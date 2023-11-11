/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const actualUrlStr =
    url.pathname.replace("/proxy/", "") + url.search + url.hash;

  const actualUrl = new URL(actualUrlStr);

  const modifiedRequest = new Request(actualUrl, {
    headers: request.headers,
    method: request.method,
    body: request.body,
    redirect: "follow",
  });

  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);

  modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");

  return modifiedResponse;
}
