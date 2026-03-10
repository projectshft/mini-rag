"""
VECTOR WORD ARITHMETIC EXERCISE

This exercise demonstrates how vector addition and subtraction can reveal
semantic relationships between words. Think of it as "word math"!

Famous example: king - man + woman ≈ queen

Run this script with: python vector_word_arithmetic.py
"""

import json
import math
from pathlib import Path
from typing import List, Dict, Tuple

from openai import OpenAI
from dotenv import load_dotenv


# =============================================================================
# STEP 1: Environment Setup
# =============================================================================
# Load environment variables from .env or .env.local
# - Check if .env.local exists, use it first
# - Otherwise fall back to .env
# - Initialize the OpenAI client with the API key

def setup_environment():
    """
    Load environment variables and return OpenAI client.
    """
    
    # Get the root directory (3 levels up from this file)
    # Check for .env.local first, then .env
    # Load the appropriate env file using load_dotenv()
    # Initialize and return OpenAI() client
    raise NotImplementedError("Implement environment setup")


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
    raise NotImplementedError("Implement cache loading")


# =============================================================================
# STEP 3: Vector Operations
# =============================================================================

def add_vectors(a: List[float], b: List[float]) -> List[float]:
    """
    Add two vectors element-wise.
    Example: [1, 2, 3] + [4, 5, 6] = [5, 7, 9]
    """
    # Use zip() to iterate through both vectors simultaneously
    # Add corresponding elements
    # Return new vector with sums (list comprehension works well here)
    raise NotImplementedError("Implement vector addition")


def subtract_vectors(a: List[float], b: List[float]) -> List[float]:
    """
    Subtract vector b from vector a element-wise.
    Example: [5, 7, 9] - [1, 2, 3] = [4, 5, 6]
    """
    # Use zip() to iterate through both vectors simultaneously
    # Subtract corresponding elements (a - b)
    # Return new vector with differences
    raise NotImplementedError("Implement vector subtraction")


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """
    Calculate the cosine similarity between two vectors.
    Formula: cos(θ) = (A · B) / (||A|| * ||B||)
    """
    # Calculate dot product: sum of (a[i] * b[i]) for all i
    # Calculate magnitude of a: sqrt(sum of a[i]^2)
    # Calculate magnitude of b: sqrt(sum of b[i]^2)
    # Return dot_product / (magnitude_a * magnitude_b)
    raise NotImplementedError("Implement cosine similarity")


# =============================================================================
# STEP 4: Get Embedding
# =============================================================================

# Global cache variable
embeddings_cache: Dict[str, List[float]] = {}

def get_embedding(text: str, client=None) -> List[float]:
    """
    Get embedding vector for a word/phrase.
    """
    # Check if text exists in embeddings_cache - if so, return it
    # If not cached, call OpenAI API:
    #   - Use client.embeddings.create()
    #   - model='text-embedding-3-small'
    #   - dimensions=512
    #   - input=text
    # Extract and return embedding from response.data[0].embedding
    raise NotImplementedError("Implement embedding retrieval")


# =============================================================================
# STEP 5: Find Closest Word
# =============================================================================

def find_closest_word(
    target_vector: List[float],
    candidates: List[str],
    client=None
) -> List[Tuple[str, float]]:
    """
    Find the closest words from candidates given a target vector.
    Returns list of (word, similarity) tuples sorted by similarity descending.
    """
    # Initialize empty results list
    # For each candidate word:
    #   - Get its embedding using get_embedding()
    #   - Calculate cosine similarity with target_vector
    #   - Append (word, similarity) tuple to results
    # Sort results by similarity (highest first) using sorted() with key=lambda
    # Return sorted list
    raise NotImplementedError("Implement closest word finder")


# =============================================================================
# STEP 6: Word Arithmetic Demonstrations
# =============================================================================

def demonstrate_word_arithmetic():
    """
    Run word arithmetic demonstrations.
    """
    global embeddings_cache
    
    print('🧮 VECTOR WORD ARITHMETIC DEMONSTRATIONS')
    print('=========================================\n')
    
    # Setup: call setup_environment() to get client
    # Setup: call load_embeddings_cache() and assign to embeddings_cache
    
    # ==========================================================================
    # Example 1: Classic King-Queen relationship
    # Formula: king - man + woman ≈ ?
    # ==========================================================================
    print('📚 CLASSIC EXAMPLE: Gender Relations')
    print('Formula: king - man + woman ≈ ?')
    
    # Get embeddings for 'king', 'man', 'woman'
    # Compute: result = add_vectors(subtract_vectors(king_vec, man_vec), woman_vec)
    # candidates = ['queen', 'princess', 'empress', 'lady', 'ruler', 'monarch', 'pizza']
    # Find closest words and print results
    
    # ==========================================================================
    # Example 2: Tech bro transformation
    # Formula: engineer - humility + ego ≈ ?
    # ==========================================================================
    print('💻 TECH BRO EXAMPLE: Silicon Valley Transformation')
    print('Formula: engineer - humility + ego ≈ ?')
    
    # Get embeddings for 'engineer', 'humility', 'ego'
    # Compute vector arithmetic
    # candidates = ['founder', 'CEO', 'entrepreneur', 'startup', 'techbro', 'disruptor', 'banana']
    # Find closest words and print results
    
    # ==========================================================================
    # Example 3: Career progression
    # Formula: intern - enthusiasm + cynicism ≈ ?
    # ==========================================================================
    print('💼 CAREER EXAMPLE: Professional Evolution')
    print('Formula: intern - enthusiasm + cynicism ≈ ?')
    
    # Get embeddings for 'intern', 'enthusiasm', 'cynicism'
    # Compute vector arithmetic
    # candidates = ['manager', 'executive', 'burnout', 'veteran', 'survivor', 'director', 'sunshine']
    # Find closest words and print results
    
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


# =============================================================================
# Main Entry Point
# =============================================================================

if __name__ == '__main__':
    demonstrate_word_arithmetic()
