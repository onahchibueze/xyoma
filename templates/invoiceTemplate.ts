import { IOrder } from "@/models/Order";

/**
 * Generates a professional luxury-styled HTML invoice.
 * 
 * @param {IOrder} order - The order data object.
 * @param {string} customerName - The name of the customer.
 * @returns {string} - The complete HTML string for the invoice.
 */
export const generateInvoiceHTML = (order: IOrder, customerName: string): string => {
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const itemsHTML = order.orderItems.map(item => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
        <div style="font-weight: 700; font-size: 13px; color: #000000; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">${item.title}</div>
        <div style="font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">Size: ${item.size || 'N/A'}</div>
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; text-align: center; color: #000000; font-size: 13px;">${item.quantity}</td>
      <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; text-align: right; color: #000000; font-weight: 700; font-size: 13px;">₦${item.price.toLocaleString()}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XYOMA - Invoice</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #f2f2f2; border-radius: 4px;">
          <!-- Header -->
          <tr>
            <td style="padding: 60px 50px 40px 50px; text-align: center; border-bottom: 1px solid #f8f8f8;">
              <h1 style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: 12px; text-transform: uppercase; color: #000000;">XYOMA</h1>
              <p style="margin: 15px 0 0 0; font-size: 10px; letter-spacing: 5px; color: #aaaaaa; text-transform: uppercase;">Official Payment Receipt</p>
            </td>
          </tr>

          <!-- Summary Info -->
          <tr>
            <td style="padding: 40px 50px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="width: 50%; vertical-align: top;">
                    <p style="margin: 0 0 10px 0; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 2px;">Order For</p>
                    <p style="margin: 0; font-size: 15px; color: #000000; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${customerName}</p>
                  </td>
                  <td style="width: 50%; text-align: right; vertical-align: top;">
                    <p style="margin: 0 0 10px 0; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 2px;">Invoice Number</p>
                    <p style="margin: 0; font-size: 15px; color: #000000; font-weight: 700;">#${order._id.toString().slice(-8).toUpperCase()}</p>
                    <p style="margin: 5px 0 0 0; font-size: 11px; color: #666666;">${date}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 50px 40px 50px;">
              <div style="height: 1px; width: 100%; background-color: #f2f2f2; margin-bottom: 30px;"></div>
              <p style="margin: 0; font-size: 14px; line-height: 1.8; color: #444444;">
                Thank you for your order. We are pleased to confirm that your payment has been successfully processed through our secure terminal. Your order is now being architected for delivery.
              </p>
            </td>
          </tr>

          <!-- Item Table -->
          <tr>
            <td style="padding: 0 50px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th style="text-align: left; font-size: 9px; color: #999999; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 15px; border-bottom: 2px solid #000000;">Item Architecture</th>
                    <th style="text-align: center; font-size: 9px; color: #999999; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 15px; border-bottom: 2px solid #000000;">Qty</th>
                    <th style="text-align: right; font-size: 9px; color: #999999; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 15px; border-bottom: 2px solid #000000;">Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Calculation Summary -->
          <tr>
            <td style="padding: 30px 50px 40px 50px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 8px 0; font-size: 12px; color: #777777; text-transform: uppercase; letter-spacing: 1px;">Subtotal</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #000000; text-align: right; font-weight: 600;">₦${order.itemsPrice.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 12px; color: #777777; text-transform: uppercase; letter-spacing: 1px;">Logistics / Shipping</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #000000; text-align: right; font-weight: 600;">₦${order.shippingPrice.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 20px 0 0 0; font-size: 18px; color: #000000; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; border-top: 2px solid #000000;">Total Paid</td>
                  <td style="padding: 20px 0 0 0; font-size: 18px; color: #000000; font-weight: 900; text-align: right; border-top: 2px solid #000000;">₦${order.totalPrice.toLocaleString()}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Security -->
          <tr>
            <td style="padding: 0 50px 60px 50px;">
              <div style="background-color: #fafafa; padding: 25px; border-radius: 2px; border: 1px solid #f0f0f0;">
                <p style="margin: 0 0 10px 0; font-size: 9px; color: #999999; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Secure Reference</p>
                <p style="margin: 0; font-size: 12px; color: #000000; font-family: 'Courier New', Courier, monospace; word-break: break-all;">${order.paymentInfo.id}</p>
                <div style="margin-top: 15px; font-size: 9px; color: #000000; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Status: VERIFIED SUCCESS</div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 50px; background-color: #000000; text-align: center; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px;">
              <p style="margin: 0 0 20px 0; font-size: 11px; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; font-weight: 700;">Connect with the Collective</p>
              <p style="margin: 0; font-size: 9px; color: #555555; letter-spacing: 1.5px; text-transform: uppercase; line-height: 2;">
                &copy; ${new Date().getFullYear()} XYOMA STUDIO. ALL RIGHTS RESERVED.<br>
                HIGH-END RUNWAY FASHION & ARCHITECTURE.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
