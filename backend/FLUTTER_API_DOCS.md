# Giftoria Mobile API Documentation

**Base API URL:** `https://api.giftoria.me/api`
**Authentication:** Bearer Token (Sanctum). Attach `Authorization: Bearer {token}` to protected endpoints.

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
    "address": "123 Main St"
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
    "password": "securepassword"
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
- **Response:** Array of user's orders, including nested products, statuses, and notes.

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
