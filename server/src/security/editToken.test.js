import assert from 'node:assert/strict';
import { extractEditToken, generateEditToken, hashEditToken, verifyEditToken } from './editToken.js';

const token = generateEditToken();
const hash = hashEditToken(token);
assert.equal(verifyEditToken(token, hash), true);
assert.equal(verifyEditToken('nope', hash), false);

assert.equal(
  extractEditToken({ headers: { 'x-tip-edit-token': ` ${token} ` }, query: {}, body: {} }),
  token,
);
assert.equal(
  extractEditToken({
    headers: {},
    query: { editToken: token },
    body: {},
  }),
  null,
);
assert.equal(
  extractEditToken({
    headers: {},
    query: {},
    body: { editToken: token },
  }),
  token,
);

console.log('editToken.test.js: ok');
