"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (isLoginMode) {
        // Modo Login
        const res = await fetch(`${API_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.senha,
          }),
        });

        if (!res.ok) throw new Error("Credenciais inválidas");
        const data = await res.json();
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userRole", data.roleName || "ROLE_COMMON");
        router.push("/loja");
      } else {
        // Modo Cadastro
        if (formData.senha !== formData.confirmaSenha) {
          setErrorMsg("As senhas não coincidem!");
          return;
        }

        const res = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.nome,
            email: formData.email,
            phone: formData.celular,
            password: formData.senha,
            confirmPassword: formData.confirmaSenha,
            roleId: 3 // COMMON ROLE
          }),
        });

        if (!res.ok) throw new Error("Erro ao criar conta. O email já pode estar em uso.");
        const data = await res.json();

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userRole", data.roleName || "ROLE_COMMON");
        router.push("/loja");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(String(err));
      }
    }
  };

  if (!isClient) return null; // Evita hidration error com router no client-side

  return (
    <main className="min-h-[85vh] pt-28 pb-16 px-margin-mobile md:px-margin-desktop flex items-center justify-center relative bg-brand-dark-50/60">
      <div className="absolute inset-0 z-[-1] pointer-events-none opacity-10">
         <Image src="/images/velaartesanal.jpeg" alt="" fill className="object-cover mix-blend-multiply" />
      </div>
      
      <div className="w-full max-w-xl bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-brand-dark-200 relative overflow-hidden">
        {/* Top decorative line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-green-900 via-brand-green-700 to-accent-gold"></div>
        
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-3xl md:text-4xl text-brand-dark-950 font-bold mb-2">Identificação</h1>
          <p className="font-body-md text-brand-dark-600">
            Cadastre-se ou faça login para continuar sua experiência.
          </p>
          <div className="mt-6 flex justify-center gap-6 border-b border-brand-dark-200 pb-3">
            <button 
              type="button"
              onClick={() => setIsLoginMode(false)}
              className={`font-label-sm uppercase tracking-widest pb-2 border-b-2 font-bold transition-all text-xs md:text-sm ${!isLoginMode ? 'border-brand-green-900 text-brand-green-900' : 'border-transparent text-brand-dark-400 hover:text-brand-dark-800'}`}
            >
              Criar Nova Conta
            </button>
            <button 
              type="button"
              onClick={() => setIsLoginMode(true)}
              className={`font-label-sm uppercase tracking-widest pb-2 border-b-2 font-bold transition-all text-xs md:text-sm ${isLoginMode ? 'border-brand-green-900 text-brand-green-900' : 'border-transparent text-brand-dark-400 hover:text-brand-dark-800'}`}
            >
              Já Possuo Conta
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-body-md text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLoginMode && (
            <div>
              <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                Nome Completo
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required={!isLoginMode}
                className="w-full px-4 py-3 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 focus:ring-1 focus:ring-brand-green-800 transition-all text-brand-dark-900 font-body-md"
                placeholder="Digite seu nome completo"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 focus:ring-1 focus:ring-brand-green-800 transition-all text-brand-dark-900 font-body-md"
                placeholder="seu@email.com"
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                  Celular
                </label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  required={!isLoginMode}
                  className="w-full px-4 py-3 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 focus:ring-1 focus:ring-brand-green-800 transition-all text-brand-dark-900 font-body-md"
                  placeholder="(00) 00000-0000"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                Senha
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 focus:ring-1 focus:ring-brand-green-800 transition-all text-brand-dark-900 font-body-md"
                placeholder="••••••••"
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  name="confirmaSenha"
                  value={formData.confirmaSenha}
                  onChange={handleChange}
                  required={!isLoginMode}
                  className="w-full px-4 py-3 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 focus:ring-1 focus:ring-brand-green-800 transition-all text-brand-dark-900 font-body-md"
                  placeholder="••••••••"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-brand-green-900 text-white font-label-lg uppercase tracking-widest py-4 mt-6 hover:bg-brand-green-800 transition-all duration-300 rounded-xl shadow-md hover:shadow-lg flex justify-center items-center gap-2 font-bold"
          >
            {isLoginMode ? "Entrar na Conta" : "Criar Minha Conta"}
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>
      </div>
    </main>
  );
}
