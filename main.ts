import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { serveDir } from "https://deno.land/std@0.220.1/http/file_server.ts";
import { layout } from "./views/layout.ts";
import { particlesView } from "./views/particles.ts";

console.log("Server running on http://localhost:8000");

serve(async (req) => {
  const url = new URL(req.url);
  
  // Serve static files
  if (url.pathname.startsWith("/static/")) {
    return await serveDir(req, {
      fsRoot: ".",
      urlRoot: "",
    });
  }

  // Serve main page
  return new Response(layout(particlesView()), {
    headers: { "content-type": "text/html" },
  });
}); 