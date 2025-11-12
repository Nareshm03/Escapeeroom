# Sequential Unlock - Quick Start Guide

## What is Sequential Unlock?

Sequential Unlock is a quiz feature that locks questions until the previous question is answered correctly, creating a progressive challenge experience.

## Quick Setup

### For Quiz Creators

1. **Create a new quiz** (QuizCreator or QuizWizard)
2. **Find the toggle**: "Enable Sequential Unlock Mode"
3. **Select option**:
   - ✅ **Yes** (default) - Questions unlock one-by-one
   - **No** - All questions accessible immediately
4. **Add questions** and publish

### For Quiz Takers

**Sequential Mode ON:**
- Only first question is unlocked
- Answer correctly to unlock next question
- See progress: `[1] [2] [🔒] [🔒]`
- Locked questions show 🔒 overlay

**Sequential Mode OFF:**
- All questions unlocked immediately
- Navigate freely between questions

## Visual Indicators

### Progress Bar (Sequential Mode)
```
Question Progress:
[✓] [2] [🔒] [🔒] [🔒]
 ↑   ↑    ↑
Done Current Locked
```

### Question States
- **Green with ✓** - Answered correctly
- **Blue border** - Current question
- **White** - Unlocked, not answered
- **Gray with 🔒** - Locked

### Feedback Messages
- ✅ "Correct! Moving to next question..."
- ❌ "Incorrect answer. Try again!"
- 🔒 "Question is locked. Complete previous questions first."

## Testing

Run the test script:
```bash
node test-sequential-unlock.js
```

## Configuration

### Default Settings
- **Sequential Unlock**: Enabled (true)
- **First Question**: Always unlocked
- **Unlock Trigger**: Correct answer only

### Database Field
```javascript
sequential_unlock_enabled: Boolean (default: true)
```

## Common Use Cases

### Escape Room Challenges
Enable sequential unlock for progressive puzzle solving

### Training Quizzes
Enable sequential unlock to ensure concept mastery

### Practice Tests
Disable sequential unlock for flexible review

### Timed Assessments
Disable sequential unlock for time-efficient completion

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Questions not unlocking | Verify correct answers are submitted |
| All questions unlocked | Check toggle is set to "Yes" |
| Can't access question | Complete previous questions first |
| Setting not saving | Check browser console for errors |

## API Quick Reference

### Create Quiz with Sequential Unlock
```javascript
{
  "title": "My Quiz",
  "sequential_unlock_enabled": true,
  "questions": [...]
}
```

### Check Answer (with validation)
```javascript
{
  "questionIndex": 0,
  "answer": "user answer",
  "unlockedQuestions": [0, 1]
}
```

## Files Modified

### Backend
- `backend/src/models/Quiz.js` - Added field
- `backend/src/routes/quiz.js` - Added validation

### Frontend
- `frontend/src/components/QuizInfoStep.js` - Added toggle
- `frontend/src/components/QuizWizard3Step.js` - Added toggle
- `frontend/src/pages/QuizCreator.js` - Added toggle
- `frontend/src/pages/QuizTaker.js` - Added unlock logic

## Documentation

- **Full Guide**: [SEQUENTIAL_UNLOCK_GUIDE.md](SEQUENTIAL_UNLOCK_GUIDE.md)
- **Main README**: [README.md](README.md)

## Support

For detailed information, see [SEQUENTIAL_UNLOCK_GUIDE.md](SEQUENTIAL_UNLOCK_GUIDE.md)
