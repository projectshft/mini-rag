import { formatUsd, type AgenticOffer } from '@/lib/agentic-sale';

export function Price({
	offer,
	strikeClassName = 'text-zinc-400',
}: {
	offer: AgenticOffer;
	strikeClassName?: string;
}) {
	if (!offer.onSale) return <>{formatUsd(offer.priceUsd)}</>;
	return (
		<>
			<span className='sr-only'>was </span>
			<s className={`${strikeClassName} decoration-2`}>{formatUsd(offer.regularPriceUsd)}</s>
			<span className='sr-only'>, now</span> {formatUsd(offer.priceUsd)}
		</>
	);
}
