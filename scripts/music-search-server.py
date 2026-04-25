"""
Simple Flask server for music search.
Run: python scripts/music-search-server.py
Then open: http://localhost:5001
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import numpy as np
from transformers import ClapModel, ClapProcessor
import weaviate
from weaviate.classes.init import Auth
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")

app = Flask(__name__)
CORS(app)

# Globals
model = None
processor = None
client = None
device = None

def init():
    global model, processor, client, device

    device = "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Device: {device}")

    print("Loading CLAP model...")
    model = ClapModel.from_pretrained("laion/clap-htsat-unfused")
    processor = ClapProcessor.from_pretrained("laion/clap-htsat-unfused")
    model = model.to(device)
    model.eval()
    print("CLAP loaded!")

    print("Connecting to Weaviate...")
    weaviate_url = os.getenv("WEAVIATE_URL")
    weaviate_key = os.getenv("WEAVIATE_API_KEY")

    if not weaviate_url.startswith("https://"):
        weaviate_url = f"https://{weaviate_url}"

    client = weaviate.connect_to_weaviate_cloud(
        cluster_url=weaviate_url,
        auth_credentials=Auth.api_key(weaviate_key)
    )
    print(f"Weaviate connected: {client.is_ready()}")

@app.route("/")
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Music Search</title>
        <style>
            body { font-family: system-ui; max-width: 800px; margin: 50px auto; padding: 20px; }
            input { width: 100%; padding: 12px; font-size: 16px; border: 2px solid #ddd; border-radius: 8px; }
            button { padding: 12px 24px; font-size: 16px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 10px; }
            button:hover { background: #0056b3; }
            .result { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin: 10px 0; }
            .similarity { color: green; font-weight: bold; }
            a { color: #007bff; }
            #loading { display: none; color: #666; }
        </style>
    </head>
    <body>
        <h1>Music Search</h1>
        <p>Search using natural language. Powered by CLAP audio embeddings.</p>

        <input type="text" id="query" placeholder="e.g., chill lo-fi beats for studying" />
        <button onclick="search()">Search</button>
        <span id="loading"> Searching...</span>

        <div id="results"></div>

        <script>
            async function search() {
                const query = document.getElementById('query').value;
                if (!query) return;

                document.getElementById('loading').style.display = 'inline';
                document.getElementById('results').innerHTML = '';

                const res = await fetch('/search?q=' + encodeURIComponent(query));
                const data = await res.json();

                document.getElementById('loading').style.display = 'none';

                let html = '<h3>Results for: "' + query + '"</h3>';
                data.results.forEach((r, i) => {
                    html += `
                        <div class="result">
                            <strong>#${i+1}</strong> - <span class="similarity">${(r.similarity * 100).toFixed(1)}% match</span>
                            <p>${r.caption}</p>
                            <a href="${r.youtube_url}" target="_blank">Listen on YouTube</a>
                        </div>
                    `;
                });
                document.getElementById('results').innerHTML = html;
            }

            document.getElementById('query').addEventListener('keypress', e => {
                if (e.key === 'Enter') search();
            });
        </script>
    </body>
    </html>
    """

@app.route("/search")
def search():
    query = request.args.get("q", "")
    if not query:
        return jsonify({"results": []})

    # Embed query with CLAP
    inputs = processor(text=[query], return_tensors="pt", padding=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model.get_text_features(**inputs)

    if hasattr(outputs, 'text_embeds'):
        embedding = outputs.text_embeds
    elif hasattr(outputs, 'pooler_output'):
        embedding = outputs.pooler_output
    else:
        embedding = outputs

    embedding = embedding.cpu().numpy().flatten()
    embedding = embedding / np.linalg.norm(embedding)

    # Search Weaviate
    collection = client.collections.get("MusicTrack")
    results = collection.query.near_vector(
        near_vector=embedding.tolist(),
        limit=5,
        return_metadata=["distance"]
    )

    formatted = []
    for obj in results.objects:
        formatted.append({
            "caption": obj.properties.get("caption", ""),
            "youtube_url": obj.properties.get("youtube_url", ""),
            "similarity": 1 - (obj.metadata.distance or 0)
        })

    return jsonify({"results": formatted})

if __name__ == "__main__":
    init()
    print("\nServer running at http://localhost:5001")
    app.run(port=5001, debug=False)
