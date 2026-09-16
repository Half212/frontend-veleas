import type { Metadata } from "next";
import { EB_Garamond, Libre_Franklin, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import NavLinks from "@/components/NavLinks";
import NavbarCartButton from "@/components/NavbarCartButton";
import CartModal from "@/components/CartModal";
import { CartProvider } from "@/context/CartContext";
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
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={`${ebGaramond.variable} ${libreFranklin.variable} ${sourceSerif4.variable} bg-background text-on-background min-h-screen flex flex-col font-body-md relative`}>
        <CartProvider>
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
          <nav className="fixed top-0 left-0 w-full z-50 bg-surface/95 border-b border-brand-dark-200/80 backdrop-blur-md transition-all">
            <div className="flex flex-wrap justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-max-width mx-auto">
              <Link href="/" className="flex items-center gap-2 md:gap-3 font-display-lg text-[28px] md:text-[38px] text-brand-green-900 uppercase tracking-widest hover:text-brand-green-700 transition-all duration-300">
                <Image src="/images/logo.svg" alt="Logo Velas São João" width={48} height={48} className="w-9 h-9 md:w-12 md:h-12 object-contain" />
                São João
              </Link>
              
              <div className="flex md:order-3 gap-3 md:gap-4 items-center text-brand-green-900">
                <Link href="/login" aria-label="account_circle" className="hover:text-brand-green-700 transition-all duration-300 flex items-center justify-center p-1">
                  <span className="material-symbols-outlined text-[24px] md:text-[28px]">account_circle</span>
                </Link>
                <NavbarCartButton />
              </div>

              <div className="w-full md:w-auto md:flex md:order-2 flex justify-center gap-6 mt-4 md:mt-0 overflow-x-auto">
                <NavLinks />
              </div>
            </div>
          </nav>

          {/* Conteúdo da Página renderizado aqui */}
          {children}

          {/* Modal Lateral do Carrinho */}
          <CartModal />

          {/* Footer Global Nobre */}
          <footer className="w-full py-16 px-margin-mobile md:px-margin-desktop bg-brand-dark-900 text-brand-dark-100 mt-auto border-t border-brand-green-800/40">
            <div className="max-w-max-width mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image src="/images/logo.svg" alt="Logo Velas São João" width={40} height={40} className="w-10 h-10 object-contain brightness-200" />
                  <h2 className="font-display-lg text-[28px] text-white tracking-wider">Velas São João</h2>
                </div>
                <p className="font-body-md text-brand-dark-300 max-w-sm leading-relaxed">
                  Tradição, fé e elegância desde 1938 Velas artesanais criadas com maestria para iluminar seus momentos mais sagrados e acolhedores.
                </p>
              </div>

              <div>
                <h3 className="font-label-lg text-white uppercase tracking-widest text-sm mb-4">Navegação Rápida</h3>
                <ul className="space-y-2 font-body-md text-brand-dark-300">
                  <li><Link href="/" className="hover:text-white transition-colors">Início</Link></li>
                  <li><Link href="/loja" className="hover:text-white transition-colors">Nossa Loja</Link></li>
                  <li><Link href="/historia" className="hover:text-white transition-colors">Nossa História</Link></li>
                  <li><Link href="/login" className="hover:text-white transition-colors">Minha Conta</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-label-lg text-white uppercase tracking-widest text-sm mb-4">Atendimento & Tradição</h3>
                <p className="font-body-md text-brand-dark-300 leading-relaxed mb-3">
                  <strong className="text-white">Loja Matriz:</strong> Cidade Velha, Belém - PA<br />
                  <strong className="text-white">Filial:</strong> Shopping Pátio Belém
                </p>
                <span className="inline-block text-xs uppercase tracking-wider text-accent-gold font-label-sm border border-accent-gold/40 px-3 py-1 rounded">
                  Qualidade Garantida & 100% Cera Artesanal
                </span>
              </div>
            </div>

            <div className="max-w-max-width mx-auto mt-12 pt-6 border-t border-brand-dark-800 text-center md:flex md:justify-between font-body-md text-sm text-brand-dark-400">
              <p>© 2026 Velas São João. Todos os direitos reservados.</p>
              <p className="mt-2 md:mt-0">Confiança, Elegância & Credibilidade.</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}