"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperRef } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface TestimonialsProps {
  variant?: "white" | "blue";
}

const TESTIMONIAL_HEADING =
  "Don't Leave without hearing from our clients testimonials.";
const GOOGLE_RATINGS = "4.8";

const REVIEWS = [
  {
    image: "/images/api/testimonials-section-review1img.jpg",
    review:
      "Loveneet at Bright light immigration has best service and was truly the best consultant I've worked with! She was professional, knowledgeable, and always available to answer any questions. The entire process was smooth, and I felt supported every step of the way. Highly recommend Loveneet and her team for anyone seeking reliable immigration services!",
    name: "Rhea Patel",
    stars: 5,
  },
  {
    image: "/images/api/testimonials-section-review2img.jpg",
    review:
      "These guys are awesome. Did an amazing job. I applied for my study permit extension on the day my study permit was expiring and still got it approved. I really didnt had any hope that i will get an extension but due to these guys hardwork and knowledge in the field, they get the work done. Highly recommend.",
    name: "Rajinder Singh",
    stars: 5,
  },
  {
    image: "/images/api/testimonials-section-review3img.jpg",
    review:
      "I wanted to express my sincere gratitude for your services in helping me and my Husband to get our visitor visa successfully and that too in just 10 days. Your seamless knowledge, attention to detail, and clear communication set you apart as the best migration agent. I wholeheartedly recommend your services!",
    name: "Mehak Sekhon",
    stars: 4,
  },
  {
    image: "/images/api/testimonials-section-review4img.jpg",
    review:
      "Loveneet ma'am has been of a great help. She took my case of PR seriously and guided me in an apt manner. I would highly recommended her to others for immigration consultant.",
    name: "Avneet Kaur",
    stars: 5,
  },
  {
    image: "/images/api/testimonials-section-review5img.jpg",
    review:
      "Strongly advised for all immigration requirements. For such a wonderful experience, I am grateful to Loveneet and the Bright Light Immigration team. I applied for BCPNP under the Health Care Authority with Loveneet's assistance, and I was approved in just two days.",
    name: "Harleen Sidhu",
    stars: 4,
  },
  {
    image: "/images/api/testimonials-section-review6img.jpg",
    review:
      "Thank you Loveneet for getting my Vulnerable Worker Open Work Permit approved. Best immigration services.",
    name: "Harman Sarao",
    stars: 5,
  },
  {
    image: "/images/api/testimonials-section-review7img.jpg",
    review:
      "I have good experience with loveneet mam all of my family got visa through bright light immigration as i also enrolled to cheapest collage because of mam so, I recommend her services.",
    name: "Manjot kaur",
    stars: 4,
  },
  {
    image: "/images/api/testimonials-section-review8img.jpg",
    review:
      "Best service! Helped with my brothers study permit extension last minute and helped to get positive result!",
    name: "Rb Takher",
    stars: 5,
  },
  {
    image: "/images/api/testimonials-section-review9img.jpg",
    review:
      "Excellent Service! All the process was very professional and warm for someone like me who is not familiar with immigration matters.",
    name: "Nizam Mishu",
    stars: 5,
  },
  {
    image: "/images/api/testimonials-section-review10img.jpg",
    review:
      "My experience with Bright Light Immigration is very good, they are so genuine.",
    name: "Manjot Atwal",
    stars: 4,
  },
];

const VIDEOS = [
  { id: "y5Pz7WPm41w", name: "Sukhwinder Singh" },
  { id: "Ex-w2fTfMn8", name: "Manpreet Kaur" },
  { id: "gIb5gfIqxdI", name: "Amandeep Kaur" },
  { id: "lBnYycZ1aSY", name: "Navjot Kaur" },
  { id: "uPhje0jwtuo", name: "Harpreet Kaur" },
  { id: "eZTZE1ixfjU", name: "Ranjit Singh" },
];

