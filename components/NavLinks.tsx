'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavLinks() {
  const pathname = usePathname();
  const [isAdminOrSupervisor, setIsAdminOrSupervisor] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (role === "ROLE_ADMIN" || role === "ROLE_SUPERVISOR" || role === "ADMIN" || role === "SUPERVISOR") {
      setIsAdminOrSupervisor(true);
    } else {
      setIsAdminOrSupervisor(false);
    }
  }, [pathname]);

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Nossa História', href: '/historia' },
    { name: 'Loja', href: '/loja' },
    ...(isAdminOrSupervisor ? [{ name: 'Painel Admin', href: '/produtos/cadastro' }] : [])
  ];

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href;
        
        return (
          <Link 
            key={link.href}
            href={link.href} 
            className={`font-label-lg text-[14px] md:text-[15px] tracking-wider uppercase whitespace-nowrap pb-1 transition-all duration-300 ${
              isActive 
                ? 'text-brand-green-900 font-bold border-b-2 border-brand-green-800' 
                : 'text-brand-dark-700 hover:text-brand-green-800'
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
