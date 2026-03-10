"""
VECTOR SIMILARITY EXERCISE

This exercise helps you understand how vector similarity works in RAG systems.
Complete the empty function below to find the most similar documents to a query.

Run this script with: python vector_similarity.py
"""

import math
import pprint
from dataclasses import dataclass
from typing import List, Tuple

pp = pprint.PrettyPrinter(indent=4)
@dataclass
class Document:
    """Document type for our examples"""
    id: str
    title: str
    embedding: List[float]


def dot_product(vector_a: List[float], vector_b: List[float]) -> float:
    """Calculate the dot product between two vectors"""
    if len(vector_a) != len(vector_b):
        raise ValueError("Vectors must have the same dimension")
    
    return sum(a * b for a, b in zip(vector_a, vector_b))


def magnitude(vector: List[float]) -> float:
    """Calculate the magnitude (length) of a vector"""
    sum_of_squares = sum(val * val for val in vector)
    return math.sqrt(sum_of_squares)


def cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:
    """Calculate the cosine similarity between two vectors"""
    dot_prod = dot_product(vector_a, vector_b)
    magnitude_a = magnitude(vector_a)
    magnitude_b = magnitude(vector_b)
    
    # Avoid division by zero
    if magnitude_a == 0 or magnitude_b == 0:
        return 0
    
    return dot_prod / (magnitude_a * magnitude_b)


def find_top_similar_documents(
    query_vector: List[float],
    documents: List[Document],
    min_similarity: float = 0.7,
    top_k: int = 3
) -> List[Tuple[Document, float]]:
    """
    EXERCISE: Implement this function to find the top K most similar documents to a query,
    filtering out any documents with similarity below the threshold.

    Args:
        query_vector: The query vector
        documents: Array of documents with embeddings
        min_similarity: Minimum similarity threshold (default: 0.7)
        top_k: Number of top results to return (default: 3)

    Returns:
        List of tuples containing (document, similarity_score)
    """
    
    # TODO: Implement this function!
    #
    # Steps:
    # 1. Calculate cosine similarity between query and each document
    #    - Use the cosine_similarity() function provided above
    #    - Create a list of (document, similarity) tuples
    similarities = [(doc, cosine_similarity(query_vector, doc.embedding)) for doc in documents]
    # 2. Filter documents that have similarity >= min_similarity
    #    - Use a list comprehension to keep only results meeting the threshold
    min_similarities = [s for s in similarities if s[1] >= min_similarity]
    # 3. Sort by similarity (highest first)
    #    - Use sorted() with a key function
    #    - Remember: higher similarity should come first (reverse=True)
    sorted_min_similarities = sorted(min_similarities, key=lambda x: x[1], reverse=True)
    # 4. Return top K results
    #    - Use slicing to get the first top_k items
    #
    return sorted_min_similarities[:top_k]


# Example test data for reference
example_documents: List[Document] = [
    Document(
        id="doc1",
        title="Introduction to Vector Databases",
        embedding=[0.8, 0.2, 0.7, 0.1],
    ),
    Document(
        id="doc2",
        title="Machine Learning Fundamentals",
        embedding=[0.2, 0.8, 0.1, 0.7],
    ),
    Document(
        id="doc3",
        title="Natural Language Processing",
        embedding=[0.9, 0.1, 0.6, 0.2],
    ),
    Document(
        id="doc4",
        title="Vector Math for Beginners",
        embedding=[0.7, 0.3, 0.8, 0.1],
    ),
    Document(
        id="doc5",
        title="Database Design Patterns",
        embedding=[0.1, 0.9, 0.2, 0.6],
    ),
]

# Example query vector - similar to documents about vectors
example_query_vector = [0.75, 0.25, 0.8, 0.1]


if __name__ == "__main__":
    print("=== VECTOR SIMILARITY EXERCISE ===")
    print("\nYour task is to implement the find_top_similar_documents function.")
    print("This function should:")
    print("1. Calculate cosine similarity between the query vector and each document")
    print("2. Filter out documents with similarity below the threshold")
    print("3. Sort the remaining documents by similarity (highest first)")
    top_similar = find_top_similar_documents(example_query_vector, example_documents)
    print("4. Return the top K results")
    pp.pprint(top_similar)

class TestVectorSimilarity:
    def test_run(self) -> bool:
        """Simple test function to verify the implementation"""
    
        # Test with a simple case
        test_query = [1.0, 0.0, 0.0]
        test_docs = [
            Document(id="1", title="Perfect match", embedding=[1.0, 0.0, 0.0]),
            Document(id="2", title="Partial match", embedding=[0.7, 0.3, 0.0]),
            Document(id="3", title="No match", embedding=[0.0, 1.0, 0.0]),
        ]

        results = find_top_similar_documents(test_query, test_docs, 0.7, 2)

        # Check if results are correct
        assert len(results) == 2
        assert results[0][0].id == "1"
        assert results[1][0].id == "2"
        assert results[0][1] == 1
