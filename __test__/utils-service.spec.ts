const Utils = require('../src/shared/services/utils-service.ts')
const tests = new Utils()

test('Sample test', () => {
  expect(tests._getYear(new Date(2020, 1, 1))).toBe('2020')
})
