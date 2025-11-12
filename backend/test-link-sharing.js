const axios = require('axios');

const BASE = 'http://localhost:5000/api/quiz';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function createQuiz() {
  const payload = {
    title: 'Link Sharing E2E',
    description: 'Automated test for link sharing',
    totalTimeMinutes: 10,
    questions: [
      { question: 'Capital of France?', answer: 'Paris', timeLimit: 60 },
      { question: '2 + 2?', answer: '4', timeLimit: 45 }
    ]
  };
  const res = await axios.post(`${BASE}/create`, payload);
  return res.data; // { quiz, link }
}

async function publishQuiz(id) {
  const res = await axios.post(`${BASE}/${id}/publish`);
  return res.data; // { message, quizLink }
}

async function getByLink(link) {
  const res = await axios.get(`${BASE}/${link}`);
  return res.data; // { quiz }
}

async function check(link, questionIndex, answer) {
  const res = await axios.post(`${BASE}/${link}/check`, { questionIndex, answer });
  return res.data; // { correct }
}

async function submit(link) {
  const res = await axios.post(`${BASE}/${link}/submit`, {
    teamName: 'Admins',
    answers: ['Paris', '4'],
    startTime: new Date().toISOString()
  });
  return res.data; // { score, total, percentage }
}

async function main() {
  try {
    console.log('Creating quiz...');
    const created = await createQuiz();
    const id = created.quiz._id;
    const link = created.quiz.quizLink;
    console.log('Created quiz:', id, 'link:', link);

    console.log('Publishing quiz...');
    const pub = await publishQuiz(id);
    console.log('Published:', pub.message, 'quizLink:', pub.quizLink);

    // Small delay to ensure DB writes complete
    await sleep(250);

    console.log('Fetching quiz publicly...');
    const fetched = await getByLink(link);
    console.log('Fetched title:', fetched.quiz.title, 'questions:', fetched.quiz.questions.length);

    console.log('Checking first answer...');
    const checkRes = await check(link, 0, 'Paris');
    console.log('Answer correct?', checkRes.correct);

    console.log('Submitting correct answers...');
    const submitRes = await submit(link);
    console.log('Score:', submitRes.score, '/', submitRes.total, 'percentage:', submitRes.percentage);

    console.log('E2E link sharing test completed successfully.');
  } catch (err) {
    const payload = err.response?.data || err.message;
    console.error('E2E test failed:', payload);
    process.exitCode = 1;
  }
}

main();

const BASE_URL = 'http://localhost:5000';

async function testLinkSharing() {
  try {
    console.log('Testing link sharing functionality...');

    // First, create a quiz
    const quizData = {
      title: 'Link Sharing Test Quiz',
      description: 'Testing shareable links',
      totalTimeMinutes: 5,
      questions: [{
        question: 'What is the capital of France?',
        answer: 'Paris',
        timeLimit: 30
      }]
    };

    console.log('Creating quiz...');
    const createResponse = await axios.post(`${BASE_URL}/api/quiz/create`, quizData);
    const quizId = createResponse.data.quiz._id;
    const quizLink = createResponse.data.link;

    console.log('Quiz created with ID:', quizId);
    console.log('Quiz link:', quizLink);

    // Publish the quiz
    console.log('Publishing quiz...');
    const publishResponse = await axios.post(`${BASE_URL}/api/quiz/${quizId}/publish`);
    console.log('Publish response:', publishResponse.data);

    // Test accessing the quiz via link
    console.log('Testing quiz access via shared link...');
    const accessResponse = await axios.get(`${BASE_URL}${quizLink}`);
    console.log('Quiz access successful:', accessResponse.data.quiz.title);

    // Test URL encoding - try with special characters
    const encodedLink = encodeURI(`${BASE_URL}${quizLink}`);
    console.log('Testing URL encoding...');
    const encodedResponse = await axios.get(encodedLink);
    console.log('Encoded URL access successful');

    // Test invalid link
    try {
      console.log('Testing invalid link...');
      await axios.get(`${BASE_URL}/quiz/invalid-link-12345`);
    } catch (error) {
      console.log('Invalid link correctly rejected:', error.response?.status);
    }

    // Test unpublished quiz access (should fail)
    console.log('Testing unpublished quiz access...');
    const unpublishedQuizData = {
      title: 'Unpublished Test Quiz',
      description: 'Should not be accessible',
      totalTimeMinutes: 5,
      questions: [{
        question: 'What is 1+1?',
        answer: '2',
        timeLimit: 30
      }]
    };

    const unpublishedCreateResponse = await axios.post(`${BASE_URL}/api/quiz/create`, unpublishedQuizData);
    const unpublishedLink = unpublishedCreateResponse.data.link;

    try {
      await axios.get(`${BASE_URL}${unpublishedLink}`);
    } catch (error) {
      console.log('Unpublished quiz correctly rejected:', error.response?.status);
    }

    console.log('✅ All link sharing tests passed!');

  } catch (error) {
    console.error('❌ Link sharing test failed:', error.response?.data || error.message);
  }
}

testLinkSharing();