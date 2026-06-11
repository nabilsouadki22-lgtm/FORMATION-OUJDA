(async ()=> {
  try {
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@centreoujda.com', password: 'Admin123!' })
    });
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error('Request failed:', e);
    process.exit(1);
  }
})();
