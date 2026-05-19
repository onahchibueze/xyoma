import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { IOrder } from "@/models/Order";
import { sendEmail } from "@/lib/email";
import { generateInvoiceHTML } from "@/templates/invoiceTemplate";

/**
 * Orchestrates the fetching of customer data and sending of the invoice email.
 * 
 * @param {IOrder} order - The order for which the invoice is being sent.
 * @returns {Promise<void>} - A promise that resolves when the invoice email has been attempted.
 */
export async function sendOrderInvoice(order: IOrder): Promise<void> {
  try {
    await dbConnect();

    // 1. Fetch user to get current email and name
    const user = await User.findById(order.userId).select("name email");

    if (!user) {
      console.error(`[Invoice Error] User not found for ID: ${order.userId}`);
      return;
    }

    // 2. Generate the high-end HTML content
    const htmlContent = generateInvoiceHTML(order, user.name);

    // 3. Send the email via SMTP
    await sendEmail({
      to: user.email,
      subject: `XYOMA - Payment Receipt [#${order._id.toString().slice(-8).toUpperCase()}]`,
      html: htmlContent,
    });

    console.log(`[Invoice Success] Receipt sent to ${user.email} for order ${order._id}`);
  } catch (error) {
    // We log the error but don't throw to avoid crashing the webhook handler
    console.error("[Invoice Error] Failed to send invoice email:", error);
  }
}
