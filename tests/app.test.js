const request = require('supertest');
const app = require('../src/app');

describe('API Core & Health Check', () => {
  it('GET /health - should return 200 OK and status message', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');
    expect(res.body.message).toBeDefined();
  });

  it('GET /api/v1/invalid-route - should return 404 ApiError', async () => {
    const res = await request(app).get('/api/v1/invalid-route');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Route not found');
  });
});
