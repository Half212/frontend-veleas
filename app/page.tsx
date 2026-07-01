import ProductCarousel from '@/components/productCarousel';
import Image from 'next/image';

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
        
        <div className="grid grid-cols-1 md:grid-cols-8 gap-gutter">
          {/* Religiosas (Large) */}
          <a href="#" className="group md:col-span-4 relative h-[400px] rounded-[18px] overflow-hidden border border-golden-honey/50 block">
            <Image fill src="/images/velareligiosa.png" alt="Velas Religiosas" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-earth/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="font-headline-sm text-[24px] text-wax-cream mb-2">Velas Religiosas</h3>
              <p className="font-body-md text-wax-cream/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Fé e devoção moldadas à mão.</p>
              <span className="inline-flex items-center font-label-sm text-wax-cream uppercase tracking-widest border-b border-wax-cream/50 pb-1 group-hover:border-wax-cream transition-colors">
                Ver coleção <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
              </span>
            </div>
          </a>

          {/* Decorativas (Small) */}
          <a href="#" className="group md:col-span-4 relative h-[400px] rounded-[18px] overflow-hidden border border-golden-honey/50 block">
            <Image fill src="/images/veladecorativa2.png" alt="Velas Decorativas" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-earth/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="font-headline-sm text-[24px] text-wax-cream mb-2">Velas Decorativas</h3>
              <p className="font-body-md text-wax-cream/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Ambientes mais iluminados.</p>
              <span className="inline-flex items-center font-label-sm text-wax-cream uppercase tracking-widest border-b border-wax-cream/50 pb-1 group-hover:border-wax-cream transition-colors">
                Ver coleção <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
              </span>
            </div>
          </a>

          {/* Aromáticas (Small) */}
          <a href="#" className="group md:col-span-4 relative h-[400px] rounded-[18px] overflow-hidden border border-golden-honey/50 block">
            <Image fill src="/images/velaaromatica.jpeg" alt="Velas Aromáticas" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-earth/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="font-headline-sm text-[24px] text-wax-cream mb-2">Velas Aromáticas</h3>
              <p className="font-body-md text-wax-cream/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Aromas que transformam seu espaço.</p>
              <span className="inline-flex items-center font-label-sm text-wax-cream uppercase tracking-widest border-b border-wax-cream/50 pb-1 group-hover:border-wax-cream transition-colors">
                Ver coleção <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
              </span>
            </div>
          </a>

          {/* Sebo de Holanda (Large) */}
          <a href="#" className="group md:col-span-4 relative h-[400px] rounded-[18px] overflow-hidden border border-golden-honey/50 block">
            <Image fill src="/images/sebodeholanda.jpeg" alt="Sebo de Holanda" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-earth/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="font-headline-sm text-[24px] text-wax-cream mb-2">Sebo de Holanda</h3>
              <p className="font-body-md text-wax-cream/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Tradição e suavidade para seu bem-estar.</p>
              <span className="inline-flex items-center font-label-sm text-wax-cream uppercase tracking-widest border-b border-wax-cream/50 pb-1 group-hover:border-wax-cream transition-colors">
                Ver coleção <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* History/About Section */}
      <section className="bg-surface-container py-[128px] border-y border-golden-honey/90">
        <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
          {/* Nossa Herança */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div className="relative h-[500px] rounded-[18px] overflow-hidden border border-golden-honey/90">
              <Image fill src="/images/nossahistoria.jpeg" alt="Foto antiga" className="object-cover" />
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

          {/* Lojas e Atendimento */}
          <div className="border-t border-golden-honey/20 pt-24">
            <div className="text-center mb-16">
              <h3 className="font-display-md text-[32px] md:text-[40px] text-deep-earth mb-4">Nossas Lojas</h3>
              <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">Visite nossos espaços físicos, conheça nossa produção de perto e encontre a vela perfeita para o seu momento.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
              {/* Loja 1 */}
              <div className="bg-surface rounded-[18px] p-8 border border-golden-honey/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">
                  <h4 className="font-headline-md text-deep-earth mb-2">Loja Matriz</h4>
                  <p className="font-body-md text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-[20px] mt-0.5 text-heritage-red">location_on</span>
                    <span>Rua. Dr. Assis, 52 - Cidade Velha, Belém - PA, 66020-010</span>
                  </p>
                </div>
               <br>
               </br>
                <div className="w-full h-[300px] bg-surface-container-high rounded-[12px] border border-golden-honey/20 overflow-hidden flex flex-col items-center justify-center text-on-surface-variant/60">
                 <iframe 
                    width="100%" 
                    height="300" 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.5295734604842!2d-48.50760182431913!3d-1.4563191985299666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48ef1343315e3%3A0x4b2c07001f1c0699!2zRsOhYnJpY2EgZGUgVmVsYXMgU8OjbyBKb8Ojbw!5e0!3m2!1spt-BR!2sbr!4v1782934146094!5m2!1spt-BR!2sbr" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="strict-origin-when-cross-origin">
                 </iframe>
                </div>
              </div>

              {/* Loja 2 */}
              <div className="bg-surface rounded-[18px] p-8 border border-golden-honey/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">
                  <h4 className="font-headline-md text-deep-earth mb-2">Loja Filial</h4>
                  <p className="font-body-md text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-20px] mt-0.5 text-heritage-red">location_on</span>
                    <span>Travessa Padre Eutíquio, 1078, 3° piso, Shopping Pátio Belém</span>
                  </p>
                </div>
                {/* Espaço para Google Maps 2 */}
                <div className="w-full h-[300px] bg-surface-container-high rounded-[12px] border border-golden-honey/20 overflow-hidden flex flex-col items-center justify-center text-on-surface-variant/60">
                 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.526856135577!2d-48.49722872431916!3d-1.457853798528424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48e8b9a13f417%3A0x3c5bd4c1f871e3de!2sShopping%20P%C3%A1tio%20Bel%C3%A9m!5e0!3m2!1spt-BR!2sbr!4v1782936014972!5m2!1spt-BR!2sbr"
                  width="100%"
                   height="300"
                    style={{border: 0}}
                     allowFullScreen loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin">

                      </iframe>
                </div>
              </div>
            </div>

            {/* Atendimento e Contato */}
            <div className="bg-surface rounded-[24px] p-10 md:p-16 border border-golden-honey/40 shadow-sm max-w-4xl mx-auto text-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-golden-honey/5 rounded-br-full"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-golden-honey/5 rounded-tl-full"></div>
              
              <div className="relative z-10">
                <span className="font-label-sm text-heritage-red uppercase tracking-widest mb-4 block">Fale Conosco</span>
                <h3 className="font-display-md text-[32px] text-deep-earth mb-4">Atendimento Personalizado</h3>
                <p className="font-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
                  Precisa de uma encomenda especial, quer tirar dúvidas sobre nossas velas ou acompanhar as novidades? Entre em contato conosco através dos nossos canais.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                  {/* Botão WhatsApp */}
                  <a href="https://wa.me/5591993090310" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full hover:bg-[#1ebe57] transition-all transform hover:scale-105 font-label-lg tracking-widest shadow-md w-full sm:w-auto justify-center">
                    <span className="material-symbols-outlined text-[24px]">chat</span>
                    <span>WhatsApp Loja 1</span>
                  </a>
                  <a href="https://wa.me/5591986099999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full hover:bg-[#1ebe57] transition-all transform hover:scale-105 font-label-lg tracking-widest shadow-md w-full sm:w-auto justify-center">
                    <span className="material-symbols-outlined text-[24px]">chat</span>
                    <span>WhatsApp Loja 2</span>
                  </a>
                                   
                  {/* Botão Instagram */}
                  <a href="https://www.instagram.com/velassaojoao/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white px-8 py-4 rounded-full hover:opacity-90 transition-all transform hover:scale-105 font-label-lg tracking-widest shadow-md w-full sm:w-auto justify-center">
                    <span className="material-symbols-outlined text-[24px]">photo_camera</span>
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