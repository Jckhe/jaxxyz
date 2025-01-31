import type {EntryContext, AppLoadContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const csp = createContentSecurityPolicy({
    connectSrc: ["'self'", '*.klaviyo.com'],
    scriptSrc: ["'self'", '*.klaviyo.com', '*.shopify.com', ''], // No nonce yet
    styleSrc: ["'self'", '*.klaviyo.com'],
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  // eslint-disable-next-line prefer-const
  let {nonce, header, NonceProvider} = csp;

  if (header.includes('default-src')) {
    header = header.replace(
      /default-src ([^;]+)/,
      (match, existingValues) =>
        `default-src ${existingValues} cdnjs.cloudflare.com`,
    );
  } else {
    header += `; default-src 'self' cdnjs.cloudflare.com`;
  }

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
