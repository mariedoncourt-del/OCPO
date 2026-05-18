import { Hono } from 'hono';
import { cors } from "hono/cors"
import { createAgentUIStreamResponse } from "ai";
import { agent } from "./agent";

const app = new Hono()
  .basePath('api')
  .use(cors({ origin: (origin) => origin ?? "*", credentials: true, exposeHeaders: ["set-auth-token"] }))
  .get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }, 200))
  .get('/health', (c) => c.json({ status: 'ok' }, 200))
  .post("/agent/messages", async (c) => {
    const { messages } = await c.req.json();
    return createAgentUIStreamResponse({ agent, uiMessages: messages });
  });

export type AppType = typeof app;
export default app;