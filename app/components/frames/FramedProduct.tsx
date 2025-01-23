import FrameOne from '~/assets/frames/frame1.png';
import FrameTwo from '~/assets/frames/frame2.png';
import FrameThree from '~/assets/frames/frame3h.png';
import type {FrameProduct} from '~/lib/products';
import {Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';

export const frameSrcObject = {
  frame1: {src: FrameOne, width: '300px', height: '357px'},
  frame2: {src: FrameTwo, width: '280px', height: '350px'},
  frame3: {src: FrameThree, width: '300px', height: '400px'},
};

interface FramedProductProps {
  product?: FrameProduct; // Optional for empty frames
  frameId: keyof typeof frameSrcObject; // ID of the frame to use
  onClick?: () => void; // Optional click handler for empty frames
}

export const FramedProduct = ({
  product,
  frameId,
  onClick,
}: FramedProductProps) => {
  const frame = frameSrcObject[frameId]; // Retrieve frame config by ID

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
            }}
          />
        </Link>
      )}
    </div>
  );
};
