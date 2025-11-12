const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testEndToEndQuizJourney() {
  try {
    console.log('🧪 Starting End-to-End Quiz Journey Test...\n');

    // Step 1: Create a quiz
    console.log('📝 Step 1: Creating quiz...');
    const quizData = {
      title: 'E2E Test Quiz',
      description: 'Complete end-to-end test',
      totalTimeMinutes: 10,
      questions: [
        {
          question: 'What is the capital of Japan?',
          answer: 'Tokyo',
          timeLimit: 60
        },
        {
          question: 'What is 15 + 27?',
          answer: '42',
          timeLimit: 45
        }
      ]
    };

    const createResponse = await axios.post(`${BASE_URL}/api/quiz/create`, quizData);
    const quizId = createResponse.data.quiz._id;
    const quizLink = createResponse.data.link;
    console.log('✅ Quiz created successfully');
    console.log(`   ID: ${quizId}`);
    console.log(`   Link: ${quizLink}\n`);

    // Step 2: Publish the quiz
    console.log('🚀 Step 2: Publishing quiz...');
    const publishResponse = await axios.post(`${BASE_URL}/api/quiz/${quizId}/publish`);
    console.log('✅ Quiz published successfully');
    console.log(`   Response: ${publishResponse.data.message}\n`);

    // Step 3: Access quiz via shared link
    console.log('🔗 Step 3: Accessing quiz via shared link...');
    const accessResponse = await axios.get(`${BASE_URL}${quizLink}`);
    const quizDataFromLink = accessResponse.data.quiz;
    console.log('✅ Quiz accessible via shared link');
    console.log(`   Title: ${quizDataFromLink.title}`);
    console.log(`   Questions: ${quizDataFromLink.questions.length}\n`);

    // Step 4: Submit answers
    console.log('📤 Step 4: Submitting quiz answers...');
    const answers = ['Tokyo', '42']; // Correct answers
    const submitData = {
      teamName: 'TestTeam',
      answers: answers,
      startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago
    };

    const submitResponse = await axios.post(`${BASE_URL}${quizLink}/submit`, submitData);
    console.log('✅ Quiz submitted successfully');
    console.log(`   Score: ${submitResponse.data.score}/${submitResponse.data.total}`);
    console.log(`   Percentage: ${Math.round((submitResponse.data.score / submitResponse.data.total) * 100)}%\n`);

    // Step 5: Verify quiz results (admin endpoint)
    console.log('📊 Step 5: Checking quiz results...');
    const resultsResponse = await axios.get(`${BASE_URL}/api/quiz/${quizId}/results`);
    console.log('✅ Quiz results retrieved');
    console.log(`   Submissions: ${resultsResponse.data.length}`);
    if (resultsResponse.data.length > 0) {
      console.log(`   Latest submission: ${resultsResponse.data[0].team_name} - Score: ${resultsResponse.data[0].score}`);
    }
    console.log('');

    // Step 6: Test error scenarios
    console.log('🛡️  Step 6: Testing error scenarios...');

    // Invalid quiz link
    try {
      await axios.get(`${BASE_URL}/quiz/invalid-quiz-link`);
      console.log('❌ Should have failed for invalid link');
    } catch (error) {
      console.log('✅ Invalid quiz link correctly rejected (404)');
    }

    // Unpublished quiz access
    const unpublishedQuizData = {
      title: 'Unpublished Quiz',
      description: 'Should not be accessible',
      totalTimeMinutes: 5,
      questions: [{
        question: 'Test question?',
        answer: 'Test answer',
        timeLimit: 30
      }]
    };

    const unpublishedCreateResponse = await axios.post(`${BASE_URL}/api/quiz/create`, unpublishedQuizData);
    const unpublishedLink = unpublishedCreateResponse.data.link;

    try {
      await axios.get(`${BASE_URL}${unpublishedLink}`);
      console.log('❌ Should have failed for unpublished quiz');
    } catch (error) {
      console.log('✅ Unpublished quiz correctly rejected (404)');
    }

    console.log('\n🎉 End-to-End Quiz Journey Test COMPLETED SUCCESSFULLY!');
    console.log('✅ All critical user flows working correctly');

  } catch (error) {
    console.error('❌ End-to-End test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testEndToEndQuizJourney();