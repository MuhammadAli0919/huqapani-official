import test from "node:test";
import assert from "node:assert/strict";
import { createOrderHandler, normalizeOrder, buildEmail } from "./order-notification.js";

const orderBody = {
  name: "<Customer>",
  phone: "03001234567",
  address: "12 Example Road",
  city: "Karachi",
  payment: "Cash on Delivery (COD)",
  consent: true,
  website: "",
  items: [{ id: "oxva-xlim-pro", quantity: 2, unitPrice: 1 }]
};

function createResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(status) { this.statusCode = status; return this; },
    json(body) { this.body = body; return this; }
  };
}

function createRequest(overrides = {}) {
  return {
    method: "POST",
    headers: {
      origin: "https://huqapani.example",
      "content-type": "application/json",
      "x-real-ip": `test-${Math.random()}`
    },
    body: orderBody,
    ...overrides
  };
}

const configuredEnv = {
  SITE_ORIGIN: "https://huqapani.example/",
  SMTP_USER: "store@gmail.com",
  SMTP_APP_PASSWORD: "test-password"
};

test("recomputes prices and shipping from the server product catalog", () => {
  const result = normalizeOrder(orderBody);
  assert.equal(result.order.subtotal, 25000);
  assert.equal(result.order.shipping, 0);
  assert.equal(result.order.total, 25000);
  assert.equal(result.order.items[0].unitPrice, 12500);
});

test("rejects unknown products and invalid quantities", () => {
  assert.match(normalizeOrder({ ...orderBody, items: [{ id: "unknown", quantity: 1 }] }).error, /invalid/i);
  assert.match(normalizeOrder({ ...orderBody, items: [{ id: "oxva-xlim-pro", quantity: 0 }] }).error, /invalid/i);
});

test("requires explicit consent before sending customer information", async () => {
  let sendAttempted = false;
  const handler = createOrderHandler({
    env: configuredEnv,
    createTransport: () => ({ sendMail: async () => { sendAttempted = true; } })
  });
  const res = createResponse();

  await handler(createRequest({ body: { ...orderBody, consent: false } }), res);

  assert.equal(res.statusCode, 400);
  assert.equal(sendAttempted, false);
  assert.match(res.body.error, /consent/i);
});

test("enforces the per-instance request limit", async () => {
  const handler = createOrderHandler({ env: configuredEnv });
  const results = [];

  for (let attempt = 0; attempt < 6; attempt++) {
    const res = createResponse();
    const req = createRequest({
      headers: { ...createRequest().headers, "x-real-ip": "test-rate-limit" },
      body: { ...orderBody, consent: false }
    });
    await handler(req, res);
    results.push(res.statusCode);
  }

  assert.deepEqual(results, [400, 400, 400, 400, 400, 429]);
});

test("sends a complete email and returns server-calculated totals", async () => {
  let sentMessage;
  const handler = createOrderHandler({
    env: configuredEnv,
    createTransport: () => ({ sendMail: async message => { sentMessage = message; } })
  });
  const res = createResponse();

  await handler(createRequest(), res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.total, 25000);
  assert.match(res.body.reference, /^HP-/);
  assert.equal(sentMessage.to, "blinkingspectrum@gmail.com");
  assert.match(sentMessage.text, /03001234567/);
  assert.match(sentMessage.text, /12 Example Road/);
  assert.match(sentMessage.text, /Email processing consent: Confirmed/);
  assert.match(sentMessage.text, /Rs\. 25,000/);
  assert.match(sentMessage.html, /&lt;Customer&gt;/);
});

test("rejects an untrusted request origin without sending email", async () => {
  let sendAttempted = false;
  const handler = createOrderHandler({
    env: configuredEnv,
    createTransport: () => ({ sendMail: async () => { sendAttempted = true; } })
  });
  const req = createRequest({ headers: { ...createRequest().headers, origin: "https://attacker.example" } });
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 403);
  assert.equal(sendAttempted, false);
});

test("reports email delivery failures without a success response", async () => {
  const handler = createOrderHandler({
    env: configuredEnv,
    createTransport: () => ({ sendMail: async () => { throw new Error("SMTP unavailable"); } })
  });
  const res = createResponse();
  const originalError = console.error;
  console.error = () => {};
  try {
    await handler(createRequest(), res);
  } finally {
    console.error = originalError;
  }

  assert.equal(res.statusCode, 502);
  assert.equal(res.body.ok, undefined);
  assert.match(res.body.error, /couldn't send/i);
});

test("builds an email that identifies payment as a preference only", () => {
  const { order } = normalizeOrder(orderBody);
  const message = buildEmail(order);
  assert.match(message.text, /Payment preference only; no payment was collected/);
});
