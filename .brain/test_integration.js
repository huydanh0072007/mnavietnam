const http = require('https');

function request(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(reqOptions, (res) => {
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

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

// Extractor helper for cookies
function getCookie(headers, name) {
  const setCookie = headers['set-cookie'];
  if (!setCookie) return null;
  for (const cookie of setCookie) {
    if (cookie.startsWith(name + '=')) {
      return cookie.split(';')[0];
    }
  }
  return null;
}

async function run() {
  console.log('🚀 --- INITIATING PRODUCTION INTEGRATION TESTS --- 🚀');
  const baseUrl = 'https://mnavietnam.vercel.app';
  let adminCookie = null;

  // ----------------------------------------------------
  // TEST 1: Get Global Settings
  // ----------------------------------------------------
  console.log('\n[TEST 1] GET /api/settings (Public Settings)...');
  try {
    const res = await request(`${baseUrl}/api/settings`);
    console.log('  Status:', res.statusCode);
    const settings = JSON.parse(res.body);
    if (res.statusCode === 200 && settings.phone && settings.address) {
      console.log('  ✅ PASS: Settings retrieved correctly.');
      console.log(`     Phone: "${settings.phone}"`);
      console.log(`     Address: "${settings.address}"`);
    } else {
      console.log('  ❌ FAIL: Settings format incorrect or request failed.');
    }
  } catch (err) {
    console.log('  ❌ FAIL Error:', err.message);
  }

  // ----------------------------------------------------
  // TEST 2: Admin Authentication (Failure Case)
  // ----------------------------------------------------
  console.log('\n[TEST 2] POST /api/auth/login (Invalid credentials)...');
  try {
    const res = await request(`${baseUrl}/api/auth/login`, { method: 'POST' }, {
      email: 'admin@mnainternational.com',
      password: 'WrongPassword123'
    });
    console.log('  Status:', res.statusCode);
    const body = JSON.parse(res.body);
    if (res.statusCode === 401 || (res.statusCode === 400 && body.error)) {
      console.log('  ✅ PASS: Rejected invalid credentials as expected. Error:', body.error || 'Unauthorized');
    } else {
      console.log('  ❌ FAIL: Allowed login or returned unexpected status code.');
    }
  } catch (err) {
    console.log('  ❌ FAIL Error:', err.message);
  }

  // ----------------------------------------------------
  // TEST 3: Admin Authentication (Success Case)
  // ----------------------------------------------------
  console.log('\n[TEST 3] POST /api/auth/login (Correct credentials)...');
  try {
    // Standard credentials: admin@mnainternational.com / Admin@MNA2024!
    const res = await request(`${baseUrl}/api/auth/login`, { method: 'POST' }, {
      email: 'admin@mnainternational.com',
      password: 'Admin@MNA2024!'
    });
    console.log('  Status:', res.statusCode);
    adminCookie = getCookie(res.headers, 'mna_session');
    if (res.statusCode === 200 && adminCookie) {
      console.log('  ✅ PASS: Logged in successfully.');
      console.log('     Session Cookie obtained:', adminCookie.substring(0, 40) + '...');
    } else {
      console.log('  ❌ FAIL: Login failed or session cookie not returned.');
    }
  } catch (err) {
    console.log('  ❌ FAIL Error:', err.message);
  }

  if (!adminCookie) {
    console.log('\n⚠️ Skipping subsequent admin tests due to login failure.');
    return;
  }

  // ----------------------------------------------------
  // TEST 4: Fetch Private Leads List (Authenticated)
  // ----------------------------------------------------
  console.log('\n[TEST 4] GET /api/leads (Authenticated request)...');
  try {
    const res = await request(`${baseUrl}/api/leads`, {
      headers: {
        'Cookie': adminCookie
      }
    });
    console.log('  Status:', res.statusCode);
    const leads = JSON.parse(res.body);
    if (res.statusCode === 200 && Array.isArray(leads)) {
      console.log(`  ✅ PASS: Retrieved ${leads.length} leads successfully.`);
      if (leads.length > 0) {
        console.log(`     Sample Lead: "${leads[0].full_name}" from "${leads[0].organization}"`);
      }
    } else {
      console.log('  ❌ FAIL: Fetch leads failed or response not an array.');
    }
  } catch (err) {
    console.log('  ❌ FAIL Error:', err.message);
  }

  // ----------------------------------------------------
  // TEST 5: Create a new Lead (Public Submission)
  // ----------------------------------------------------
  console.log('\n[TEST 5] POST /api/leads (Public Lead submission)...');
  try {
    const testLead = {
      lead_type: 'interest',
      full_name: 'Robot Tester',
      organization: 'Antigravity QA Lab',
      email: 'qa@antigravity.ai',
      phone: '0999 888 777',
      role_title: 'Automated Tester',
      message: 'This is an automated test submission verifying the API logic works.',
      project_name_location: 'Hồ Chí Minh',
      preferred_deal_type: 'buyout',
      estimated_scale: '1000 tỷ'
    };

    const res = await request(`${baseUrl}/api/leads`, { method: 'POST' }, testLead);
    console.log('  Status:', res.statusCode);
    const body = JSON.parse(res.body);
    if (res.statusCode === 200 || res.statusCode === 210 || res.statusCode === 201) {
      console.log('  ✅ PASS: Public lead submitted successfully. Lead ID:', body.id);
    } else {
      console.log('  ❌ FAIL: Lead submission failed. Error:', body.error || res.body);
    }
  } catch (err) {
    console.log('  ❌ FAIL Error:', err.message);
  }

  console.log('\n🚀 --- INTEGRATION TESTS COMPLETED --- 🚀');
}

run();