// YouTube facade: thumbnail with play button, loads iframe only on click
function YouTubeFacade({ id, title, isWhite }: { id: string; title: string; isWhite: boolean }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <iframe
        width="500"
        height="500"
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
        className="w-[500px] h-[500px] rounded-[10px] border-none max-[680px]:w-[350px] max-[680px]:h-[350px] max-[415px]:w-[300px] max-[415px]:h-[300px]"
      />
    );
  }
  return (
    <div
      className="relative w-[500px] h-[500px] rounded-[10px] overflow-hidden cursor-pointer max-[680px]:w-[350px] max-[680px]:h-[350px] max-[415px]:w-[300px] max-[415px]:h-[300px]"
      onClick={() => setPlaying(true)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors duration-200">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${isWhite ? "bg-primary" : "bg-white"}`}>
          <svg viewBox="0 0 24 24" className={`w-8 h-8 ml-1 ${isWhite ? "fill-white" : "fill-primary"}`}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials({ variant = "blue" }: TestimonialsProps) {
  const isWhite = variant === "white";
  const videoSwiperRef = useRef<SwiperRef>(null);
  const [currentReview, setCurrentReview] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Only run auto-rotate when section is visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timerRef.current = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % REVIEWS.length);
          }, 5000);
        } else {
          if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleNextReview = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentReview((prev) => (prev + 1) % REVIEWS.length);
      setIsAnimating(false);
    }, 500);
  };

  const handlePreviousReview = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentReview(
        (prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length
      );
      setIsAnimating(false);
    }, 500);
  };

  const review = REVIEWS[currentReview];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`w-full py-[50px] bg-no-repeat bg-cover flex items-center justify-center ${
        isWhite
          ? "bg-[url('/images/aboutLeaf.png')]"
          : "bg-[url('/images/fag-bg.png')]"
      }`}
    >
      <div className="max-w-[1440px] w-full max-[1460px]:w-[95%]">
        <h1
          className={`text-center mb-[50px] max-[415px]:text-[31px] ${
            isWhite
              ? "text-primary text-[70px] max-[680px]:text-[50px]"
              : "text-white text-[50px] max-[680px]:text-[50px]"
          }`}
        >
          {TESTIMONIAL_HEADING}
        </h1>

        {/* Google Rating */}
        <div className="flex items-center justify-center gap-[50px] mb-[50px] max-[415px]:gap-0">
          <Image
            src="/images/google-review.webp"
            alt="Google Reviews"
            width={300}
            height={100}
            className={`w-[300px] pr-[50px] py-5 border-r max-[680px]:w-[200px] max-[415px]:w-[120px] max-[415px]:p-0 max-[415px]:pr-5 ${
              isWhite ? "border-primary" : "border-white"
            }`}
          />
          <p
            className={`font-light text-[100px] -mt-[10px] max-[680px]:text-[50px] max-[415px]:text-[40px] max-[415px]:pl-[15px] ${
              isWhite ? "text-primary" : "text-white"
            }`}
          >
            {GOOGLE_RATINGS}/5
          </p>
        </div>

        {/* Client Reviews */}
        <div className="w-[1440px] max-[1460px]:w-full overflow-hidden flex">
          <div
            className={`w-[1440px] max-[1460px]:w-[95%] flex-shrink-0 flex items-start justify-between gap-[35px] transition-all duration-500 ${
              isAnimating ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
            } max-[500px]:gap-[15px]`}
          >
            <div className="w-[150px] h-[150px] shrink-0 max-[500px]:w-[100px] max-[500px]:h-[100px]">
              <Image
                src={review.image}
                alt={review.name}
                width={150}
                height={150}
                className="w-full h-full object-cover rounded-[50%_0%_50%_50%]"
              />
            </div>
            <div className="w-[85%] max-[1460px]:w-[95%]">
              <h3
                className={`font-normal text-[23px] leading-relaxed mb-[30px] max-[680px]:text-xs ${
                  isWhite ? "text-gray-600" : "text-gray-200"
                }`}
              >
                {review.review}
              </h3>
              <h2
                className={`uppercase font-semibold text-[27px] max-[680px]:text-xl ${
                  isWhite ? "text-primary" : "text-white"
                }`}
              >
                {review.name}
              </h2>
              <div className="flex items-center justify-start gap-[10px] mt-[10px]">
                {Array.from({ length: review.stars }, (_, i) => (
                  <FaStar
                    key={i}
                    className="text-yellow-400 w-[25px] h-[25px] max-[680px]:w-3 max-[680px]:h-3"
                  />
                ))}
              </div>
              <div
                className={`flex items-center justify-start gap-5 mt-[50px] text-sm ${
                  isWhite ? "text-primary" : "text-white"
                }`}
              >
                <FaChevronLeft
                  className="w-5 h-5 cursor-pointer hover:text-gold"
                  onClick={handlePreviousReview}
                  role="button"
                  aria-label="Previous Review"
                />
                <p className="-mt-[2px]">{`${currentReview + 1} / ${REVIEWS.length}`}</p>
                <FaChevronRight
                  className="w-5 h-5 cursor-pointer hover:text-gold"
                  onClick={handleNextReview}
                  role="button"
                  aria-label="Next Review"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Video Testimonials */}
        <div className="mt-[100px] max-[1460px]:w-[95%] max-[1460px]:mx-auto max-[1460px]:pt-[70px]">
          <Swiper
            ref={videoSwiperRef}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            className="w-full pb-[70px]"
            modules={[EffectCoverflow]}
          >
            {[...VIDEOS, ...VIDEOS, ...VIDEOS].map((video, index) => (
              <SwiperSlide key={`${video.id}-${index}`} className="testimonial-video-slide">
                <YouTubeFacade id={video.id} title={video.name} isWhite={isWhite} />
                <p
                  className={`text-center text-[25px] w-[80%] mx-auto mt-5 font-light max-[980px]:text-xl max-[500px]:text-lg ${
                    isWhite ? "text-primary" : "text-white"
                  }`}
                >
                  {video.name}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex justify-center mt-5">
            <button
              onClick={() => videoSwiperRef.current?.swiper.slidePrev()}
              className={`border-none text-[60px] cursor-pointer rounded-full w-[45px] h-[45px] flex items-center justify-center mx-5 ${
                isWhite
                  ? "text-white bg-primary"
                  : "text-primary bg-white"
              }`}
              aria-label="Previous Video"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => videoSwiperRef.current?.swiper.slideNext()}
              className={`border-none text-[60px] cursor-pointer rounded-full w-[45px] h-[45px] flex items-center justify-center mx-5 ${
                isWhite
                  ? "text-white bg-primary"
                  : "text-primary bg-white"
              }`}
              aria-label="Next Video"
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
