# HUQA PANI Ecommerce Demo

This project is a premium, responsive ecommerce storefront built with vanilla HTML, CSS, and JavaScript.

## Run locally

```bash
npm install
npm run dev
```

The first run downloads the Vercel CLI through `npx`; sign in to your Vercel account and link the project when the CLI prompts. Open the URL printed by Vercel CLI (normally `http://localhost:3000`). Do not use Python's static server, VS Code Live Server, or another static-only preview for checkout: they cannot run the `api/order-notification.js` serverless function. For local email delivery, copy `.env.example` to the ignored `.env.local`, set your Gmail App Password, and set `SITE_ORIGIN` to the exact local origin printed by Vercel (for example `http://localhost:3000`). Never commit `.env.local`. Without SMTP credentials, the API returns a configuration error and won't send mail.

## Features included

- Premium black-and-gold storefront design
- Cinematic smoke background animation
- Age-gate verification modal
- Product catalog, filters, search, and product details
- Wishlist, shopping cart, and checkout flow
- User registration and login flow
- Dashboard and admin-style overview
- Responsive layout for desktop and mobile
- Newsletter subscription and contact form storage in localStorage
- Order requests emailed to the store through a Vercel serverless function

## Notes

The single-page storefront in `index.html` uses locally stored, item-matched product photos. The store owner confirmed authorization to use the photos. Source references:

- [OXVA XLIM 3 Ultra — VapeStation](https://vapestation.pk/wp-content/uploads/2026/01/Oxva-Xlim-3-Ultra-Pod-sale-in-pakistan.jpg)
- [OXVA XLIM Pro 3 — Smokers Alley](https://cdn.shopify.com/s/files/1/0960/3642/1933/files/IMG-2032.webp?v=1787954771)
- [Vaporesso XROS 5 Nano — VapeBazaar](https://vapebazaar.pk/wp-content/uploads/2026/02/xros_5_nano-black_satin.webp)
- [Vaporesso XROS 5 — Smokers Alley](https://cdn.shopify.com/s/files/1/0960/3642/1933/files/IMG-2031.png?v=1787954445)
- [Uwell G5 Koko — Smokers Alley](https://cdn.shopify.com/s/files/1/0960/3642/1933/files/BFAD7ADC-5E45-47E3-B81A-61D5BD66DA34.jpg?v=1787955449)
- [Elf Bar Ice King Strawberry Watermelon — VapeStation](https://vapestation.pk/wp-content/uploads/2025/02/Elf-Bar-Ice-King-Strawberry-Watermelon-50mg-30000-Puffs.jpg)
- [VOOPOO DRAG S3 — VapeStation](https://vapestation.pk/wp-content/uploads/2026/08/voopoo-drag-s3-color-blue-white-background.webp)
- [VOOPOO ARGUS P3 — Smokers Alley](https://cdn.shopify.com/s/files/1/0960/3642/1933/files/IMG-2036.webp?v=1787954944)
- [Pod Salt Apple — VapeStation](https://vapestation.pk/wp-content/uploads/2023/01/Pod-Salt-Apple-30ml-50mg-in-pakistan.jpg)
- [Nasty Juice Strawberry Trap Queen — Karachi Vapers](https://karachivapers.com/wp-content/uploads/2026/10/Nasty_Juice_Strawberry_Trap_Queen.png)
- [Al Fakher Two Apple 50g — Smokers Alley](https://cdn.shopify.com/s/files/1/0960/3642/1933/files/FB46DD15-0E43-4292-93A5-643B0D169241_63f6e5a9-066d-459d-ad49-4fb03dc89ef4.webp?v=1788443569)
- [RAW Classic — Smokers Alley](https://cdn.shopify.com/s/files/1/0960/3642/1933/files/F4844BBB-02CF-4D6E-98FD-1442CE87CE6D.png?v=1788083557)

Other catalog items use original inline SVG illustrations where an exact matching product photo was not verified. Product prices are demonstration data. Checkout emails an order request only; it does not process a payment or confirm live stock.

The cigarettes/cigars area is informational only: tobacco products and related cigarette brands are not included in the sales catalog. It links to the WHO tobacco fact sheet and advises visitors to check current local rules.

## Order notification setup (Vercel)

The order endpoint is `api/order-notification.js`. Deploy the project to Vercel and add these environment variables in the Vercel project settings for every environment you use:

- `SMTP_USER`: the Gmail account used to send store notifications.
- `SMTP_APP_PASSWORD`: a Google App Password for that account (requires 2-Step Verification); do not use the normal Gmail password.
- `SITE_ORIGIN`: exact public website origin, such as `https://huqapani.pk` (no path or trailing slash). Set the Vercel preview origin when testing previews.
- `ORDER_FROM_EMAIL` (optional): a sender address configured and authorized in that Gmail account; otherwise `SMTP_USER` is used.

Order notifications are delivered to `blinkingspectrum@gmail.com`. After adding or changing environment variables, redeploy. The checkout requires customer consent before sending the customer's name, phone, address, city, items, and payment preference to that inbox. Payment credentials are not collected, and payment methods are only preferences; store staff must contact the customer to confirm the order. The endpoint recalculates prices and delivery from its server-side product list; update that list when the catalog changes.

The in-memory request limit is best-effort per function instance, not a global rate limit. Add a persistent rate-limit or abuse-prevention service before relying on this endpoint for high-volume public orders.

The storefront also uses browser localStorage for cart and other demo persistence.
