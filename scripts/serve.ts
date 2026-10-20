import { join, normalize } from 'node:path';

const publicDir = join(import.meta.dir, '..', 'public');
const port = Number(process.env.PORT ?? 4173);

const server = Bun.serve({
	port,
	async fetch(req) {
		const url = new URL(req.url);
		const relPath = url.pathname === '/' ? '/index.html' : url.pathname;
		const safePath = normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, '');
		const file = Bun.file(join(publicDir, safePath));
		if (await file.exists()) {
			return new Response(file);
		}
		return new Response('Not Found', { status: 404 });
	}
});

console.log(`bordr-site listening on http://127.0.0.1:${server.port}`);
