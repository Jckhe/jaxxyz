export type FrameProduct = {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    nodes: Array<{
      id: string;
      url: string;
      altText?: string | null; // altText may be optional or nullable
      width: number;
      height: number;
    }>;
  };
};

// Define the type for the query result
export type FrameProductsQueryResult = {
  products: {
    nodes: FrameProduct[];
  };
};
