const request = require('supertest');

describe('Success login', () => {
  test('POST /login', async () => {
    const res = await request(apiUrl)
      .post('/login')
      .send({
        firstName: 'Charlely',
        password: 'password',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Failed login', () => {
  test('POST /login => without firstName', async () => {
    const res = await request(apiUrl)
      .post('/login')
      .send({
        password: 'password',
      });

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual('Property "req.body.firstName": Invalid value. Current value = undefined');
  });

  test('POST /login => with wrong firstName', async () => {
    const res = await request(apiUrl)
      .post('/login')
      .send({
        firstName: 'fake',
        password: 'password',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Unauthorized');
  });

  test('POST /login => with wrong password', async () => {
    const res = await request(apiUrl)
      .post('/login')
      .send({
        firstName: 'Charlely',
        password: 'fake',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Unauthorized');
  });
});
