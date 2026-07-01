import type { Metadata } from "next";
import { EB_Garamond, Libre_Franklin, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif-4",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Velas São João - Tradição em cada chama",
  description: "Artesanato em cera desde 1922.",
  icons: {
    icon: '/images/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${ebGaramond.variable} ${libreFranklin.variable} ${sourceSerif4.variable} bg-background text-on-background min-h-screen flex flex-col font-body-md relative`}>
        
        {/* Fundo Dinâmico com Imagens Mescladas */}
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-10 mix-blend-multiply flex flex-col md:flex-row">
          <div className="relative flex-1 h-full w-full">
            <Image src="/images/velaartesanal.jpeg" alt="" fill className="object-cover opacity-70" />
          </div>
          <div className="relative flex-1 h-full w-full hidden md:block">
            <Image src="/images/velaartesanal2.jpeg" alt="" fill className="object-cover opacity-70" />
          </div>
          <div className="relative flex-1 h-full w-full hidden lg:block">
            <Image src="/images/velaartesanal3.jpeg" alt="" fill className="object-cover opacity-70" />
          </div>
        </div>

        {/* Navbar Global */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-wax-cream/95 border-b border-golden-honey/20 backdrop-blur-md">
          <div className="flex flex-wrap justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-max-width mx-auto">
            <Link href="/" className="flex items-center gap-2 md:gap-3 font-display-lg text-[28px] md:text-[48px] text-saojoao uppercase tracking-widest hover:text-saojoao transition-all duration-300">
              <Image src="/images/logo.svg" alt="Logo Velas São João" width={56} height={56} className="w-10 h-10 md:w-14 md:h-14 object-cover" />
              São João
            </Link>
            
            <div className="flex md:order-3 gap-3 md:gap-4 items-center text-heritage-red">
              <button aria-label="account_circle" className="hover:text-heritage-red transition-all duration-300">
                <span className="material-symbols-outlined text-[24px] md:text-[28px]">account_circle</span>
              </button>
              <button aria-label="shopping_bag" className="hover:text-heritage-red transition-all duration-300">
                <span className="material-symbols-outlined text-[24px] md:text-[28px]">shopping_bag</span>
              </button>
            </div>

            <div className="w-full md:w-auto md:flex md:order-2 flex justify-center gap-6 mt-4 md:mt-0 overflow-x-auto">
              <Link href="/" className="font-label-lg text-[14px] md:text-[16px] text-heritage-red border-b border-heritage-red pb-1 whitespace-nowrap">Home</Link>
              <Link href="/historia" className="font-label-lg text-[14px] md:text-[16px] text-deep-earth/70 hover:text-heritage-red transition-colors duration-300 whitespace-nowrap">Nossa História</Link>
              <Link href="/loja" className="font-label-lg text-[14px] md:text-[16px] text-deep-earth/70 hover:text-heritage-red transition-colors duration-300 whitespace-nowrap">Loja</Link>
             
            </div>
          </div>
        </nav>

        {/* Conteúdo da Página renderizado aqui */}
        {children}

        {/* Footer Global */}
        <footer className="w-full py-14 px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-1 gap-gutter max-w-max-width mx-auto border-t border-golden-honey/30 bg-wax-cream mt-auto">
          <div className="md:col-span-1">
            <h2 className="font-display-lg text-[24px] text-heritage-red mb-4">Velas São João</h2>
            <p className="font-body-md text-deep-earth/80">© 2026 Velas São João. Artesanato em Cera desde 1922.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}