import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// main intentionally carries student TODO-stub files (unused imports
	// etc.), which fail ESLint. Don't let that block deploys of the course
	// site — type checking still runs during build.
	eslint: {
		ignoreDuringBuilds: true,
	},
	// Ship the curriculum markdown with the serverless functions that read
	// it from disk (lib/lms/curriculum.ts). Without this, Vercel's output
	// tracing would drop the .md files and /learn would render empty.
	outputFileTracingIncludes: {
		'/learn': ['./curriculum/**/*.md'],
		'/learn/[slug]': ['./curriculum/**/*.md'],
		'/admin': ['./curriculum/**/*.md'],
	},
};

export default nextConfig;
