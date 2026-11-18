import { CartItem, SmartphoneModel } from '../types';

export const STORE_WHATSAPP_NUMBER = '923293179587';

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralInquiryUrl(): string {
  return buildWhatsAppUrl(
    'Assalam-o-Alaikum Yasir Mobile Store! I would like to inquire about available smartphone models and prices.'
  );
}

export function buildSmartphoneInquiryUrl(
  phone: SmartphoneModel,
  storage: string,
  color: string,
  quantity: number = 1
): string {
  const msg = `Assalam-o-Alaikum Yasir Mobile Store! I am interested in:\n- Model: ${phone.brand} ${phone.name}\n- Variant: ${storage} · ${color}\n- Quantity: ${quantity}\n- Listed Price: ${formatPKR(phone.currentPrice)}`;
  return buildWhatsAppUrl(msg);
}

export function buildCartWhatsAppUrl(items: CartItem[], totalAmount: number): string {
  const lines = items.map(
    (item, i) =>
      `${i + 1}. ${item.product.brand} ${item.product.name} (${item.selectedStorage}, ${item.selectedColor}) × ${item.quantity}`
  );
  const msg = `Assalam-o-Alaikum Yasir Mobile Store! My cart inquiry:\n${lines.join('\n')}\nTotal: ${formatPKR(totalAmount)}`;
  return buildWhatsAppUrl(msg);
}
