// import React from 'react';
// import {Swiper, SwiperSlide} from 'swiper/react';
// import SwiperCore from 'swiper';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/thumbs';
// import Frame1 from '../assets/frames/frame1.png';
// import Frame2 from '../assets/frames/frame2.png';
// import Frame3 from '../assets/frames/frame3.png';
// import {Navigation, Thumbs} from 'swiper/modules';
// import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
// import {useLoaderData} from '@remix-run/react';
//
// SwiperCore.use([Navigation, Thumbs]);
//
// const FILES_QUERY = `#graphql
//   query GetFiles {
//     files {
//       edges {
//         node {
//           id
//           url
//           alt
//           createdAt
//         }
//       }
//     }
//   }
// `;
//
// export async function loader({context}: LoaderFunctionArgs) {
//   const {storefront} = context;
//
//   const filesData = await storefront.query(FILES_QUERY, {
//     variables: {first: 50}, // Pass the value for $first
//   });
//
//     return {
//         files: filesData?.files?.edges || [],
//     };
// }
//
// async function loadCriticalData({context}: LoaderFunctionArgs) {
//   const {storefront} = context;
//
//   // Fetch files (critical for rendering the page)
//   const filesData = await storefront.query(FILES_QUERY, {
//     variables: {first: 50},
//   });
//
//   return {
//     files: filesData?.files?.edges || [],
//   };
// }
//
// function loadDeferredData() {
//   // Non-critical data can be fetched here
//   return {};
// }
//
// export default function Campaign() {
//   const [thumbsSwiper, setThumbsSwiper] = React.useState<any>(null);
//   const {files} = useLoaderData<typeof loader>();
//
//   console.log('files: ', files);
//
//   const pictures = [Frame1, Frame2, Frame3];
//   return (
//     <div style={{border: '1px solid blue', height: '100%', width: '100%'}}>
//       <h3>CAMPAIGN PAGE</h3>
//       <Swiper
//         spaceBetween={10}
//         navigation
//         thumbs={{swiper: thumbsSwiper}}
//         style={{
//           width: '40%',
//           margin: '0 auto',
//           border: '1px solid purple',
//           height: '50%',
//           padding: '3px;',
//         }}
//       >
//         {Array.from({length: 3}).map((__, i) => (
//           <SwiperSlide style={{border: '1px solid red'}}>
//             <img
//               src={pictures[i]}
//               alt="Slide 1"
//               style={{width: '100px', height: '100px'}}
//             />
//           </SwiperSlide>
//         ))}
//         {/* Main carousel slides */}
//         {/*<SwiperSlide style={{border: '1px solid red'}}>*/}
//         {/*  <img*/}
//         {/*    src={FrameThree}*/}
//         {/*    alt="Slide 1"*/}
//         {/*    style={{width: '100px', height: '100px'}}*/}
//         {/*  />*/}
//         {/*</SwiperSlide>*/}
//         {/*<SwiperSlide style={{border: '1px solid red'}}>*/}
//         {/*  <img*/}
//         {/*    src={FrameOne}*/}
//         {/*    alt="Slide 2"*/}
//         {/*    style={{width: '100px', height: '100px'}}*/}
//         {/*  />*/}
//         {/*</SwiperSlide>*/}
//         {/*<SwiperSlide style={{border: '1px solid red'}}>*/}
//         {/*  <img*/}
//         {/*    src={FrameTwo}*/}
//         {/*    alt="Slide 3"*/}
//         {/*    style={{width: '100px', height: '100px'}}*/}
//         {/*  />*/}
//         {/*</SwiperSlide>*/}
//         {/* Add more slides as needed */}
//       </Swiper>
//
//       {/* Thumbnail navigation */}
//       {/*<Swiper*/}
//       {/*  onSwiper={(swiper) => setThumbsSwiper(swiper)}*/}
//       {/*  spaceBetween={10}*/}
//       {/*  slidesPerView={5}*/}
//       {/*  freeMode*/}
//       {/*  watchSlidesProgress*/}
//       {/*  style={{width: '70%', margin: '20px auto'}}*/}
//       {/*>*/}
//       {/*  <SwiperSlide>*/}
//       {/*    <img*/}
//       {/*      src={FrameThree}*/}
//       {/*      alt="Slide 1"*/}
//       {/*      style={{width: '100px', height: '100px'}}*/}
//       {/*    />*/}
//       {/*  </SwiperSlide>*/}
//       {/*  <SwiperSlide>*/}
//       {/*    <img*/}
//       {/*      src={FrameTwo}*/}
//       {/*      alt="Slide 1"*/}
//       {/*      style={{width: '100px', height: '100px'}}*/}
//       {/*    />*/}
//       {/*  </SwiperSlide>*/}
//       {/*  <SwiperSlide>*/}
//       {/*    <img*/}
//       {/*      src={FrameOne}*/}
//       {/*      alt="Slide 1"*/}
//       {/*      style={{width: '100px', height: '100px'}}*/}
//       {/*    />*/}
//       {/*  </SwiperSlide>*/}
//       {/*  /!* Add more thumbnails as needed *!/*/}
//       {/*</Swiper>*/}
//     </div>
//   );
// }
