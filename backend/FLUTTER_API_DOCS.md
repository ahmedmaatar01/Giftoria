# Giftoria Mobile API Documentation

**Base API URL:** `https://api.giftoria.me/api`
**Authentication:** Bearer Token (Sanctum). Attach `Authorization: Bearer {token}` to protected endpoints. Send `"client": "mobile"` at login and register so the token lasts 30 days. On a `401`, send the user to the login screen.
**Headers:** Send `Accept: application/json` on every request.

---

## 1. Authentication (Users)

### Register a new Customer
- **Endpoint:** `POST /user/register`
- **Body (JSON):**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "country": "Qatar",
    "address": "123 Main St",
    "client": "mobile"
  }
  ```
- **Response (200 OK):**
  Returns `access_token` and `user` object.

### Login Customer
- **Endpoint:** `POST /user/login`
- **Body (JSON):**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword",
    "client": "mobile"
  }
  ```
- **Response (200 OK):**
  Returns `access_token` and `user` object.

### Get Current User Profile
- **Endpoint:** `GET /user/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User JSON object.

### Update Profile
- **Endpoint:** `PUT /user/update`
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):** (All fields optional) `name`, `last_name`, `email`, `current_password`, `password`, `password_confirmation`, `country`, `address`.

### Forgot Password
Sends an email linking to `https://giftoria.me/reset-password?token=...&email=...`, valid for 60 minutes. The user sets the new password on that page.
- **Endpoint:** `POST /user/forgot-password`
- **Body (JSON):** `{ "email": "john@example.com" }`
- **Response (200 OK):** The same message whether or not the account exists. Repeat requests for one email within 60 seconds send no new email. More than 6 requests a minute returns `429`.

### Reset Password
Only needed for an in-app reset screen. On success, all of the user's sessions and registered devices are removed.
- **Endpoint:** `POST /user/reset-password`
- **Body (JSON):** `token`, `email`, `password` (min 8), `password_confirmation`.
- **Response:** `200 OK`, or `422` with a `message` if the link is invalid or expired.

### Logout
Ends all of the user's sessions and removes all their registered devices.
- **Endpoint:** `POST /user/logout`
- **Headers:** `Authorization: Bearer <token>`

---

## 2. Catalog & Home Page

### Get Home Page Content (Hero Video/Image)
- **Endpoint:** `GET /home-page-details`
- **Response:**
  ```json
  {
    "id": 1,
    "hero_type": "image", 
    "hero_title_en": "Welcome",
    "hero_title_ar": "مرحباً",
    "hero_media": "home/12345_hero.jpg" 
  }
  ```

### Get All Categories
- **Endpoint:** `GET /categories`
- **Response:** Array of categories. Includes nested `parent`, `children`, `images`, and `customFields`.

### Get All Products
- **Endpoint:** `GET /products`
- **Response:** Array of products. Includes nested `category.customFields`, `images`, and `customValues`.

### Get Featured Products
- **Endpoint:** `GET /products/featured`
- **Response:** Array of products where `featured = 1`.

### Get Single Product Details
- **Endpoint:** `GET /products/{id}`
- **Response:** Single product object with loaded relations (images, custom values, category custom fields).

### Get Available Gift Cards
- **Endpoint:** `GET /gift-cards`
- **Response:** Array of active gift card templates (with images and occasion associations).

### Get Occasions
- **Endpoint:** `GET /occasions`
- **Response:** Array of occasions (e.g., Birthdays, Anniversaries).

---

## 3. Orders & Checkout (Commands)

### Create an Order (Checkout)
*Note: Works for both Guests and Authenticated Users. If logged in, pass the Bearer token.*
- **Endpoint:** `POST /commands`
- **Body (JSON):**
  ```json
  {
    "customer_first_name": "John",
    "customer_last_name": "Doe",
    "customer_email": "john@example.com",
    "customer_phone": "97412345678",
    "shipping_address": "Doha, Qatar",
    "billing_address": "Doha, Qatar",
    "payment_method": "online", // or 'cod'
    "source": "mobile_app",
    "description": "Please deliver in the evening",
    "desired_delivery_at": "2026-03-20 18:00:00",
    "products": [
      {
        "product_id": 1,
        "quantity": 2,
        "custom_fields": [
          { "field_id": 1, "value": "Red" }
        ]
      }
    ],
    "gift_card": {
      "template_id": 3,  // Optional (id from /gift-cards)
      "custom_description": "Happy Birthday!",
      "custom_signing": "data:image/png;base64,iVBORw0KGgoAAAANSUh..." // Base64 drawn signature (optional)
    }
  }
  ```
