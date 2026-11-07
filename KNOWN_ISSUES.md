# Giftoria Known Issues

Problems found while reviewing the code on 2026-11-07, to fix later. They come from reading the code and were not tested against the live site.

## Critical security

- [ ] **Anyone can become an admin.** `POST /api/admin/register` is public and returns an admin token. See [AdminAuthController.php:13](backend/app/Http/Controllers/Api/AdminAuthController.php#L13) and [routes/api.php](backend/routes/api.php).
- [ ] **The catalog can be edited without logging in.** Create, update and delete have no auth on `categories`, `products`, `product-images`, `custom-fields`, `product-custom-values`, `occasions`, `gift-cards`, `tags` and `home-page-details`, plus the image and gift card selection routes. See [routes/api.php](backend/routes/api.php).
- [ ] **Payments can be faked.** A forged request can mark an order as paid:
  - The webhook's checksum rejection is commented out: [SadadPaymentController.php:380](backend/app/Http/Controllers/SadadPaymentController.php#L380).
  - The callback never checks a checksum: [SadadPaymentController.php:275](backend/app/Http/Controllers/SadadPaymentController.php#L275).
  - `paymentSuccess` marks the order paid without verifying anything: [SadadPaymentController.php:236](backend/app/Http/Controllers/SadadPaymentController.php#L236).
  - Before turning checksums back on, check the logs. They may have been disabled because valid Sadad requests were failing, and re-enabling them as is could block real payments.
- [ ] **Customer data is public.** `GET /api/commands/{id}/details` needs no login, so guessing order IDs reveals names, phone numbers and addresses. See [CommandController.php:536](backend/app/Http/Controllers/Api/CommandController.php#L536).

## High security

- [ ] **Customers can reach other customers' orders.** The order routes only check for a valid login, not ownership or admin rights, so any customer can list, change or delete any order. The ownership check in `getCommandsByUser` is commented out. See [CommandController.php:344](backend/app/Http/Controllers/Api/CommandController.php#L344).
- [ ] **Customers can change order status.** `PUT /api/commands/{id}/status` accepts any logged-in user. See [CommandController.php:503](backend/app/Http/Controllers/Api/CommandController.php#L503).
- [ ] **Order status can be set at checkout.** The public `POST /api/commands` accepts `status` from the client, so an order can be created as `paid`. See [CommandController.php:86](backend/app/Http/Controllers/Api/CommandController.php#L86).
- [ ] **Internal notes are public.** `GET /api/commands/{id}/notes` needs no login and returns staff-only notes. See [CommandController.php:375](backend/app/Http/Controllers/Api/CommandController.php#L375). The Flutter docs currently tell the app to filter these out, so update them after the fix.
- [ ] **Fake staff access on notes.** `addNote` treats anyone whose email contains "admin" as staff. See [CommandController.php:401](backend/app/Http/Controllers/Api/CommandController.php#L401).
- [ ] **Wrong person on staff notes.** `OrderNote::admin()` looks up `users` instead of `admins`, so it can return an unrelated customer's details. See [OrderNote.php](backend/app/Models/OrderNote.php). The Flutter docs also mention this, so update them after the fix.
- [ ] **Secrets are committed.** [backend/.env.production](backend/.env.production) is tracked with a non-empty `APP_KEY`, database password and mail password. Rotate them and remove the file from git.
- [ ] **The Sadad secret key is written to the logs.** See `pay` at [SadadPaymentController.php:93](backend/app/Http/Controllers/SadadPaymentController.php#L93) and the `key_value` and `pre_hash_string` entries in the webhook at [SadadPaymentController.php:336](backend/app/Http/Controllers/SadadPaymentController.php#L336). Rotate the key if these logs may have been seen.
- [ ] **Debug routes are public.** Remove `/api/clear-cache`, `/api/test` and `/api/categories-test` from [routes/api.php](backend/routes/api.php), and `/debug-web` and `/debug-api` from [routes/web.php](backend/routes/web.php).

## Bugs

- [ ] **Payment details aren't saved.** `paid_at` and `payment_reference` are missing from `$fillable` in [Command.php](backend/app/Models/Command.php), so those updates are silently dropped. Also check that both columns exist.
- [ ] **The backend container may stop itself.** The `CMD` in [backend/Dockerfile](backend/Dockerfile) wraps the server in `timeout 120`, so it exits after 2 minutes. It also skips migrations, because the entrypoint script is created but never used. Check whether production uses this `CMD`.
- [ ] **Dead payment page.** [app/sadad-payment/page.jsx](GiftoriaStore/app/sadad-payment/page.jsx) calls `/payments/sadad/*` routes that don't exist.
- [ ] **Possibly unreachable route, not confirmed.** `GET /api/gift-cards/available` is defined after the `gift-cards` resource, so `gift-cards/{id}` may catch it first.

## Decisions needed

- [ ] **Firebase ownership.** The handoff doc assumes the app developer creates the Firebase project.
- [ ] **Replies to contact messages.** The contact form only sends an email, so these replies can't trigger a notification. This would need a new feature.

## Before deploying push notifications and password reset

- [ ] Commit the changes and run `php artisan migrate --force` on the server.
- [ ] Set `FCM_CREDENTIALS` on the server, as base64 of the Firebase service account JSON.
- [ ] Send a real push to a real device. So far Firebase has only been simulated in tests.
- [ ] Set `APP_NAME=Giftoria` on the server, so the reset email doesn't sign off "Regards, Laravel".
- [ ] Have a native speaker review the Arabic in [lang/ar/push.php](backend/lang/ar/push.php).
- [ ] Share the handoff doc with the app developer: https://claude.ai/artifact/Ky5LTPv4WBJBoUcaZm7UNb

## Cleanup

- [ ] **Translate the reset email.** It's currently English only.
- [ ] **Remove leftover template code.** Most of the storefront is unused theme pages such as `home-*` and `product-style-*`, and live pages import from oddly named folders, such as `home-baby/Products2`. The admin also keeps Volt demo pages.
- [ ] **Add tests.** Only password reset and notifications have real tests. Orders, payments and catalog permissions have none. To run the suite, create a local `giftoria_test` database.
- [ ] **Update the README.** It says the admin uses React 18, but it's on 16, and it mentions an `AdminMiddleware` and a `.env.example` that aren't in the repo.
