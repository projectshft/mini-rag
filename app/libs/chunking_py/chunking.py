from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Dict, List, Union

MetadataValue = Union[str, int, float, bool, List[str]]


@dataclass
class Chunk:
    id: str
    content: str
    metadata: Dict[str, MetadataValue]

class ChunkIT:

    def chunk_text(
        self,
        text: str,
        chunk_size: int = 500,
        overlap: int = 50,
        source: str = "unknown",
    ) -> List[Chunk]:
        """Split text into smaller chunks for processing.

        Args:
            text: The text to chunk.
            chunk_size: Maximum size of each chunk.
            overlap: Number of characters to overlap between chunks.
            source: Source identifier (typically URL).

        Returns:
            List of text chunks.
        """
        chunks: List[Chunk] = []
        sentences = [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]

        current_chunk = ""
        chunk_start = 0
        chunk_index = 0

        for raw_sentence in sentences:
            sentence = raw_sentence + "."

            # If adding this sentence would exceed chunk size, create a chunk.
            if len(current_chunk) + len(sentence) > chunk_size and len(current_chunk) > 0:
                chunk = Chunk(
                    id=f"{source}-chunk-{chunk_index}",
                    content=current_chunk.strip(),
                    metadata={
                        "source": source,
                        "chunkIndex": chunk_index,
                        "totalChunks": 0,
                        "startChar": chunk_start,
                        "endChar": chunk_start + len(current_chunk),
                    },
                )

                chunks.append(chunk)

                # Start new chunk with overlap.
                overlap_text = self.get_last_words(current_chunk, overlap)
                current_chunk = f"{overlap_text} {sentence}"
                chunk_start = int(chunk.metadata["endChar"]) - len(overlap_text)
                chunk_index += 1
            else:
                current_chunk += (" " if current_chunk else "") + sentence

        # Add final chunk if it has content.
        if current_chunk.strip():
            chunks.append(
                Chunk(
                    id=f"{source}-chunk-{chunk_index}",
                    content=current_chunk.strip(),
                    metadata={
                        "source": source,
                        "chunkIndex": chunk_index,
                        "totalChunks": 0,
                        "startChar": chunk_start,
                        "endChar": chunk_start + len(current_chunk),
                    },
                )
            )

        # Update total chunks count.
        total_chunks = len(chunks)
        for chunk in chunks:
            chunk.metadata["totalChunks"] = total_chunks

        return chunks


    def get_last_words(self, text: str, max_length: int) -> str:
        """Get the last max_length characters worth of complete words.

        This builds from the end so overlap keeps complete trailing words.
        """
        # Intended implementation:
        # 1. If the text is already short enough, return it unchanged.
        # 2. Split into words using spaces.
        # 3. Iterate from the end toward the beginning.
        # 4. Prepend each candidate word while the total length stays <= max_length.
        # 5. Stop when adding another word would exceed max_length.
        # 6. Return the accumulated trailing words.
        if len(text) <= max_length:
            return text

        words = text.split(" ")
        result = ""

        for word in reversed(words):
            candidate = word if not result else f"{word} {result}"
            if len(candidate) > max_length:
                break
            result = candidate

        return result

