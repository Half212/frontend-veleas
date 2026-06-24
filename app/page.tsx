import ProductCarousel from '@/components/productCarousel';

export default function Home() {
  return (
    <main className="flex-grow pt-[120px] md:pt-[140px] pb-24">
      {/* Carrossel de Produtos */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mb-[128px]">
        <ProductCarousel />
      </section>

      {/* Categories Bento Grid */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mb-[128px]">
        <div className="text-center mb-16">
          <h2 className="font-headline-md text-[32px] text-deep-earth mb-4">Nossas Coleções</h2>
          <div className="w-16 h-px bg-golden-honey/40 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Religiosas (Large) */}
          <a href="#" className="group md:col-span-8 relative h-[400px] rounded-DEFAULT overflow-hidden border border-golden-honey/20 block">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz7I0OVsWaOSIvWZv5PQuQHs_miDBUSCa1rqp8y4WLWWb_il3q0pc6612G1v5k4WmDn9XWAQ4PtRv1KQIdXqW3605y9FfHMT9Lv3tSpvlRKjnlsmzWSg2pSIvRpLzgsOLlkQ82kzkZTsW0rm5ZfrT9H02e-fgsq_5NRWUpOD4-qRDLobR2AwNJg7CrEp8KG7mfawELP4I32vsm_MMp4ZaSjmi5PsaqgKrWjcT68w_MJc2Bo25TLhEr7NV2dna2aMup4PhCJOYK8Sg" alt="Velas Religiosas" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-earth/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="font-headline-sm text-[24px] text-wax-cream mb-2">Religiosas</h3>
              <p className="font-body-md text-wax-cream/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Fé e devoção moldadas à mão.</p>
              <span className="inline-flex items-center font-label-sm text-wax-cream uppercase tracking-widest border-b border-wax-cream/50 pb-1 group-hover:border-wax-cream transition-colors">
                Ver coleção <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
              </span>
            </div>
          </a>

          {/* Decorativas (Small) */}
          <a href="#" className="group md:col-span-4 relative h-[400px] rounded-DEFAULT overflow-hidden border border-golden-honey/20 block">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOJkT9aWTyUj8TQzyuEQcap6zYhuZDpwnyYD25RNtp3Yw4M6HcSsUxIIuQHNOoqDebEHOUuuV5GzpG2RVmPtAh3vUdjO-9HIrImUbBTStLzFQzEcsvY_q1ii_ugEYR5Stx9UMRDSXsp5DgNBpDYR2DOWE981H_57UYgQt1wA_84nddX9PatIkpon-ShbBd5XIKL1mVOy8IkvnMx1HUaxUJ3A_AWqNk3HsOyN1R-ysUGXixXUOfMPI2qgEEelq0KEuW21ddsyuwAPU" alt="Velas Decorativas" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-earth/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="font-headline-sm text-[24px] text-wax-cream mb-2">Decorativas</h3>
              <span className="inline-flex items-center font-label-sm text-wax-cream uppercase tracking-widest border-b border-wax-cream/50 pb-1 group-hover:border-wax-cream transition-colors">
                Ver coleção
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* History/About Section */}
      <section className="bg-surface-container py-[128px] border-y border-golden-honey/20">
        <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-DEFAULT overflow-hidden border border-golden-honey/30">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGxvQrBrCTAbJCv3BSNmLXeyhSdLvWNH4cugpicPcRLI79pF2s_3OS1SxcxIvAkKhOR1K5fextNBQgV5-wkenwLOaql4z_HlBirDD19lpi6gQY83LjuM7PB6xoXYP9J8H3GuMN6_2FJiXUdUfUpdH3rV6l7z3kvOPJakbKrhMgTNBSbMDL89GE36fShBO_dVPxovEPcbf6DSz-Mo_3o2LwG1XAJ8Mb8dCBdSPjmpPRFD0Q6i_YfYdcrSV2fDp2yJ1qrNhBAg5lqeE" alt="Artesão trabalhando" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-label-sm text-heritage-red uppercase tracking-widest mb-4 block">Nossa Herança</span>
              <h2 className="font-display-lg text-[36px] md:text-[48px] text-deep-earth mb-8">Desde 1938</h2>
              <p className="font-body-lg text-on-surface-variant mb-6 leading-relaxed">
                A história da Velas São João começa numa pequena oficina, onde o calor da cera derretida se misturava ao aroma de devoção. Por gerações, mantemos o compromisso com o fazer manual.
              </p>
              <a href="#" className="inline-flex items-center text-heritage-red font-label-lg uppercase tracking-widest hover:text-primary-container transition-colors">
                Ler nossa história completa <span className="material-symbols-outlined ml-2 text-[18px]">menu_book</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}