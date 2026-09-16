import Image from 'next/image';
import Link from 'next/link';

export default function HistoriaPage() {
  return (
    <main className="flex-grow pt-[110px] md:pt-[130px] pb-24 bg-brand-dark-50/50">
      {/* Hero Section */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mb-16 md:mb-20">
        <div className="relative h-[380px] md:h-[520px] rounded-3xl overflow-hidden border border-brand-dark-200 shadow-lg">
          <Image 
            fill 
            src="/images/nossahistoria.jpeg" 
            alt="Nossa História - Velas São João" 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-950/95 via-brand-dark-950/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-14 w-full">
            <span className="text-sm md:text-base font-bold text-accent-gold uppercase tracking-[0.25em] mb-3 block drop-shadow-md">
              Tradição & Devoção Centenária
            </span>
            <h1 className="font-display-xl text-[40px] md:text-[64px] text-white mb-3 drop-shadow-md">
              Nossa História
            </h1>
            <p className="font-body-lg text-white/90 max-w-2xl text-base md:text-lg">
              Uma trajetória construída ao longo de décadas com trabalho, dedicação e o espírito empreendedor da família Chaves.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-[840px] mx-auto mb-20">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-brand-dark-200 shadow-sm space-y-10">
          <div>
            <h2 className="font-display-md text-[28px] md:text-[36px] text-brand-dark-950 mb-4 font-bold">O Início em 1938</h2>
            <p className="font-body-lg text-brand-dark-700 leading-relaxed text-base md:text-lg">
              Tudo começou em 1938, quando o português João Chaves veio para o Brasil para morar e trabalhar com sua irmã e seu cunhado, que já possuía um pequeno comércio. Juntos, decidiram comprar uma máquina de fabricar velas e começaram a produzir e vender velas, inicialmente junto a outros artigos que já faziam parte do comércio.
            </p>
          </div>

          <div>
            <h2 className="font-display-md text-[28px] md:text-[36px] text-brand-dark-950 mb-4 font-bold">O Crescimento da São João</h2>
            <p className="font-body-lg text-brand-dark-700 leading-relaxed text-base md:text-lg">
              Com o passar dos anos, João Chaves, ao lado de sua esposa, Lucinda, deram continuidade à São João. O negócio prosperou e a produção de velas e sebo de Holanda tornou-se a principal atividade da empresa.
            </p>
          </div>

          <div>
            <h2 className="font-display-md text-[28px] md:text-[36px] text-brand-dark-950 mb-4 font-bold">Atravessando Gerações</h2>
            <p className="font-body-lg text-brand-dark-700 leading-relaxed text-base md:text-lg">
              Mas essa história não parou por aí. O sonho iniciado por João e Lucinda atravessou gerações. Seus filhos assumiram a responsabilidade de dar continuidade ao trabalho construído pelos pais e, com o passar dos anos, a empresa chegou à terceira geração da família.
            </p>
          </div>

          <div>
            <h2 className="font-display-md text-[28px] md:text-[36px] text-brand-dark-950 mb-4 font-bold">A Terceira Geração no Comando</h2>
            <p className="font-body-lg text-brand-dark-700 leading-relaxed text-base md:text-lg">
              Hoje, são as netas de João e Lucinda que estão à frente da Fábrica de Velas São João, levando adiante não apenas uma empresa, mas um legado construído ao longo de décadas com trabalho, dedicação, perseverança e espírito empreendedor.
            </p>
          </div>

          <div className="bg-brand-green-50 p-6 md:p-8 rounded-2xl border-l-4 border-brand-green-800 shadow-xs">
            <p className="font-body-lg text-brand-dark-900 italic text-lg md:text-xl font-medium leading-relaxed">
              &quot;De uma pequena máquina de fabricar velas, em 1938, até a terceira geração no comando, a São João construiu uma trajetória que se confunde com a própria história da família Chaves. Uma história que começou com um sonho e que continua sendo escrita, geração após geração.&quot;
            </p>
          </div>

          <div className="text-center pt-8 border-t border-brand-dark-200">
            <Link href="/loja" className="inline-flex items-center gap-3 bg-brand-green-900 text-white px-8 py-4 rounded-full hover:bg-brand-green-800 transition-all transform hover:scale-105 font-label-lg tracking-widest shadow-md">
              Explorar Nossa Loja
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
