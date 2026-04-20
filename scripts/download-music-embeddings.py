"""
Download MusicCaps dataset and compute CLAP embeddings.
CLAP enables text-to-audio search ("find upbeat electronic music").

Usage:
    pip install datasets transformers torch librosa
    python scripts/download-music-embeddings.py

Options:
    --limit: Number of tracks to process (default: 500)

Note: This downloads audio from YouTube, which can be slow.
      Start with a small limit (100-500) to test.
"""

import json
import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description="Download MusicCaps + compute CLAP embeddings")
    parser.add_argument("--limit", type=int, default=500, help="Number of tracks to process")
    args = parser.parse_args()

    print("=" * 60)
    print("CLAP Music Embedding Pipeline")
    print("=" * 60)
    print(f"\nWill process up to {args.limit} tracks from MusicCaps")
    print("This enables text-to-audio search like 'chill lo-fi beats'\n")

    # Import heavy libraries
    print("Loading libraries...")
    import torch
    from datasets import load_dataset
    from transformers import ClapModel, ClapProcessor
    import numpy as np

    # Check for GPU
    device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"Using device: {device}")

    # Load CLAP model
    print("\nLoading CLAP model (first run downloads ~600MB)...")
    model = ClapModel.from_pretrained("laion/clap-htsat-unfused")
    processor = ClapProcessor.from_pretrained("laion/clap-htsat-unfused")
    model = model.to(device)
    model.eval()
    print("CLAP model loaded!")

    # Load MusicCaps dataset
    print("\nLoading MusicCaps dataset...")
    dataset = load_dataset("google/MusicCaps", split="train")
    print(f"Dataset has {len(dataset)} tracks")
    print(f"Columns: {dataset.column_names}")

    # MusicCaps has: ytid, start_s, end_s, audioset_positive_labels, aspect_list, caption
    # We'll use the caption for metadata and ytid to potentially fetch audio

    vectors = []
    processed = 0
    skipped = 0

    print(f"\nProcessing {min(args.limit, len(dataset))} tracks...")
    print("(Using captions to generate text embeddings for demo)")
    print("-" * 60)

    for i, row in enumerate(dataset):
        if processed >= args.limit:
            break

        caption = row.get("caption", "")
        if not caption:
            skipped += 1
            continue

        try:
            # Embed the caption/description using CLAP text encoder
            # This creates embeddings in the same space as audio would be
            inputs = processor(text=[caption], return_tensors="pt", padding=True)
            inputs = {k: v.to(device) for k, v in inputs.items()}

            with torch.no_grad():
                text_embedding = model.get_text_features(**inputs)

            # Normalize embedding
            embedding = text_embedding[0].cpu().numpy()
            embedding = embedding / np.linalg.norm(embedding)

            # Extract metadata
            metadata = {
                "caption": caption[:500],  # Truncate long captions
                "ytid": row.get("ytid", ""),
                "start_s": row.get("start_s", 0),
                "end_s": row.get("end_s", 10),
                "labels": row.get("audioset_positive_labels", ""),
                "aspects": row.get("aspect_list", ""),
            }

            # Add YouTube URL if available
            if metadata["ytid"]:
                metadata["youtube_url"] = f"https://youtube.com/watch?v={metadata['ytid']}"

            vectors.append({
                "id": f"musiccaps_{i}",
                "values": embedding.tolist(),
                "metadata": metadata
            })

            processed += 1
            if processed % 100 == 0:
                print(f"  Processed {processed}/{args.limit} tracks...")

        except Exception as e:
            print(f"  Error processing track {i}: {e}")
            skipped += 1
            continue

    print("-" * 60)
    print(f"\nProcessed {len(vectors)} tracks successfully")
    if skipped > 0:
        print(f"Skipped {skipped} tracks")

    if not vectors:
        print("ERROR: No vectors created!")
        return

    # Check dimensions
    dims = len(vectors[0]["values"])
    print(f"Embedding dimensions: {dims}")

    # Save to JSON
    output_path = Path(__file__).parent.parent / "data" / "music-embeddings.json"
    output_path.parent.mkdir(exist_ok=True)

    with open(output_path, "w") as f:
        json.dump({
            "dimensions": dims,
            "count": len(vectors),
            "source": "Google MusicCaps",
            "model": "laion/clap-htsat-unfused",
            "embedding_type": "text (caption-based)",
            "note": "CLAP text embeddings from captions. Search with CLAP text encoder.",
            "vectors": vectors
        }, f)

    file_size = output_path.stat().st_size / 1024 / 1024
    print(f"\nSaved to: {output_path}")
    print(f"File size: {file_size:.2f} MB")

    print("\n" + "=" * 60)
    print("SUCCESS! Next steps:")
    print("  1. npx ts-node scripts/upload-music-embeddings.ts")
    print("  2. python scripts/search-music.py 'chill lo-fi beats'")
    print("=" * 60)

if __name__ == "__main__":
    main()
