const request = require('supertest');

describe('Test without jwt', () => {
  test('POST /users without jwt', async () => {
    const res = await request(apiUrl).post('/users');

    expect(res.statusCode).toEqual(500);
  });
});

describe('Test with jwt', () => {
  let jwt = '';

  beforeAll(async () => {
    const res = await request(apiUrl)
      .post('/login')
      .send({
        firstName: 'Charlely',
        password: 'password',
      });

      jwt = res.body.token;
  });

  test('POST /users => success', async () => {
    // Create an user
    let res = await request(apiUrl)
      .post('/users')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        firstName: 'Blablabla',
        lastName: 'Blublublu',
        password: 'Blobloblo',
      });

    expect(res.statusCode).toEqual(201);

    // Retrieve the created user
    res = await request(apiUrl)
      .get('/users/Blablabla')
      .set('Authorization', `Bearer ${jwt}`);

    expect(res.statusCode).toEqual(200);

    // Delete it for cleaning purpose
    const userId = res.body.id;
    res = await request(apiUrl)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwt}`);

    expect(res.statusCode).toEqual(204);
  });

  test('POST /users => without "lastName" should fail', async () => {
    const res = await request(apiUrl)
      .post('/users')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        firstName: 'Blablabla',
        password: 'Blobloblo',
      });

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual('Property "req.body.lastName": Invalid value. Current value = undefined');
  });

  test('POST /users', async () => {
    const res = await request(apiUrl)
      .post('/users')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        firstName: 'Blablabla',
        lastName: 'Blublublu',
        password: 'oups',
      });

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual('Property "req.body.password": Invalid value. Current value = oups');
  });
});
