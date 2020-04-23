const app = require('../src/app')

describe('App', () => {
  it('GET /api/* responds 200 with JSON object containing ok: true', () => {
    return supertest(app)
      .get('/api/*')
      .expect(200, { ok: true })
  })
})