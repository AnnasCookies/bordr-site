import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = join(import.meta.dir, '..');
const publicDir = join(rootDir, 'public');
const indexHtml = readFileSync(join(publicDir, 'index.html'), 'utf8');
const stylesCss = readFileSync(join(publicDir, 'styles.css'), 'utf8');
const headersTxt = readFileSync(join(publicDir, '_headers'), 'utf8');

describe('bordr.dev static site', () => {
	test('includes all launch-playbook essentials', () => {
		expect(indexHtml).toContain('bordr for Herdr');
		expect(indexHtml).toContain('src="/media/demo.mp4"');
		expect(indexHtml).toContain('poster="/media/agents-light.png"');
		expect(indexHtml).toContain('Install from GitHub');
		expect(indexHtml).toContain('View source');
		expect(indexHtml).toContain('https://github.com/AnnasCookies/bordr');
	});

	test('includes the no-login and Tailscale security warning before quickstart', () => {
		const securityIndex = indexHtml.indexOf('bordr deliberately has no login.');
		const quickstartIndex = indexHtml.indexOf('bun run setup');
		expect(securityIndex).toBeGreaterThan(0);
		expect(quickstartIndex).toBeGreaterThan(securityIndex);
		expect(indexHtml).toContain('tailscale serve');
		expect(indexHtml).toContain('tailscale funnel');
		expect(indexHtml).toContain('https://tailscale.com/docs/features/access-control/grants');
		expect(indexHtml).toContain('https://github.com/AnnasCookies/bordr/blob/main/SECURITY.md');
	});

	test('every local asset referenced in index.html exists and is non-empty', () => {
		const attrMatches = indexHtml.matchAll(/(?:src|href|poster)="(\/[^"#?]+)"/g);
		const paths = Array.from(attrMatches, (m) => m[1]).filter((p) => p !== '/');
		expect(paths.length).toBeGreaterThan(15);

		for (const rel of paths) {
			const full = join(publicDir, rel);
			expect(existsSync(full)).toBe(true);
			expect(statSync(full).size).toBeGreaterThan(0);
		}
	});

	test('every self-hosted font in styles.css exists and is non-empty', () => {
		const fontMatches = stylesCss.matchAll(/url\('(\/fonts\/[^']+)'\)/g);
		const fonts = Array.from(fontMatches, (m) => m[1]);
		expect(fonts.length).toBe(5);

		for (const rel of fonts) {
			const full = join(publicDir, rel);
			expect(existsSync(full)).toBe(true);
			expect(statSync(full).size).toBeGreaterThan(0);
		}
	});

	test('Cloudflare Pages _headers sets strict security headers and HTML has no inline styles or scripts', () => {
		expect(headersTxt).toContain('X-Frame-Options: DENY');
		expect(headersTxt).toContain('X-Content-Type-Options: nosniff');
		expect(headersTxt).toContain("Content-Security-Policy: default-src 'self'");
		expect(indexHtml).not.toMatch(/\sstyle=/i);
		expect(indexHtml).not.toMatch(/<script(?![^>]*\bsrc=)/i);
		expect(indexHtml).not.toContain('\u2014');
		expect(indexHtml).not.toContain('&mdash;');
	});
});
