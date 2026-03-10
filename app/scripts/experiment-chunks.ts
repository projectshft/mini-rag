import { chunkText } from "../libs/chunking";
const text = `A neural network is a method in artificial intelligence that teaches computers to process data in a way that is inspired by the human brain. It is a type of machine learning process called deep learning
   that uses interconnected nodes or neurons in a layered structure that resembles the human brain. It can adapt to changing input so the network generates the best possible result without needing to redesign the      
  output criteria. Neural networks were originally developed in the 1940s to solve problems that were too complex for traditional algorithmic approaches.`;

// Try different chunk sizes
const smallChunks = chunkText(text, 200, 40, "test");
const largeChunks = chunkText(text, 1000, 100, "test");

console.log(`Small chunks: ${smallChunks.length}`);
console.log(`Large chunks: ${largeChunks.length}`);

// Try different overlap amounts
const noOverlap = chunkText(text, 500, 0, "test");
const highOverlap = chunkText(text, 500, 50, "test");

console.log(`No overlap chunks: ${noOverlap}`);
highOverlap.forEach((chunk, index) => {
  console.log(`High overlap chunk ${index}: ${chunk.content}\n`);
});
