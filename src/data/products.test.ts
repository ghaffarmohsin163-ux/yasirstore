import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  BRANDS,
  DEAL_SMARTPHONES,
  HERO_BANNER_IMAGE,
  HERO_SLIDES,
  POPULAR_SMARTPHONES,
  PROMO_LINEUP_IMAGE,
  SMARTPHONES,
} from './products';

function assertPublicImageExistsCaseSensitive(url: string, label: string) {
  assert.ok(
    url.startsWith('/images/'),
    `${label} must use /images/... path (not /src/ or /public/), got: ${url}`
  );
  assert.ok(
    !url.startsWith('/src/') && !url.startsWith('/public/'),
    `${label} must not reference /src/ or /public/ directly: ${url}`
  );
  const publicDir = path.resolve(process.cwd(), 'public');
  const relativeParts = url.replace(/^\//, '').split('/');
  let currentDir = publicDir;
  for (const part of relativeParts) {
    const entries = fs.readdirSync(currentDir);
    assert.ok(
      entries.includes(part),
      `${label} path segment "${part}" not found (case-sensitive check) inside ${currentDir}`
    );
    currentDir = path.join(currentDir, part);
  }
  const stat = fs.statSync(currentDir);
  assert.ok(stat.isFile() && stat.size > 0, `${label} image file is empty: ${currentDir}`);
}

test('all hero, promo, and smartphone images resolve to existing case-sensitive files under public/images', () => {
  assertPublicImageExistsCaseSensitive(HERO_BANNER_IMAGE, 'HERO_BANNER_IMAGE');
  assertPublicImageExistsCaseSensitive(PROMO_LINEUP_IMAGE, 'PROMO_LINEUP_IMAGE');
  for (const slide of HERO_SLIDES) {
    assertPublicImageExistsCaseSensitive(slide.image, `HERO_SLIDES[${slide.id}]`);
  }
  for (const phone of SMARTPHONES) {
    for (const img of phone.images) {
      assertPublicImageExistsCaseSensitive(img.url, `${phone.id} gallery image`);
    }
    for (const color of phone.colors) {
      assert.ok(color.image, `${phone.id} color ${color.name} must define an image`);
      assertPublicImageExistsCaseSensitive(color.image, `${phone.id} color ${color.name}`);
    }
  }
});

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
