"""
VECTOR WORD ARITHMETIC EXERCISE

This exercise demonstrates how vector addition and subtraction can reveal
semantic relationships between words. Think of it as "word math"!

Famous example: king - man + woman ≈ queen

Run this script with: python vector_word_arithmetic.py
"""

import json
import numpy as np
import pandas as pd
import asyncio
import math
from rich import print as rprint
from pathlib import Path
from typing import List, Dict, Tuple

from openai import AsyncOpenAI
from dotenv import load_dotenv


# =============================================================================
# STEP 1: Environment Setup
# =============================================================================
# Load environment variables from .env or .env.local
# - Check if .env.local exists, use it first
# - Otherwise fall back to .env
# - Initialize the OpenAI client with the API key
rootdir = Path(__file__).parent.parent.parent.parent
embeddings_cache = None
def setup_environment():
    """
    Load environment variables and return OpenAI client.
    """
    env_local_path = rootdir / ".env.local"
    env_path = rootdir / ".env"

    if env_local_path:
        load_dotenv(env_local_path)
    elif env_path:
        load_dotenv(env_path)
    else:
        load_dotenv()
    # Get the root directory (3 levels up from this file)
    # Check for .env.local first, then .env
    # Load the appropriate env file using load_dotenv()

    return AsyncOpenAI()


# =============================================================================
# STEP 2: Embeddings Cache
# =============================================================================
# Load pre-computed embeddings from cache file to avoid API calls

def load_embeddings_cache() -> Dict[str, List[float]]:
    """
    Load embeddings cache from JSON file.
    """
    # Construct path to embeddings-cache.json (in project root)
    # Check if file exists using Path.exists()
    # If exists, open and parse JSON with json.load()
    # Return the cache dict (or empty dict if not found)
    embeddings_path = rootdir / "embeddings-cache.json"
    if not embeddings_path:
        raise FileNotFoundError
    with open(embeddings_path) as file_in:
        embeddings = json.load(file_in)
    embeddings_cache = embeddings


# =============================================================================
# STEP 3: Vector Operations
# =============================================================================

def add_vectors(a: List[float], b: List[float]) -> List[float]:
    """
    Add two vectors element-wise.
    Example: [1, 2, 3] + [4, 5, 6] = [5, 7, 9]
    """
    return [val_a + val_b for val_a, val_b in zip(a, b)]

def add_vectors_numpy(a: List[float], b: List[float]) -> List[float]:
    """
    same as above except this is probably a good use case for numpy
    vectorized operations
    """
    arr_a = np.array(a)
    arr_b = np.array(b)
    result = arr_a + arr_b
    return result.tolist()

def subtract_vectors(a: List[float], b: List[float]) -> List[float]:
    """
    Subtract vector b from vector a element-wise.
    Example: [5, 7, 9] - [1, 2, 3] = [4, 5, 6]
    """
    return [val_a - val_b for val_a, val_b in zip(a, b)]

def subtract_vectors_numpy(a, b):
    arr_a = np.array(a)
    arr_b = np.array(b)
    result = arr_a - arr_b
    return result.tolist()


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """
    Calculate the cosine similarity between two vectors.
    Formula: cos(θ) = (A · B) / (||A|| * ||B||)
    """
    dot_product = sum(val_a * val_b for val_a, val_b in zip(a,b))
    mag_a = math.sqrt(sum(val * val for val in a))
    mag_b = math.sqrt(sum(val * val for val in b))
    return dot_product / (mag_a * mag_b)

def cosine_similarity_np(a, b):
    arr_a = np.array(a)
    arr_b = np.array(b)
    dot_product = np.dot(arr_a, arr_b)
    mag_a = np.linalg.norm(arr_a)
    mag_b = np.linalg.norm(arr_b)

    return dot_product / (mag_a * mag_b)


# =============================================================================
# STEP 4: Get Embedding
# =============================================================================

# Global cache variable
embeddings_cache: Dict[str, List[float]] = {}

async def get_embedding(text: str, client=None) -> List[float]:
    """
    Get embedding vector for a word/phrase.
    """
    if text in embeddings_cache:
        return embeddings_cache[text]
    
    response = await client.embeddings.create(
        model='text-embedding-3-small',
        dimensions=512,
        input=text
    )
    return response.data[0].embedding



# =============================================================================
# STEP 5: Find Closest Word
# =============================================================================

async def find_closest_word(
    target_vector: List[float],
    candidates: List[str],
    client=None
) -> List[Tuple[str, float]]:
    """
    Find the closest words from candidates given a target vector.
    Returns list of (word, similarity) tuples sorted by similarity descending.
    """
    results = []
    for candidate in candidates:
        embedding = await get_embedding(candidate, client)
        similarity = cosine_similarity(target_vector, embedding)
        results.append((candidate, similarity))
    return sorted(results, key=lambda x: x[1], reverse=True)

