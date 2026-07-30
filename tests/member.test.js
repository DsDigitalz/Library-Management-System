const request = require('supertest');
const app = require('../src/app');
const Member = require('../src/models/member.model');

jest.mock('../src/models/member.model');

describe('Member API Endpoints Validation & Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/members', () => {
    it('should reject invalid email format with 400 Validation Failed', async () => {
      const res = await request(app).post('/api/v1/members').send({
        name: 'John Doe',
        email: 'invalid-email-address',
        phone: '1234567890',
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toEqual('Validation Failed');
    });

    it('should register a member successfully when payload is valid', async () => {
      const memberData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1234567890',
        membershipType: 'standard',
      };

      Member.findOne.mockResolvedValue(null);
      Member.create.mockResolvedValue({
        _id: '60d5ecb8b5c9c22b9c8b9999',
        ...memberData,
        status: 'active',
      });

      const res = await request(app).post('/api/v1/members').send(memberData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toEqual('jane@example.com');
    });
  });
});
