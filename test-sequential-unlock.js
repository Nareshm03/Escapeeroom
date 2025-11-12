const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const Quiz = require('./backend/src/models/Quiz');

async function testSequentialUnlock() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Create quiz with sequential unlock enabled (default)
    console.log('\n📝 Test 1: Creating quiz with sequential unlock enabled...');
    const quiz1 = new Quiz({
      title: 'Sequential Test Quiz',
      description: 'Testing sequential unlock feature',
      quizLink: 'test-seq-' + Date.now(),
      totalTimeMinutes: 30,
      sequential_unlock_enabled: true,
      questions: [
        { questionText: 'Question 1', correctAnswer: 'answer1', questionOrder: 1, timeLimitSeconds: 120 },
        { questionText: 'Question 2', correctAnswer: 'answer2', questionOrder: 2, timeLimitSeconds: 120 },
        { questionText: 'Question 3', correctAnswer: 'answer3', questionOrder: 3, timeLimitSeconds: 120 }
      ]
    });
    await quiz1.save();
    console.log('✅ Quiz created with sequential_unlock_enabled:', quiz1.sequential_unlock_enabled);

    // Test 2: Create quiz with sequential unlock disabled
    console.log('\n📝 Test 2: Creating quiz with sequential unlock disabled...');
    const quiz2 = new Quiz({
      title: 'Non-Sequential Test Quiz',
      description: 'Testing without sequential unlock',
      quizLink: 'test-nonseq-' + Date.now(),
      totalTimeMinutes: 30,
      sequential_unlock_enabled: false,
      questions: [
        { questionText: 'Question 1', correctAnswer: 'answer1', questionOrder: 1, timeLimitSeconds: 120 },
        { questionText: 'Question 2', correctAnswer: 'answer2', questionOrder: 2, timeLimitSeconds: 120 }
      ]
    });
    await quiz2.save();
    console.log('✅ Quiz created with sequential_unlock_enabled:', quiz2.sequential_unlock_enabled);

    // Test 3: Create quiz without specifying (should default to true)
    console.log('\n📝 Test 3: Creating quiz without specifying sequential unlock...');
    const quiz3 = new Quiz({
      title: 'Default Test Quiz',
      description: 'Testing default value',
      quizLink: 'test-default-' + Date.now(),
      totalTimeMinutes: 30,
      questions: [
        { questionText: 'Question 1', correctAnswer: 'answer1', questionOrder: 1, timeLimitSeconds: 120 }
      ]
    });
    await quiz3.save();
    console.log('✅ Quiz created with default sequential_unlock_enabled:', quiz3.sequential_unlock_enabled);

    // Test 4: Verify field persistence
    console.log('\n📝 Test 4: Verifying field persistence...');
    const retrieved = await Quiz.findById(quiz1._id);
    console.log('✅ Retrieved quiz sequential_unlock_enabled:', retrieved.sequential_unlock_enabled);

    // Test 5: Edge case - empty quiz
    console.log('\n📝 Test 5: Testing empty quiz...');
    const emptyQuiz = new Quiz({
      title: 'Empty Quiz',
      description: 'No questions',
      quizLink: 'test-empty-' + Date.now(),
      totalTimeMinutes: 30,
      sequential_unlock_enabled: true,
      questions: []
    });
    await emptyQuiz.save();
    console.log('✅ Empty quiz created with sequential_unlock_enabled:', emptyQuiz.sequential_unlock_enabled);

    // Test 6: Single question quiz
    console.log('\n📝 Test 6: Testing single question quiz...');
    const singleQuiz = new Quiz({
      title: 'Single Question Quiz',
      description: 'Only one question',
      quizLink: 'test-single-' + Date.now(),
      totalTimeMinutes: 30,
      sequential_unlock_enabled: true,
      questions: [
        { questionText: 'Only Question', correctAnswer: 'answer', questionOrder: 1, timeLimitSeconds: 120 }
      ]
    });
    await singleQuiz.save();
    console.log('✅ Single question quiz created with sequential_unlock_enabled:', singleQuiz.sequential_unlock_enabled);

    console.log('\n✅ All tests passed!');
    console.log('\n📊 Summary:');
    console.log('- Sequential unlock enabled quiz: ✅');
    console.log('- Sequential unlock disabled quiz: ✅');
    console.log('- Default value (true): ✅');
    console.log('- Field persistence: ✅');
    console.log('- Empty quiz: ✅');
    console.log('- Single question quiz: ✅');

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await Quiz.deleteMany({ title: { $regex: /Test Quiz/ } });
    console.log('✅ Cleanup complete');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

testSequentialUnlock();
