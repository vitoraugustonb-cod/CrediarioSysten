import rateLimit from 'express-rate-limit';

/**
 * Rate limiter estrito para a rota de login (/login)
 * Bloqueia ataques de força bruta: max 5 tentativas a cada 15 minutos por IP
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limite de 5 tentativas por IP
  standardHeaders: true, // Retorna `RateLimit-*` nos headers
  legacyHeaders: false, // Desativa headers `X-RateLimit-*`
  message: {
    erro: 'Muitas tentativas de login a partir deste IP. Por favor, tente novamente após 15 minutos.'
  }
});

/**
 * Rate limiter geral para a API
 * Previne sobrecarga e abuso: max 120 requisições por minuto por IP
 */
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 120, // 120 requisições por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    erro: 'Muitas requisições enviadas ao servidor. Por favor, aguarde alguns instantes.'
  }
});