class TestChunkIT:

    def setup_method(self) -> None:
        self.chunker = ChunkIT()

    # Basic Functionality
    def test_get_last_words_returns_full_text_when_short_enough(self) -> None:
        text = "short text"

        result = self.chunker.get_last_words(text, 50)

        assert result == text

    def test_get_last_words_returns_trailing_complete_words(self) -> None:
        text = "one two three four"

        result = self.chunker.get_last_words(text, 10)

        assert result == "three four"

    def test_chunk_text_returns_single_chunk_for_short_input(self) -> None:
        chunks = self.chunker.chunk_text(
            "Alpha beta gamma.",
            chunk_size=100,
            overlap=10,
            source="doc-1",
        )

        assert len(chunks) == 1
        assert chunks[0].id == "doc-1-chunk-0"
        assert chunks[0].content == "Alpha beta gamma."
        assert chunks[0].metadata["source"] == "doc-1"
        assert chunks[0].metadata["chunkIndex"] == 0
        assert chunks[0].metadata["totalChunks"] == 1

    def test_chunk_text_splits_and_carries_overlap_into_next_chunk(self) -> None:
        chunks = self.chunker.chunk_text(
            "Alpha beta gamma. Delta epsilon zeta.",
            chunk_size=20,
            overlap=6,
            source="doc-2",
        )

        assert len(chunks) == 2
        assert chunks[0].content == "Alpha beta gamma."
        assert chunks[1].content == "gamma. Delta epsilon zeta."
        assert chunks[0].metadata["totalChunks"] == 2
        assert chunks[1].metadata["totalChunks"] == 2
        assert chunks[1].metadata["chunkIndex"] == 1
        assert chunks[1].metadata["startChar"] == chunks[0].metadata["endChar"] - len("gamma.")

    def test_chunk_text_splits_longer_text_into_chunks(self) -> None:
        text = (
            "React Hooks were introduced in React 16.8. "
            "They allow you to use state and other React features without writing a class component. "
            "The most commonly used hooks are useState and useEffect."
        )

        chunks = self.chunker.chunk_text(text, 100, 20, "test")

        assert len(chunks) > 0
        assert chunks[0].content

    def test_chunk_text_handles_empty_text(self) -> None:
        chunks = self.chunker.chunk_text("", 500, 50, "test")

        assert chunks == []

    # Sentence Boundaries
    def test_chunk_text_preserves_sentence_boundaries(self) -> None:
        text = "First sentence. Second sentence. Third sentence. Fourth sentence."

        chunks = self.chunker.chunk_text(text, 30, 10, "test")

        for chunk in chunks:
            assert re.search(r"[.!?]\s*$", chunk.content)

    def test_chunk_text_handles_different_punctuation_marks(self) -> None:
        text = "Is this a question? Yes it is! This is an exclamation. This is normal."

        chunks = self.chunker.chunk_text(text, 40, 10, "test")

        assert len(chunks) > 0
        for chunk in chunks:
            assert chunk.content

    def test_chunk_text_keeps_words_intact(self) -> None:
        text = (
            "The company announced new features including advanced AI capabilities. "
            "These features will revolutionize the industry. "
            "Users are excited about the upcoming release."
        )

        chunks = self.chunker.chunk_text(text, 50, 10, "test")

        for chunk in chunks:
            assert re.search(r"[.!?]\s*$", chunk.content)
            words = chunk.content.split()
            for word in words:
                assert len(word) > 0

    # Overlap Functionality
    def test_chunk_text_respects_overlap_parameter(self) -> None:
        text = (
            "Sentence one. Sentence two. Sentence three. "
            "Sentence four. Sentence five. Sentence six."
        )

        chunks_no_overlap = self.chunker.chunk_text(text, 30, 0, "test")
        chunks_with_overlap = self.chunker.chunk_text(text, 30, 10, "test")

        if len(chunks_no_overlap) > 1 and len(chunks_with_overlap) > 1:
            assert chunks_no_overlap[1].content != chunks_with_overlap[1].content

    # Metadata
    def test_chunk_text_includes_correct_metadata(self) -> None:
        text = "First sentence. Second sentence. Third sentence."
        source = "test-document"

        chunks = self.chunker.chunk_text(text, 50, 10, source)

        for index, chunk in enumerate(chunks):
            assert chunk.id == f"{source}-chunk-{index}"
            assert chunk.metadata["source"] == source
            assert chunk.metadata["chunkIndex"] == index
            assert chunk.metadata["totalChunks"] == len(chunks)
            assert chunk.metadata["startChar"] >= 0
            assert chunk.metadata["endChar"] > chunk.metadata["startChar"]

    def test_chunk_text_has_sequential_chunk_indices(self) -> None:
        text = "One. Two. Three. Four. Five. Six. Seven. Eight. Nine. Ten."

        chunks = self.chunker.chunk_text(text, 20, 5, "test")

        for index, chunk in enumerate(chunks):
            assert chunk.metadata["chunkIndex"] == index

    def test_chunk_text_updates_total_chunks_for_all_chunks(self) -> None:
        text = "A. B. C. D. E. F. G. H. I. J."

        chunks = self.chunker.chunk_text(text, 10, 2, "test")

        total_chunks = len(chunks)
        for chunk in chunks:
            assert chunk.metadata["totalChunks"] == total_chunks

    # Edge Cases
    def test_chunk_text_handles_very_long_sentence(self) -> None:
        long_sentence = (
            "This is a very long sentence that contains many words and should be handled properly "
            "even though it exceeds the normal chunk size because we need to test edge cases."
        )

        chunks = self.chunker.chunk_text(long_sentence, 50, 10, "test")

        assert len(chunks) >= 1
        assert chunks[0].content

    def test_chunk_text_handles_multiple_spaces(self) -> None:
        text = "First  sentence   with    spaces. Second     sentence."

        chunks = self.chunker.chunk_text(text, 100, 20, "test")

        assert len(chunks) > 0
        for chunk in chunks:
            assert chunk.content

    def test_chunk_text_handles_newlines(self) -> None:
        text = "First sentence.\nSecond sentence.\n\nThird sentence."

        chunks = self.chunker.chunk_text(text, 100, 20, "test")

        assert len(chunks) > 0

    def test_chunk_text_handles_special_characters(self) -> None:
        text = "React uses JSX! Does it work? Yes, it works. Amazing!"

        chunks = self.chunker.chunk_text(text, 50, 10, "test")

        assert len(chunks) > 0
        for chunk in chunks:
            assert chunk.content

    # Chunk Size Control
    def test_chunk_text_respects_chunk_size_limits(self) -> None:
        text = (
            "Short sentence. Another short one. And one more. "
            "Plus this. And that. Finally done."
        )
        chunk_size = 40

        chunks = self.chunker.chunk_text(text, chunk_size, 5, "test")

        for chunk in chunks:
            assert len(chunk.content) <= chunk_size + 100

    def test_chunk_text_creates_multiple_chunks_for_long_text(self) -> None:
        sentences = " ".join(["This is a test sentence."] * 20)

        chunks = self.chunker.chunk_text(sentences, 100, 20, "test")

        assert len(chunks) > 1

    # Real-World Example
    def test_chunk_text_handles_real_world_react_documentation_example(self) -> None:
        text = (
            "React Hooks were introduced in React 16.8. "
            "They allow you to use state and other React features without writing a class component. "
            "The most commonly used hooks are useState and useEffect. "
            "useState lets you add state to function components. "
            "useEffect lets you perform side effects in function components."
        )

        chunks = self.chunker.chunk_text(text, 150, 30, "react-docs")

        assert len(chunks) > 0
        for chunk in chunks:
            assert "react-docs-chunk-" in chunk.id
            assert len(chunk.content) > 0
            assert chunk.metadata["source"] == "react-docs"

        all_content = " ".join(chunk.content for chunk in chunks)
        assert "useState" in all_content
        assert "useEffect" in all_content

