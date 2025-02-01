import '@radix-ui/themes/styles.css';
import {useNonce, getShopAnalytics, Analytics} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs, redirect} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  useRouteLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Form,
} from '@remix-run/react';

import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from '~/components/PageLayout';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import {useEffect} from 'react';

/* ---------------------------------------------
   1) STORE LOCK QUERY - Single item approach
   --------------------------------------------- */
const IS_DEV = process.env.NODE_ENV === 'development';

// Decide which type/handle you want to query
const METAOBJECT_TYPE = IS_DEV
  ? 'password_page_toggle_dev'
  : 'password_page_toggle';
const METAOBJECT_HANDLE = IS_DEV ? 'password_page_dev' : 'password_page';

const STORE_LOCK_QUERY = `#graphql
  query getStoreLockSettings($metaobjectHandle: MetaobjectHandleInput!) {
    metaobject(handle: $metaobjectHandle) {
      handle
      type
      fields {
        key
        value
      }
    }
  }
`;

export function links() {
  return [
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  // revalidate on non-GET form submissions
  if (formMethod && formMethod !== 'GET') return true;
  // revalidate on forced revalidation
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return defaultShouldRevalidate;
};

/* ---------------------------------------------
   2) ROOT LOADER
   --------------------------------------------- */
export async function loader(args: LoaderFunctionArgs) {
  const {request, context} = args;
  const {storefront, env} = context;

  const metaobjectHandle = {
    handle: METAOBJECT_HANDLE,
    type: METAOBJECT_TYPE,
  };
  console.log(`is dev: ${IS_DEV} `);
  console.log(metaobjectHandle);

  // Fetch the metaobject
  const data = await storefront.query<{
    metaobject: {
      handle: string;
      type: string;
      fields: Array<{key: string; value: string}>;
    } | null;
  }>(STORE_LOCK_QUERY, {
    variables: {
      metaobjectHandle,
    },
  });


  // Default values
  let locked = false;
  let storedPassword = '';

  const metaobject = data?.metaobject;
  if (metaobject?.fields) {
    for (const {key, value} of metaobject.fields) {
      // IMPORTANT: match your field keys
      if (key === 'toggle') {
        locked = value === 'true';
      }
      if (key === 'password') {
        storedPassword = value;
      }
    }
  }

  // If locked, check cookie
  if (locked) {
    const {pathname} = new URL(request.url);
    const cookieHeader = request.headers.get('Cookie') || '';
    const userUnlocked = cookieHeader.includes('unlocked=true');

    // If not unlocked AND we’re not already at "/password", redirect there
    if (!userUnlocked && pathname !== '/password') {
      return redirect('/password');
    }
  }

  // C) Load your store’s other data (header, etc.)
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({
    ...deferredData,
    ...criticalData,
    // Additional data you might pass to client
    locked,
    storedPassword,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });
}

/**
 * Fetch data necessary for rendering content above the fold.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {headerMenuHandle: 'main-menu'},
    }),
    // Add additional critical queries here...
  ]);
  return {header};
}

/**
 * Defer data needed below the fold, e.g. footer or cart details.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {storefront, customerAccount, cart} = context;

  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {footerMenuHandle: 'footer'},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    footer,
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
  };
}

/* ---------------------------------------------
   3) ROOT LAYOUT
   --------------------------------------------- */
export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<typeof loader>('root');

  // Example: Load Klaviyo script
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=Xb2Wdw';
    script.type = 'text/javascript';
    script.defer = true;
    if (typeof nonce === 'string') {
      script.setAttribute('nonce', nonce);
    }
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [nonce]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <PageLayout {...data}>{children}</PageLayout>
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

/* ---------------------------------------------
   4) ERROR BOUNDARY
   --------------------------------------------- */
export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
