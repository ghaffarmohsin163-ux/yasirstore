import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OrderRecord {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  productId: string;
  productName: string;
  productCategory: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  orderDate: string;
}

// In-memory demo orders storage
const demoOrders: OrderRecord[] = [];
const processedOrderIds = new Set<string>();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Route: Send Order Email Notification
  app.post('/api/send-order-email', async (req: Request, res: Response): Promise<void> => {
    try {
      const order: OrderRecord = req.body;

      if (!order || !order.orderId || !order.customerEmail) {
        res.status(400).json({ success: false, error: 'Incomplete order payload' });
        return;
      }

      // Store in demo memory
      if (!processedOrderIds.has(order.orderId)) {
        demoOrders.unshift(order);
        processedOrderIds.add(order.orderId);
      }

      const recipientEmail = process.env.ORDER_NOTIFICATION_EMAIL || 'tiktokpakitanmedia344@gmail.com';
      const resendApiKey = process.env.RESEND_API_KEY;

      const subject = `New Yasir Mobile Store Order — ${order.orderId}`;
      const plainText = `
YASIR MOBILE STORE — NEW ORDER NOTIFICATION

Order ID: ${order.orderId}
Customer Name: ${order.customerName}
Customer Email: ${order.customerEmail}
Customer Phone: ${order.customerPhone}
Delivery Address: ${order.deliveryAddress}
Product Name: ${order.productName}
Product Category: ${order.productCategory}
Unit Price: PKR ${order.unitPrice.toLocaleString('en-PK')}
Quantity: ${order.quantity}
Total Amount: PKR ${order.totalAmount.toLocaleString('en-PK')}
Payment Status: ${order.paymentStatus || 'PAID — DEMO'}
Order Date: ${order.orderDate}
      `.trim();

      const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 24px; color: #171717; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e8e8e8; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #151515; color: #ffffff; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; letter-spacing: 1.5px; color: #B89155; font-weight: 800; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #a3a3a3; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 28px 24px; }
    .order-badge { display: inline-block; background: #16834A; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 20px; }
    .detail-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
    .detail-table th, .detail-table td { padding: 12px 14px; text-align: left; border-bottom: 1px solid #e8e8e8; }
    .detail-table th { background: #fbfbfb; color: #777777; font-weight: 600; width: 38%; }
    .detail-table td { font-weight: 500; color: #171717; }
    .total-row td { font-size: 16px; font-weight: 800; color: #B89155; }
    .footer { background: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>YASIR MOBILE STORE</h1>
      <p>New Smartphone Order Notification</p>
    </div>
    <div class="content">
      <div class="order-badge">STATUS: ${order.paymentStatus || 'PAID — DEMO'}</div>
      <table class="detail-table">
        <tr><th>Order ID</th><td><strong>${order.orderId}</strong></td></tr>
        <tr><th>Customer Name</th><td>${order.customerName}</td></tr>
        <tr><th>Customer Email</th><td>${order.customerEmail}</td></tr>
        <tr><th>Customer Phone</th><td>${order.customerPhone}</td></tr>
        <tr><th>Delivery Address</th><td>${order.deliveryAddress}</td></tr>
        <tr><th>Product Name</th><td>${order.productName}</td></tr>
        <tr><th>Category</th><td>${order.productCategory}</td></tr>
        <tr><th>Unit Price</th><td>PKR ${order.unitPrice.toLocaleString('en-PK')}</td></tr>
        <tr><th>Quantity</th><td>${order.quantity}</td></tr>
        <tr class="total-row"><th>Total Amount</th><td>PKR ${order.totalAmount.toLocaleString('en-PK')}</td></tr>
        <tr><th>Order Date</th><td>${order.orderDate}</td></tr>
      </table>
    </div>
    <div class="footer">
      <p>Yasir Mobile Store · Commercial Area, Phase 6, DHA, Lahore, Pakistan · WhatsApp: 03293179587</p>
    </div>
  </div>
</body>
</html>
      `;

      // If Resend API key is present, attempt live email dispatch
      if (resendApiKey) {
        try {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: 'Yasir Store Orders <onboarding@resend.dev>',
              to: [recipientEmail],
              subject,
              text: plainText,
              html: htmlBody,
            }),
          });

          if (resendResponse.ok) {
            const resendData = await resendResponse.json();
            res.json({
              success: true,
              mode: 'live',
              messageId: resendData.id,
              recipient: recipientEmail,
              orderId: order.orderId,
            });
            return;
          } else {
            const errorDetails = await resendResponse.text();
            console.warn('[Order Email] Resend delivery response error:', errorDetails);
            res.json({
              success: false,
              mode: 'failed_to_send',
              error: 'Failed to deliver live email via provider. Details logged on server.',
              recipient: recipientEmail,
              orderId: order.orderId,
            });
            return;
          }
        } catch (mailErr: any) {
          console.error('[Order Email] Error connecting to Resend:', mailErr);
          res.json({
            success: false,
            mode: 'network_error',
            error: mailErr?.message || 'Network error reaching email service',
            orderId: order.orderId,
          });
          return;
        }
      }

      // In demo environment without Resend API key:
      console.log(`[Order Email Simulation] Order ${order.orderId} recorded for ${recipientEmail}.`);
      console.log(plainText);

      res.json({
        success: true,
        mode: 'demo',
        recipient: recipientEmail,
        orderId: order.orderId,
        message: `Order notification saved in demo mode for ${recipientEmail}.`,
      });
    } catch (err: any) {
      console.error('[Order Email] Internal server error:', err);
      res.status(500).json({ success: false, error: 'Internal server error processing notification' });
    }
  });

  // API Route: Get demo orders
  app.get('/api/orders', (_req: Request, res: Response) => {
    res.json({ orders: demoOrders });
  });

  // Mount Vite middleware in development or serve static in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Yasir Mobile Store server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
