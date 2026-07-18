// Middleware de log do Express

export default function logger(req, res, next) {
  const inicio = Date.now();
  res.on('finish', () => {
    const duracao = Date.now() - inicio;
    const agora = new Date().toISOString();
    console.log(`[${agora}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duracao}ms)`);
  });
  next();
}