- **Response (201 Created):**
  Returns the created `command` object, including the `id` needed for payment.

### Get User's Order History
- **Endpoint:** `GET /users/{userId}/commands`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "user": {...}, "commands": [...] }`. Orders include nested products, statuses, and notes.

### Get and Add Order Notes
- **Endpoints:** `GET /commands/{id}/notes` and `POST /commands/{id}/notes` with `{ "content": "..." }`
- **Headers:** `Authorization: Bearer <token>`
- **When showing notes:** Show a note only if `is_visible_to_customer` is true and `note_type` is not `admin`. Label notes with `admin_id` set as "Giftoria" and do not display the `admin` object, which can hold the wrong person's details.

### Get Order Status (Public)
- **Endpoint:** `GET /public/order-status/{commandId}`
- **Response:** `{ "status": "pending" }`

### Get Order Payment Status (Public)
- **Endpoint:** `GET /public/order-payment-status/{commandId}`
- **Response:** `{ "status": "paid" | "pending" | "failed" }`

---

## 4. Payment Integration (SADAD)

*Once an order is created via `POST /commands`, the app must initiate payment.*

### Init Payment (For Mobile Webview)
When the user clicks "Pay", redirect them (or open a webview) to the backend web route:
- **URL:** `https://api.giftoria.me/sadad/pay?order_id={command_id}`

The user will complete the payment in the browser/webview. Upon completion, they will be redirected by SADAD back to:
- `https://giftoria.me/payment-processing?order_id={command_id}`

*The mobile app should intercept this final redirect URL in the Webview to detect payment completion, and then ping `GET /public/order-payment-status/{commandId}` to verify if it was a success.*


---

## 5. Push Notifications (Firebase Cloud Messaging)

Customers get a push when their order status changes and when staff add a customer-visible note. Guest orders, internal notes, and the customer's own notes send nothing. Pushes start once the Firebase service account key is on the server (`FCM_CREDENTIALS`); until then the inbox still fills.

These routes accept customer tokens only. Admin tokens get `401`.

### Register a Device
Call after login and register, on FCM token refresh, and when the user changes language. Safe to repeat. If another account logs in on the same phone, the device moves to that account.
- **Endpoint:** `POST /user/device-tokens`
- **Body (JSON):**
  ```json
  {
    "token": "FCM token",
    "platform": "android",
    "locale": "ar"
  }
  ```
  `platform` is `android`, `ios`, or `web`. `locale` is `en` or `ar` (default `en`) and sets the push language.

### Remove a Device
- **Endpoint:** `DELETE /user/device-tokens`
- **Body (JSON):** `{ "token": "FCM token" }`

### Push Data Payload
All values are strings. `command_id` is the order ID. Open that order when the user taps the push.
```json
{
  "type": "order_status_changed",
  "notification_id": "9d3f6c1e-...",
  "command_id": "412",
  "status": "shipped"
}
```
```json
{
  "type": "order_note_added",
  "notification_id": "9d3f6c1e-...",
  "command_id": "412",
  "note_id": "87"
}
```

---

## 6. Notification Inbox

Every notification is saved here, even if the push never arrives.

### List Notifications
Newest first, 20 per page. Use `?page=2` for more and `?unread=1` for unread only.
- **Endpoint:** `GET /user/notifications`
- **Response:**
  ```json
  {
    "current_page": 1,
    "last_page": 3,
    "next_page_url": "https://api.giftoria.me/api/user/notifications?page=2",
    "total": 47,
    "data": [
      {
        "id": "9d3f6c1e-...",
        "type": "order_status_changed",
        "command_id": 412,
        "status": "shipped",
        "title": { "en": "Order #412 update", "ar": "تحديث الطلب رقم 412" },
        "body": { "en": "Your order has been shipped.", "ar": "تم شحن طلبك." },
        "read_at": null,
        "created_at": "2026-11-07T10:30:00.000000Z"
      }
    ]
  }
  ```

### Unread Count
- **Endpoint:** `GET /user/notifications/unread-count`
- **Response:** `{ "count": 3 }`

### Mark as Read
- **Endpoints:** `POST /user/notifications/{id}/read` and `POST /user/notifications/read-all`
