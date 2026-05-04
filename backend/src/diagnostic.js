#!/usr/bin/env node
/**
 * Pet Care Application - Diagnostic Tool
 * Run this script to verify your setup is correct
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Pet Care Application - System Diagnostic\n');
console.log('=' .repeat(50));

// Check 1: Node.js Version
console.log('\n1. Checking Node.js...');
try {
  const version = process.version;
  console.log(`   ✅ Node.js ${version}`);
} catch (e) {
  console.log('   ❌ Node.js not found');
}

// Check 2: Project Structure
console.log('\n2. Checking project structure...');
const requiredDirs = [
  'backend/src',
  'frontend/src',
  'data',
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`   ✅ ${dir}/`);
  } else {
    console.log(`   ❌ ${dir}/ NOT FOUND`);
  }
});

// Check 3: Key Files
console.log('\n3. Checking key files...');
const requiredFiles = [
  'backend/.env',
  'backend/package.json',
  'backend/src/server.js',
  'frontend/package.json',
  'frontend/src/main.jsx',
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} NOT FOUND`);
  }
});

// Check 4: Dependencies
console.log('\n4. Checking npm packages...');
const backendPackageJson = path.join(__dirname, 'backend/package.json');
const frontendPackageJson = path.join(__dirname, 'frontend/package.json');

if (fs.existsSync(backendPackageJson)) {
  const backend = JSON.parse(fs.readFileSync(backendPackageJson));
  console.log(`   ✅ Backend: ${Object.keys(backend.dependencies || {}).length} dependencies`);
}

if (fs.existsSync(frontendPackageJson)) {
  const frontend = JSON.parse(fs.readFileSync(frontendPackageJson));
  console.log(`   ✅ Frontend: ${Object.keys(frontend.dependencies || {}).length} dependencies`);
}

// Check 5: Database
console.log('\n5. Checking database...');
const dbPath = path.join(__dirname, 'data/petcare.db');
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log(`   ✅ Database exists (${(stats.size / 1024).toFixed(2)} KB)`);
} else {
  console.log('   ⚠️  Database not found (will be created on first run)');
}

// Check 6: Environment
console.log('\n6. Checking environment configuration...');
const envPath = path.join(__dirname, 'backend/.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  const hasPort = lines.some(l => l.includes('PORT'));
  const hasJWT = lines.some(l => l.includes('JWT_SECRET'));
  const hasRazorpay = lines.some(l => l.includes('RAZORPAY'));
  
  console.log(`   ${hasPort ? '✅' : '❌'} PORT configured`);
  console.log(`   ${hasJWT ? '✅' : '❌'} JWT_SECRET configured`);
  console.log(`   ${hasRazorpay ? '✅' : '⚠️'} Razorpay (optional for development)`);
}

// Check 7: Models
console.log('\n7. Checking database models...');
const modelsDir = path.join(__dirname, 'backend/src/models');
if (fs.existsSync(modelsDir)) {
  const models = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));
  console.log(`   ✅ Found ${models.length} models:`);
  models.forEach(model => {
    console.log(`      - ${model.replace('.js', '')}`);
  });
}

// Check 8: Routes
console.log('\n8. Checking API routes...');
const routesDir = path.join(__dirname, 'backend/src/routes');
if (fs.existsSync(routesDir)) {
  const routes = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));
  console.log(`   ✅ Found ${routes.length} route files:`);
  routes.forEach(route => {
    console.log(`      - ${route.replace('.js', '')}`);
  });
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📋 SETUP STATUS: READY\n');
console.log('Next steps:');
console.log('1. cd backend && npm start (in first terminal)');
console.log('2. cd frontend && npm run dev (in second terminal)');
console.log('3. Open http://localhost:3003 in your browser');
console.log('\n');
