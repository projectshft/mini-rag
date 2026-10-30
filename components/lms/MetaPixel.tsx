'use client';

import Script from 'next/script';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1046834166659411';

type Event = { name: 'Purchase'; value: number; currency: string; eventId: string };

declare global {
	interface Window {
		fbq?: (...args: unknown[]) => void;
	}
}

export function trackPixel(name: string, params?: Record<string, unknown>) {
	window.fbq?.('track', name, params);
}

export function MetaPixel({ event }: { event?: Event }) {
	const eventCall = event
		? `fbq('track','${event.name}',{value:${event.value},currency:'${event.currency}'},{eventID:'${event.eventId}'});`
		: '';
	return (
		<Script id='meta-pixel' strategy='afterInteractive'>
			{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');${eventCall}`}
		</Script>
	);
}
