import Image from 'next/image';
import Link from 'next/link';

export default function HistoriaPage() {
  return (
    <main className="flex-grow pt-[120px] md:pt-[140px] pb-24">
      {/* Hero Section */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mb-[80px]">
        <div className="relative h-[400px] md:h-[600px] rounded-[24px] overflow-hidden border border-golden-honey/40 shadow-sm">
          <Image 
            fill 
            src="/images/nossahistoria.jpeg" 
            alt="Nossa História - Velas São João" 
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-earth/90 via-deep-earth/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full">
            <span className="text-xl md:text-2xl font-bold text-heritage-red uppercase tracking-[0.2em] mb-4 block drop-shadow-md">Tradição & Devoção</span>
            <h1 className="font-display-xl text-[48px] md:text-[72px] text-wax-cream mb-4 drop-shadow-md">Nossa História</h1>
            <p className="font-body-lg text-wax-cream/90 max-w-2xl">Mais de um século iluminando caminhos e aquecendo corações com nossa arte em cera.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-[800px] mx-auto mb-[128px]">
        <div>
          <h2 className="font-display-md text-[32px] md:text-[40px] text-deep-earth mb-6">O Início de Tudo</h2>
          <p className="font-body-lg text-on-surface-variant mb-8 leading-relaxed">
            A história da <strong className="text-deep-earth">Velas São João</strong> começou em uma pequena oficina familiar. Com muita fé e dedicação, nossos fundadores começaram a moldar as primeiras velas de forma 100% artesanal, derretendo a cera em tachos e usando moldes tradicionais.
          </p>
          <p className="font-body-lg text-on-surface-variant mb-8 leading-relaxed">
            Cada vela carrega consigo o calor e o aroma da devoção. Nossas velas não servem apenas para iluminar ambientes, mas para iluminar a alma, sendo companheiras de orações, promessas e momentos de paz.
          </p>
          
          <h2 className="font-display-md text-[32px] md:text-[40px] text-deep-earth mb-6 mt-16">A Arte da Tradição</h2>
          <p className="font-body-lg text-on-surface-variant mb-8 leading-relaxed">
            Nosso processo produtivo valoriza o tempo e a paciência. Assim como produtos artesanais clássicos, nossas velas são feitas seguindo receitas que atravessaram gerações. Conhecidas por sua suavidade e pureza, elas representam o nosso compromisso inabalável com a qualidade e respeito pela tradição.
          </p>

          <div className="bg-surface-container p-8 md:p-10 rounded-[18px] border-l-4 border-heritage-red my-12 shadow-sm">
            <p className="font-body-lg text-deep-earth italic text-lg md:text-xl">
              "Nossa missão nunca foi apenas vender velas, mas entregar luz e fé em forma de artesanato para cada lar."
            </p>
          </div>

          <h2 className="font-display-md text-[32px] md:text-[40px] text-deep-earth mb-6 mt-16">O Futuro</h2>
          <p className="font-body-lg text-on-surface-variant mb-12 leading-relaxed">
            Hoje, mesmo com o passar das décadas, mantemos viva a essência artesanal da Velas São João. Misturamos a tradição de outrora com o frescor da modernidade, sempre buscando novas formas de iluminar a sua vida, respeitando as raízes que nos trouxeram até aqui.
          </p>
        </div>

        <div className="text-center mt-16 border-t border-golden-honey/20 pt-16">
          <Link href="/" className="inline-flex items-center gap-3 bg-heritage-red text-wax-cream px-8 py-4 rounded-full hover:bg-primary-container transition-all transform hover:scale-105 font-label-lg tracking-widest shadow-md">
            Ver Nossas Coleções
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
