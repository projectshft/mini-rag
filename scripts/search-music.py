"""
Search for music using natural language queries with CLAP.
Embeds your text query and searches Pinecone for similar tracks.

Usage:
    python scripts/search-music.py "chill lo-fi beats for studying"
    python scripts/search-music.py "aggressive metal with fast drums"
    python scripts/search-music.py "90s hip hop with jazz samples"
    python scripts/search-music.py "upbeat electronic dance music"
"""

import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(Path(__file__).parent.parent / ".env")

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/search-music.py \"your search query\"")
        print("\nExamples:")
        print('  python scripts/search-music.py "upbeat electronic dance music"')
        print('  python scripts/search-music.py "sad piano ballad"')
        print('  python scripts/search-music.py "funky bass groove"')
        print('  python scripts/search-music.py "relaxing ambient soundscape"')
        sys.exit(1)

    query = " ".join(sys.argv[1:])
    top_k = 5

    print(f"\nSearching for: \"{query}\"\n")

    # Import heavy libraries after arg check
    import torch
    import numpy as np
    from transformers import ClapModel, ClapProcessor
    from pinecone import Pinecone

    # Check device
    device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"

    # Load CLAP model
    print(f"Loading CLAP model (device: {device})...")
    model = ClapModel.from_pretrained("laion/clap-htsat-unfused")
    processor = ClapProcessor.from_pretrained("laion/clap-htsat-unfused")
    model = model.to(device)
    model.eval()

    # Embed the text query
    print("Embedding query...")
    inputs = processor(text=[query], return_tensors="pt", padding=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        text_embedding = model.get_text_features(**inputs)

    # Normalize
    embedding = text_embedding[0].cpu().numpy()
    embedding = embedding / np.linalg.norm(embedding)
    query_vector = embedding.tolist()

    # Search Pinecone
    print("Searching Pinecone...\n")

    api_key = os.getenv("PINECONE_API_KEY")
    if not api_key:
        print("Error: PINECONE_API_KEY not set in .env")
        sys.exit(1)

    pc = Pinecone(api_key=api_key)
    index = pc.Index("music-search")

    results = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True
    )

    # Display results
    print("=" * 70)
    print(f"Top {top_k} results for: \"{query}\"")
    print("=" * 70)

    for i, match in enumerate(results.matches, 1):
        meta = match.metadata or {}
        score = match.score

        print(f"\n{i}. Score: {score:.4f}")
        print(f"   Caption: {meta.get('caption', 'No caption')[:100]}...")

        if meta.get("labels"):
            print(f"   Labels: {meta['labels'][:80]}...")

        if meta.get("youtube_url"):
            print(f"   YouTube: {meta['youtube_url']}&t={int(meta.get('start_s', 0))}")

    print("\n" + "=" * 70)
    print("Note: Higher scores = better matches (cosine similarity)")
    print("=" * 70)

if __name__ == "__main__":
    main()
