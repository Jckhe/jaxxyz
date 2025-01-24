import frame1 from '~/assets/frames/frame1.png';
import frame2 from '~/assets/frames/frame2.png';
import frame3 from '~/assets/frames/frame3h.png';
import frame8 from '~/assets/frames/frame8.png';
import frame5 from '~/assets/frames/frame5.png';
import type {FrameProduct} from '~/lib/products';
import {Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {CSSProperties} from 'react';

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
  frame1: {src: frame1, width: '320px', height: '400px'},
  frame2: {src: frame2, width: '280px', height: '350px'},
  frame3: {
    src: frame3,
    width: '135px',
    height: '180px',
      frameStyle: {boxShadow: 'none'}
  },
    frame5: {
      src: frame5,
        width: '405px',
        height: '250px',
        frameStyle: {
          boxShadow: 'none',
        }
    },
  frame8: {
    src: frame8,
    width: '130px',
    height: '130px',
      frameStyle: {position: 'relative'}
  },
};

interface FramedProductProps {
  product?: FrameProduct; // Optional for empty frames
  frameId: keyof typeof frameSrcObject; // ID of the frame to use
  onClick?: () => void; // Optional click handler for empty frames
  frameStyle?: CSSProperties;
  productStyle?: CSSProperties;
  frameImageStyle?: CSSProperties;
}

export const FramedProduct = ({
  product,
  frameId,
  onClick,
}: // frameStyle,
// productStyle,
//   frameImageStyle,
FramedProductProps) => {
  const frame: Frame = frameSrcObject[frameId]; // Retrieve frame config by ID

  return (
    <div
      onClick={onClick}
      style={{
        width: frame.width,
        height: frame.height,
        position: 'absolute',
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
          ...frame.frameStyle,
      }}
    >
      {/* Frame Image */}
      <img
        src={frame.src}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          zIndex: 2,
          pointerEvents: 'none',
            ...frame.frameImageStyle,
        }}
        alt={`Frame ${frameId}`}
      />
      {/* Product Image (if provided) */}
      {product && (
        <Link
          to={`/products/${product.handle}`}
          style={{
            position: 'relative',
            display: 'block',
            width: '90%',
            height: '90%',
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          <Image
            data={product.images.nodes[0]}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              filter: 'drop-shadow(0px 6px 8px rgba(0, 0, 0, 0.15))',
                ...frame.productStyle,

            }}
          />
        </Link>
      )}
    </div>
  );
};
