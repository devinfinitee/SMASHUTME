const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check for node_modules
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

if (!fs.existsSync(nodeModulesPath)) {
  console.log('node_modules not found. Running npm install...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  } catch (error) {
    console.error('Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('Dependencies already installed.');
}
