import { IndexType } from './types';

export interface IndexConfig {
	name: string;
	description: string;
}

export const indexConfigs: Record<IndexType, IndexConfig> = {
	LinkedInPosts: {
		name: 'LinkedIn Posts',
		description: 'Professional content, career advice, LinkedIn engagement strategies, personal branding',
	},
	MediumArticles: {
		name: 'Medium Articles',
		description: 'Technical tutorials, programming guides, software development articles',
	},
	ScientificPapers: {
		name: 'Scientific Papers',
		description: 'Academic research, scientific studies, technical papers',
	},
};
