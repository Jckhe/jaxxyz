import {Form, useNavigate, useLoaderData, redirect, useActionData} from '@remix-run/react';
import type {ActionFunction} from '@remix-run/node';
import {useEffect, useMemo, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay} from 'swiper/modules';
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
import {parse, serialize} from 'cookie';
import {json, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@shopify/remix-oxygen';
import {getStoreLockSettings} from '~/lib/storeLock';

export async function loader(args: LoaderFunctionArgs) {
  const {request, context} = args;
  const {storefront, env} = context;

  const {locked, storedPassword} = await getStoreLockSettings(storefront);

  if (!locked) return redirect('/');

  return defer({locked, storedPassword});
}

export const action: ActionFunction = async ({request, context}) => {
  const formData = await request.formData();
  const inputPassword = formData.get('password');

  const {storedPassword} = await getStoreLockSettings(context.storefront);
  console.log(`storedPassword: ${JSON.stringify(storedPassword)}`);
  console.log(`InputPassword: ${inputPassword}`);
  const isCorrect = inputPassword === storedPassword;
  console.log(`isCorrect: ${isCorrect}`);
  if (isCorrect) {
    // Set a cookie so user is "unlocked" next time
    return redirect('/', {
      headers: {
        'Set-Cookie': serialize('unlocked', 'true', {
          path: '/', // cookie valid across entire domain
          httpOnly: true, // not accessible from JS
          sameSite: 'lax', // typical security setting
          // maxAge: 3600, // optionally keep them unlocked for an hour
          // secure: true, // use true in production with HTTPS
        }),
      },
    });
  } else {
    return json({ error: 'Invalid password' }, { status: 400 });
  }
};

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
          width: '100%',
          height: '35dvh',
          marginTop: '0.5%',
          marginBottom: '7.5%',
          position: 'relative'
        }}
      >
        <Carousel images={carouselPhotos} />
        <p style={{marginLeft: '65%', marginTop: '1%'}}>
          IF NOT NOW
          <br /> THEN WHEN
          <br />
          ©2025
        </p>
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
  const iconColor = value.length > 2 ? 'black' : 'gray';
  const actionData = useActionData<{ error?: string }>();
  const [error, setError] = useState<string>('');



  useEffect(() => {
    if (actionData?.error) {
      setError(actionData.error);
    }
  }, [actionData]);

  const handleFocus = () => {
    if (error) {
      setError('');
      setValue('');
    }
  };

  // onChange handler is standard.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const inputClassName = error ? 'error' : '';


  return (
    <Form
      method="post"
      action="/password"
      className="store-password-input-form"

    >
      <div className="input-wrap">
        <input
          name="password"
          type="password"
          placeholder="ENTER STORE PASSWORD"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setFocused(false)}
          className={inputClassName}
        />
        <button
          type="submit"
          className="icon-submit-btn"
          disabled={value.length < 3} /* optional: disable if < 3 chars */
        >
          <ArrowRight color={iconColor} />
        </button>
      </div>
    </Form>
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
            style={{width: '300px', height: '100%', border: '1px solid black'}}
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
