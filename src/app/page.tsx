"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaLinkedin, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { SwiperRef } from "swiper/react";

import Testimonials from "@/components/sections/testimonials";
import FAQInternal from "@/components/sections/faq-internal";
import RecentBlogs from "@/components/sections/recent-blogs";
import OurProcessShared from "@/components/sections/our-process";

import {
  homeTopSection,
  servicesSection,
  serviceCards,
  features,
  memberCards,
  achievementsSection,
  achievements,
  loveneetSection,
  ourProcessSection,
  processSteps,
  homepageFaqData,
} from "@/data/pages/homepage";

// =============================================================================
// Helpers
// =============================================================================
function splitHeadline(text: string) {
  const words = text.trim().split(" ");
  const lastWord = words.pop() || "";
  return { rest: words.join(" "), last: lastWord };
}

// =============================================================================
// AnimatedCounter (Odometer-style)
// =============================================================================
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    setCount(0);
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          obs.disconnect();
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) * (1 - progress);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { rootMargin: "-50px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// =============================================================================
// FadeIn wrapper — IntersectionObserver scroll reveal
// =============================================================================
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40 && rect.bottom >= 0) return;
    el.classList.add("fade-up");
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          obs.disconnect();
        }
      },
      { rootMargin: "-40px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

function ServicesSwiperSection() {
  const swiperRef = useRef<SwiperRef>(null);

  return (
    <div className="pb-[80px] overflow-hidden">
      <Swiper
        ref={swiperRef}
        effect="coverflow"
        grabCursor={true}
        slidesPerView="auto"
        centeredSlides={true}
        loop={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        modules={[EffectCoverflow]}
        className="!pb-[20px] w-full"
      >
        {[...serviceCards, ...serviceCards, ...serviceCards].map((card, index) => (
          <SwiperSlide
            key={index}
            className="!h-auto services-slide"
          >
            <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-8 max-[580px]:p-6 min-h-[350px] flex flex-col text-center">
              <h4 className="text-primary text-[18px] font-bold mb-4">
                {card.title}
              </h4>
              <p className="text-primary text-[17px] max-[580px]:text-[15px] leading-[1.5] flex-1">
                {card.desc}
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href={card.href}
                  className="inline-block text-primary text-[14px] border border-primary rounded-[10px] px-[15px] py-[10px] no-underline hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  Know More
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom prev/next arrows below dots */}
      <div className="flex justify-center mt-5 gap-3">
        <button
          onClick={() => swiperRef.current?.swiper.slidePrev()}
          className="w-[50px] h-[50px] max-[580px]:w-[45px] max-[580px]:h-[45px] rounded-full bg-primary flex items-center justify-center cursor-pointer border-none hover:bg-primary-light transition-colors duration-200"
          aria-label="Previous Slide"
        >
          <FaChevronLeft className="text-white w-4 h-4" />
        </button>
        <button
          onClick={() => swiperRef.current?.swiper.slideNext()}
          className="w-[50px] h-[50px] max-[580px]:w-[45px] max-[580px]:h-[45px] rounded-full bg-primary flex items-center justify-center cursor-pointer border-none hover:bg-primary-light transition-colors duration-200"
          aria-label="Next Slide"
        >
          <FaChevronRight className="text-white w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Main Page
// =============================================================================
export default function HomePage() {
  const headline1 = splitHeadline(homeTopSection.headline1);
  const headline2 = splitHeadline(homeTopSection.headline2);

  const handleCardClick = useCallback((href: string) => {
    window.location.href = href;
  }, []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.from({ length: 15 }, (_, i) => {
      const q = homepageFaqData[`q${i + 1}`];
      const a = homepageFaqData[`qa${i + 1}`];
      if (q && a) {
        return {
          "@type": "Question",
          name: q,
          acceptedAnswer: {
            "@type": "Answer",
            text: a,
          },
        };
      }
      return null;
    }).filter(Boolean),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* ===================================================================
          SECTION 1 — Hero Banner (contactMap bg, gray text, card bar)
      =================================================================== */}
      <section
        className="w-full relative overflow-hidden pt-[200px] pb-[50px] max-[1000px]:pt-[200px] max-[580px]:pt-[220px] max-[580px]:pb-[30px]"
        style={{
          backgroundImage: "url('/images/contactMap.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          {/* Headlines — gray text with blue last word */}
          <div>
            <h1 className="hero-slide-left text-[55px] max-[1100px]:text-[46px] max-[790px]:text-[38px] max-[580px]:text-[28px] max-[415px]:text-[24px] font-normal leading-[1.15] text-[#727376]">
              {headline1.rest}{" "}
              <span className="text-primary-light">{headline1.last}</span>
            </h1>
            <h1 className="hero-slide-right text-[55px] max-[1100px]:text-[46px] max-[790px]:text-[38px] max-[580px]:text-[28px] max-[415px]:text-[24px] font-normal leading-[1.15] text-[#727376] mt-2">
              {headline2.rest}{" "}
              <span className="text-primary-light">{headline2.last}</span>
            </h1>
            <h2 className="hero-fade-up mt-5 text-[18px] max-[580px]:text-[14px] font-bold text-primary">
              {homeTopSection.smallHeadline1}
            </h2>
          </div>

          {/* Service icon cards — horizontal bar with dividers */}
          <div className="hero-cards mx-auto mt-12 mb-8 max-w-[1400px]">
            {/* Desktop: single-row bar with dividers. Mobile (<900px): 3-col grid with individual card shadows */}
            <div className="flex items-center justify-around bg-white rounded-[15px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-[900px]:grid max-[900px]:grid-cols-3 max-[900px]:bg-transparent max-[900px]:shadow-none max-[900px]:gap-[12px] max-[900px]:justify-items-center max-[900px]:px-[15px] max-[415px]:gap-[8px] max-[415px]:px-[10px]">
              {serviceCards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(card.href)}
                  className={`group flex flex-col items-center justify-center py-[25px] px-[15px] w-[190px] h-[150px] max-[1100px]:w-[160px] max-[1100px]:h-[140px] max-[900px]:w-full max-[900px]:h-auto max-[900px]:py-[20px] max-[900px]:px-[10px] cursor-pointer transition-all duration-300 hover:bg-primary hover:scale-110 bg-transparent ${
                    index < serviceCards.length - 1
                      ? "border-r border-[#00273f]/30 max-[900px]:border-r-0"
                      : ""
                  } max-[900px]:rounded-[15px] max-[900px]:bg-white max-[900px]:shadow-[0_2px_10px_rgba(0,0,0,0.08)] ${
                    index === serviceCards.length - 1 && serviceCards.length % 3 === 1
                      ? "max-[900px]:col-start-2"
                      : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.img}
                    alt={card.alt}
                    className="w-[40%] max-[900px]:w-[45px] max-[415px]:w-[35px] mb-2 transition-all duration-300 group-hover:invert group-hover:brightness-200"
                  />
                  <p className="text-center text-[11px] max-[900px]:text-[10px] max-[415px]:text-[9px] font-bold leading-tight text-primary group-hover:text-white transition-colors duration-300">
                    {card.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* More Services button */}
          <div className="hero-btn">
            <Link href="/more-services">
              <button className="font-heading bg-gradient-to-b from-white to-[#f6f9fe] rounded-[28px] border-2 border-[#00273f] px-[66px] py-[18px] max-[580px]:px-[40px] max-[580px]:py-[14px] text-[16px] max-[580px]:text-[14px] font-semibold text-primary cursor-pointer transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary animate-[pulse_2s_infinite]">
                More Services
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 2 — Loveneet / Consultant Banner (full-width image overlay)
      =================================================================== */}
      <section className="relative w-full overflow-hidden">
        {/* Full-width background image — on mobile, image flows naturally for proper aspect ratio */}
        <div className="relative w-full">
          {loveneetSection.bgImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={loveneetSection.bgImage}
              alt={loveneetSection.bgAlt}
              className="w-full h-auto block"
            />
          ) : (
            <div className="w-full h-[600px] bg-primary" />
          )}

          {/* "DECADE LONG EXPERIENCE" watermark text — hidden on small mobile */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none max-[580px]:hidden">
            <div className="text-center">
              <p className="text-white/[0.07] text-[150px] max-[1100px]:text-[100px] max-[790px]:text-[70px] font-bold leading-none tracking-wider">
                DECADE LONG
              </p>
              <p className="text-white/[0.07] text-[150px] max-[1100px]:text-[100px] max-[790px]:text-[70px] font-bold leading-none tracking-wider">
                EXPERIENCE
              </p>
            </div>
          </div>

          {/* Overlay buttons at bottom */}
          <div className="absolute bottom-[90px] max-[900px]:bottom-[40px] max-[580px]:bottom-[15px] left-0 w-full px-[150px] max-[1200px]:px-[80px] max-[900px]:px-[40px] max-[580px]:px-[10px]">
            <div className="max-w-[1440px] mx-auto flex items-center gap-4 max-[580px]:gap-2 flex-wrap">
              {/* LinkedIn button */}
              <Link
                href={loveneetSection.linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent border-2 max-[580px]:border border-white text-white px-6 py-2.5 max-[580px]:px-3 max-[580px]:py-1.5 rounded-full text-[18px] max-[580px]:text-[11px] font-semibold no-underline transition-all duration-300 hover:bg-primary-light animate-[pulse_2s_infinite]"
              >
                <FaLinkedin className="text-[20px] max-[580px]:text-[12px]" />
                LinkedIn
              </Link>

              {/* RCIC Appointment button */}
              <Link
                href={loveneetSection.rcicAppointmentUrl}
                className="inline-flex flex-col items-center bg-transparent border-2 max-[580px]:border border-white text-white px-6 py-2.5 max-[580px]:px-3 max-[580px]:py-1 rounded-full no-underline transition-all duration-300 hover:bg-primary-light"
              >
                <span className="text-[10px] max-[580px]:text-[7px] font-light">Have Questions?</span>
                <span className="text-[14px] max-[580px]:text-[9px] font-bold">
                  <span className="font-bold">RCIC</span>{" "}
                  <span className="text-[10px] max-[580px]:text-[7px]">APPOINTMENT</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 3 — Member Of (dark bg, white cards with logos)
      =================================================================== */}
      <section className="w-full bg-primary py-[50px] -mt-[5px]">
        <div className="max-w-[1420px] mx-auto max-[1460px]:w-[95%]">
          <FadeIn className="flex items-start justify-center gap-[100px] max-[1100px]:gap-[50px] max-[790px]:gap-[30px] max-[580px]:gap-[15px]">
            {memberCards.map((card, i) => (
              <FadeIn
                key={i}
                delay={i * 0.3}
                className="flex flex-col items-center text-white text-center"
              >
                <h3 className="text-[20px] max-[580px]:text-[12px] font-bold pb-[20px] max-[580px]:pb-[10px]">
                  {card.heading}
                </h3>
                <div className="w-[350px] h-[180px] max-[1100px]:w-[280px] max-[1100px]:h-[150px] max-[790px]:w-[220px] max-[790px]:h-[130px] max-[580px]:w-[110px] max-[580px]:h-[90px] max-[415px]:w-[95px] max-[415px]:h-[80px] bg-white rounded-[15px] max-[580px]:rounded-[10px] flex items-center justify-center p-4 max-[580px]:p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.img}
                    alt={card.alt}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </FadeIn>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ===================================================================
          SECTION 4 — Why Us / Features (aboutLeaf bg, dotted border cards)
      =================================================================== */}
      <section
        className="w-full py-[50px]"
        style={{
          backgroundImage: "url('/images/aboutLeaf.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-[1340px] mx-auto max-[1380px]:w-[95%]">
          <FadeIn className="text-center mb-10">
            <h2 className="text-primary text-[40px] max-[790px]:text-[32px] max-[580px]:text-[26px] font-semibold">
              Why Us?
            </h2>
          </FadeIn>

          <div className="flex flex-col gap-[60px] max-[790px]:gap-[40px]">
            {features.map((feature, num) => (
              <FadeIn key={num} delay={num * 0.2}>
                <div className="flex items-start gap-[60px] max-[790px]:gap-[30px] max-[580px]:flex-col border-2 border-dotted border-primary rounded-[25px] p-8 max-[580px]:p-5 transition-all duration-300 hover:-translate-y-[10px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
                  {/* Icon/SVG */}
                  <div className="shrink-0 w-[100px] max-[790px]:w-[80px] max-[580px]:w-[60px] transition-transform duration-300 hover:scale-110">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={feature.svg}
                      alt={feature.alt}
                      className="w-full h-auto"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-primary text-[28px] max-[790px]:text-[22px] max-[580px]:text-[20px] font-medium">
                      {feature.heading}
                    </h2>
                    <p className="text-primary text-[18px] max-[790px]:text-[16px] max-[580px]:text-[14px] leading-relaxed pt-[30px] max-[580px]:pt-[15px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 5 — Our Process (alternating blue/gold circles, runway)
      =================================================================== */}
      <OurProcessShared />

      {/* ===================================================================
          SECTION 6 — Services (Swiper coverflow on dark bg)
      =================================================================== */}
      <section
        className="w-full pt-[55px] pb-[10px]"
        style={{
          backgroundImage: "url('/images/pillars-bg.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-[1440px] mx-auto max-[1470px]:w-[95%] text-center">
          {/* Heading */}
          <FadeIn>
            <h2 className="text-gold text-[60px] max-[790px]:text-[40px] max-[580px]:text-[30px] pb-[50px] max-[580px]:pb-[30px]">
              {servicesSection.heading}
            </h2>
            <p className="text-white text-[26px] max-[790px]:text-[20px] max-[580px]:text-[16px] leading-[40px] max-[580px]:leading-[28px] font-light max-w-[900px] mx-auto mb-8">
              {servicesSection.description}
            </p>
            <Link href="/more-services">
              <button className="text-white border-2 border-white bg-transparent px-[45px] py-[20px] max-[580px]:px-[30px] max-[580px]:py-[14px] rounded-[30px] text-[18px] max-[580px]:text-[14px] font-semibold cursor-pointer transition-all duration-300 hover:bg-white hover:text-black animate-[pulse_1.5s_infinite] mb-10">
                Know More
              </button>
            </Link>
          </FadeIn>

          {/* Swiper Coverflow */}
          <ServicesSwiperSection />
        </div>
      </section>

      {/* ===================================================================
          SECTION 7 — Achievements (contactMap bg, #033b5d cards)
      =================================================================== */}
      <section
        className="w-full py-[50px]"
        style={{
          backgroundImage: "url('/images/contactMap.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-[1440px] mx-auto max-[1470px]:w-[95%] text-center">
          <FadeIn>
            <h2 className="text-primary text-[65px] max-[790px]:text-[40px] max-[580px]:text-[30px]">
              {achievementsSection.heading}
            </h2>
            <h2 className="text-primary text-[32px] max-[790px]:text-[22px] max-[580px]:text-[16px] font-normal pt-[30px] pb-[40px]">
              {achievementsSection.description}
            </h2>
          </FadeIn>

          <div className="flex items-center justify-around max-[790px]:flex-col max-[790px]:gap-8">
            {achievements.map((achievement, index) => (
              <FadeIn
                key={index}
                delay={index * 0.2}
                className="bg-[#033b5d] text-white w-[288px] max-[900px]:w-[240px] max-[580px]:w-[220px] h-[360px] max-[900px]:h-[300px] max-[580px]:h-[260px] rounded-[20px] p-[60px_30px] max-[580px]:p-[40px_20px] flex flex-col items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={achievement.svg}
                  alt={achievement.alt}
                  className="w-[100px] h-[100px] max-[580px]:w-[70px] max-[580px]:h-[70px] mb-4"
                />
                <p className="text-[50px] max-[580px]:text-[36px] font-bold leading-none">
                  <AnimatedCounter target={achievement.numbers} />
                  <span className="text-[30px]">+</span>
                </p>
                <p className="text-[30px] max-[580px]:text-[20px] font-light mt-2">
                  {achievement.heading}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION 8 — Testimonials (white variant)
      =================================================================== */}
      <Testimonials variant="white" />

      {/* ===================================================================
          SECTION 9 — Recent Blogs
      =================================================================== */}
      <RecentBlogs />

      {/* ===================================================================
          SECTION 10 — FAQ (blue variant — dark gradient, golden question mark)
      =================================================================== */}
      <FAQInternal data={homepageFaqData} variant="blue" />
    </main>
  );
}