async def main():
    """
    Run word arithmetic demonstrations.
    """
    
    print('🧮 VECTOR WORD ARITHMETIC DEMONSTRATIONS')
    print('=========================================\n')
    client = setup_environment()
    load_embeddings_cache()
    
    # ==========================================================================
    # Example 1: Classic King-Queen relationship
    # Formula: king - man + woman ≈ ?
    # ==========================================================================
    print('📚 CLASSIC EXAMPLE: Gender Relations')
    print('Formula: king - man + woman ≈ ?')

    king_vec, man_vec, woman_vec = await asyncio.gather(
        get_embedding('king', client),
        get_embedding('man', client),
        get_embedding('woman', client)
    )

    result = add_vectors(subtract_vectors(king_vec, man_vec), woman_vec)
    candidates = ['queen', 'princess', 'empress', 'lady', 'ruler', 'monarch', 'pizza']
    matches = await find_closest_word(result, candidates, client)

    print('Top matches:')
    for i, (word, similarity) in enumerate(matches):
        emoji = '❌' if i == len(matches) - 1 else '✅'
        print(f'{emoji} {i + 1}. {word} (similarity: {similarity:.3f})')
    print()

    # ==========================================================================
    # Example 2: Tech bro transformation
    # Formula: engineer - humility + ego ≈ ?
    # ==========================================================================
    print('💻 TECH BRO EXAMPLE: Silicon Valley Transformation')
    print('Formula: engineer - humility + ego ≈ ?')

    engineer_vec, humility_vec, ego_vec = await asyncio.gather(
        get_embedding('engineer', client),
        get_embedding('humility', client),
        get_embedding('ego', client)
    )

    result = add_vectors(subtract_vectors(engineer_vec, humility_vec), ego_vec)
    candidates = ['founder', 'CEO', 'entrepreneur', 'startup', 'techbro', 'disruptor', 'banana']
    matches = await find_closest_word(result, candidates, client)

    print('Top matches:')
    for i, (word, similarity) in enumerate(matches):
        emoji = '❌' if i == len(matches) - 1 else '✅'
        print(f'{emoji} {i + 1}. {word} (similarity: {similarity:.3f})')
    print()

    # ==========================================================================
    # Example 3: Career progression
    # Formula: intern - enthusiasm + cynicism ≈ ?
    # ==========================================================================
    print('💼 CAREER EXAMPLE: Professional Evolution')
    print('Formula: intern - enthusiasm + cynicism ≈ ?')

    intern_vec, enthusiasm_vec, cynicism_vec = await asyncio.gather(
        get_embedding('intern', client),
        get_embedding('enthusiasm', client),
        get_embedding('cynicism', client)
    )

    result = add_vectors(subtract_vectors(intern_vec, enthusiasm_vec), cynicism_vec)
    candidates = ['manager', 'executive', 'burnout', 'veteran', 'survivor', 'director', 'sunshine']
    matches = await find_closest_word(result, candidates, client)

    print('Top matches:')
    for i, (word, similarity) in enumerate(matches):
        emoji = '❌' if i == len(matches) - 1 else '✅'
        print(f'{emoji} {i + 1}. {word} (similarity: {similarity:.3f})')
    print()

    # ==========================================================================
    # Example 4: Country → Capital
    # Formula: Tokyo - Japan + Germany ≈ ?
    # ==========================================================================
    print('🌍 GEOGRAPHY EXAMPLE: Country → Capital')
    print('Formula: Tokyo - Japan + Germany ≈ ?')

    tokyo_vec, japan_vec, germany_vec = await asyncio.gather(
        get_embedding('Tokyo', client),
        get_embedding('Japan', client),
        get_embedding('Germany', client)
    )

    result = add_vectors(subtract_vectors(tokyo_vec, japan_vec), germany_vec)
    candidates = ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Vienna', 'Paris', 'sushi']
    matches = await find_closest_word(result, candidates, client)

    print('Top matches:')
    for i, (word, similarity) in enumerate(matches):
        emoji = '❌' if i == len(matches) - 1 else '✅'
        print(f'{emoji} {i + 1}. {word} (similarity: {similarity:.3f})')
    print()

    # ==========================================================================
    # Example 5: Adjective → Noun (Superlatives)
    # Formula: biggest - big + small ≈ ?
    # ==========================================================================
    print('📏 GRAMMAR EXAMPLE: Adjective Superlatives')
    print('Formula: biggest - big + small ≈ ?')

    biggest_vec, big_vec, small_vec = await asyncio.gather(
        get_embedding('biggest', client),
        get_embedding('big', client),
        get_embedding('small', client)
    )

    result = add_vectors(subtract_vectors(biggest_vec, big_vec), small_vec)
    candidates = ['smallest', 'tiny', 'little', 'miniature', 'minor', 'larger', 'elephant']
    matches = await find_closest_word(result, candidates, client)

    print('Top matches:')
    for i, (word, similarity) in enumerate(matches):
        emoji = '❌' if i == len(matches) - 1 else '✅'
        print(f'{emoji} {i + 1}. {word} (similarity: {similarity:.3f})')
    print()

    # ==========================================================================
    # Example 6: Verb Tenses
    # Formula: running - run + eat ≈ ?
    # ==========================================================================
    print('🏃 GRAMMAR EXAMPLE: Verb Tenses')
    print('Formula: running - run + eat ≈ ?')

    running_vec, run_vec, eat_vec = await asyncio.gather(
        get_embedding('running', client),
        get_embedding('run', client),
        get_embedding('eat', client)
    )

    result = add_vectors(subtract_vectors(running_vec, run_vec), eat_vec)
    candidates = ['eating', 'ate', 'eats', 'consumed', 'dining', 'chewing', 'sprinting']
    matches = await find_closest_word(result, candidates, client)

    print('Top matches:')
    for i, (word, similarity) in enumerate(matches):
        emoji = '❌' if i == len(matches) - 1 else '✅'
        print(f'{emoji} {i + 1}. {word} (similarity: {similarity:.3f})')
    print()

    # ==========================================================================
    # Why This Works
    # ==========================================================================
    print('🎯 WHY THIS WORKS:')
    print('==================')
    print('Vector embeddings capture semantic relationships in high-dimensional space.')
    print("When we do math on these vectors, we're manipulating meaning itself!")
    print()
    print('Think of it like this:')
    print('• Vectors encode the "essence" of concepts')
    print('• Addition combines concepts')
    print('• Subtraction removes aspects')
    print('• The result points to related concepts in semantic space')
    print()
    print('🔬 EXERCISE FOR YOU:')
    print('Try creating your own word equations! Some ideas:')
    print('• coffee - sleep + anxiety ≈ ?')
    print('• Netflix - content + ads ≈ ?')
    print('• startup - funding + desperation ≈ ?')
    print('• influencer - talent + followers ≈ ?')

    # Run custom equations
    await my_equations(client)


