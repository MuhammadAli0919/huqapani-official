import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";

const ORDER_TO = "blinkingspectrum@gmail.com";
const FREE_SHIPPING_AT = 15000;
const DELIVERY_FEE = 350;
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const recentRequests = new Map();

const PRODUCTS = {
  "oxva-xlim-pro": { name: "XLIM 3 Ultra Pod Kit 30W", price: 12500 },
  "oxva-xlim-pro-3": { name: "XLIM Pro 3 Pod Kit", price: 8200 },
  "vaporesso-xros": { name: "XROS 5 Pod Kit", price: 8900 },
  "vaporesso-xros-nano": { name: "XROS 5 Nano Pod Kit", price: 8900 },
  "uwell-caliburn-koko": { name: "Caliburn G5 Koko Pod Kit", price: 10500 },
  "elf-bar-600": { name: "Ice King Strawberry Watermelon", price: 4200 },
  "voopoo-drag": { name: "DRAG S3 Pod Mod Kit 60W", price: 18900 },
  "voopoo-argus-p3": { name: "ARGUS P3 Pod System Kit", price: 7800 },
  "pod-salt": { name: "Pod Salt Apple Nic Salt 30ml", price: 3900 },
  "nasty-juice": { name: "Strawberry Trap Queen E-Juice", price: 5600 },
  "alfakher-double-apple": { name: "Two Apple Shisha Tobacco 50g", price: 6800 },
  "oduman-mini": { name: "Oduman Mini Hookah", price: 23500 },
  "kaloud-hmd": { name: "Lotus Heat Manager", price: 16900 },
  "raw-papers": { name: "RAW Classic Rolling Papers", price: 950 },
  "zippo-lighter": { name: "Classic Pocket Lighter", price: 7400 }
};

const CITIES = new Set(["Karachi", "Lahore", "Islamabad", "Nationwide / Other"]);
const PAYMENT_METHODS = new Set([
  "Cash on Delivery (COD)",
  "JazzCash (demo)",
  "EasyPaisa (demo)",
  "Bank Transfer (demo)"
]);

