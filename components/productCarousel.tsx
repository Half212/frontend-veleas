'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Image from "next/image";     
import Link from "next/link";
import { carouselService, DEFAULT_CAROUSEL_SLIDES } from "@/services/carouselService";
import { CarouselSlide } from "@/types/carousel";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function ProductCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>(() => {
    return carouselService.getActiveSlides();
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlides(carouselService.getActiveSlides());

    const unsubscribe = carouselService.onUpdate((updatedSlides) => {
      setSlides(updatedSlides.filter((s) => s.active));
    });

    return () => unsubscribe();
  }, []);

  const displaySlides = slides.length > 0 ? slides : DEFAULT_CAROUSEL_SLIDES;

  return (
    <div className="product-carousel-container relative w-full h-[460px] md:h-[580px] lg:h-[640px] rounded-3xl overflow-hidden border border-brand-dark-200/90 shadow-2xl bg-brand-dark-950">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={displaySlides.length > 1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        className="h-full w-full"
        style={{
          "--swiper-navigation-color": "#FFFFFF",
          "--swiper-pagination-color": "#C89D42",
        } as React.CSSProperties}
      >
        {displaySlides.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            <div className="relative h-full w-full flex items-center justify-center">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                unoptimized={Boolean(slide.image && slide.image.startsWith("data:"))}
                className="absolute inset-0 object-cover object-center transform scale-105 transition-transform duration-1000"
              />
              
              {/* Overlay sofisticado com gradiente escuro e toque esmeralda */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-950/95 via-brand-dark-950/50 to-brand-dark-950/30"></div>
              <div className="absolute inset-0 bg-brand-green-950/25 mix-blend-multiply pointer-events-none"></div>

              <div className="relative z-10 text-center px-6 max-w-4xl">
                <span className="inline-block text-xs md:text-sm font-label-sm uppercase tracking-[0.3em] text-accent-gold font-bold mb-4 bg-brand-dark-900/60 px-4 py-1.5 rounded-full border border-accent-gold/30 backdrop-blur-sm shadow-sm">
                  Tradição & Pureza Artesanal
                </span>
                
                <h1 className="font-display-lg text-[32px] sm:text-[44px] md:text-[56px] text-white mb-4 leading-tight drop-shadow-lg font-bold tracking-tight">
                  {slide.title}
                </h1>
                
                <p className="font-body-lg text-[16px] md:text-[20px] text-brand-dark-100/90 mb-8 max-w-2xl mx-auto drop-shadow-md leading-relaxed">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href={slide.buttonLink || "/loja"}
                    className="inline-flex items-center justify-center gap-2 bg-brand-green-900 hover:bg-brand-green-800 text-white font-label-lg text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-all duration-300 shadow-xl border border-brand-green-700/60 hover:scale-105 font-bold"
                  >
                    <span>{slide.buttonText || "Explorar Coleção"}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>

                  <Link
                    href="/historia"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-label-lg text-sm uppercase tracking-widest px-6 py-4 rounded-xl transition-all duration-300 backdrop-blur-md border border-white/30 hover:border-white/60"
                  >
                    <span>Nossa História</span>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}