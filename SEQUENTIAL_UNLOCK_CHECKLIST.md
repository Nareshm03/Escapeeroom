# Sequential Unlock - Verification Checklist

Use this checklist to verify the Sequential Unlock feature is working correctly.

## 🔧 Backend Verification

### Database Schema
- [ ] Open `backend/src/models/Quiz.js`
- [ ] Verify `sequential_unlock_enabled` field exists
- [ ] Verify default value is `true`
- [ ] Verify type is `Boolean`

### API Routes
- [ ] Open `backend/src/routes/quiz.js`
- [ ] Verify quiz creation handles `sequential_unlock_enabled`
- [ ] Verify answer check validates sequence
- [ ] Verify public quiz response includes field
- [ ] Verify sequence violations are logged

### Test Database
```bash
node test-sequential-unlock.js
```
- [ ] All tests pass
- [ ] Sequential enabled quiz created
- [ ] Sequential disabled quiz created
- [ ] Default value applied correctly
- [ ] Field persists correctly

## 🎨 Frontend Verification

### Quiz Creation Forms

#### QuizInfoStep.js
- [ ] Open `frontend/src/components/QuizInfoStep.js`
- [ ] Verify toggle exists with label "Enable Sequential Unlock Mode"
- [ ] Verify tooltip (ℹ️) is present
- [ ] Verify radio buttons: "✅ Yes" and "No"
- [ ] Verify helper text is displayed

#### QuizWizard3Step.js
- [ ] Open `frontend/src/components/QuizWizard3Step.js`
- [ ] Verify `sequentialUnlock` in initial state (default: true)
- [ ] Verify toggle in Step 1
- [ ] Verify display in Review step

#### QuizCreator.js
- [ ] Open `frontend/src/pages/QuizCreator.js`
- [ ] Verify `sequential_unlock_enabled` in initial state (default: true)
- [ ] Verify toggle in form
- [ ] Verify field sent in API request

### Quiz Taking

#### QuizTaker.js
- [ ] Open `frontend/src/pages/QuizTaker.js`
- [ ] Verify `unlockedQuestions` state exists
- [ ] Verify initialization logic (first question or all)
- [ ] Verify unlock logic on correct answer
- [ ] Verify progress indicator component
- [ ] Verify locked question overlay
- [ ] Verify navigation buttons
- [ ] Verify backend validation call
- [ ] Verify 403 error handling

## 🧪 Manual Testing

### Test 1: Create Sequential Quiz
1. [ ] Navigate to Quiz Creator
2. [ ] Fill in title and description
3. [ ] Verify "Enable Sequential Unlock Mode" toggle is visible
4. [ ] Verify "✅ Yes" is selected by default
5. [ ] Hover over ℹ️ icon - tooltip appears
6. [ ] Add 3+ questions
7. [ ] Create quiz
8. [ ] Verify quiz created successfully

### Test 2: Create Non-Sequential Quiz
1. [ ] Navigate to Quiz Creator
2. [ ] Fill in title and description
3. [ ] Select "No" for sequential unlock
4. [ ] Add 3+ questions
5. [ ] Create quiz
6. [ ] Verify quiz created successfully

### Test 3: Take Sequential Quiz
1. [ ] Open sequential quiz link
2. [ ] Enter team name and start
3. [ ] Verify only Question 1 is unlocked
4. [ ] Verify progress indicator shows: `[1] [🔒] [🔒]`
5. [ ] Verify other questions show lock overlay
6. [ ] Answer Question 1 incorrectly
7. [ ] Verify error message: "❌ Incorrect answer. Try again!"
8. [ ] Verify Question 2 still locked
9. [ ] Answer Question 1 correctly
10. [ ] Verify success message: "✅ Correct! Moving to next question..."
11. [ ] Verify Question 2 unlocks
12. [ ] Verify progress indicator updates: `[✓] [2] [🔒]`
13. [ ] Try clicking locked Question 3
14. [ ] Verify it's disabled/shows lock overlay
15. [ ] Complete all questions
16. [ ] Verify quiz submission works

### Test 4: Take Non-Sequential Quiz
1. [ ] Open non-sequential quiz link
2. [ ] Enter team name and start
3. [ ] Verify all questions are unlocked
4. [ ] Verify no progress indicator (or all unlocked)
5. [ ] Verify can navigate freely between questions
6. [ ] Complete quiz
7. [ ] Verify submission works

### Test 5: Edge Cases

#### Empty Quiz
1. [ ] Create quiz with 0 questions
2. [ ] Verify no errors
3. [ ] Verify sequential setting saved

#### Single Question Quiz
1. [ ] Create quiz with 1 question
2. [ ] Take quiz
3. [ ] Verify question is unlocked
4. [ ] Answer correctly
5. [ ] Verify no unlock attempt for non-existent next question
6. [ ] Verify submission works

#### Last Question
1. [ ] Take sequential quiz
2. [ ] Progress to last question
3. [ ] Answer correctly
4. [ ] Verify no unlock attempt
5. [ ] Verify submission proceeds

## 🔒 Security Testing

### Sequence Violation
1. [ ] Open browser console
2. [ ] Take sequential quiz
3. [ ] Attempt to manually call API for locked question
4. [ ] Verify 403 error returned
5. [ ] Verify error message: "Question is locked..."
6. [ ] Check backend logs for violation log

### State Tampering
1. [ ] Open React DevTools
2. [ ] Attempt to modify `unlockedQuestions` state
3. [ ] Submit answer for "unlocked" question
4. [ ] Verify backend rejects if not actually unlocked

## 📱 Responsive Testing

### Desktop
- [ ] Quiz creation form displays correctly
- [ ] Progress indicator displays correctly
- [ ] Lock overlay displays correctly
- [ ] Navigation buttons display correctly

### Tablet
- [ ] All elements responsive
- [ ] Touch interactions work
- [ ] Layout adapts appropriately

### Mobile
- [ ] Toggle accessible and usable
- [ ] Progress indicator wraps correctly
- [ ] Lock overlay readable
- [ ] Navigation buttons accessible

## 🎯 Integration Testing

### With Existing Features
- [ ] Works with time limits
- [ ] Works with settings (page titles, progress bar, etc.)
- [ ] Works with quiz publishing
- [ ] Works with results submission
- [ ] Works with leaderboard
- [ ] Doesn't break existing quizzes

### Browser Compatibility
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## 📊 Performance Testing

- [ ] No noticeable lag when unlocking questions
- [ ] State updates smoothly
- [ ] No memory leaks
- [ ] API calls complete quickly

## 📚 Documentation Verification

- [ ] README.md updated with feature
- [ ] SEQUENTIAL_UNLOCK_GUIDE.md exists and complete
- [ ] SEQUENTIAL_UNLOCK_QUICK_START.md exists and complete
- [ ] SEQUENTIAL_UNLOCK_IMPLEMENTATION.md exists and complete
- [ ] Code comments added where necessary
- [ ] API documented

## ✅ Final Verification

- [ ] All backend changes committed
- [ ] All frontend changes committed
- [ ] All documentation committed
- [ ] Test file committed
- [ ] No console errors
- [ ] No backend errors
- [ ] Feature works end-to-end
- [ ] Ready for production

## 🐛 Known Issues

Document any issues found during testing:

1. _None identified_

## 📝 Notes

Additional observations or comments:

---

**Verification Date**: _____________

**Verified By**: _____________

**Status**: ⬜ Pending | ⬜ In Progress | ⬜ Complete

**Sign-off**: _____________