function respond(res, status, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function normalizeOrder(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Invalid order details." };
  }

  const name = cleanText(body.name, 100);
  const phone = cleanText(body.phone, 30);
  const address = cleanText(body.address, 300);
  const city = cleanText(body.city, 40);
  const payment = cleanText(body.payment, 40);

  if (name.length < 2 || phone.length < 7 || address.length < 5) {
    return { error: "Please provide a valid name, phone number, and delivery address." };
  }
  if (!CITIES.has(city) || !PAYMENT_METHODS.has(payment)) {
    return { error: "Please choose a valid city and payment method." };
  }
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 30) {
    return { error: "Your order must contain between 1 and 30 product lines." };
  }

  const items = [];
  for (const item of body.items) {
    const product = item && PRODUCTS[item.id];
    const quantity = Number(item?.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return { error: "An item in your cart is invalid. Please review your cart and try again." };
    }

    items.push({
      id: item.id,
      name: product.name,
      quantity,
      unitPrice: product.price,
      nicotine: cleanText(item.nicotine, 40),
      flavour: cleanText(item.flavour, 60)
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : DELIVERY_FEE;

  return {
    order: {
      reference: `HP-${randomUUID().slice(0, 8).toUpperCase()}`,
      name,
      phone,
      address,
      city,
      payment,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      createdAt: new Date().toISOString()
    }
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function formatMoney(value) {
  return `Rs. ${Number(value).toLocaleString("en-PK")}`;
}

export function buildEmail(order) {
  const itemRows = order.items.map(item => {
    const options = [item.nicotine, item.flavour].filter(Boolean).join(" · ");
    const detail = options ? ` <span style="color:#777">(${escapeHtml(options)})</span>` : "";
    return `<tr>
      <td style="padding:10px;border-bottom:1px solid #eee">${escapeHtml(item.name)}${detail}</td>
      <td style="padding:10px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">${formatMoney(item.unitPrice * item.quantity)}</td>
    </tr>`;
  }).join("");

  const textItems = order.items.map(item => {
    const options = [item.nicotine, item.flavour].filter(Boolean).join(" / ");
    return `- ${item.name}${options ? ` (${options})` : ""} x ${item.quantity}: ${formatMoney(item.unitPrice * item.quantity)}`;
  }).join("\n");

  return {
    html: `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f5f3;font-family:Arial,sans-serif;color:#222">
      <main style="max-width:680px;margin:auto;padding:24px;background:#fff;border:1px solid #e8e8e4">
        <p style="color:#9a672b;text-transform:uppercase;letter-spacing:2px;font-size:12px">Huqa Pani · New order request</p>
        <h1 style="font-size:24px">Order ${escapeHtml(order.reference)}</h1>
        <p style="color:#666">Submitted ${escapeHtml(order.createdAt)}</p>
        <h2 style="font-size:17px">Customer and delivery</h2>
        <p><strong>Name:</strong> ${escapeHtml(order.name)}<br>
        <strong>Phone:</strong> ${escapeHtml(order.phone)}<br>
        <strong>Address:</strong> ${escapeHtml(order.address)}<br>
        <strong>City:</strong> ${escapeHtml(order.city)}<br>
        <strong>Payment preference:</strong> ${escapeHtml(order.payment)}<br>
        <strong>Email processing consent:</strong> Confirmed at checkout</p>
        <h2 style="font-size:17px">Items</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead><tr><th style="padding:10px;text-align:left">Product</th><th style="padding:10px">Qty</th><th style="padding:10px;text-align:right">Amount</th></tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p style="text-align:right;line-height:1.9"><strong>Subtotal:</strong> ${formatMoney(order.subtotal)}<br>
        <strong>Delivery:</strong> ${order.shipping ? formatMoney(order.shipping) : "Free"}<br>
        <strong style="font-size:18px">Total: ${formatMoney(order.total)}</strong></p>
        <p style="padding-top:12px;border-top:1px solid #eee;color:#777;font-size:12px">Payment preference only; no payment was collected by this notification.</p>
      </main></body></html>`,
    text: `New Huqa Pani order request: ${order.reference}
Submitted: ${order.createdAt}

Customer and delivery
Name: ${order.name}
Phone: ${order.phone}
Address: ${order.address}
City: ${order.city}
Payment preference: ${order.payment}
Email processing consent: Confirmed at checkout

Items
${textItems}

Subtotal: ${formatMoney(order.subtotal)}
Delivery: ${order.shipping ? formatMoney(order.shipping) : "Free"}
Total: ${formatMoney(order.total)}

Payment preference only; no payment was collected by this notification.`
  };
}

function isRateLimited(ip, now = Date.now()) {
  for (const [key, timestamps] of recentRequests) {
    const active = timestamps.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);
    if (active.length) recentRequests.set(key, active);
    else recentRequests.delete(key);
  }

  const timestamps = recentRequests.get(ip) || [];
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) return true;
  timestamps.push(now);
  recentRequests.set(ip, timestamps);
  return false;
}

export function createOrderHandler({
  env = process.env,
  createTransport = options => nodemailer.createTransport(options)
} = {}) {
  return async function handler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return respond(res, 405, { error: "Method not allowed." });
    }

    let expectedOrigin;
    try {
      expectedOrigin = new URL(env.SITE_ORIGIN).origin;
    } catch {
      console.error("SITE_ORIGIN is not configured with a valid URL.");
      return respond(res, 503, { error: "Order notifications are not configured yet." });
    }
    if (req.headers.origin !== expectedOrigin) {
      return respond(res, 403, { error: "Request origin is not allowed." });
    }

    const smtpUser = env.SMTP_USER;
    const smtpPassword = env.SMTP_APP_PASSWORD;
    const fromEmail = env.ORDER_FROM_EMAIL || smtpUser;
    if (!smtpUser || !smtpPassword || !fromEmail) {
      console.error("SMTP_USER and SMTP_APP_PASSWORD must be configured.");
      return respond(res, 503, { error: "Order notifications are not configured yet." });
    }

    const contentLength = Number(req.headers["content-length"] || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return respond(res, 413, { error: "Order details are too large." });
    }

    const contentType = req.headers["content-type"] || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return respond(res, 415, { error: "Send order details as JSON." });
    }
    if (Buffer.byteLength(JSON.stringify(req.body ?? null), "utf8") > MAX_BODY_BYTES) {
      return respond(res, 413, { error: "Order details are too large." });
    }

    const ip = req.headers["x-real-ip"] || req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return respond(res, 429, { error: "Too many order attempts. Please wait and try again." });
    }

    if (cleanText(req.body?.website, 200)) {
      return respond(res, 200, { ok: true, reference: "received" });
    }
    if (req.body?.consent !== true) {
      return respond(res, 400, { error: "Please consent to email processing before submitting your order request." });
    }

    const normalized = normalizeOrder(req.body);
    if (normalized.error) return respond(res, 400, { error: normalized.error });

    const order = normalized.order;
    const email = buildEmail(order);
    try {
      const transporter = createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPassword }
      });
      await transporter.sendMail({
        from: `"Huqa Pani Orders" <${fromEmail}>`,
        to: ORDER_TO,
        replyTo: fromEmail,
        subject: `New order request ${order.reference} · ${formatMoney(order.total)}`,
        text: email.text,
        html: email.html
      });
    } catch (error) {
      console.error("Order notification email failed.", error);
      return respond(res, 502, { error: "We couldn't send your order request. Please try again or contact the store." });
    }

    return respond(res, 200, {
      ok: true,
      reference: order.reference,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total
    });
  };
}

export default createOrderHandler();
