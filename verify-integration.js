const fs = require('fs');
const path = require('path');

console.log('🔍 Sequential Unlock - Integration Verification\n');
console.log('='.repeat(60));

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// Check 1: Backend Model
console.log('\n📦 CHECK 1: Backend Model (Quiz.js)');
try {
  const modelPath = path.join(__dirname, 'backend', 'src', 'models', 'Quiz.js');
  const modelContent = fs.readFileSync(modelPath, 'utf8');
  
  if (modelContent.includes('sequential_unlock_enabled')) {
    console.log('✅ Field "sequential_unlock_enabled" found in model');
    checks.passed++;
  } else {
    console.log('❌ Field "sequential_unlock_enabled" NOT found in model');
    checks.failed++;
  }
  
  if (modelContent.includes('default: true')) {
    console.log('✅ Default value set to true');
    checks.passed++;
  } else {
    console.log('⚠️ Default value may not be set correctly');
    checks.warnings++;
  }
} catch (error) {
  console.log('❌ Error reading model file:', error.message);
  checks.failed++;
}

// Check 2: Backend Routes
console.log('\n📦 CHECK 2: Backend Routes (quiz.js)');
try {
  const routesPath = path.join(__dirname, 'backend', 'src', 'routes', 'quiz.js');
  const routesContent = fs.readFileSync(routesPath, 'utf8');
  
  if (routesContent.includes('sequential_unlock_enabled')) {
    console.log('✅ Field handled in quiz creation route');
    checks.passed++;
  } else {
    console.log('❌ Field NOT handled in quiz creation route');
    checks.failed++;
  }
  
  if (routesContent.includes('unlockedQuestions')) {
    console.log('✅ Sequence validation implemented');
    checks.passed++;
  } else {
    console.log('❌ Sequence validation NOT implemented');
    checks.failed++;
  }
  
  if (routesContent.includes('403')) {
    console.log('✅ 403 error handling for locked questions');
    checks.passed++;
  } else {
    console.log('⚠️ 403 error handling may be missing');
    checks.warnings++;
  }
} catch (error) {
  console.log('❌ Error reading routes file:', error.message);
  checks.failed++;
}

// Check 3: Frontend - QuizInfoStep
console.log('\n📦 CHECK 3: Frontend - QuizInfoStep.js');
try {
  const componentPath = path.join(__dirname, 'frontend', 'src', 'components', 'QuizInfoStep.js');
  const componentContent = fs.readFileSync(componentPath, 'utf8');
  
  if (componentContent.includes('Enable Sequential Unlock Mode')) {
    console.log('✅ Toggle label found');
    checks.passed++;
  } else {
    console.log('❌ Toggle label NOT found');
    checks.failed++;
  }
  
  if (componentContent.includes('sequentialUnlock')) {
    console.log('✅ Sequential unlock field in component');
    checks.passed++;
  } else {
    console.log('❌ Sequential unlock field NOT in component');
    checks.failed++;
  }
  
  if (componentContent.includes('radio')) {
    console.log('✅ Radio buttons implemented');
    checks.passed++;
  } else {
    console.log('❌ Radio buttons NOT implemented');
    checks.failed++;
  }
} catch (error) {
  console.log('❌ Error reading QuizInfoStep file:', error.message);
  checks.failed++;
}

// Check 4: Frontend - QuizWizard3Step
console.log('\n📦 CHECK 4: Frontend - QuizWizard3Step.js');
try {
  const wizardPath = path.join(__dirname, 'frontend', 'src', 'components', 'QuizWizard3Step.js');
  const wizardContent = fs.readFileSync(wizardPath, 'utf8');
  
  if (wizardContent.includes('sequentialUnlock: true')) {
    console.log('✅ Default value set in state');
    checks.passed++;
  } else {
    console.log('❌ Default value NOT set in state');
    checks.failed++;
  }
  
  if (wizardContent.includes('Enable Sequential Unlock Mode')) {
    console.log('✅ Toggle added to wizard');
    checks.passed++;
  } else {
    console.log('❌ Toggle NOT added to wizard');
    checks.failed++;
  }
} catch (error) {
  console.log('❌ Error reading QuizWizard3Step file:', error.message);
  checks.failed++;
}

