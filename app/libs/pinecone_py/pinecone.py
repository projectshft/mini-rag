"""
Pinecone vector database integration.

This module mirrors the TypeScript implementation in app/libs/pinecone.ts:
- Initializes a Pinecone client from PINECONE_API_KEY
- Builds a query embedding using OpenAI
- Queries Pinecone with include_metadata enabled
"""

import os
from typing import Any

from app.libs.pinecone_py.pinecone import Pinecone

from app.libs.openai_py.openai import setup_environment


# Initialize clients with environment-based credentials.
openai_client = setup_environment()
pinecone_client = Pinecone(api_key=os.environ["PINECONE_API_KEY"])


async def search_documents(query: str, top_k: int = 3) -> list[Any]:
	"""
	Search for semantically similar documents in Pinecone.

	Args:
		query: Search query text.
		top_k: Number of top matches to return.

	Returns:
		List of Pinecone match records.
	"""
	index = pinecone_client.Index(os.environ["PINECONE_INDEX"])

	query_embedding = await openai_client.embeddings.create(
		model="text-embedding-3-small",
		dimensions=512,
		input=query,
	)

	embedding = query_embedding.data[0].embedding

	docs = index.query(
		vector=embedding,
		top_k=top_k,
		include_metadata=True,
	)

	return docs.matches
