import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Automated Production-Ready Tests...');

// Check critical file existence
const criticalFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'src/types.ts',
  'src/index.css',
  'index.html',
  'package.json'
];

let failed = false;

criticalFiles.forEach(file => {
  const filePath = path.resolve(file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ File verified: ${file}`);
  } else {
    console.error(`❌ Critical file missing: ${file}`);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
}

// Run TypeScript type checks
try {
  console.log('🔍 Running TypeScript linter & compiler check...');
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ TypeScript checks passed!');
} catch (error) {
  console.error('❌ TypeScript compilation failed.');
  process.exit(1);
}

// Run build check
try {
  console.log('📦 Running production build validation...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Production build succeeded!');
} catch (error) {
  console.error('❌ Production build failed.');
  process.exit(1);
}

console.log('\n✨ All automated tests passed successfully! Application is production-ready. ✨');
process.exit(0);
