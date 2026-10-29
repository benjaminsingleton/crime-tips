import assert from 'assert';
import {
  resolveBranding,
  sanitizeBrandingPatch,
  normalizeHex,
  BRANDING_DEFAULTS,
} from './branding.js';

assert.strictEqual(normalizeHex('#abc'), '#aabbcc');
assert.strictEqual(normalizeHex('#102033'), '#102033');
assert.strictEqual(normalizeHex('nope'), null);

{
  const b = resolveBranding({});
  assert.strictEqual(b.name, BRANDING_DEFAULTS.name);
  assert.strictEqual(b.primaryColor, BRANDING_DEFAULTS.primaryColor);
}

{
  process.env.BRAND_NAME = 'Springfield PD Crime Tips';
  process.env.BRAND_PRIMARY_COLOR = '#0b3d5c';
  const b = resolveBranding({});
  assert.strictEqual(b.name, 'Springfield PD Crime Tips');
  assert.strictEqual(b.primaryColor, '#0b3d5c');
  const overridden = resolveBranding({ name: 'Override PD', accentColor: '#c4a35a' });
  assert.strictEqual(overridden.name, 'Override PD');
  assert.strictEqual(overridden.primaryColor, '#0b3d5c');
  assert.strictEqual(overridden.accentColor, '#c4a35a');
  delete process.env.BRAND_NAME;
  delete process.env.BRAND_PRIMARY_COLOR;
}

{
  const patch = sanitizeBrandingPatch({
    name: '  City PD  ',
    primaryColor: '#ABC',
    logoUrl: 'https://example.gov/logo.png',
  });
  assert.strictEqual(patch.name, 'City PD');
  assert.strictEqual(patch.primaryColor, '#aabbcc');
  assert.strictEqual(patch.logoUrl, 'https://example.gov/logo.png');
}

try {
  sanitizeBrandingPatch({ logoUrl: 'javascript:alert(1)' });
  assert.fail('expected throw');
} catch (err) {
  assert.ok(err.status === 400);
}

console.log('branding.test.js: ok');
