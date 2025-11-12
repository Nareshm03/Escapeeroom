const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const BASE_URL = 'http://localhost:5000';
const Quiz = require('./backend/src/models/Quiz');

let testQuizId = null;
let testQuizLink = null;

async function testDatabaseConnection() {
  console.log('\n🔌 TEST 1: Database Connection');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testQuizCreationAPI() {
  console.log('\n🔌 TEST 2: Quiz Creation API (Sequential Enabled)');
  try {
    const response = await axios.post(`${BASE_URL}/api/quiz/create`, {
      title: 'Integration Test Quiz - Sequential',
      description: 'Testing sequential unlock',
      totalTimeMinutes: 30,
      sequential_unlock_enabled: true,
      questions: [
        { question: 'Q1', answer: 'A1', timeLimit: 120 },
        { question: 'Q2', answer: 'A2', timeLimit: 120 },
        { question: 'Q3', answer: 'A3', timeLimit: 120 }
      ]
    });
    
    testQuizId = response.data.quiz._id;
    testQuizLink = response.data.quiz.quizLink;
    console.log('✅ Quiz created:', testQuizId);
    console.log('✅ Sequential unlock enabled:', response.data.quiz.sequential_unlock_enabled);
    return response.data.quiz.sequential_unlock_enabled === true;
  } catch (error) {
    console.error('❌ Quiz creation failed:', error.response?.data || error.message);
    return false;
  }
}

async function testQuizCreationNonSequential() {
  console.log('\n🔌 TEST 3: Quiz Creation API (Sequential Disabled)');
  try {
    const response = await axios.post(`${BASE_URL}/api/quiz/create`, {
      title: 'Integration Test Quiz - Non-Sequential',
      description: 'Testing without sequential unlock',
      totalTimeMinutes: 30,
      sequential_unlock_enabled: false,
      questions: [
        { question: 'Q1', answer: 'A1', timeLimit: 120 },
        { question: 'Q2', answer: 'A2', timeLimit: 120 }
      ]
    });
    
    console.log('✅ Quiz created with sequential disabled');
    console.log('✅ Sequential unlock disabled:', response.data.quiz.sequential_unlock_enabled === false);
    return response.data.quiz.sequential_unlock_enabled === false;
  } catch (error) {
    console.error('❌ Quiz creation failed:', error.response?.data || error.message);
    return false;
  }
}

async function testPublishAPI() {
  console.log('\n🔌 TEST 4: Quiz Publishing API');
  try {
    const response = await axios.post(`${BASE_URL}/api/quiz/${testQuizId}/publish`);
    console.log('✅ Quiz published:', response.data.quizLink);
    return response.data.quizLink === testQuizLink;
  } catch (error) {
    console.error('❌ Quiz publishing failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetQuizAPI() {
  console.log('\n🔌 TEST 5: Get Quiz API (Public)');
  try {
    const response = await axios.get(`${BASE_URL}/api/quiz/${testQuizLink}`);
    const quiz = response.data.quiz;
    
    console.log('✅ Quiz retrieved');
    console.log('✅ Sequential field present:', quiz.sequential_unlock_enabled !== undefined);
    console.log('✅ Sequential value:', quiz.sequential_unlock_enabled);
    console.log('✅ Questions count:', quiz.questions.length);
    
    return quiz.sequential_unlock_enabled === true && quiz.questions.length === 3;
  } catch (error) {
    console.error('❌ Get quiz failed:', error.response?.data || error.message);
    return false;
  }
}

async function testAnswerCheckValid() {
  console.log('\n🔌 TEST 6: Answer Check API (Valid Sequence)');
  try {
    const response = await axios.post(`${BASE_URL}/api/quiz/${testQuizLink}/check`, {
      questionIndex: 0,
      answer: 'A1',
      unlockedQuestions: [0]
    });
    
    console.log('✅ Answer checked');
    console.log('✅ Correct answer:', response.data.correct);
    return response.data.correct === true;
  } catch (error) {
    console.error('❌ Answer check failed:', error.response?.data || error.message);
    return false;
  }
}

async function testAnswerCheckInvalid() {
  console.log('\n🔌 TEST 7: Answer Check API (Invalid Sequence)');
  try {
    await axios.post(`${BASE_URL}/api/quiz/${testQuizLink}/check`, {
      questionIndex: 2,
      answer: 'A3',
      unlockedQuestions: [0]
    });
    
    console.error('❌ Should have rejected locked question');
    return false;
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✅ Correctly rejected locked question');
      console.log('✅ Error message:', error.response.data.error);
      return true;
    }
    console.error('❌ Wrong error type:', error.response?.data || error.message);
    return false;
  }
}

async function testDataPersistence() {
  console.log('\n🔌 TEST 8: Data Persistence');
  try {
    const quiz = await Quiz.findById(testQuizId);
    console.log('✅ Quiz retrieved from DB');
    console.log('✅ Sequential field persisted:', quiz.sequential_unlock_enabled);
    console.log('✅ Questions persisted:', quiz.questions.length);
    return quiz.sequential_unlock_enabled === true && quiz.questions.length === 3;
  } catch (error) {
    console.error('❌ Data persistence check failed:', error.message);
    return false;
  }
}

async function testDefaultValue() {
  console.log('\n🔌 TEST 9: Default Value');
  try {
    const quiz = new Quiz({
      title: 'Default Test',
      quizLink: 'test-default-' + Date.now(),
      questions: [{ questionText: 'Q1', correctAnswer: 'A1', questionOrder: 1 }]
    });
    await quiz.save();
    
    console.log('✅ Quiz created without specifying sequential field');
    console.log('✅ Default value applied:', quiz.sequential_unlock_enabled);
    
    await Quiz.findByIdAndDelete(quiz._id);
    return quiz.sequential_unlock_enabled === true;
  } catch (error) {
    console.error('❌ Default value test failed:', error.message);
    return false;
  }
}

async function testEdgeCaseEmpty() {
  console.log('\n🔌 TEST 10: Edge Case - Empty Quiz');
  try {
    const response = await axios.post(`${BASE_URL}/api/quiz/create`, {
      title: 'Empty Quiz Test',
      description: 'No questions',
      totalTimeMinutes: 30,
      sequential_unlock_enabled: true,
      questions: []
    });
    
    console.log('✅ Empty quiz created');
    console.log('✅ Sequential field saved:', response.data.quiz.sequential_unlock_enabled);
    return true;
  } catch (error) {
    console.error('❌ Empty quiz test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testEdgeCaseSingle() {
  console.log('\n🔌 TEST 11: Edge Case - Single Question');
  try {
    const response = await axios.post(`${BASE_URL}/api/quiz/create`, {
      title: 'Single Question Test',
      description: 'One question',
      totalTimeMinutes: 30,
      sequential_unlock_enabled: true,
      questions: [{ question: 'Q1', answer: 'A1', timeLimit: 120 }]
    });
    
    console.log('✅ Single question quiz created');
    console.log('✅ Sequential field saved:', response.data.quiz.sequential_unlock_enabled);
    return true;
  } catch (error) {
    console.error('❌ Single question test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testQuizSubmission() {
  console.log('\n🔌 TEST 12: Quiz Submission');
  try {
    const response = await axios.post(`${BASE_URL}/api/quiz/${testQuizLink}/submit`, {
      teamName: 'Test Team',
      answers: ['A1', 'A2', 'A3'],
      startTime: new Date()
    });
    
    console.log('✅ Quiz submitted');
    console.log('✅ Score:', response.data.score, '/', response.data.total);
    return response.data.score === 3 && response.data.total === 3;
  } catch (error) {
    console.error('❌ Quiz submission failed:', error.response?.data || error.message);
    return false;
  }
}

async function cleanup() {
  console.log('\n🧹 Cleanup');
  try {
    await Quiz.deleteMany({ title: { $regex: /Integration Test|Empty Quiz|Single Question|Default Test/ } });
    console.log('✅ Test data cleaned up');
  } catch (error) {
    console.error('⚠️ Cleanup warning:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Sequential Unlock Integration Tests\n');
  console.log('=' .repeat(60));
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  const tests = [
    { name: 'Database Connection', fn: testDatabaseConnection },
    { name: 'Quiz Creation (Sequential)', fn: testQuizCreationAPI },
    { name: 'Quiz Creation (Non-Sequential)', fn: testQuizCreationNonSequential },
    { name: 'Quiz Publishing', fn: testPublishAPI },
    { name: 'Get Quiz API', fn: testGetQuizAPI },
    { name: 'Answer Check (Valid)', fn: testAnswerCheckValid },
    { name: 'Answer Check (Invalid)', fn: testAnswerCheckInvalid },
    { name: 'Data Persistence', fn: testDataPersistence },
    { name: 'Default Value', fn: testDefaultValue },
    { name: 'Edge Case - Empty', fn: testEdgeCaseEmpty },
    { name: 'Edge Case - Single', fn: testEdgeCaseSingle },
    { name: 'Quiz Submission', fn: testQuizSubmission }
  ];
  
  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.tests.push({ name: test.name, passed });
      if (passed) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      console.error(`❌ Test "${test.name}" threw error:`, error.message);
      results.tests.push({ name: test.name, passed: false });
      results.failed++;
    }
  }
  
  await cleanup();
  await mongoose.connection.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  results.tests.forEach((test, i) => {
    console.log(`${i + 1}. ${test.passed ? '✅' : '❌'} ${test.name}`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${results.tests.length} | Passed: ${results.passed} | Failed: ${results.failed}`);
  console.log('='.repeat(60));
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Integration is successful.');
  } else {
    console.log(`\n⚠️ ${results.failed} TEST(S) FAILED. Please review and fix.`);
  }
  
  process.exit(results.failed > 0 ? 1 : 0);
}

// Check if server is running
axios.get(`${BASE_URL}/api/system/health`)
  .then(() => {
    console.log('✅ Backend server is running\n');
    runAllTests();
  })
  .catch(() => {
    console.error('❌ Backend server is not running!');
    console.error('Please start the backend server first: cd backend && npm run dev');
    process.exit(1);
  });
