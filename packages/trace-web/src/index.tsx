import { serve } from "bun";
import { renderToReadableStream } from "react-dom/server";
import { App } from "./App";

serve({
	port: 5173,
	routes: {
		"/oidc-callback": async () => {
			const file = Bun.file("src/oidc-callback.html");
			const contents = await file.text();
			return new Response(contents, { headers: { "Content-Type": file.type }});
		},
		"/hydrate.js":  async () => {
			const build = await Bun.build({
				entrypoints: ["./src/hydrate.tsx"],
				target: "browser",
				splitting: true,
				minify: {
					identifiers: true,
					syntax: true,
					whitespace: true,
				},
			});
			const script = build.outputs[0];
			if (!script) return Response.json({ message: "Internal Server Error" }, { status: 500 });
			const text = await script.text();
			return new Response(text, { headers: { "Content-Type": script.type }});
		},
		"/":  async () => {
			const stream = await renderToReadableStream(<App />, {
				bootstrapModules: ["./hydrate.js"],
			});
			return new Response(stream, { headers: { "Content-Type": "text/html" }});
		},
	},
});
