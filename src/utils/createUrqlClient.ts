import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import Router from "next/router";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

export const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      }
    })
  );
};

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    //entityName is Query and fieldName is posts
    const { parentKey: entityKey, fieldName } = info;

    // allFields: [
    //   {
    //     fieldKey: 'posts({"limit":5})',
    //     fieldName: 'posts',
    //     arguments: [Object]
    //   }
    // ]
    const allFields = cache.inspectFields(entityKey);

    const fieldInfos = allFields.filter(
      (info) => info.fieldName === fieldName
    );
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInCache;

    const results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fi) => {
      //gives array of 'Post:id'
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore") as boolean;
      if (!_hasMore) {
        hasMore = _hasMore;
      }
      results.push(...data);
    });
    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          createPost: (_result, _, cache, __) => {
            const allFields = cache.inspectFields("Query");

            const fieldInfos = allFields.filter(
              (info) => info.fieldName === "posts"
            );

            fieldInfos.forEach((fi) => {
              cache.invalidate("Query", "posts", fi.arguments || {});
            });
          },
          logout: (_result, _, cache, __) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, _, cache, __) => {
            //this has no types checking so we use betterUpdateQuery
            // cache.updateQuery({ query: MeDocument }, (data) => {
            //   return data;
            // });
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login?.errors) return query;
                else
                  return {
                    me: result.login?.user,
                  };
              }
            );
          },
          register: (_result, _, cache, __) => {
            //this has no types checking so we use betterUpdateQuery
            // cache.updateQuery({ query: MeDocument }, (data) => {
            //   return data;
            // });
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register?.errors) return query;
                else
                  return {
                    me: result.register?.user,
                  };
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
