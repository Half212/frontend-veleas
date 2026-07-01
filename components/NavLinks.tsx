'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Nossa História', href: '/historia' },
    { name: 'Loja', href: '/loja' },
  ];

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href;
        
        return (
          <Link 
            key={link.href}
            href={link.href} 
            className={`font-label-lg text-[14px] md:text-[16px] whitespace-nowrap pb-1 transition-colors duration-300 ${
              isActive 
                ? 'text-heritage-red border-b border-heritage-red' 
                : 'text-deep-earth/70 hover:text-heritage-red'
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
