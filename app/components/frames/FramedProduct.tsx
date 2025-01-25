import frame1 from '~/assets/frames/frame1.png';
import frame2 from '~/assets/frames/frame2.png';
import frame3 from '~/assets/frames/frame3.png';
import frame4 from '~/assets/frames/frame4.png';
import frame5 from '~/assets/frames/frame5.png';
import frame6 from '~/assets/frames/frame6.png';
import frame7 from '~/assets/frames/frame7.png';
import frame8 from '~/assets/frames/frame8.png';
import frame9 from '~/assets/frames/frame9.png';
import type {FrameProduct} from '~/lib/products';
import {Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {CSSProperties, HTMLAttributes, useState} from 'react';

type Frame = {
  src: string; // The `FrameOne`, `FrameTwo`, etc., should resolve to string
  width: string; // Width as a string with a unit (e.g., '300px')
  height: string; // Height as a string with a unit (e.g., '357px')
  frameStyle?: CSSProperties;
  productStyle?: CSSProperties;
  frameImageStyle?: CSSProperties;
};

export type FrameSrcObject = Record<string, Frame>;

export const frameSrcObject: FrameSrcObject = {
  frame1: {
    src: frame1,
    width: '280px',
    height: '360px',
    frameStyle: {maxWidth: '400px', maxHeight: '500px'},
  },
  frame2: {src: frame2, width: '270px', height: '350px'},
  frame3: {
    src: frame3,
    width: '350px',
    height: '250px',
    frameStyle: {boxShadow: 'none'},
  },
  frame4: {
    src: frame4,
    width: '275px',
    height: '300px',
  },
  frame5: {
    src: frame5,
    width: '405px',
    height: '250px',
    frameStyle: {
      boxShadow: 'none',
    },
  },
  frame6: {
    src: frame6,
    width: '180px',
    height: '140px',
  },
  frame7: {
    src: frame7,
    width: '120px',
    height: '135px',
  },
  frame8: {
    src: frame8,
    width: '130px',
    height: '130px',
    // frameStyle: {position: 'relative'}
  },
  frame9: {
    src: frame9,
    width: '150px',
    height: '200px',
  },
  frame10: {
    src: frame7,
    width: '100px',
    height: '100px',
  },
};

interface FramedProductProps {
  product?: FrameProduct; // Optional for empty frames
  frameId: keyof typeof frameSrcObject; // ID of the frame to use
  onClick?: () => void; // Optional click handler for empty frames
  frameStyle?: CSSProperties;
  productStyle?: CSSProperties;
  frameImageStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  containerProps?: HTMLAttributes<HTMLDivElement>;
}

export const FramedProduct = ({
  product,
  frameId,
  onClick,
  containerStyle,
  productStyle,
  frameImageStyle,
  containerProps = {},
}: FramedProductProps) => {
  const frame: Frame = frameSrcObject[frameId]; // Load frame config

  return (
    <div
      {...containerProps}
      onClick={onClick}
      style={{
        // Default size from frame config
        width: frame.width,
        height: frame.height,
        // We remove `position: 'absolute'` so parent can decide
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: 'transparent',
        boxShadow: `0 0 0.07em rgba(255,255,255,0.1),
                    0 0.2em 0.2em -0.15em rgba(0,0,0,0.5),
                    0 0.25em 0.75em -0.05em rgba(0,0,0,0.5),
                    inset 0 0 0.7em rgba(0,0,0,0.3),
                    inset 0 0.05em 0.1em rgba(255,255,255,0.15)`,
        // Merge default frame styles (if any) and any container overrides
        ...frame.frameStyle,
        ...containerStyle,
      }}
    >
      {/* Frame PNG itself */}
      <img
        src={frame.src}
        alt={`Frame ${frameId}`}
        style={{
          position: 'absolute', // still required if you want the product inside it
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          zIndex: 2,
          pointerEvents: 'none',
            backgroundColor: 'transparent',
          // Merge default config plus any overrides
          ...frame.frameImageStyle,
          ...frameImageStyle,
        }}
      />

      {/* Product Image (only if we have a product) */}
      {product && (
        // <Link
        //   to={`/products/${product.handle}`}
        //   style={{
        //     position: 'relative',
        //     display: 'block',
        //     width: '90%',
        //     height: '90%',
        //     zIndex: 1,
        //     overflow: 'hidden',
        //   }}
        // >
        //   <Image
        //     data={product.images?.nodes?.[0]}
        //     style={{
        //       width: '100%',
        //       height: '100%',
        //       objectFit: 'contain',
        //       objectPosition: 'center',
        //       filter: 'drop-shadow(0px 6px 8px rgba(0, 0, 0, 0.15))',
        //       // Merge default frame’s style plus any custom overrides
        //       ...frame.productStyle,
        //       ...productStyle,
        //     }}
        //   />
        <img
          src={product.images?.nodes?.[0]?.url}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            // ...
          }}
        />
        // </Link>
      )}
      {!product && (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '75%', height: '75%'}}>
              <h3>{frameId}</h3>
          </div>
      )}
    </div>
  );
};

interface DraggableFrameProps {
  frameId: keyof typeof import('./FramedProduct').frameSrcObject;
  product?: FrameProduct;
  defaultX?: number;
  defaultY?: number;
}

export function DraggableFrame({
  frameId,
  product,
  defaultX = 100,
  defaultY = 100,
}: DraggableFrameProps) {
  const [pos, setPos] = useState({x: defaultX, y: defaultY});
  const [isDragging, setIsDragging] = useState(false);
  const [startOffset, setStartOffset] = useState({x: 0, y: 0});

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    // store the initial click offset
    setStartOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPos({
      x: e.clientX - startOffset.x,
      y: e.clientY - startOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Here you could console.log or store pos to get final coordinates
    console.log(`Frame ${frameId} final position => x: ${pos.x}, y: ${pos.y}`);
  };

  return (
    <FramedProduct
      frameId={frameId}
      product={product}
      containerStyle={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        // a debug border so you can see the bounding box
        border: '1px dashed magenta',
      }}
      containerProps={{
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        style: {cursor: isDragging ? 'grabbing' : 'grab'},
      }}
    />
  );
}
