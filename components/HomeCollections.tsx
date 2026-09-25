"use client";

import { useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { collectionService } from "@/services/collectionService";

export default function HomeCollections() {
  const collections = useSyncExternalStore(
    collectionService.subscribe,
    collectionService.getActiveCollectionsSnapshot,
    collectionService.getServerActiveCollectionsSnapshot
  );

  const header = useSyncExternalStore(
    collectionService.subscribe,
    collectionService.getHeaderSnapshot,
    collectionService.getServerHeaderSnapshot
  );

  useEffect(() => {
    collectionService.fetchFromBackend();
  }, []);

  return (
    <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mb-24 md:mb-32">
      <div className="text-center mb-14">
        <span className="text-xs md:text-sm font-label-lg uppercase tracking-widest text-brand-green-700 font-bold mb-2 block">
          {header.tag || "Artesanato & Fé"}
        </span>
        <h2 className="font-headline-md text-[32px] md:text-[40px] text-brand-dark-950 mb-3">
          {header.title || "Nossas Coleções"}
        </h2>
        <div className="w-20 h-1 bg-brand-green-800 rounded-full mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-8 gap-6 md:gap-8">
        {collections.map((item) => (
          <Link
            key={item.id}
            href={item.link || "/loja"}
            className="group md:col-span-4 relative h-[380px] md:h-[420px] rounded-2xl overflow-hidden border border-brand-dark-200/80 shadow-sm hover:shadow-xl transition-all duration-500 block"
          >
            <Image
              fill
              src={item.image}
              alt={item.title}
              unoptimized={Boolean(item.image && item.image.startsWith("data:"))}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-950/90 via-brand-dark-950/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="inline-block text-[11px] font-label-sm uppercase tracking-widest text-white bg-brand-green-900/90 px-3 py-1 rounded mb-3 backdrop-blur-sm font-bold">
                {item.tag}
              </span>
              <h3 className="font-headline-sm text-[26px] text-white mb-2 leading-tight">
                {item.title}
              </h3>
              <p className="font-body-md text-white/85 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 text-sm md:text-base leading-relaxed">
                {item.subtitle}
              </p>
              <span className="inline-flex items-center font-label-sm text-white uppercase tracking-widest border-b border-white/60 pb-1 group-hover:border-white transition-colors">
                {item.buttonText || "Ver coleção"}{" "}
                <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
