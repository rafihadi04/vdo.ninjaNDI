const fs = require('fs');
const path = require('path');

const grandioseSrcDir = path.join(__dirname, '..', 'node_modules', 'grandiose', 'src');

if (!fs.existsSync(grandioseSrcDir)) {
  console.log('Grandiose source directory not found. Skipping patch.');
  process.exit(0);
}

const filesToPatch = [
  'grandiose_util.h',
  'grandiose_util.cc',
  'grandiose_find.cc',
  'grandiose_receive.cc',
  'grandiose_send.cc',
  'grandiose_routing.cc'
];

filesToPatch.forEach(file => {
  const filePath = path.join(grandioseSrcDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix C++ const char* conversion errors in newer Visual Studio compilers
    content = content.replace(/char\*\s+file/g, 'const char* file');
    content = content.replace(/char\*\s+resourceName/g, 'const char* resourceName');

    // Fix missing itoa function in some C++ standard libraries
    content = content.replace(/itoa\(errorInfo->error_code,\s*errorCode,\s*10\)/g, '(sprintf(errorCode, "%d", errorInfo->error_code), errorCode)');
    content = content.replace(/itoa\(c->status,\s*errorChars,\s*10\)/g, '(sprintf(errorChars, "%d", c->status), errorChars)');

    // Add math.h header if sin is used in grandiose_send.cc
    if (file === 'grandiose_send.cc' && !content.includes('<math.h>')) {
       content = '#include <math.h>\n' + content;
    }

    // Fix duplicate const chars caused by multiple replace calls in my previous tests (failsafe for local dev)
    content = content.replace(/const\s+const\s+char\*/g, 'const char*');
    content = content.replace(/const\s+const\s+const\s+char\*/g, 'const char*');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched ${file}`);
  }
});

console.log('Grandiose patch complete.');