// Check 5: Frontend - QuizCreator
console.log('\n📦 CHECK 5: Frontend - QuizCreator.js');
try {
  const creatorPath = path.join(__dirname, 'frontend', 'src', 'pages', 'QuizCreator.js');
  const creatorContent = fs.readFileSync(creatorPath, 'utf8');
  
  if (creatorContent.includes('sequential_unlock_enabled')) {
    console.log('✅ Field in QuizCreator state');
    checks.passed++;
  } else {
    console.log('❌ Field NOT in QuizCreator state');
    checks.failed++;
  }
  
  if (creatorContent.includes('Enable Sequential Unlock Mode')) {
    console.log('✅ Toggle added to creator form');
    checks.passed++;
  } else {
    console.log('❌ Toggle NOT added to creator form');
    checks.failed++;
  }
} catch (error) {
  console.log('❌ Error reading QuizCreator file:', error.message);
  checks.failed++;
}

// Check 6: Frontend - QuizTaker
console.log('\n📦 CHECK 6: Frontend - QuizTaker.js');
try {
  const takerPath = path.join(__dirname, 'frontend', 'src', 'pages', 'QuizTaker.js');
  const takerContent = fs.readFileSync(takerPath, 'utf8');
  
  if (takerContent.includes('unlockedQuestions')) {
    console.log('✅ Unlocked questions state tracking');
    checks.passed++;
  } else {
    console.log('❌ Unlocked questions state NOT tracked');
    checks.failed++;
  }
  
  if (takerContent.includes('sequential_unlock_enabled')) {
    console.log('✅ Sequential mode check implemented');
    checks.passed++;
  } else {
    console.log('❌ Sequential mode check NOT implemented');
    checks.failed++;
  }
  
  if (takerContent.includes('Question Locked')) {
    console.log('✅ Lock overlay implemented');
    checks.passed++;
  } else {
    console.log('❌ Lock overlay NOT implemented');
    checks.failed++;
  }
  
  if (takerContent.includes('Question Progress')) {
    console.log('✅ Progress indicator implemented');
    checks.passed++;
  } else {
    console.log('❌ Progress indicator NOT implemented');
    checks.failed++;
  }
} catch (error) {
  console.log('❌ Error reading QuizTaker file:', error.message);
  checks.failed++;
}

// Check 7: Documentation
console.log('\n📦 CHECK 7: Documentation Files');
const docFiles = [
  'SEQUENTIAL_UNLOCK_GUIDE.md',
  'SEQUENTIAL_UNLOCK_QUICK_START.md',
  'SEQUENTIAL_UNLOCK_IMPLEMENTATION.md',
  'SEQUENTIAL_UNLOCK_CHECKLIST.md',
  'TEST_EXECUTION_GUIDE.md'
];

docFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
    checks.passed++;
  } else {
    console.log(`❌ ${file} NOT found`);
    checks.failed++;
  }
});

// Check 8: Test Files
console.log('\n📦 CHECK 8: Test Files');
const testFiles = [
  'test-sequential-unlock.js',
  'test-sequential-integration.js',
  'test-frontend-integration.html',
  'verify-integration.js'
];

testFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
    checks.passed++;
  } else {
    console.log(`❌ ${file} NOT found`);
    checks.failed++;
  }
});

// Check 9: README Updated
console.log('\n📦 CHECK 9: README.md Updated');
try {
  const readmePath = path.join(__dirname, 'README.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  
  if (readmeContent.includes('Sequential Puzzle Unlocking')) {
    console.log('✅ Feature added to README');
    checks.passed++;
  } else {
    console.log('❌ Feature NOT added to README');
    checks.failed++;
  }
} catch (error) {
  console.log('❌ Error reading README:', error.message);
  checks.failed++;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Passed: ${checks.passed}`);
console.log(`❌ Failed: ${checks.failed}`);
console.log(`⚠️ Warnings: ${checks.warnings}`);
console.log('='.repeat(60));

const total = checks.passed + checks.failed;
const percentage = total > 0 ? Math.round((checks.passed / total) * 100) : 0;
console.log(`\n📈 Success Rate: ${percentage}%`);

if (checks.failed === 0) {
  console.log('\n🎉 ALL CHECKS PASSED! Integration verified successfully.');
  console.log('\n✅ Next Steps:');
  console.log('1. Start backend: cd backend && npm run dev');
  console.log('2. Start frontend: cd frontend && npm start');
  console.log('3. Run integration tests: node test-sequential-integration.js');
  console.log('4. Open test page: test-frontend-integration.html');
  process.exit(0);
} else {
  console.log(`\n⚠️ ${checks.failed} CHECK(S) FAILED. Please review and fix.`);
  process.exit(1);
}
