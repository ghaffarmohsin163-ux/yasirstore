import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateShippingInfo,
  validateCardDetails,
  getPriceForStorage,
  calculateCartTotals,
  generateMobileOrderId,
  createSmartphoneOrder,
} from './checkout';
import { SmartphoneModel } from '../types';

const mockPhone: SmartphoneModel = {
  id: 'APP-01',
  brand: 'Apple',
  name: 'iPhone 16 Pro',
  storageOptions: ['128GB', '256GB', '512GB'],
  defaultStorage: '256GB',
  colors: [{ name: 'Titanium Blue', hex: '#3B6696' }],
  defaultColor: 'Titanium Blue',
  currentPrice: 384999,
  rating: 4.9,
  reviewsCountText: '2.5k',
  stockCount: 8,
  shortDescription: 'Flagship titanium smartphone.',
  images: [{ url: '/test.jpg', alt: 'iPhone 16 Pro', label: 'Front' }],
  specs: {
    display: '6.3"',
    storage: '256GB',
    chipset: 'A18 Pro',
    network: '5G Ready',
    camera: '48MP Pro',
    battery: '3582 mAh',
  },
};

test('validateShippingInfo passes with valid data', () => {
  const res = validateShippingInfo({
    fullName: 'Ali Hassan',
    email: 'ali@example.com',
    address: 'House 42, Sector K, DHA Phase 6',
    city: 'Lahore',
    phone: '+92 300 1234567',
    postalCode: '54792',
  });
  assert.equal(res.isValid, true);
  assert.deepEqual(res.errors, {});
});

test('validateShippingInfo rejects empty or malformed fields', () => {
  const res = validateShippingInfo({
    fullName: '',
    email: 'invalid-email',
    address: '123',
    city: '',
    phone: '123',
    postalCode: '12',
  });
  assert.equal(res.isValid, false);
  assert.ok(res.errors.fullName);
  assert.ok(res.errors.email);
  assert.ok(res.errors.address);
  assert.ok(res.errors.city);
  assert.ok(res.errors.phone);
  assert.ok(res.errors.postalCode);
});

test('validateCardDetails validates card number, expiry, and CVV', () => {
  const good = validateCardDetails({
    cardNumber: '4242 4242 4242 4242',
    expiry: '08/28',
    cvv: '123',
  });
  assert.equal(good.isValid, true);

  const bad = validateCardDetails({
    cardNumber: '1234',
    expiry: '15/28',
    cvv: '1',
  });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.cardNumber);
  assert.ok(bad.errors.expiry);
  assert.ok(bad.errors.cvv);
});

test('getPriceForStorage scales price cleanly by storage tier', () => {
  assert.equal(getPriceForStorage(384999, mockPhone.storageOptions, '128GB'), 384999);
  assert.equal(getPriceForStorage(384999, mockPhone.storageOptions, '256GB'), 409999);
  assert.equal(getPriceForStorage(384999, mockPhone.storageOptions, '512GB'), 434999);
});

test('calculateCartTotals sums multi-item quantities accurately', () => {
  const totals = calculateCartTotals([
    { product: mockPhone, quantity: 2, selectedStorage: '128GB', selectedColor: 'Titanium Blue' },
  ]);
  assert.equal(totals.subtotal, 769998);
  assert.equal(totals.shippingFee, 0);
  assert.equal(totals.total, 769998);
});

test('generateMobileOrderId uses #YM-XXXXXX format', () => {
  const id = generateMobileOrderId();
  assert.match(id, /^#YM-\d{6}$/);
});

test('createSmartphoneOrder generates complete order with 5 tracking stages', () => {
  const order = createSmartphoneOrder({
    orderId: '#YM-784512',
    items: [{ product: mockPhone, quantity: 1, selectedStorage: '256GB', selectedColor: 'Titanium Blue' }],
    shipping: {
      fullName: 'Sara Ahmed',
      email: 'sara@example.com',
      address: 'Street 12, Gulberg III',
      city: 'Lahore',
      phone: '+92 300 9876543',
      postalCode: '54660',
    },
    paymentMethod: 'Credit / Debit Card',
  });

  assert.equal(order.orderId, '#YM-784512');
  assert.equal(order.totalAmount, 409999);
  assert.equal(order.timeline.length, 5);
  assert.equal(order.timeline[0].completed, true);
  assert.equal(order.timeline[4].completed, false);
});
