# Student Setup Checklist

## Before the Session

### Required Software
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn package manager
- [ ] VS Code or preferred code editor
- [ ] Git installed and configured

### Accounts Needed
- [ ] OpenAI account with API access
- [ ] Pinecone account (free tier is fine)
- [ ] GitHub account
- [ ] Helicone account (optional but recommended)
- [ ] Firecrawl.dev account (for web scraping module)

### Pre-Session Setup (15 minutes)

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd mini-rag
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file with:
   ```
   OPENAI_API_KEY=your_key_here
   PINECONE_API_KEY=your_key_here
   HELICONE_API_KEY=optional_key_here
   FIRECRAWL_API_KEY=your_key_here
   ```

4. **Verify Setup**
   ```bash
   yarn dev
   # Should start on http://localhost:3000
   ```

### Quick Knowledge Check

Can you answer these?
- [ ] What does API stand for?
- [ ] Have you used async/await in TypeScript?
- [ ] Familiar with environment variables?
- [ ] Used any AI/LLM APIs before?

(Don't worry if you answered "no" - we'll cover everything!)

### Recommended Reading (Optional)
- [OpenAI Quickstart](https://platform.openai.com/docs/quickstart)
- [What are embeddings?](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings)
- [TypeScript Basics](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

### During the Session

**Bring:**
- Laptop with charger
- Note-taking app/notebook
- Questions about AI/LLMs
- Project ideas you'd like to build

**Mindset:**
- It's okay to not understand everything immediately
- Ask questions - others probably have the same ones
- Focus on concepts over syntax
- Think about real-world applications

### Troubleshooting Resources

If you encounter issues:
1. Check the [README.md](./README.md) troubleshooting section
2. Verify all environment variables are set
3. Ensure you're using Node.js 18+
4. Clear cache: `rm -rf node_modules && yarn install`

### Success Indicators

You're ready when:
- ✅ The app runs locally
- ✅ You can see the home page
- ✅ No console errors on startup
- ✅ API keys are configured

---

**Remember:** The goal is to learn concepts, not memorize code. Focus on understanding the "why" behind each module!