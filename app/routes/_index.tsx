import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense, useEffect} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
  AllProductsWithTagQuery,
  FrameProductsQuery,
} from 'storefrontapi.generated';
import {Box} from '@radix-ui/themes';
import {FramedProduct, frameSrcObject} from '~/components/frames/FramedProduct';

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

const FramedProductsCanvas = ({ products }: { products: Promise<any> }) => {
  const layout = [
    { frameId: 'frame1', productIndex: 0 }, // Product frame
    { frameId: 'frame2', productIndex: 1 }, // Product frame
    { frameId: 'frame3', productIndex: undefined }, // Empty frame
    // Add more frame layout configurations as needed
  ];

  return (
      <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px', // Space between frames
            padding: '16px',
            width: '100%',
          }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {(resolvedProducts) => {
              const productNodes = resolvedProducts?.products?.nodes || [];
              return layout.map((item, index) => (
                  <FramedProduct
                      key={index}
                      frameId={item.frameId as keyof typeof frameSrcObject}
                      product={item.productIndex !== undefined ? productNodes[item.productIndex] : undefined}
                      onClick={
                        item.productIndex === undefined // Empty frame
                            ? () => (window.location.href = '/collections/all')
                            : undefined
                      }
                  />
              ));
            }}
          </Await>
        </Suspense>
      </div>
  );
};

// const FramedProductsCanvas = ({products}) => {
//   return (
//     <div style={{width: '100%', height: '90vh', border: '1px solid purple'}}>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Await resolve={products}>
//           {(resolvedProducts) => {
//             console.log('Resolved Products:', resolvedProducts); // Log the structure
//
//             if (
//               !resolvedProducts ||
//               !resolvedProducts.products ||
//               !resolvedProducts.products.nodes ||
//               resolvedProducts.products.nodes.length === 0
//             ) {
//               return <div>No products available.</div>;
//             }
//
//             return (
//               <FramedProduct
//                 product={resolvedProducts.products.nodes[0]}
//                 frameType="frame1"
//               />
//             );
//           }}
//         </Await>
//       </Suspense>
//     </div>
//   );
// };

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
