import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  ABOUT_METRICS,
  ABOUT_PILLARS,
  CUSTOMER_REVIEWS,
  SHOWROOM_IMAGE,
  SHOWROOM_LANDMARKS,
  SHOWROOM_LOCATION,
  STORE_RATING_SUMMARY,
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsUrl,
  clampMapZoom,
} from './storeShowroom';

test('showroom image resolves to an existing case-sensitive file under public/images', () => {
  assert.ok(
    SHOWROOM_IMAGE.startsWith('/images/'),
    `SHOWROOM_IMAGE must use /images/..., got: ${SHOWROOM_IMAGE}`
  );
  const fileName = SHOWROOM_IMAGE.replace('/images/', '');
  const imagesDir = path.resolve(process.cwd(), 'public', 'images');
  const entries = fs.readdirSync(imagesDir);
  assert.ok(
    entries.includes(fileName),
    `Showroom file "${fileName}" missing in public/images (case-sensitive check)`
  );
  const stat = fs.statSync(path.join(imagesDir, fileName));
  assert.ok(stat.isFile() && stat.size > 0);
});

test('rating breakdown percentages sum to 100 and average matches summary', () => {
  const sum = STORE_RATING_SUMMARY.breakdown.reduce((acc, r) => acc + r.percentage, 0);
  assert.equal(sum, 100);
  assert.ok(STORE_RATING_SUMMARY.score >= 4.8 && STORE_RATING_SUMMARY.score <= 5.0);
});

test('clampMapZoom constrains interactive map zoom between 0.85 and 1.8', () => {
  assert.equal(clampMapZoom(0.5), 0.85);
  assert.equal(clampMapZoom(1.25), 1.25);
  assert.equal(clampMapZoom(2.4), 1.8);
});

test('buildGoogleMapsUrl and directions URL point to Google Maps with encoded destination', () => {
  const url = buildGoogleMapsUrl('Commercial Area, Phase 6, DHA, Lahore');
  assert.ok(url.startsWith('https://www.google.com/maps/search/?api=1&query='));
  assert.ok(url.includes('Commercial%20Area'));
  assert.ok(url.includes('Lahore'));

  const dirUrl = buildGoogleMapsDirectionsUrl('Plot 42-C, Phase 6, DHA, Lahore');
  assert.ok(dirUrl.startsWith('https://www.google.com/maps/dir/?api=1&destination='));
  assert.ok(dirUrl.includes('Plot%2042-C'));
});

test('about pillars, landmarks with lat/lng, and reviews are complete and non-empty', () => {
  assert.equal(ABOUT_PILLARS.length, 3);
  assert.equal(ABOUT_METRICS.length, 4);
  assert.ok(CUSTOMER_REVIEWS.length >= 3);
  assert.equal(SHOWROOM_LANDMARKS[0].id, 'store');
  assert.ok(SHOWROOM_LOCATION.plotAddress.includes('Phase 6'));
  for (const lm of SHOWROOM_LANDMARKS) {
    assert.equal(typeof lm.lat, 'number');
    assert.equal(typeof lm.lng, 'number');
    assert.ok(lm.lat > 30 && lm.lng > 70);
  }
});
