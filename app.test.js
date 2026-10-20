const request = require('supertest');
const app = require('./app');

describe('demo-app', () => {
  test('GET /health returns UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  test('GET /add returns the sum', async () => {
    const res = await request(app).get('/add?a=2&b=3');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(5);
  });

  test('GET /add rejects non-numbers', async () => {
    const res = await request(app).get('/add?a=x&b=3');
    expect(res.statusCode).toBe(400);
  });
});
