const { spawn } = require('child_process');
const http = require('http');

const API_URL = process.env.API_URL || 'http://api:4000';
const TUNNEL_SECRET = process.env.TUNNEL_SECRET;
const TARGET_URL = process.env.TARGET_URL || 'http://web:3000';

console.log(`Starting Cloudflare Tunnel manager...`);
console.log(`Target: ${TARGET_URL}`);
console.log(`API: ${API_URL}`);

const cloudflared = spawn('cloudflared', ['tunnel', '--url', TARGET_URL]);

let capturedUrl = null;

cloudflared.stderr.on('data', (data) => {
  const line = data.toString();
  process.stderr.write(line);

  // Look for the URL in the output
  // Example: +  Your quick tunnel has been created! Visit it at https://something.trycloudflare.com
  const match = line.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
  if (match && !capturedUrl) {
    capturedUrl = match[0];
    console.log(`\n>>> CAPTURED TUNNEL URL: ${capturedUrl} <<<\n`);
    reportToApi(capturedUrl);
  }
});

cloudflared.stdout.on('data', (data) => {
  process.stdout.write(data.toString());
});

cloudflared.on('close', (code) => {
  console.log(`cloudflared process exited with code ${code}`);
  process.exit(code);
});

function reportToApi(url) {
  if (!TUNNEL_SECRET) {
    console.error('TUNNEL_SECRET is not set. Cannot report URL to API.');
    return;
  }

  const data = JSON.stringify({ url });
  const urlObj = new URL(`${API_URL}/internal/tunnel`);

  const req = http.request(
    {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'x-tunnel-secret': TUNNEL_SECRET,
      },
    },
    (res) => {
      console.log(`API response: ${res.statusCode}`);
      res.on('data', (d) => process.stdout.write(d));
    }
  );

  req.on('error', (error) => {
    console.error('Error reporting to API:', error);
    // Retry after 5 seconds if API is not ready
    setTimeout(() => reportToApi(url), 5000);
  });

  req.write(data);
  req.end();
}
