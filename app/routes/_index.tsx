import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
  AllProductsWithTagQuery,
  FrameProductsQuery,
} from 'storefrontapi.generated';
import {Box} from '@radix-ui/themes';
import type {
  FrameSrcObject,
  frameSrcObject,
} from '~/components/frames/FramedProduct';
import {FramedProduct, DraggableFrame} from '~/components/frames/FramedProduct';

export const meta: MetaFunction = () => {
  return [{title: 'jaxxYz | homepage'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const allProducts = context.storefront
    .query(FRAME_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    allProducts,
  };
}

export function FramedProductsCanvas({products}: {products: Promise<any>}) {
  /**
   * This array defines the collage layout:
   * - `frameId` tells us which frame style to use
   * - `x, y` are the initial positions (for dev, you can refine them by dragging)
   * - `width, height` are optional if you want to override the frame's default size
   */
  const layout = [
    {
      frameId: 'frame1',
      x: 907,
      y: 227,
    },
    {
      frameId: 'frame2',
      x: 568,
      y: 612,
    },
    {
      frameId: 'frame3',
      x: 872,
      y: 615,
    },
    {
      frameId: 'frame4',
      x: 253,
      y: 631,
    },
    {
      frameId: 'frame5',
      x: 322,
      y: 346,
    },
    {
      frameId: 'frame6',
      x: 129,
      y: 478,
    },
    {
      frameId: 'frame7',
      x: 763,
      y: 236,
    },
    {
      frameId: 'frame8',
      x: 1209,
      y: 419,
    },
    {
      frameId: 'frame9',
      x: 744,
      y: 384,
    },
    {
      frameId: 'frame10',
      x: 184,
      y: 355,
    },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '1920px', // Base "design" width
        height: '1080px', // Base "design" height
        maxWidth: '100%', // Scale down on smaller screens
        margin: '0 auto',
        border: '1px solid red',
        overflow: 'hidden',
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(resolvedProducts) => {
            // Grab the product nodes from Shopify
            const productNodes: FramedProduct[] =
              resolvedProducts?.products?.nodes || [];
            let productIndex = 0; // We'll assign products in order

            return layout.map((layoutItem, idx) => {
              // Pick the next product in the list (or undefined if we run out)
              const product =
                productIndex < productNodes.length
                  ? productNodes[productIndex++]
                  : undefined;

              return (
                <DraggableFrame
                  key={`frame-${idx}`}
                  frameId={layoutItem.frameId as any}
                  product={product}
                  // If you want to override the default frame size, pass `width/height`
                  // or rely on the frame's built-in size from frameSrcObject
                  defaultX={layoutItem.x}
                  defaultY={layoutItem.y}
                />
              );
            });
          }}
        </Await>
      </Suspense>
    </div>
  );
}


export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <div className="home-content-container">
      <FramedProductsCanvas products={data.allProducts} />
    </div>
  );
}

// {/*<FeaturedCollection collection={data.featuredCollection} />*/}
// {/*<RecommendedProducts products={data.allProducts} />*/}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<FrameProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => {
            if (!response) return null;

            // Sort the products by the numeric value in their "frame-*" tag
            const sortedProducts = response.products.nodes.sort((a, b) => {
              const aTagNumber = parseInt(a.tags[0].split('-')[1], 10);
              const bTagNumber = parseInt(b.tags[0].split('-')[1], 10);
              return aTagNumber - bTagNumber;
            });

            return (
              <div className="recommended-products-grid">
                {sortedProducts.map((product) => (
                  <Link
                    key={product.id}
                    className="recommended-product"
                    to={`/products/${product.handle}`}
                  >
                    <Image
                      data={product.images.nodes[0]}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 20vw, 50vw"
                    />
                    <h4>{product.title}</h4>
                    <small>
                      <Money data={product.priceRange.minVariantPrice} />
                    </small>
                  </Link>
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}
const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

const ALL_PRODUCTS_WITH_TAG_QUERY = `#graphql
  fragment ProductDetails on Product {
    id
    title
    handle
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query AllProductsWithTag($country: CountryCode, $language: LanguageCode) 
    @inContext(country: $country, language: $language) {
    products(first: 250, query: "tag:homepage") {
      nodes {
        ...ProductDetails
      }
    }
  }
` as const;

const FRAME_PRODUCTS_QUERY = `#graphql
  fragment ProductDetailsWithFrameTag on Product {
    id
    title
    handle
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query FrameProducts($country: CountryCode, $language: LanguageCode) 
    @inContext(country: $country, language: $language) {
    products(first: 250, query: "tag:frame") {
      nodes {
        ...ProductDetailsWithFrameTag
      }
    }
  }
` as const;
