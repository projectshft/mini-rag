import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
	// ── Electronics ──────────────────────────────────────────────
	{
		name: 'Wireless Noise-Cancelling Headphones',
		category: 'electronics',
		price: 249.99,
		stockCount: 42,
		description: 'Premium ANC headphones with 30-hour battery life and spatial audio.',
	},
	{
		name: 'Mechanical Keyboard (65%)',
		category: 'electronics',
		price: 129.0,
		stockCount: 0,
		description: 'Hot-swappable switches, RGB backlighting, aluminium case.',
	},
	{
		name: '4K Webcam',
		category: 'electronics',
		price: 89.99,
		stockCount: 18,
		description: 'Auto-focus, built-in ring light, USB-C connection.',
	},
	{
		name: 'Portable SSD 2TB',
		category: 'electronics',
		price: 159.99,
		stockCount: 73,
		description: 'USB 3.2 Gen 2, 1050 MB/s read, shock-resistant.',
	},
	{
		name: 'Smart Home Hub',
		category: 'electronics',
		price: 59.99,
		stockCount: 5,
		description: 'Matter-compatible, controls lights, locks, and thermostats.',
	},

	// ── Books ────────────────────────────────────────────────────
	{
		name: 'Designing Data-Intensive Applications',
		category: 'books',
		price: 44.99,
		stockCount: 120,
		description: 'The big ideas behind reliable, scalable, and maintainable systems.',
	},
	{
		name: 'The Pragmatic Programmer',
		category: 'books',
		price: 39.99,
		stockCount: 85,
		description: 'From journeyman to master — classic software engineering advice.',
	},
	{
		name: 'AI Engineering',
		category: 'books',
		price: 54.99,
		stockCount: 200,
		description: 'Building applications with foundation models — practical patterns.',
	},
	{
		name: 'Refactoring (2nd Edition)',
		category: 'books',
		price: 47.5,
		stockCount: 0,
		description: 'Improving the design of existing code, updated with JavaScript examples.',
	},
	{
		name: 'System Design Interview Vol. 2',
		category: 'books',
		price: 36.0,
		stockCount: 64,
		description: 'Step-by-step framework for designing large-scale distributed systems.',
	},

	// ── Home Office ──────────────────────────────────────────────
	{
		name: 'Standing Desk (Electric)',
		category: 'home-office',
		price: 499.0,
		stockCount: 12,
		description: 'Dual-motor sit-stand desk, memory presets, cable management tray.',
	},
	{
		name: 'Ergonomic Office Chair',
		category: 'home-office',
		price: 349.0,
		stockCount: 8,
		description: 'Adjustable lumbar, mesh back, 4D armrests.',
	},
	{
		name: 'Monitor Arm (Dual)',
		category: 'home-office',
		price: 79.99,
		stockCount: 34,
		description: 'Gas-spring dual monitor mount, VESA 75/100.',
	},
	{
		name: 'Desk Lamp with Wireless Charger',
		category: 'home-office',
		price: 64.99,
		stockCount: 0,
		description: 'LED desk lamp, 5 brightness levels, Qi charging base.',
	},
	{
		name: 'Cable Management Kit',
		category: 'home-office',
		price: 19.99,
		stockCount: 150,
		description: 'Under-desk tray, velcro straps, and cable clips.',
	},
	// ── Fitness ──────────────────────────────────────────────────
	{
		name: 'Adjustable Dumbbell Set',
		category: 'fitness',
		price: 299.0,
		stockCount: 22,
		description: '5-52.5 lbs per dumbbell, quick-change weight selector.',
	},
	{
		name: 'Yoga Mat (Premium)',
		category: 'fitness',
		price: 34.99,
		stockCount: 90,
		description: 'Non-slip surface, 6mm thickness, includes carry strap.',
	},
];

const reviewTemplates = [
	{ rating: 5, reviewText: 'Absolutely love it. Best purchase I made this year.' },
	{ rating: 5, reviewText: 'Exceeded expectations in every way. Highly recommend.' },
	{ rating: 4, reviewText: 'Great quality, minor nitpick with the packaging.' },
	{ rating: 4, reviewText: 'Solid product. Does exactly what it says.' },
	{ rating: 4, reviewText: 'Very good for the price point. Would buy again.' },
	{ rating: 3, reviewText: 'Decent but nothing special. Gets the job done.' },
	{ rating: 3, reviewText: 'Average quality. Expected a bit more at this price.' },
	{ rating: 2, reviewText: 'Arrived with a small defect. Customer service helped though.' },
	{ rating: 2, reviewText: 'Not as described. Feels cheap compared to photos.' },
	{ rating: 1, reviewText: 'Broke after two weeks. Returning for a refund.' },
];

async function main() {
	console.log('🌱 Seeding database...');

	// Clear existing data
	await prisma.review.deleteMany();
	await prisma.product.deleteMany();

	for (const product of products) {
		const created = await prisma.product.create({ data: product });

		// Assign 2-4 random reviews per product
		const reviewCount = 2 + Math.floor(Math.random() * 3);
		const shuffled = [...reviewTemplates].sort(() => Math.random() - 0.5);

		for (let i = 0; i < reviewCount; i++) {
			await prisma.review.create({
				data: {
					...shuffled[i],
					productId: created.id,
				},
			});
		}
	}

	const productCount = await prisma.product.count();
	const reviewCount = await prisma.review.count();
	console.log(`✅ Seeded ${productCount} products and ${reviewCount} reviews.`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
