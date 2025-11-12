# Sequential Puzzle Unlocking - Implementation Guide

## Overview

The Sequential Unlock feature allows quiz creators to control whether questions are accessible all at once or unlock one-by-one as participants answer correctly. This creates a more engaging, progressive challenge experience.

## Features

### 1. Gameplay Behavior
- **Locked State**: Questions start locked (except the first one)
- **Sequential Unlocking**: Each question unlocks only after correctly answering the previous one
- **Visual Feedback**: Clear visual distinction between locked and unlocked questions
- **Progress Tracking**: Visual progress indicator showing locked/unlocked/answered states

### 2. Configuration Options
- **Toggle Location**: Quiz creation form (Step 1: Quiz Information)
- **Default Value**: Yes (enabled)
- **Options**: 
  - ✅ Yes - Sequential unlock enabled
  - No - All questions accessible immediately
- **Tooltip**: Explains functionality on hover

### 3. Backend Implementation
- **Database Field**: `sequential_unlock_enabled` (Boolean)
- **Default**: `true`
- **Validation**: Server-side sequence violation checking
- **Logging**: Sequence violations logged for debugging

### 4. Error Handling
- **Locked Question Access**: Returns 403 error with clear message
- **Frontend Validation**: Prevents locked question interaction
- **User Feedback**: Clear messages when questions are locked
- **Edge Cases**: Handles empty quizzes and single-question quizzes

## Technical Implementation

### Database Schema

```javascript
// Quiz Model (backend/src/models/Quiz.js)
sequential_unlock_enabled: {
  type: Boolean,
  default: true
}
```

### Frontend Components

#### 1. Quiz Creation (QuizWizard3Step.js & QuizCreator.js)
```javascript
// State initialization
const [quizData, setQuizData] = useState({
  // ... other fields
  sequentialUnlock: true  // or sequential_unlock_enabled
});

// Form field
<div className="form-group">
  <label>
    Enable Sequential Unlock Mode
    <span title="When enabled, questions unlock one at a time">ℹ️</span>
  </label>
  <div>
    <label>
      <input type="radio" checked={data.sequentialUnlock === true} />
      ✅ Yes
    </label>
    <label>
      <input type="radio" checked={data.sequentialUnlock === false} />
      No
    </label>
  </div>
</div>
```

#### 2. Quiz Taking (QuizTaker.js)
```javascript
// State for tracking unlocked questions
const [unlockedQuestions, setUnlockedQuestions] = useState([0]);

// Initialize based on quiz settings
if (data.sequential_unlock_enabled) {
  setUnlockedQuestions([0]);  // Only first question
} else {
  setUnlockedQuestions(data.questions.map((_, i) => i));  // All questions
}

// Unlock next question on correct answer
if (quiz.sequential_unlock_enabled && currentQuestion < quiz.questions.length - 1) {
  const nextQuestion = currentQuestion + 1;
  if (!unlockedQuestions.includes(nextQuestion)) {
    setUnlockedQuestions([...unlockedQuestions, nextQuestion]);
  }
}
```

### Backend Routes

#### Quiz Creation
```javascript
// POST /api/quiz/create
const quiz = new Quiz({
  // ... other fields
  sequential_unlock_enabled: sequential_unlock_enabled !== undefined 
    ? sequential_unlock_enabled 
    : true
});
```

#### Answer Checking with Validation
```javascript
// POST /api/quiz/:link/check
if (quiz.sequential_unlock_enabled && unlockedQuestions) {
  if (!unlockedQuestions.includes(questionIndex)) {
    console.error('Sequence violation: Question', questionIndex, 'is locked');
    return res.status(403).json({ 
      error: 'Question is locked. Complete previous questions first.' 
    });
  }
}
```

## Visual Design

### Question Progress Indicator
```
┌─────────────────────────────────────┐
│ Question Progress:                  │
│ [1] [2] [🔒] [🔒] [🔒]             │
│  ✓  →   locked                      │
└─────────────────────────────────────┘
```

### States:
- **Unlocked & Current**: Blue border, white background
- **Unlocked & Answered**: Green background, white text
- **Locked**: Gray background, lock icon 🔒
- **Hover**: Tooltip shows status

