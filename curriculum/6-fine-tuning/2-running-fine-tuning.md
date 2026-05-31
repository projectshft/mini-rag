# Running the Fine-Tuning Process

Learn how fine-tuning works by examining the code and data formats that were used to create custom models.

---

> **Important: Historical Context**
>
> As of May 7, 2026, OpenAI has limited access to fine-tuning. The scripts in this lesson are **artifacts** showing how fine-tuning used to be performed. You will **not** run these scripts yourself.
>
> **Instead, you will:**
> - Study the code to understand the workflow
> - Examine the training data format (JSONL)
> - Use our **pre-trained model** for the LinkedIn agent
>
> **Why learn this anyway?**
> - Fine-tuning is not limited to OpenAI — Anthropic, Cohere, and open-source models (via Hugging Face, Axolotl, etc.) still support it
> - Understanding the process helps you evaluate when fine-tuning vs RAG vs prompting is appropriate
> - Many production systems still use fine-tuned models

---

## Video Walkthrough

Watch this guide to understand the fine-tuning process:

<iframe src="https://share.descript.com/embed/nub6vmvmL3a" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Learn

1. Examine the training data format
2. Understand how the training script works
3. Learn about monitoring fine-tuning jobs
4. Know what a model ID looks like
5. Configure your app with a pre-trained model

---

## Understanding the Training Script

Located at: `app/scripts/upload-training-data.ts`

This script handles the entire fine-tuning workflow:

### The Process

```
Training Data (JSONL)
    ↓
1. Upload to OpenAI
    ↓
2. Create fine-tuning job
    ↓
3. OpenAI trains model
    ↓
4. Get model ID
    ↓
5. Use in your app
```

### What the Script Does

**Step 1: Upload File**
```typescript
const file = await openai.files.create({
  file: fs.createReadStream(filePath),
  purpose: 'fine-tune',
});
```

Uploads your JSONL file to OpenAI's servers.

**Step 2: Start Training Job**
```typescript
const job = await openai.fineTuning.jobs.create({
  training_file: fileId,
  model: 'gpt-4o-mini-2024-07-18',
});
```

Kicks off the training process. OpenAI handles everything from here!

---

## Examining the Training Data

Your training data lives at: `app/scripts/data/linkedin_training.jsonl`

### The Format

Each line is a complete training example:

```jsonl
{"messages": [{"role": "system", "content": "You are a professional LinkedIn advisor helping with networking and career advice"}, {"role": "user", "content": "How do I write an effective LinkedIn headline?"}, {"role": "assistant", "content": "Your LinkedIn headline is prime real estate - you have 220 characters to make a strong first impression. Here's how to make it count:\n\n1. **Go beyond your job title**: Instead of just 'Software Engineer', try 'Software Engineer | Building scalable systems | React & Node.js expert'\n\n2. **Include keywords**: Think about what people search for when looking for someone like you\n\n3. **Show value**: What problems do you solve? What makes you different?\n\n4. **Use numbers when possible**: 'Helped 50+ startups scale' is more concrete than 'Experienced with startups'\n\nYour headline appears everywhere on LinkedIn - in search results, in comments, in connection requests. Make it work hard for you!"}]}
```

### Breaking It Down

**System Message (Consistent):**
```json
{"role": "system", "content": "You are a professional LinkedIn advisor..."}
```
This sets the context - appears in EVERY example with same text.

**User Message (Varies):**
```json
{"role": "user", "content": "How do I write an effective LinkedIn headline?"}
```
The question/prompt - should cover wide variety of topics.

**Assistant Message (Your Voice):**
```json
{"role": "assistant", "content": "Your LinkedIn headline is prime real estate..."}
```
This is what the model learns! Should be in YOUR style, tone, and approach.

---

## Understanding the Training Script (Artifact)

> **Note:** This script is no longer runnable due to OpenAI's fine-tuning deprecation. Study it to understand the workflow.

### What the Script Needed

**1. OpenAI API Key**
```bash
# In your .env.local
OPENAI_API_KEY=sk-your-key-here
```

**2. Training Data**
The training data file: `app/scripts/data/linkedin_training.jsonl`

### How It Was Run

```bash
yarn train  # No longer functional
```

This ran: `npx ts-node app/scripts/upload-training-data.ts`

### What the Output Looked Like

```bash
Uploading training file...
File uploaded successfully: file-abc123xyz

Creating fine-tuning job...
Fine-tuning job created successfully: ftjob-abc123

You can monitor the job status using the OpenAI dashboard or the job ID:
https://platform.openai.com/finetune/ftjob-abc123?filter=all

🚨 IMPORTANT: Once the fine-tuning job completes, you will receive
   a new fine-tuned model ID. Update the model ID in .env.local
   to use your new fine-tuned model.
```

**Key Information:**
- **File ID**: Confirmed upload succeeded
- **Job ID**: Used to track progress
- **Dashboard Link**: For monitoring in real-time

---

## Monitoring Your Fine-Tuning Job

### Via OpenAI Dashboard

