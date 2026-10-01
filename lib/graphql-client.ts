const GRAPHQL_URL = process.env.GRAPHQL_API_URL;
const GRAPHQL_KEY = process.env.GRAPHQL_API_KEY;

interface GqlResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!GRAPHQL_URL || !GRAPHQL_KEY) {
    throw new Error(
      'Missing GRAPHQL_API_URL or GRAPHQL_API_KEY environment variables'
    );
  }

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': GRAPHQL_KEY,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store', // Server Components — always fresh
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP error: ${res.status} ${res.statusText}`);
  }

  const json: GqlResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(`GraphQL error: ${json.errors[0].message}`);
  }

  if (!json.data) {
    throw new Error('No data returned in GraphQL response');
  }

  return json.data;
}
