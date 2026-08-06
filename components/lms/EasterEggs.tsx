'use client';

import { useEffect, useRef, useState } from 'react';

// The fun layer. Two eggs live here:
//
// 1. Console greeting — anyone who opens devtools gets a styled hello and
//    a hint at egg #2. Printed once per session.
// 2. Konami code (↑↑↓↓←→←→BA) → "vector mode": the page background briefly
//    becomes a drifting 2-D embedding space of course vocabulary, with
//    king−man+woman≈queen wandering through. Purely cosmetic, ~12s.
//
// (Egg #3 — completion confetti + the Day 42 special — lives in
// MarkDoneCheckbox.tsx. Egg #4 — the rest-day palm wiggle — is CSS.)

const KONAMI = [
	'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
	'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
	'b', 'a',
];

const WORDS = [
	'king', 'queen', 'man', 'woman', 'vector', 'chunk', 'embed', 'cosine',
	'RAG', 'agent', 'Pinecone', 'retrieval', 'token', 'prompt', 'index',
	'similarity', 'rerank', 'metadata', 'zod', 'selector', 'overlap',
	'dyspnea ≠ shortness of breath', 'k=3', '0.87', '1536-d', 'topK',
];

function VectorField({ onDone }: { onDone: () => void }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const w = window.innerWidth;
		const h = window.innerHeight;
		canvas.width = w * dpr;
		canvas.height = h * dpr;
		ctx.scale(dpr, dpr);

		const pts = WORDS.map((word) => ({
			word,
			x: Math.random() * w,
			y: Math.random() * h,
			vx: (Math.random() - 0.5) * 0.6,
			vy: (Math.random() - 0.5) * 0.6,
		}));

		let raf = 0;
		const start = performance.now();
		const DURATION = 12_000;

		function frame(now: number) {
			if (!ctx) return;
			const t = now - start;
			if (t > DURATION) {
				onDone();
				return;
			}
			// fade in for 600ms, out for the last 1200ms
			const alpha = Math.min(1, t / 600) * Math.min(1, (DURATION - t) / 1200);
			ctx.clearRect(0, 0, w, h);
			ctx.globalAlpha = alpha;

			// nearest-neighbor lines between close points
			for (let i = 0; i < pts.length; i++) {
				for (let j = i + 1; j < pts.length; j++) {
					const dx = pts[i].x - pts[j].x;
					const dy = pts[i].y - pts[j].y;
					const d = Math.hypot(dx, dy);
					if (d < 160) {
						ctx.strokeStyle = `rgba(37, 99, 235, ${0.16 * (1 - d / 160)})`;
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(pts[i].x, pts[i].y);
						ctx.lineTo(pts[j].x, pts[j].y);
						ctx.stroke();
					}
				}
			}

			for (const p of pts) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0 || p.x > w) p.vx *= -1;
				if (p.y < 0 || p.y > h) p.vy *= -1;
				ctx.fillStyle = 'rgba(37, 99, 235, 0.75)';
				ctx.beginPath();
				ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = 'rgba(24, 24, 27, 0.55)';
				ctx.font = '11px ui-monospace, monospace';
				ctx.fillText(p.word, p.x + 7, p.y + 4);
			}

			raf = requestAnimationFrame(frame);
		}
		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	}, [onDone]);

	return (
		<div className='pointer-events-none fixed inset-0 z-50'>
			<canvas ref={canvasRef} className='h-full w-full' />
			<p className='absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900/80 px-4 py-1.5 font-mono text-xs text-blue-200'>
				vector mode · you are now a point in meaning-space
			</p>
		</div>
	);
}

export function EasterEggs() {
	const [vectorMode, setVectorMode] = useState(false);
	const progress = useRef(0);

	useEffect(() => {
		// console greeting, once per tab
		if (!sessionStorage.getItem('lms-hello')) {
			sessionStorage.setItem('lms-hello', '1');
			// eslint-disable-next-line no-console
			console.log(
				'%c▲ RAG & AI Agents %c\n\nYou opened the console. Obviously you belong here.\n\nSince you’re the type: this whole site renders from markdown,\nthe quizzes are JSON in code fences, and there’s a mode you\ncan only reach with a certain very old cheat code. ↑↑↓↓←→←→BA\n\n(Also: view-source teaches nothing anymore. The repo does.)',
				'font-size:16px;font-weight:bold;color:#2563eb',
				'font-size:12px;color:#52525b'
			);
		}

		function onKey(e: KeyboardEvent) {
			const expected = KONAMI[progress.current];
			const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
			if (key === expected) {
				progress.current++;
				if (progress.current === KONAMI.length) {
					progress.current = 0;
					setVectorMode(true);
				}
			} else {
				progress.current = key === KONAMI[0] ? 1 : 0;
			}
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	if (!vectorMode) return null;
	return <VectorField onDone={() => setVectorMode(false)} />;
}
