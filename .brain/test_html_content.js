const http = require('https');

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', (err) => { reject(err); });
  });
}

async function run() {
  console.log('--- SCANNING HOMEPAGE HTML FOR NEW VALUES ---');
  
  try {
    const res = await fetchUrl('https://mnavietnam.vercel.app/vi');
    const body = res.body;

    const hasPhone = body.includes('0984 999 135');
    const hasAddress = body.includes('192 Pasteur');
    const hasOldPhone = body.includes('090 123 4567');
    const hasOldAddress = body.includes('Tầng 12, Tòa nhà MNA');

    console.log('Does HTML contain new phone "0984 999 135"?', hasPhone);
    console.log('Does HTML contain new address "192 Pasteur"?', hasAddress);
    console.log('Does HTML contain old default phone?', hasOldPhone);
    console.log('Does HTML contain old default address?', hasOldAddress);

    // If it doesn't contain the new values, let's see what phone it does contain
    if (!hasPhone) {
      const match = body.match(/(\+?\d[\d\s-.]{8,15})/g);
      console.log('Found phone numbers in HTML:', match ? [...new Set(match)].slice(0, 10) : 'None');
    }
  } catch (err) {
    console.error('Failed to fetch homepage:', err.message);
  }
}

run();
