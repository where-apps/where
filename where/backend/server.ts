import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const S5_BASE_URL = process.env.S5_BASE_URL ?? "http://where-app.com";
const S5_ADMIN_API_KEY =
  process.env.S5_ADMIN_API_KEY ??
  "6g4wEnRFrwmUNJj1uc32vLj8HAmVWaaY5ArYABRnNoj8";

const app = new Hono();

app.use("*", cors());

app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

app.post("/s5/upload", async (c) => {
  try {
    if (!S5_ADMIN_API_KEY) {
      c.status(500);
      return c.json({ error: "S5 admin key not configured" });
    }

    const formData = await c.req.formData();

    const res = await fetch(`${S5_BASE_URL}/s5/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${S5_ADMIN_API_KEY}`,
      },
      body: formData as unknown as BodyInit,
    });

    if (!res.ok) {
      const text = await res.text();
      c.status(res.status);
      return c.json({ error: text || "S5 upload failed" });
    }

    const cid = (await res.text()).trim();
    return c.json({ cid });
  } catch (err) {
    console.error("[S5 Upload Proxy] Error", err);
    c.status(500);
    return c.json({ error: "Unexpected error proxying upload" });
  }
});

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;




