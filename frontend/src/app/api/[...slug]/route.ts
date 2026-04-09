import { NextRequest, NextResponse } from "next/server";

/**
 * Catch-all proxy route: forwards /api/* requests to the Python backend.
 * Using a route handler (instead of next.config rewrites) lets us read
 * BACKEND_URL at runtime, which is required for Docker environments where
 * the backend service name is only known after the containers start.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

type RouteContext = { params: Promise<{ slug: string[] }> };

async function proxy(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { slug } = await context.params;
  const { search } = new URL(request.url);

  const targetUrl = `${BACKEND_URL}/api/${slug.join("/")}${search}`;

  const init: RequestInit = { method: request.method };

  // Forward request body for non-GET methods
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
    init.headers = {
      "content-type": request.headers.get("content-type") ?? "application/json",
    };
  }

  const upstream = await fetch(targetUrl, init);
  const body = await upstream.text();

  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = proxy;
export const DELETE = proxy;
