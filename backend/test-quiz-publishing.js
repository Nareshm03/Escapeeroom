const mongoose = require('mongoose');
require('dotenv').config();

const Quiz = require('./src/models/Quiz');

async function testQuizPublishing() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a test quiz
    const testQuiz = new Quiz({
      title: 'Test Quiz for Publishing',
      description: 'Testing publishing functionality',
      quizLink: 'test-publish-' + Date.now(),
      totalTimeMinutes: 10,
      createdBy: null,
      questions: [{
        questionText: 'What is 2+2?',
        correctAnswer: '4',
        questionOrder: 1,
        timeLimitSeconds: 60
      }]
    });

    await testQuiz.save();
    console.log('Test quiz created:', testQuiz._id);

    // Check initial state
    let quiz = await Quiz.findById(testQuiz._id);
    console.log('Initial state - Published:', quiz.isPublished);

    // Publish the quiz
    quiz = await Quiz.findByIdAndUpdate(
      testQuiz._id,
      { isPublished: true },
      { new: true }
    );

    console.log('After publishing - Published:', quiz.isPublished);
    console.log('Quiz link:', quiz.quizLink);

    // Verify quiz is accessible via link
    const foundQuiz = await Quiz.findOne({
      quizLink: quiz.quizLink,
      isPublished: true
    });

    if (foundQuiz) {
      console.log('✅ Quiz successfully found via published link');
    } else {
      console.log('❌ Quiz not found via published link');
    }

    // Clean up
    await Quiz.findByIdAndDelete(testQuiz._id);
    console.log('Test quiz cleaned up');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuizPublishing();
const axios = require('axios');

const BASE = 'http://localhost:5000/api/quiz';

async function createQuiz() {
  const payload = {
    title: 'Publishing Flow E2E',
    description: 'Automated test for publishing flow',
    totalTimeMinutes: 5,
    questions: [
      { question: 'Color of the sky?', answer: 'blue', timeLimit: 30 }
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

async function main() {
  try {
    console.log('Creating quiz...');
    const created = await createQuiz();
    const id = created.quiz._id;
    console.log('Created:', id);

    console.log('Publishing quiz...');
    const pub = await publishQuiz(id);
    console.log('Published:', pub.message, 'quizLink:', pub.quizLink);

    console.log('Verifying public retrieval by link...');
    const fetched = await getByLink(pub.quizLink);
    console.log('Fetched title:', fetched.quiz.title);

    console.log('Publishing flow E2E completed successfully.');
  } catch (err) {
    const payload = err.response?.data || err.message;
    console.error('Publishing flow E2E failed:', payload);
    process.exitCode = 1;
  }
}

main();