### Locked Question Overlay
```
┌─────────────────────────────────────┐
│           🔒                        │
│     Question Locked                 │
│  Complete the previous question     │
│  correctly to unlock this one       │
└─────────────────────────────────────┘
```

## Testing

### Test Scenarios

1. **Sequential Mode Enabled**
   - ✅ First question unlocked by default
   - ✅ Subsequent questions locked
   - ✅ Correct answer unlocks next question
   - ✅ Incorrect answer keeps questions locked
   - ✅ Cannot skip to locked questions

2. **Sequential Mode Disabled**
   - ✅ All questions unlocked immediately
   - ✅ Can navigate freely between questions
   - ✅ No unlock progression needed

3. **Edge Cases**
   - ✅ Empty quiz (0 questions)
   - ✅ Single question quiz
   - ✅ Last question (no next to unlock)

4. **Persistence**
   - ✅ Setting saved with quiz
   - ✅ Setting retrieved correctly
   - ✅ Default value applied when not specified

### Running Tests

```bash
# Run the test script
node test-sequential-unlock.js
```

Expected output:
```
✅ Connected to MongoDB
📝 Test 1: Creating quiz with sequential unlock enabled...
✅ Quiz created with sequential_unlock_enabled: true
📝 Test 2: Creating quiz with sequential unlock disabled...
✅ Quiz created with sequential_unlock_enabled: false
...
✅ All tests passed!
```

## Usage Examples

### Creating a Sequential Quiz

1. Navigate to Quiz Creator
2. Fill in quiz details
3. Under "Enable Sequential Unlock Mode", select "✅ Yes"
4. Add questions
5. Publish quiz

### Taking a Sequential Quiz

1. Start quiz with team name
2. Answer first question (only one unlocked)
3. Submit correct answer
4. See unlock notification: "✅ Correct! Moving to next question..."
5. Next question automatically unlocks
6. Progress indicator updates
7. Continue until all questions completed

### Creating a Non-Sequential Quiz

1. Navigate to Quiz Creator
2. Fill in quiz details
3. Under "Enable Sequential Unlock Mode", select "No"
4. Add questions
5. Publish quiz
6. All questions accessible immediately during quiz

## API Reference

### Create Quiz
```http
POST /api/quiz/create
Content-Type: application/json

{
  "title": "My Quiz",
  "description": "Quiz description",
  "totalTimeMinutes": 30,
  "sequential_unlock_enabled": true,
  "questions": [...]
}
```

### Get Quiz (Public)
```http
GET /api/quiz/:link

Response:
{
  "quiz": {
    "_id": "...",
    "title": "...",
    "sequential_unlock_enabled": true,
    "questions": [...]
  }
}
```

### Check Answer
```http
POST /api/quiz/:link/check
Content-Type: application/json

{
  "questionIndex": 0,
  "answer": "user answer",
  "unlockedQuestions": [0, 1]
}

Response (Success):
{
  "correct": true
}

Response (Locked):
{
  "error": "Question is locked. Complete previous questions first."
}
```

## Troubleshooting

### Issue: Questions not unlocking
**Solution**: Check that correct answers are being submitted and validated

### Issue: All questions unlocked immediately
**Solution**: Verify `sequential_unlock_enabled` is set to `true` in quiz settings

### Issue: Sequence violation errors
**Solution**: Check browser console for logged violations, ensure frontend state matches backend

### Issue: Default value not applied
**Solution**: Verify Quiz model schema has default value set to `true`

## Future Enhancements

Potential improvements:
- Partial unlocking (unlock multiple questions at once)
- Time-based unlocking
- Point-threshold unlocking
- Hint system for locked questions
- Analytics on unlock patterns

## Support

For issues or questions:
1. Check browser console for errors
2. Review backend logs for sequence violations
3. Run test script to verify database schema
4. Refer to this documentation

## Changelog

### Version 1.0.0
- Initial implementation
- Sequential unlock toggle in quiz creation
- Visual progress indicator
- Backend validation
- Comprehensive testing
- Documentation
