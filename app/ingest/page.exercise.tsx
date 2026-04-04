'use client';

import { useState } from 'react';

interface FieldError {
	field: string;
	message: string;
}

/**
 * TODO: Build the Custom Ingest Form
 *
 * This page should have a form with the following fields:
 *   - source (text input) — e.g. "nytimes.com"
 *   - author (text input) — e.g. "Jane Doe"
 *   - date (text input) — e.g. "2026-04-01"
 *   - category (select dropdown) — options: tech, finance, health, science, other
 *   - text (textarea) — the document content to ingest
 *
 * Behavior:
 *   1. On submit, POST to /api/ingest/custom with JSON body:
 *      { text, source, author, date, category }
 *   2. If the response has errors (status 400), display them inline
 *      next to the corresponding field using the FieldError type above.
 *      The API returns { success: false, errors: FieldError[] }
 *   3. If successful, display a message showing how many chunks and
 *      vectors were created. The API returns:
 *      { success: true, chunksCreated, vectorsUploaded, index }
 *   4. Show a character count on the text field (out of 50,000 max)
 *
 * Hints:
 *   - Look at the existing app/page.tsx for the code style
 *   - Use useState for each field + fieldErrors + successMessage + isSubmitting
 *   - Create a helper: getFieldError(field) that finds the error for a field
 *   - Use Tailwind classes matching the rest of the app
 */
export default function IngestPage() {
	// TODO: Add state variables for each form field
	// TODO: Add state for fieldErrors (FieldError[]), successMessage, isSubmitting

	// TODO: Implement getFieldError helper
	// TODO: Implement handleSubmit

	return (
		<div className='min-h-screen p-8 max-w-3xl mx-auto'>
			<h1 className='text-3xl font-bold mb-2'>Custom Document Ingest</h1>
			<p className='text-gray-500 mb-8'>
				Paste raw text with metadata. Content is validated for security,
				split into sentence-based chunks, and stored in a separate Pinecone index.
			</p>

			{/* TODO: Build the form here */}
			<p className='text-gray-400'>Form not implemented yet.</p>
		</div>
	);
}
