const http = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data
        });
      });
    }).on('error', (err) => { reject(err); });
  });
}

async function run() {
  console.log('--- FETCHING LEADS SCHEMA DEBUG INFO ---');
  try {
    const res = await fetchUrl('https://mnavietnam.vercel.app/api/leads/debug-schema');
    console.log('Status:', res.statusCode);
    console.log('Body:', res.body);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
