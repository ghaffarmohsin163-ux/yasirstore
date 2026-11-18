import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPKR,
  buildWhatsAppUrl,
  buildSmartphoneInquiryUrl,
  buildCartWhatsAppUrl,
} from './whatsapp';
import { SmartphoneModel } from '../types';

const samplePhone: SmartphoneModel = {
  id: 'SAM-01',
  brand: 'Samsung',
  name: 'Galaxy S24 Ultra',
  storageOptions: ['256GB', '512GB'],
  defaultStorage: '256GB',
  colors: [{ name: 'Titanium Gray', hex: '#6B7280' }],
  defaultColor: 'Titanium Gray',
  currentPrice: 399999,
  rating: 4.9,
  reviewsCountText: '1.8k',
  stockCount: 6,
  shortDescription: 'Flagship S-Pen smartphone.',
  images: [{ url: '/s24.jpg', alt: 'S24 Ultra', label: 'Front' }],
  specs: {
    display: '6.8"',
    storage: '256GB',
    chipset: 'SD 8 Gen 3',
    network: '5G Ready',
    camera: '200MP Quad',
    battery: '5000 mAh',
  },
};

test('formatPKR formats currency strings cleanly', () => {
  assert.equal(formatPKR(399999), 'PKR 399,999');
  assert.equal(formatPKR(84999), 'PKR 84,999');
});

test('buildWhatsAppUrl formats wa.me link with encoded text', () => {
  const url = buildWhatsAppUrl('Hello Yasir Mobile Store');
  assert.equal(url, 'https://wa.me/923293179587?text=Hello%20Yasir%20Mobile%20Store');
});

test('buildSmartphoneInquiryUrl encodes model, storage, color, and price', () => {
  const url = buildSmartphoneInquiryUrl(samplePhone, '256GB', 'Titanium Gray', 1);
  assert.ok(url.includes('Samsung%20Galaxy%20S24%20Ultra'));
  assert.ok(url.includes('256GB'));
  assert.ok(url.includes('PKR%20399%2C999'));
});

test('buildCartWhatsAppUrl encodes all cart items and total', () => {
  const url = buildCartWhatsAppUrl(
    [{ product: samplePhone, quantity: 2, selectedStorage: '256GB', selectedColor: 'Titanium Gray' }],
    799998
  );
  assert.ok(url.includes('Galaxy%20S24%20Ultra'));
  assert.ok(url.includes('PKR%20799%2C998'));
});
