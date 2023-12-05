import express, { Express } from 'express';
import { json } from './middlewares/json';
import { RequestHandler } from 'express';
import { routes } from './routes';

const app: Express = express();

// Middleware para analisar JSON
app.use(json);

// Definição das rotas
routes.forEach(route => {
  const method: keyof Express = route.method.toLowerCase() as keyof Express;
  app[method](route.path, route.handler as RequestHandler);
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
