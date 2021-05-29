const ApiRequestService = require('../src/shared/services/request-service.ts')
const tests = new ApiRequestService()

test('the data is peanut butter', async () => {
  await expect(tests.getGenres({ apiToken: 'ewiojfoijweofiwejfjowj' })).resolves.toBe('peanut butter')
})
