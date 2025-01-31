// shopifyAdminClient.ts
export async function adminGraphQLRequest(
    query: string,
    variables: Record<string, any> = {},
    env: Env // Use your Hydrogen environment interface from context.env
) {
  const endpoint = `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/2023-10/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": env.ADMIN_API,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify Admin API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors) {
    console.error("Shopify Admin API errors:", data.errors);
    throw new Error("Admin API request returned errors.");
  }
  return data.data;
}
