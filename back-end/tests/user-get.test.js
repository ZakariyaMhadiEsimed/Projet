const request = require('supertest');

test('GET /users without jwt', async () => {
  const res = await request(apiUrl).get('/users');

  expect(res.statusCode).toEqual(500);
});

test('GET /users with jwt', async () => {
  let res = await request(apiUrl)
    .post('/login')
    .send({
      firstName: 'Charlely',
      password: 'password',
    });

  expect(res.statusCode).toEqual(200);

  const jwt = res.body.token;

  res = await request(apiUrl)
    .get('/users')
    .set('Authorization', `Bearer ${jwt}`);

  expect(res.statusCode).toEqual(200);
});
