import {Form, useNavigate, useLoaderData} from '@remix-run/react';
import {useEffect, useMemo, useState} from 'react';
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
import {ArrowRight} from 'react-feather';

export default function Password() {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const carouselPhotos = useMemo(() => {
    return [
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
  }, []);
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
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        padding: '0% 0',
      }}
      className="password-page"
    >
      <div
        className="swiper-carousel-wrapper"
        style={{
          border: '1px solid purple',
          width: '100%',
          height: '35dvh',
          marginTop: '0.5%',
          marginBottom: '2.5%',
        }}
      >
        <Carousel images={carouselPhotos} />
      </div>
      <div className="password-newsletter-container">
        <div style={{display: `${open ? 'none' : 'block'}`}}>
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
        {/*<form*/}
        {/*  className="store-password-input-form"*/}
        {/*  style={{display: `${open ? 'block' : 'none'}`}}*/}
        {/*>*/}
        {/*  <input type="password" placeholder="ENTER STORE PASSWORD" />*/}
        {/*</form>*/}
        {open && <PasswordInput />}
      </div>
      <div className="store-password-toggle">
        <button onClick={() => setOpen(!open)}>
          {`${(!open
            ? 'I have a password'
            : 'I dont have a password'
          ).toUpperCase()}`}
        </button>
      </div>
    </div>
  );
}

const PasswordInput = () => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const showIcon = focused || value.length > 0;
  // only show icon if focused or has text (up to you)

  // If we want it grey when focused, black if typed >2 chars
  const iconColor = value.length > 2 ? 'black' : 'gray';

  return (
    <form className="store-password-input-form">
      <div className="input-wrap">
        <input
          type="password"
          placeholder="ENTER STORE PASSWORD"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {showIcon && (
          <button
            type="submit"
            className="icon-submit-btn"
            disabled={value.length < 3} /* optional: disable if < 3 chars */
          >
            <ArrowRight color={iconColor} />
          </button>
        )}{' '}
      </div>
    </form>
  );
};

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
