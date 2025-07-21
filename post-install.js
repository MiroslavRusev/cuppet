const fs = require('fs');

// Create required directories
fs.mkdirSync('jsonFiles', { recursive: true });
fs.mkdirSync('reports', { recursive: true });
fs.mkdirSync('screenshots', { recursive: true });
console.log('\nAll required directories have been created successfully!');
