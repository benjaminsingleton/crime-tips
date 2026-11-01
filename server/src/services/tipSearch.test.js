import assert from 'node:assert/strict';
import {
  buildSearchText,
  collectPayloadSearchParts,
  normalizeSearchQuery,
  parseListPagination,
} from './tipSearch.js';

const parts = collectPayloadSearchParts({
  crimeType: 'Theft',
  tipText: 'Blue sedan',
  nested: { plate: 'ABC123', empty: '' },
  flags: true,
});
assert.ok(parts.includes('Theft'));
assert.ok(parts.includes('Blue sedan'));
assert.ok(parts.includes('ABC123'));
assert.ok(parts.includes('true'));

const text = buildSearchText({
  id: '11111111-1111-4111-8111-111111111111',
  payload: { tipText: 'warehouse', tipsterContactDetails: '555-0100' },
  filenames: ['scene.jpg'],
});
assert.match(text, /warehouse/);
assert.match(text, /555-0100/);
assert.match(text, /scene\.jpg/);
assert.match(text, /11111111-1111-4111-8111-111111111111/);

assert.equal(normalizeSearchQuery('  foo%bar_baz  '), 'foo\\%bar\\_baz');
assert.equal(normalizeSearchQuery('river_photo.jpg'), 'river\\_photo.jpg');
assert.equal(normalizeSearchQuery('a\\b%c'), 'a\\\\b\\%c');
assert.equal(normalizeSearchQuery(''), '');

assert.deepEqual(parseListPagination({}), { limit: 50, offset: 0 });
assert.deepEqual(parseListPagination({ limit: '10', offset: '20' }), {
  limit: 10,
  offset: 20,
});
assert.equal(parseListPagination({ limit: '999' }).limit, 200);

console.log('tipSearch.test.js: ok');
