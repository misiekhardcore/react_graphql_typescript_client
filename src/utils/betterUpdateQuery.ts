import { Cache, QueryInput } from "@urql/exchange-graphcache";

//cache update function that has correct types
//normal cache exchange has problem with types
export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(
    qi,
    (data) => fn(result, data as any) as any
  );
}
