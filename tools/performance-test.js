const http = require('http');
const https = require('https');

async function measure(url) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, {
      headers: { 'Accept-Encoding': 'gzip, deflate, br' }
    }, (res) => {
      let data = '';
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        const duration = Date.now() - start;
        const size = Buffer.concat(chunks).length;
        resolve({
          url,
          status: res.statusCode,
          durationMs: duration,
          sizeBytes: size,
          compressed: res.headers['content-encoding'] || 'none'
        });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  const targets = [
    'http://localhost:3000',
    'http://localhost:4000/health',
    'http://localhost:4000/cms/pages'
  ];

  console.log('--- Performance Test Results ---');
  for (const target of targets) {
    try {
      const result = await measure(target);
      console.log(`${result.url} | Status: ${result.status} | Time: ${result.durationMs}ms | Size: ${(result.sizeBytes / 1024).toFixed(2)}KB | Encoding: ${result.compressed}`);
    } catch (err) {
      console.log(`${target} | Error: ${err.message}`);
    }
  }
}

runTests();
