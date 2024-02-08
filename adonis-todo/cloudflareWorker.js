import { Ignitor } from '@adonisjs/ignitor';
import http from 'http';

let app;

async function handleRequest(request) {
  if (!app) {
    // Lazily load AdonisJS app on first request
    await bootstrapServer();
  }

  const { req, res } = createNodeHttpRequest(request);
  app.handle(req, res);
  return new Response(res.body, {
    status: res.statusCode,
    headers: res.getHeaders(),
  });
}

async function bootstrapServer() {
  try {
    app = await new Ignitor(require('@adonisjs/fold'))
      .appRoot(__dirname)
      .fireHttpServer();
  } catch (error) {
    console.error('Error bootstrapping AdonisJS app:', error);
    throw error;
  }
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
