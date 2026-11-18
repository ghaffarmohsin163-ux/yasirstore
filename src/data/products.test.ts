import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BRANDS,
  DEAL_SMARTPHONES,
  POPULAR_SMARTPHONES,
  SMARTPHONES,
} from './products';

test('every company has 7 to 8 smartphone models', () => {
  for (const brand of BRANDS) {
    const models = SMARTPHONES.filter((p) => p.brand === brand.name);
    assert.ok(
      models.length >= 7 && models.length <= 8,
      `${brand.name} should have 7-8 models, found ${models.length}`
    );
  }
});

test('every smartphone model within each company has a distinct primary image', () => {
  for (const brand of BRANDS) {
    const models = SMARTPHONES.filter((p) => p.brand === brand.name);
    const urls = models.map((m) => m.images[0]?.url);
    const uniqueUrls = new Set(urls);
    assert.equal(
      uniqueUrls.size,
      models.length,
      `${brand.name} has duplicate primary images: ${urls.length} models vs ${uniqueUrls.size} unique images`
    );
  }
});

test('popular and deal showcase cards all have distinct primary images', () => {
  const showcase = [...POPULAR_SMARTPHONES, ...DEAL_SMARTPHONES];
  const uniqueUrls = new Set(showcase.map((m) => m.images[0]?.url));
  assert.equal(uniqueUrls.size, showcase.length);
});

test('all models align defaultStorage with specs.storage, valid defaultColor, and consistent discount pricing', () => {
  for (const phone of SMARTPHONES) {
    assert.equal(
      phone.defaultStorage,
      phone.specs.storage,
      `${phone.name} defaultStorage (${phone.defaultStorage}) does not match specs.storage (${phone.specs.storage})`
    );
    assert.ok(
      phone.colors.some((c) => c.name === phone.defaultColor),
      `${phone.name} defaultColor (${phone.defaultColor}) missing from colors array`
    );
    if (phone.originalPrice !== undefined) {
      assert.ok(
        phone.originalPrice > phone.currentPrice,
        `${phone.name} originalPrice (${phone.originalPrice}) must exceed currentPrice (${phone.currentPrice})`
      );
    }
  }
});

test('official Apple color names match real hardware generations', () => {
  const iphone16Pro = SMARTPHONES.find((p) => p.id === 'APP-02');
  const iphone15 = SMARTPHONES.find((p) => p.id === 'APP-06');
  const iphone13 = SMARTPHONES.find((p) => p.id === 'APP-08');

  assert.equal(iphone16Pro?.defaultColor, 'Natural Titanium');
  assert.ok(!iphone16Pro?.colors.some((c) => c.name === 'Titanium Blue'));
  assert.equal(iphone15?.defaultColor, 'Blue');
  assert.ok(!iphone15?.colors.some((c) => c.name === 'Ice Blue'));
  assert.equal(iphone13?.defaultColor, 'Midnight');
  assert.ok(!iphone13?.colors.some((c) => c.name === 'Midnight Navy'));
});
