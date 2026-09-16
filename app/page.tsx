import ProductCarousel from '@/components/productCarousel';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-grow pt-[110px] md:pt-[130px] pb-24 bg-brand-dark-50/50">
      {/* Carrossel de Produtos */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mb-20 md:mb-28">
        <ProductCarousel />
      </section>

      {/* Categories Bento Grid */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mb-24 md:mb-32">
        <div className="text-center mb-14">
          <span className="text-xs md:text-sm font-label-lg uppercase tracking-widest text-brand-green-700 font-bold mb-2 block">
            Artesanato & Fé
          </span>
          <h2 className="font-headline-md text-[32px] md:text-[40px] text-brand-dark-950 mb-3">Nossas Coleções</h2>
          <div className="w-20 h-1 bg-brand-green-800 rounded-full mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-8 gap-6 md:gap-8">
          {/* Religiosas (Large) */}
          <Link href="/loja" className="group md:col-span-4 relative h-[380px] md:h-[420px] rounded-2xl overflow-hidden border border-brand-dark-200/80 shadow-sm hover:shadow-xl transition-all duration-500 block">
            <Image fill src="/images/velareligiosa.png" alt="Velas Religiosas" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-950/90 via-brand-dark-950/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="inline-block text-[11px] font-label-sm uppercase tracking-widest text-white bg-brand-green-900/90 px-3 py-1 rounded mb-3 backdrop-blur-sm">Tradição & Fé</span>
              <h3 className="font-headline-sm text-[26px] text-white mb-2">Velas Religiosas</h3>
              <p className="font-body-md text-white/85 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Fé e devoção moldadas à mão para os seus momentos sagrados.</p>
              <span className="inline-flex items-center font-label-sm text-white uppercase tracking-widest border-b border-white/60 pb-1 group-hover:border-white transition-colors">
                Ver coleção <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
              </span>
            </div>
          </Link>

          {/* Decorativas (Small) */}
          <Link href="/loja" className="group md:col-span-4 relative h-[380px] md:h-[420px] rounded-2xl overflow-hidden border border-brand-dark-200/80 shadow-sm hover:shadow-xl transition-all duration-500 block">
            <Image fill src="/images/veladecorativa2.png" alt="Velas Decorativas" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-950/90 via-brand-dark-950/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="inline-block text-[11px] font-label-sm uppercase tracking-widest text-white bg-brand-green-900/90 px-3 py-1 rounded mb-3 backdrop-blur-sm">Sofisticação</span>
              <h3 className="font-headline-sm text-[26px] text-white mb-2">Velas Decorativas</h3>
              <p className="font-body-md text-white/85 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Ambientes mais acolhedores, elegantes e iluminados.</p>
              <span className="inline-flex items-center font-label-sm text-white uppercase tracking-widest border-b border-white/60 pb-1 group-hover:border-white transition-colors">
                Ver coleção <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
              </span>
            </div>
          </Link>

          {/* Aromáticas (Small) */}
          <Link href="/loja" className="group md:col-span-4 relative h-[380px] md:h-[420px] rounded-2xl overflow-hidden border border-brand-dark-200/80 shadow-sm hover:shadow-xl transition-all duration-500 block">
            <Image fill src="/images/velaaromatica.jpeg" alt="Velas Aromáticas" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-950/90 via-brand-dark-950/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="inline-block text-[11px] font-label-sm uppercase tracking-widest text-white bg-brand-green-900/90 px-3 py-1 rounded mb-3 backdrop-blur-sm">Sensações</span>
              <h3 className="font-headline-sm text-[26px] text-white mb-2">Velas Aromáticas</h3>
              <p className="font-body-md text-white/85 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Aromas envolventes que transformam sua casa e bem-estar.</p>
              <span className="inline-flex items-center font-label-sm text-white uppercase tracking-widest border-b border-white/60 pb-1 group-hover:border-white transition-colors">
                Ver coleção <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
              </span>
            </div>
          </Link>

          {/* Sebo de Holanda (Large) */}
          <Link href="/loja" className="group md:col-span-4 relative h-[380px] md:h-[420px] rounded-2xl overflow-hidden border border-brand-dark-200/80 shadow-sm hover:shadow-xl transition-all duration-500 block">
            <Image fill src="/images/sebodeholanda.jpeg" alt="Sebo de Holanda" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-950/90 via-brand-dark-950/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="inline-block text-[11px] font-label-sm uppercase tracking-widest text-white bg-brand-green-900/90 px-3 py-1 rounded mb-3 backdrop-blur-sm">Artesanal</span>
              <h3 className="font-headline-sm text-[26px] text-white mb-2">Sebo de Holanda</h3>
              <p className="font-body-md text-white/85 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Tradição centenária e pureza para seu cuidado diário.</p>
              <span className="inline-flex items-center font-label-sm text-white uppercase tracking-widest border-b border-white/60 pb-1 group-hover:border-white transition-colors">
                Ver coleção <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* History/About Section */}
      <section className="bg-brand-green-50/60 py-24 md:py-32 border-y border-brand-dark-200">
        <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
          {/* Nossa Herança */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-24">
            <div className="relative h-[420px] md:h-[500px] rounded-2xl overflow-hidden border border-brand-dark-200 shadow-md">
              <Image fill src="/images/nossahistoria.jpeg" alt="Foto antiga" className="object-cover" />
            </div>
            <div>
              <span className="font-label-sm text-brand-green-800 uppercase tracking-widest mb-3 block font-bold">Nossa Herança</span>
              <h2 className="font-display-lg text-[34px] md:text-[46px] text-brand-dark-950 mb-6">Desde 1938</h2>
              <p className="font-body-lg text-brand-dark-700 mb-6 leading-relaxed">
                Tudo começou em 1938, quando o português João Chaves veio para o Brasil e iniciou a produção de velas com uma pequena máquina. Hoje, na terceira geração da família, as netas de João e Lucinda mantêm vivo um legado de trabalho, dedicação e perseverança.
              </p>
              <Link href="/historia" className="inline-flex items-center gap-2 text-brand-green-900 font-label-lg uppercase tracking-widest hover:text-brand-green-700 transition-colors font-bold">
                Ler nossa história completa <span className="material-symbols-outlined text-[20px]">menu_book</span>
              </Link>
            </div>
          </div>

          {/* Lojas e Atendimento */}
          <div className="border-t border-brand-dark-200 pt-20">
            <div className="text-center mb-16">
              <h3 className="font-display-md text-[30px] md:text-[38px] text-brand-dark-950 mb-3">Nossas Lojas</h3>
              <p className="font-body-lg text-brand-dark-600 max-w-2xl mx-auto">Visite nossos espaços físicos, conheça nossa produção de perto e encontre a vela perfeita para o seu momento.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {/* Loja 1 */}
              <div className="bg-white rounded-2xl p-8 border border-brand-dark-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">
                  <h4 className="font-headline-md text-brand-dark-950 mb-2 font-bold">Loja Matriz</h4>
                  <p className="font-body-md text-brand-dark-700 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[20px] mt-0.5 text-brand-green-800">location_on</span>
                    <span>Rua. Dr. Assis, 52 - Cidade Velha, Belém - PA, 66020-010</span>
                  </p>
                </div>
                <div className="w-full h-[280px] bg-brand-dark-100 rounded-xl border border-brand-dark-200 overflow-hidden">
                 <iframe 
                    width="100%" 
                    height="280" 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.5295734604842!2d-48.50760182431913!3d-1.4563191985299666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48ef1343315e3%3A0x4b2c07001f1c0699!2zRsOhYnJpY2EgZGUgVmVsYXMgU8OjbyBKb8Ojbw!5e0!3m2!1spt-BR!2sbr!4v1782934146094!5m2!1spt-BR!2sbr" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="strict-origin-when-cross-origin">
                 </iframe>
                </div>
              </div>

              {/* Loja 2 */}
              <div className="bg-white rounded-2xl p-8 border border-brand-dark-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">
                  <h4 className="font-headline-md text-brand-dark-950 mb-2 font-bold">Loja Filial</h4>
                  <p className="font-body-md text-brand-dark-700 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[20px] mt-0.5 text-brand-green-800">location_on</span>
                    <span>Travessa Padre Eutíquio, 1078, 3° piso, Shopping Pátio Belém</span>
                  </p>
                </div>
                <div className="w-full h-[280px] bg-brand-dark-100 rounded-xl border border-brand-dark-200 overflow-hidden">
                 <iframe 
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.526856135577!2d-48.49722872431916!3d-1.457853798528424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48e8b9a13f417%3A0x3c5bd4c1f871e3de!2sShopping%20P%C3%A1tio%20Bel%C3%A9m!5e0!3m2!1spt-BR!2sbr!4v1782936014972!5m2!1spt-BR!2sbr"
                   width="100%"
                   height="280"
                   style={{border: 0}}
                   allowFullScreen 
                   loading="lazy"
                   referrerPolicy="strict-origin-when-cross-origin">
                 </iframe>
                </div>
              </div>
            </div>

            {/* Atendimento e Contato */}
            <div className="bg-white rounded-3xl p-10 md:p-14 border border-brand-dark-200 shadow-sm max-w-4xl mx-auto text-center relative overflow-hidden">
              <div className="relative z-10">
                <span className="font-label-sm text-brand-green-800 uppercase tracking-widest mb-3 block font-bold">Fale Conosco</span>
                <h3 className="font-display-md text-[30px] md:text-[36px] text-brand-dark-950 mb-3">Atendimento Personalizado</h3>
                <p className="font-body-lg text-brand-dark-600 mb-8 max-w-xl mx-auto">
                  Precisa de uma encomenda especial, quer tirar dúvidas sobre nossas velas ou acompanhar as novidades? Entre em contato através dos nossos canais oficiais.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <a href="https://wa.me/5591993090310" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-brand-green-900 hover:bg-brand-green-800 text-white px-7 py-3.5 rounded-full transition-all transform hover:scale-105 font-label-lg text-sm tracking-wider shadow-md w-full sm:w-auto justify-center">
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    <span>WhatsApp Matriz</span>
                  </a>
                  <a href="https://wa.me/5591986099999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-brand-green-900 hover:bg-brand-green-800 text-white px-7 py-3.5 rounded-full transition-all transform hover:scale-105 font-label-lg text-sm tracking-wider shadow-md w-full sm:w-auto justify-center">
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    <span>WhatsApp Filial</span>
                  </a>
                                   
                  <a href="https://www.instagram.com/velassaojoao/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white px-7 py-3.5 rounded-full hover:opacity-90 transition-all transform hover:scale-105 font-label-lg text-sm tracking-wider shadow-md w-full sm:w-auto justify-center">
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}