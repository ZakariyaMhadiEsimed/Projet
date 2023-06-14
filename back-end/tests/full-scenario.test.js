const request = require('supertest');

describe('Test the whole scenario', () => {
  test(`Let's go !`, async () => {
    // Token creation
    let res = await request(apiUrl)
      .post('/login')
      .send({
        firstName: 'Charlely',
        password: 'password',
      });

    expect(res.statusCode).toEqual(200);
    jwt = res.body.token;

    // List users
    res = await request(apiUrl)
      .get('/users')
      .set('Authorization', `Bearer ${jwt}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);

    // Update user
    const userId = res.body[0].id;
    const newLastName = 'Vittel';
    res = await request(apiUrl)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        lastName: newLastName,
      });

    expect(res.statusCode).toEqual(204);

    // Get updated user
    res = await request(apiUrl)
      .get('/users/Charlely')
      .set('Authorization', `Bearer ${jwt}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.lastName).toEqual(newLastName);

    // Delete user
    res = await request(apiUrl)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwt}`);

    expect(res.statusCode).toEqual(204);

    // List users
    res = await request(apiUrl)
      .get('/users')
      .set('Authorization', `Bearer ${jwt}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(0);
  });
})
