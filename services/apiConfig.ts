/**
 * Configuração central da URL base da API Backend.
 * Suporta integração com o backend implantado no Render em homologação:
 * https://backend-velas.onrender.com/api
 */

export const getApiUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-velas.onrender.com/api";
  let trimmed = envUrl.trim().replace(/\/+$/, "");

  // Garante que o sufixo /api esteja presente caso o usuário forneça apenas o domínio principal
  if (!trimmed.endsWith("/api")) {
    trimmed = `${trimmed}/api`;
  }

  return trimmed;
};

export const API_URL = getApiUrl();
export const API_BASE_URL = API_URL;
