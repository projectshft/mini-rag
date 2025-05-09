export interface NewsSource {
	name: string;
	url: string;
	bias: 'liberal' | 'conservative';
}

export const newsSources: NewsSource[] = [
	// Liberal sources
	{
		name: 'The New York Times',
		url: 'https://www.nytimes.com',
		bias: 'liberal',
	},
	{
		name: 'The Washington Post',
		url: 'https://www.washingtonpost.com',
		bias: 'liberal',
	},
	{
		name: 'The Guardian',
		url: 'https://www.theguardian.com',
		bias: 'liberal',
	},
	{
		name: 'NPR',
		url: 'https://www.npr.org',
		bias: 'liberal',
	},
	{
		name: 'CNN',
		url: 'https://www.cnn.com',
		bias: 'liberal',
	},

	// Conservative sources
	{
		name: 'Fox News',
		url: 'https://www.foxnews.com',
		bias: 'conservative',
	},
	{
		name: 'The Wall Street Journal',
		url: 'https://www.wsj.com',
		bias: 'conservative',
	},
	{
		name: 'The Daily Wire',
		url: 'https://www.dailywire.com',
		bias: 'conservative',
	},
	{
		name: 'Breitbart',
		url: 'https://www.breitbart.com',
		bias: 'conservative',
	},
	{
		name: 'The Federalist',
		url: 'https://thefederalist.com',
		bias: 'conservative',
	},
];