1. Click the link from the script output
2. Or go to: https://platform.openai.com/finetune
3. Find your job in the list

**What You'll See:**
```
Status: running
Progress: 45/100 steps
Time Remaining: ~8 minutes
```

### Via API (Optional)

```bash
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Status Meanings

**`running`**: Training in progress - be patient!
**`succeeded`**: Complete! You have a model ready.
**`failed`**: Something went wrong (check error message)
**`cancelled`**: Job was stopped

---

## Using the Pre-Trained Model

Since you cannot run fine-tuning yourself, we provide a pre-trained model for the LinkedIn agent exercises.

### Our Pre-Trained Model ID

```
ft:gpt-4o-mini-2024-07-18:personal::COAiNLWZ
```

This model was fine-tuned on LinkedIn post examples and writes in a professional LinkedIn style.

### Add to Your Environment

Update your `.env.local`:

```bash
OPENAI_API_KEY=sk-your-key-here
OPENAI_FINETUNED_MODEL=ft:gpt-4o-mini-2024-07-18:personal::COAiNLWZ
```

**Important:**
- Use this exact model ID — it's already fine-tuned and ready
- Include the entire string (organization, name, and hash)
- Restart your dev server after updating
- **Note:** This model may be deprecated in the future as part of OpenAI's full deprecation of fine-tuning

---

## Understanding What Happened

### Before Training

```
Your Question → Base Model → Generic Response
```

The model uses general training, no knowledge of YOUR style.

### After Training

```
Your Question → Fine-Tuned Model → Response in YOUR Voice
```

The model has learned YOUR patterns, tone, and approach from 100+ examples.

### What Changed Internally

```
Base Model Weights
    +
Your Training Examples
    =
Adjusted Weights (Fine-Tuned Model)
```

OpenAI adjusted millions of internal parameters to better match your data. This is a NEW model (yours specifically).

---

## Testing Your Model

### Quick Test via OpenAI Playground

1. Go to: https://platform.openai.com/playground
2. Select your fine-tuned model from dropdown
3. Try a test prompt
4. Compare to base model

### Test in Your App

We'll do this in the next section when implementing the agent!

---

## Common Issues & Solutions

### "File format invalid"

**Issue:** JSONL file has formatting errors

**Fix:**
- Each line must be valid JSON
- No blank lines
- No trailing commas
- Use a JSONL validator

### "Training data too small"

**Issue:** Need minimum 10 examples (recommended 100+)

**Fix:**
- Add more training examples
- More data = better results

### "Job failed"

**Issue:** Training job encountered an error

**Fix:**
- Check OpenAI dashboard for error message
- Common causes:
  - Malformed training data
  - Invalid system messages
  - Rate limits hit

### "Model not found in app"

**Issue:** Model ID not configured correctly

**Fix:**
- Double-check `.env.local` has correct model ID
- Restart dev server: `yarn dev`
- Verify no typos in model ID

---

## Cost Breakdown

**Training Cost:**
- Based on tokens in training data
- ~$0.10-1.00 for typical LinkedIn training set
- One-time cost

**Usage Cost:**
- Fine-tuned models cost ~2x base models
- But worth it for quality!

**Example:**
```
Base model: $0.150 per 1M input tokens
Fine-tuned:  $0.300 per 1M input tokens

1000 user queries × 500 tokens each = 500k tokens
Base cost: $0.075
Fine-tuned cost: $0.150

Extra $0.075 for significantly better quality!
```

---

## What You Learned

✅ How training data is prepared in JSONL format
✅ How the fine-tuning script worked (as an artifact)
✅ How training jobs were monitored
✅ How to configure your app with a pre-trained model
✅ What happens during the training process internally

---

## Quick Reference

### Commands

```bash
# The training script is no longer functional
# yarn train  # DEPRECATED - OpenAI fine-tuning limited

# Check environment
cat .env.local | grep OPENAI

# Restart dev server (after adding model ID)
yarn dev
```

### File Locations

```
Training script (artifact): app/scripts/upload-training-data.ts
Training data (reference): app/scripts/data/linkedin_training.jsonl
Environment: .env.local
```

### Pre-Trained Model

Use this model ID in your `.env.local`:
```
OPENAI_FINETUNED_MODEL=ft:gpt-4o-mini-2024-07-18:personal::COAiNLWZ
```

### Fine-Tuning Elsewhere

While OpenAI has deprecated fine-tuning, you can still fine-tune models on other platforms:
- **Hugging Face**: Fine-tune open-source models (Llama, Mistral, etc.)
- **Anthropic**: Claude fine-tuning for enterprise customers
- **Cohere**: Command models with fine-tuning support
- **Together AI**: Fine-tune open-source models via API

### Useful Links

- OpenAI Fine-Tuning Docs (historical): https://platform.openai.com/docs/guides/fine-tuning
- Hugging Face Training: https://huggingface.co/docs/transformers/training
- Axolotl (popular fine-tuning tool): https://github.com/OpenAccess-AI-Collective/axolotl
