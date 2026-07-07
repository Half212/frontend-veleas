"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    celular: "",
    senha: "",
    confirmaSenha: "",
  });

  useEffect(() => {
    setIsClient(true);
    // Se já estiver logado, redireciona para a loja
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/loja");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmaSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    // Simula o login/cadastro salvando no localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", formData.nome);
    router.push("/loja");
  };

  if (!isClient) return null; // Evita hidration error com router no client-side

  return (
    <main className="min-h-[85vh] pt-32 pb-16 px-margin-mobile md:px-margin-desktop flex items-center justify-center relative">
      <div className="absolute inset-0 z-[-1] pointer-events-none opacity-20">
         <Image src="/images/velaartesanal.jpeg" alt="" fill className="object-cover opacity-30 mix-blend-multiply" />
      </div>
      
      <div className="w-full max-w-xl bg-wax-cream/95 backdrop-blur-md p-8 md:p-12 rounded-lg shadow-2xl border border-golden-honey/30 relative overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-heritage-red via-golden-honey to-saojoao"></div>
        
        <div className="text-center mb-10">
          <h1 className="font-display-lg text-4xl text-heritage-red mb-3">Identificação</h1>
          <p className="font-body-md text-deep-earth/80">
            Cadastre-se ou faça login para continuar sua compra.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-label-sm text-on-surface-variant mb-2 uppercase tracking-wider text-[11px] font-semibold">
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface/50 border border-golden-honey/40 rounded focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-all text-on-background font-body-md"
              placeholder="Digite seu nome completo"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-2 uppercase tracking-wider text-[11px] font-semibold">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface/50 border border-golden-honey/40 rounded focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-all text-on-background font-body-md"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block font-label-sm text-on-surface-variant mb-2 uppercase tracking-wider text-[11px] font-semibold">
                Celular
              </label>
              <input
                type="tel"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface/50 border border-golden-honey/40 rounded focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-all text-on-background font-body-md"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-2 uppercase tracking-wider text-[11px] font-semibold">
                Senha
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface/50 border border-golden-honey/40 rounded focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-all text-on-background font-body-md"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block font-label-sm text-on-surface-variant mb-2 uppercase tracking-wider text-[11px] font-semibold">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmaSenha"
                value={formData.confirmaSenha}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface/50 border border-golden-honey/40 rounded focus:outline-none focus:border-heritage-red focus:ring-1 focus:ring-heritage-red transition-all text-on-background font-body-md"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-heritage-red text-wax-cream font-label-lg uppercase tracking-widest py-4 mt-6 hover:bg-saojoao transition-colors duration-300 rounded shadow-md flex justify-center items-center gap-2"
          >
            Acessar
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>
      </div>
    </main>
  );
}
