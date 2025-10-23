import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello from Elysia + Bun!").listen(3000);

console.log(`🦊 Elysia running at http://${app.server?.hostname}:${app.server?.port}`);
