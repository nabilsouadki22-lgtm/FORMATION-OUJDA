const fetch = globalThis.fetch || require('node-fetch');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWRtaW5AY2VudHJlb3VqZGEuY29tIiwicm9sZSI6InRlYWNoZXIiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3ODA0MjYxMzgsImV4cCI6MTc4MTAzMDkzOH0.jtK1n75xzN3_DeUhxzRKsDKhVWVMFLgqZ70oPFOxNvo';
(async () => {
  try {
    const res = await fetch('http://localhost:4000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await res.text();
    console.log('status', res.status);
    console.log('body', body);
  } catch (e) {
    console.error('error', e);
    process.exit(1);
  }
})();
