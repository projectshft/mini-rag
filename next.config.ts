import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// main intentionally carries student TODO-stub files (unused imports
	// etc.), which fail ESLint. Don't let that block deploys of the course
	// site — type checking still runs during build.
	eslint: {
		ignoreDuringBuilds: true,
	},
	// Ship the curriculum markdown (read from disk in lib/lms/curriculum.ts)
	// AND the isolated LMS Prisma client's query engine with the serverless
	// functions. The engine lives at a custom output path, which Next's tracer
	// misses on its own → PrismaClientInitializationError on Vercel ("could not
	// locate the Query Engine"). Bundle both explicitly.
	outputFileTracingIncludes: {
		'/learn': ['./curriculum/**/*.md', './node_modules/.prisma/lms-client/**/*'],
		'/learn/[slug]': ['./curriculum/**/*.md', './node_modules/.prisma/lms-client/**/*'],
		'/admin': ['./curriculum/**/*.md', './node_modules/.prisma/lms-client/**/*'],
	},
};

export default nextConfig;
