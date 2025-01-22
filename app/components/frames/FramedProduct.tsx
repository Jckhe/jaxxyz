import FrameOne from '~/assets/frames/frame1.png';
import FrameTwo from '~/assets/frames/frame2.png';
import FrameThree from '~/assets/frames/frame3.png';
import type {FrameProduct} from '~/lib/products';
import {Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';

// const frameSrcObject = {
//   frame1: FrameOne,
//   frame2: FrameTwo,
//   frame3: FrameThree,
// } as const;

export const frameSrcObject = {
    frame1: { src: FrameOne, width: '600px', height: '800px' },
    frame2: { src: FrameTwo, width: '400px', height: '550px' },
    frame3: { src: FrameThree, width: '300px', height: '400px' },
    // Add more frames here...
};

// interface FramedProductProps {
//   product: FrameProduct;
//   frameType: keyof typeof frameSrcObject;
// }



interface FramedProductProps {
    product?: FrameProduct; // Optional for empty frames
    frameId: keyof typeof frameSrcObject; // ID of the frame to use
    onClick?: () => void; // Optional click handler for empty frames
}


// export const FramedProduct = ({product, frameType}: FramedProductProps) => {
//   return (
//     <div
//       style={{
//         width: '500px', // Frame width
//         height: '650px', // Frame height for proportions
//         position: 'relative', // Enable layering
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         overflow: 'hidden', // Clip anything that exceeds the container
//         // boxShadow: '0px 50px 20px transparent', // Subtle shadow for depth
//         boxShadow: `0 0 0.07em rgba(255,255,255,0.1),
//                 0 0.2em 0.2em -0.15em rgba(0,0,0,0.5),
//                 0 0.25em 0.75em -0.05em rgba(0,0,0,0.5),
//                 inset 0 0 0.7em rgba(0,0,0,0.3),
//                 inset 0 0.05em 0.1em rgba(255,255,255,0.15)`,
//       }}
//     >
//       {/* Frame PNG */}
//       <img
//         src={frameSrcObject[frameType]}
//         style={{
//           position: 'absolute', // Overlay the frame on top
//           top: 0,
//             border: 'transparent',
//           left: 0,
//           width: '100%',
//           height: '100%',
//           objectFit: 'cover', // Ensure frame scales properly
//           zIndex: 2, // Frame is on top of the product
//           pointerEvents: 'none', // Prevent frame from interfering with clicks
//         }}
//         alt="Frame"
//       />
//       {/* Product Image */}
//       <Link
//         key={product.id}
//         className="recommended-product"
//         to={`/products/${product.handle}`}
//         style={{
//           position: 'relative', // Keep product above the frame
//           display: 'block',
//           width: '100%', // Slightly smaller to ensure it stays inside the frame
//           height: '100%', // Adjust height proportionally
//           zIndex: 1, // Layer product above frame
//           overflow: 'hidden', // Prevent any child element overflow
//         }}
//       >
//         <Image
//           data={product.images.nodes[0]}
//           style={{
//             width: '100%',
//             height: '100%',
//             objectFit: 'contain', // Scale image within container
//             objectPosition: 'center', // Center the product image
//             filter: 'drop-shadow(0px 6px 8px rgba(0, 0, 0, 0.15))', // Subtle shadow for product depth
//           }}
//         />
//       </Link>
//     </div>
//   );
// };
export const FramedProduct = ({ product, frameId, onClick }: FramedProductProps) => {
    const frame = frameSrcObject[frameId]; // Retrieve frame config by ID

    return (
        <div
            onClick={onClick}
            style={{
                width: frame.width,
                height: frame.height,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : 'default',
                backgroundColor: product ? 'transparent' : '#f8f4ec', // Bone white for empty frames
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
                    objectFit: 'cover',
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
