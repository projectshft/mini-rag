# Branch Structure

This repository uses multiple branches for different purposes in the course.

## Student Branches

### `student-todo-exercises` ⭐ PRIMARY STUDENT BRANCH
**Use this for the course!**

**Purpose:** Starter code with TODOs for students to complete

**What's included:**
- ✅ All infrastructure and setup code (pre-built)
- ✅ Helper functions and utilities (pre-built)
- ✅ API routes scaffolding (pre-built)
- ❌ Exercise implementations (TODOs for students)
- ❌ Agent implementations (TODOs for students)

**Students should:**
1. Clone this branch: `git checkout student-todo-exercises`
2. Complete exercises marked with TODO comments
3. Implement agents following curriculum guidance
4. Test their implementations

**Files with TODOs:**
```
app/
├── scripts/exercises/
│   └── vector-similarity.ts          # TODO: Implement similarity search
├── libs/
│   └── chunking.ts                   # TODO: Implement getLastWords()
├── agents/
│   ├── linkedin.ts                   # TODO: Implement LinkedIn agent
│   └── rag.ts                        # TODO: Implement RAG agent
└── api/
    └── select-agent/route.ts         # TODO: Implement selector
```

---

### `student-starter` (Alternative)
**Purpose:** Minimal starter with even less scaffolding (for advanced students)

**Difference from `student-todo-exercises`:**
- Less guidance in comments
- Fewer helper functions
- More "from scratch" implementation

**Not recommended for first-time RAG learners.**

---

## Instructor/Solution Branches

### `solution`
**Purpose:** Complete working implementation

**Contains:**
- ✅ All exercises completed
- ✅ All agents implemented
- ✅ Full working application

**Use for:**
- Instructor reference
- Debugging student issues
- Comparing implementations
- Live coding demos

---

### `solution-session-2`, `solution-session-3`, `solution-session-4`
**Purpose:** Incremental solutions for each week

**Use for:**
- Showing weekly progress
- Students who join mid-course
- Catchup for students who fall behind

---

## Other Branches

### `main`
**Purpose:** Production-ready code (may differ from course version)

**Note:** This might include features beyond the curriculum. Use `student-todo-exercises` for the course.

---

### `working_version`
**Purpose:** Development branch for testing new features

---

### `cohort-1`
**Purpose:** Snapshot of first cohort's version (historical)

---

### `chunking-upload-test`
**Purpose:** Testing branch (can be ignored)

---

## Quick Start for Students

**Step 1: Clone the repository**
```bash
git clone https://github.com/your-org/mini_rag.git
cd mini_rag
```

**Step 2: Switch to student branch**
```bash
git checkout student-todo-exercises
```

**Step 3: Install dependencies**
```bash
yarn install
# or
npm install
```

**Step 4: Set up environment**
```bash
cp .env.example .env.local
# Add your API keys to .env.local
```

**Step 5: Start learning!**
```bash
# Check what exercises you need to complete
grep -r "TODO:" app/
```

---

## Quick Start for Instructors

**View solutions:**
```bash
git checkout solution
```

**View specific week's solution:**
```bash
git checkout solution-session-2  # Week 2 complete
git checkout solution-session-3  # Week 3 complete
git checkout solution-session-4  # Week 4 complete
```

**Compare student code to solution:**
```bash
# From student-todo-exercises branch
git diff solution -- app/agents/rag.ts
```

---

## Branch Protection

**Protected branches:**
- `main` - Production code
- `student-todo-exercises` - Student starter (don't push solutions here!)
- `solution` - Complete solutions

**Students should:**
- Work on their own forks or feature branches
- Never push to `student-todo-exercises` directly

**Instructors should:**
- Keep `student-todo-exercises` clean (TODOs only)
- Update `solution` when curriculum changes
- Create new `solution-session-X` branches for each cohort if needed

---

## Common Workflows

### For Students: Start a New Exercise

```bash
# Make sure you're on the right branch
git checkout student-todo-exercises

# Create a feature branch for your work (optional)
git checkout -b my-rag-agent-implementation

# Work on your implementation
# Test frequently
yarn test

# Commit your progress
git add .
git commit -m "Implement RAG agent"
```

---

### For Instructors: Update Student Branch

```bash
# Switch to student branch
git checkout student-todo-exercises

# Make changes (update curriculum, fix bugs, improve TODOs)
# IMPORTANT: Don't include solutions!

# Test that TODOs are clear
grep -r "TODO:" app/

# Commit and push
git add .
git commit -m "Update TODO guidance for RAG agent"
git push origin student-todo-exercises
```

---

### For Instructors: Update Solution Branch

```bash
# Switch to solution branch
git checkout solution

# Make changes (implement new features, fix bugs)

# Test everything works
yarn test
yarn dev

# Commit and push
git add .
git commit -m "Add re-ranking implementation"
git push origin solution
```

---

## Current Branch: student-todo-exercises ✅

You are currently on the student branch with exercises to complete.

The curriculum lives on the course site under `/learn` — not in this repo. Each
lesson tells you which file to open and which TODO to work on. This branch is
just the code.

**Next steps:**
1. Sign in to the course site and open `/learn`
2. Work through the lessons in order — start at the top
3. Copy `.env.example` to `.env` and fill in your keys before the first lesson
   that hits an API

**Happy coding! 🚀**
