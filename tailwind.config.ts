import type { Config } from 'tailwindcss';

const config = {
	content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
			},
		},
	},
	plugins: [],
} satisfies Config;

export default config;
