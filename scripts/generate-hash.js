const crypto = require('crypto');

const password = process.argv[2];

if (!password) {
  console.log('\n❌ Vui lòng cung cấp mật khẩu cần băm.');
  console.log('Cách dùng: node scripts/generate-hash.js <mat_khau_cua_ban>\n');
  process.exit(1);
}

// Scrypt password hashing function identical to src/lib/auth.ts
function generateScryptHash(pwd) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pwd, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}

const finalHash = generateScryptHash(password);

console.log('\n======================================================');
console.log('🔑 SINH MÃ BĂM MẬT KHẨU BẢO MẬT (SCRYPT + SALT)');
console.log('======================================================');
console.log(`Mật khẩu nhập vào : ${password}`);
console.log(`Chuỗi Hash sinh ra  : ${finalHash}`);
console.log('------------------------------------------------------');
console.log('Copy dòng dưới đây dán vào file .env.local của bạn:');
console.log(`ADMIN_PASSWORD_HASH="${finalHash}"`);
console.log('======================================================\n');
