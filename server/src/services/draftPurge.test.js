import assert from 'node:assert/strict';
import { draftRetentionDays, draftPurgeIntervalMs } from './draftPurge.js';

const prevDays = process.env.DRAFT_RETENTION_DAYS;
const prevInterval = process.env.DRAFT_PURGE_INTERVAL_HOURS;

try {
  delete process.env.DRAFT_RETENTION_DAYS;
  assert.equal(draftRetentionDays(), 30);

  process.env.DRAFT_RETENTION_DAYS = '0';
  assert.equal(draftRetentionDays(), 0);

  process.env.DRAFT_RETENTION_DAYS = '14';
  assert.equal(draftRetentionDays(), 14);

  delete process.env.DRAFT_PURGE_INTERVAL_HOURS;
  assert.equal(draftPurgeIntervalMs(), 24 * 60 * 60 * 1000);

  process.env.DRAFT_PURGE_INTERVAL_HOURS = '6';
  assert.equal(draftPurgeIntervalMs(), 6 * 60 * 60 * 1000);

  console.log('draftPurge.test.js: ok');
} finally {
  if (prevDays === undefined) delete process.env.DRAFT_RETENTION_DAYS;
  else process.env.DRAFT_RETENTION_DAYS = prevDays;
  if (prevInterval === undefined) delete process.env.DRAFT_PURGE_INTERVAL_HOURS;
  else process.env.DRAFT_PURGE_INTERVAL_HOURS = prevInterval;
}
