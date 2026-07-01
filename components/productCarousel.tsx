'use client'; // Componentes Swiper precisam rodar no cliente

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from "next/image";     
import Link from "next/link";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Definição dos slides (pode vir da API futuramente)
const slides = [
  {
    image: "/images/velaartesanal.jpeg", // Certifique-se de ter as imagens em /public/images
    title: "Velas Artesanais de Cera de Abelha",
    description: "Desde 1938 iluminando ambientes e momentos especiais."
  },
  {
    image: "/images/velaartesanal2.jpeg",
    title: "Velas Religiosas de Devoção",
    description: "Fé moldada à mão com nossa tradição."
  },
  {
    image: "/images/velaartesanal3.jpeg",
    title: "Velas Decorativas Aromáticas",
    description: "Transforme ambientes com aromas envolventes."
  }
];

export default function ProductCarousel() {
  return (
    <div className="product-carousel-container relative w-full h-[450px] md:h-[600px] lg:h-[700px] rounded-[16px] overflow-hidden border-[5px] border-golden-honey/50">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
        className="h-full w-full"
        style={{
          "--swiper-navigation-color": "#8C1C13",
          "--swiper-pagination-color": "#8C1C13",
        } as React.CSSProperties}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full flex items-center justify-center">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="absolute inset-0 object-cover object-center"
              />
              <div className="absolute inset-0 bg-deep-earth/20 mix-blend-multiply"></div>
              <div className="relative z-10 text-center px-4 max-w-3xl">
                <h1 className="font-display-lg text-[36px] md:text-[48px] text-wax-cream mb-6 drop-shadow-md">
                  {slide.title}
                </h1>
                <p className="font-body-lg text-[18px] text-wax-cream/90 mb-10 max-w-xl mx-auto drop-shadow-sm">
                  {slide.description}
                </p>
                <Link
                  href="/loja"
                  className="inline-flex items-center justify-center bg-heritage-red text-wax-cream font-label-lg text-label-lg uppercase px-8 py-4 rounded-[8px] hover:bg-primary-container transition-colors duration-300 border border-transparent hover:border-golden-honey/50"
                >
                  Explorar Coleção
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}