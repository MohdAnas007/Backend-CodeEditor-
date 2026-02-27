const axios = require('axios');

async function sendRequest(user) {
  try {
    const res = await axios.post('http://localhost:8080/api/runcode', {
      code: `print("Hello from ${user}")`,
      input: "",
      language: "python"
    });
    console.log(`User ${user} result:`, res.data);
  } catch (err) {
    console.error(`User ${user} error:`, err.response?.data || err.message);
  }
}

async function main() {
  const users = Array.from({ length: 40 }, (_, i) => `User${i+1}`);
  await Promise.all(users.map(u => sendRequest(u)));
}

main();
