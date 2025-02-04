import type {Storefront} from '@shopify/hydrogen';

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

const metaobjectHandle = {
  handle: METAOBJECT_HANDLE,
  type: METAOBJECT_TYPE,
};

export async function getStoreLockSettings(storefront: Storefront) {
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

  let locked = false;
  let storedPassword = '';

  const metaobject = data?.metaobject;
  if (metaobject?.fields) {
    for (const {key, value} of metaobject.fields) {
      if (key === 'toggle') {
        locked = value === 'true';
      }
      if (key === 'password') {
        storedPassword = value;
      }
    }
  }

  return {locked, storedPassword};
}
