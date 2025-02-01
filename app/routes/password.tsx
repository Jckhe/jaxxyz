import {Form, useNavigate, useLoaderData} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay} from 'swiper/modules';
import FrameOne from '../assets/frames/frame1.png';
import FrameTwo from '../assets/frames/frame2.png';
import NewsletterSignupForm from '~/components/NewsletterSignupForm';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import carouselOne from '../assets/carousel/carousel-1.png';
import carouselTwo from '../assets/carousel/carousel-2.png';
import carouselThree from '../assets/carousel/carousel-3.png';
import carouselFour from '../assets/carousel/carousel-4.png';
import carouselFive from '../assets/carousel/carousel-5.png';
import carouselSix from '../assets/carousel/carousel-6.png';
import carouselSeven from '../assets/carousel/carousel-7.png';
import carouselEight from '../assets/carousel/carousel-8.png';
import carouselNine from '../assets/carousel/carousel-9.png';
import carouselTen from '../assets/carousel/carousel-10.png';



export default function Password() {
  const navigate = useNavigate();
  const carouselPhotos = [
    carouselOne,
    carouselTwo,
    carouselThree,
    carouselFour,
    carouselFive,
    carouselSix,
    carouselSeven,
    carouselEight,
    carouselNine,
    carouselTen,
  ];
  // const [password, setPassword] = useState('');
  //
  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (password === 'your-secret-password') {
  //     localStorage.setItem('password-unlocked', 'true');
  //     navigate('/');
  //   } else {
  //     alert('Incorrect password.');
  //   }
  // };

  return (
    <div
      style={{
        width: '100%',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        padding: '0% 0',
      }}
    >
      <div
        className="swiper-carousel-wrapper"
        style={{
          border: '1px solid purple',
          width: '100%',
          height: '45dvh',
            marginTop: '3.5%',
            marginBottom: '4.5%'
        }}
      >
        <Carousel images={carouselPhotos} />
      </div>
      <div
        className="newsletter-form-wrapper password"
        style={{width: '40%', maxWidth: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}
      >
        <p>
          WEBSITE CLOSED
          <br />
          BUT STAY A WHILE
          <br />
          <br />
          SUBSCRIBE FOR EXCLUSIVE OFFERS, MEMBER EVENTS
          <br />
          AND DROP ANNOUNCEMENTS
        </p>
        <NewsletterSignupForm />
      </div>
    </div>
  );
}

const Carousel = ({images}) => {
  return (
    <Swiper
      modules={[Autoplay]}
      // autoHeight={true}
      slidesPerView={'auto'} // Adjust based on your needs
      spaceBetween={0} // Adjust spacing between slides
      loop={true} // Enables infinite looping
      speed={10000} // Adjusts scrolling speed (higher = slower)
        style={{height: '100%'}}
      autoplay={{
        delay: 0, // No delay between transitions
        disableOnInteraction: false, // Keeps autoplay running even after user interaction
        reverseDirection: false, // Set to true if you want right-to-left scrolling
      }}
      freeMode={true} // Makes scrolling smoother
    >
      {images.map((image, index) => {
        return (
          <SwiperSlide
            key={`image-${index}}`}
            style={{width: '300px', height: '100%', border: '1px solid red'}}
          >
            <img
              style={{width: '100%', height: '100%'}}
              src={image}
              alt="Slide 1"
            />
          </SwiperSlide>
        );
      })}
      {/*<SwiperSlide>*/}
      {/*  <img*/}
      {/*    style={{width: '300px', height: '300px'}}*/}
      {/*    src={FrameTwo}*/}
      {/*    alt="Slide 1"*/}
      {/*  />*/}
      {/*</SwiperSlide>*/}
    </Swiper>
  );
};