async def my_equations(client):
    """
    Custom word arithmetic equations exploring plurals, opposites, and professions.
    """
    rprint('\n🧪 CUSTOM EQUATIONS')
    rprint('===================\n')
    
    # ==========================================================================
    # Custom 1: Plurals
    # Formula: musician - musicians + gig ≈ ?
    # Idea: Remove the "plural" aspect from musician, add "gig" context
    # ==========================================================================
    rprint('🎸 PLURALS EXAMPLE')
    rprint('Formula: musician - musicians + gig ≈ ?')

    musician_vec, musicians_vec, gig_vec = await asyncio.gather(
        get_embedding('musician', client),
        get_embedding('musicians', client),
        get_embedding('gig', client)
    )

    result = add_vectors(subtract_vectors(musician_vec, musicians_vec), gig_vec)
    candidates = ['concert', 'performance', 'show', 'band', 'solo', 'performer', 'rehearsal', 'accountant']
    matches = await find_closest_word(result, candidates, client)

    rprint('Top matches:')
    for i, (word, similarity) in enumerate(matches):
        emoji = '❌' if i == len(matches) - 1 else '✅'
        rprint(f'{emoji} {i + 1}. {word} (similarity: {similarity:.3f})')
    rprint()

    # ==========================================================================
    # Custom 2: Opposites / Spatial
    # Formula: sky - land + orange ≈ ?
    # Idea: Take sky, remove "land" (ground), add "orange" (color/fruit)
    # ==========================================================================
    rprint('🌅 OPPOSITES/SPATIAL EXAMPLE')
    rprint('Formula: sky - land + orange ≈ ?')

    sky_vec, land_vec, orange_vec = await asyncio.gather(
        get_embedding('sky', client),
        get_embedding('land', client),
        get_embedding('orange', client)
    )

    result = add_vectors(subtract_vectors(sky_vec, land_vec), orange_vec)
    candidates = ['sunset', 'sunrise', 'horizon', 'tangerine', 'blue', 'cloud', 'fruit', 'calculator']
    matches = await find_closest_word(result, candidates, client)

    rprint('Top matches:')
    for i, (word, similarity) in enumerate(matches):
        emoji = '❌' if i == len(matches) - 1 else '✅'
        rprint(f'{emoji} {i + 1}. {word} (similarity: {similarity:.3f})')
    rprint()

    # ==========================================================================
    # Custom 3: Professions / Context Shift
    # Formula: lawyer - court + academy ≈ ?
    # Idea: Take lawyer, remove "court" context, add "academy" (academic setting)
    # ==========================================================================
    rprint('👨‍⚖️ PROFESSIONS EXAMPLE')
    rprint('Formula: lawyer - court + academy ≈ ?')

    lawyer_vec, court_vec, academy_vec = await asyncio.gather(
        get_embedding('lawyer', client),
        get_embedding('court', client),
        get_embedding('academy', client)
    )

    result = add_vectors(subtract_vectors(lawyer_vec, court_vec), academy_vec)
    candidates = ['professor', 'scholar', 'student', 'teacher', 'dean', 'researcher', 'attorney', 'hamburger']
    matches = await find_closest_word(result, candidates, client)

    rprint('Top matches:')
    for i, (word, similarity) in enumerate(matches):
        emoji = '❌' if i == len(matches) - 1 else '✅'
        rprint(f'{emoji} {i + 1}. {word} (similarity: {similarity:.3f})')
    rprint()


# =============================================================================
# Main Entry Point
# =============================================================================

if __name__ == '__main__':
    asyncio.run(main())
    

    
