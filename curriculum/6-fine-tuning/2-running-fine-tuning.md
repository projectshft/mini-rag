# Running the Fine-Tuning Process

Time to train your own model! This section walks you through creating a fine-tuned model that writes like you.

---

## Video Walkthrough

Watch this guide to running the fine-tuning process:

<iframe src="https://share.descript.com/embed/nub6vmvmL3a" width="640" height="360" frameborder="0" allowfullscreen></iframe>

---

## What You'll Do

1. Examine the training data format
2. Run the training script
3. Monitor the fine-tuning job
4. Get your model ID
5. Configure your app

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

## Running the Training Script

### Prerequisites

**1. OpenAI API Key**
```bash
# In your .env.local
OPENAI_API_KEY=sk-your-key-here
```

**2. Training Data**
Make sure `app/scripts/data/linkedin_training.jsonl` exists and has content.

### Run the Script

```bash
yarn train
```

This runs: `npx ts-node app/scripts/upload-training-data.ts`

### Expected Output

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
- **File ID**: Confirms upload succeeded
- **Job ID**: Use this to track progress
- **Dashboard Link**: Click to monitor in real-time

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

## When Training Completes

### Getting Your Model ID

**In the Dashboard:**
```
Status: succeeded
Fine-tuned model: ft:gpt-4o-mini-2024-07-18:org:model-name:abc123
```

**Copy that full model ID!**

### Add to Your Environment

Update your `.env.local`:

```bash
OPENAI_API_KEY=sk-your-key-here
OPENAI_FINETUNED_MODEL=ft:gpt-4o-mini-2024-07-18:org:model-name:abc123
```

**Important:**
- Use the FULL model ID (starts with `ft:`)
- Include the entire string (organization, name, and hash)
- Restart your dev server after updating

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

✅ How to prepare training data in JSONL format
✅ How to run the fine-tuning script
✅ How to monitor training progress
✅ How to get and configure your model ID
✅ What happens during the training process

---

## What's Next

Now that you have a fine-tuned model, time to build the LinkedIn agent that uses it!

**Coming up:**
- Implementing the LinkedIn agent
- Integrating your fine-tuned model
- Testing the agent in the full system

---

## Quick Reference

### Commands

```bash
# Run training script
yarn train

# Check environment
cat .env.local | grep OPENAI

# Restart dev server (after adding model ID)
yarn dev
```

### File Locations

```
Training script: app/scripts/upload-training-data.ts
Training data: app/scripts/data/linkedin_training.jsonl
Environment: .env.local
```

### Useful Links

- OpenAI Fine-Tuning Dashboard: https://platform.openai.com/finetune
- OpenAI Playground: https://platform.openai.com/playground
- Fine-Tuning Docs: https://platform.openai.com/docs/guides/fine-tuning
