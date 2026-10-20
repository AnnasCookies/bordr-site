(() => {
	const root = document.documentElement;
	const toggle = document.getElementById('theme-toggle');
	const label = document.getElementById('theme-label');

	function isDark() {
		if (root.classList.contains('dark')) return true;
		if (root.classList.contains('light')) return false;
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	function applyTheme(dark) {
		root.classList.toggle('dark', dark);
		root.classList.toggle('light', !dark);
		if (label) {
			label.textContent = dark ? 'Light' : 'Dark';
		}
		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) {
			meta.setAttribute('content', dark ? '#0a0a0a' : '#f4f5f7');
		}
	}

	try {
		const saved = localStorage.getItem('bordr-site-theme');
		if (saved === 'dark' || saved === 'light') {
			applyTheme(saved === 'dark');
		} else {
			applyTheme(isDark());
		}
	} catch {
		applyTheme(isDark());
	}

	if (toggle) {
		toggle.addEventListener('click', () => {
			const nextDark = !isDark();
			applyTheme(nextDark);
			try {
				localStorage.setItem('bordr-site-theme', nextDark ? 'dark' : 'light');
			} catch {
				// Private browsing ignores storage writes.
			}
		});
	}
})();
