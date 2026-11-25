# Firebase and payment setup

The app's live authentication, listings, media uploads, messaging, notifications, viewing requests, and Paystack checkout require a Firebase project. Payments are NGN-only and settle to the merchant account; they are not held in escrow. Do not switch to Paystack live keys until the test-mode flow has been verified.

## Configure Firebase

1. Create a Firebase project with billing enabled and register a web app. Enable **Authentication > Email/Password**, create a Firestore database, and create its Storage bucket.
2. From the `project` directory, copy `.env.example` to `.env.local` and fill in the web app values from Firebase. Keep `.env.local` private.
3. Install and sign in to the Firebase CLI, then select the project from the `project` directory:

   ```powershell
   npm install -g firebase-tools
   firebase login
   firebase use --add
   ```

4. Configure the Functions parameters in `functions/.env.<project-id>` using `functions/.env.example` as a template. Set `APP_BASE_URL` to the deployed site URL and `SUPPORT_EMAIL` to a monitored address. These parameter files are ignored by git.
5. Deploy the database rules and Functions:

   ```powershell
   firebase deploy --only firestore:rules,storage,functions
   ```

6. Configure an email delivery provider by installing Firebase's **Trigger Email** extension. Set its watched collection to `mail`, and complete its SMTP/provider settings. Contact, payment, and message emails are queued there; they are not delivered until the extension is configured.
7. Build and deploy the frontend:

   ```powershell
   npm run build
   firebase deploy --only hosting
   ```

## Configure Paystack

1. Start with a Paystack **test secret key** and set it as a Firebase Functions secret:

   ```powershell
   firebase functions:secrets:set PAYSTACK_SECRET_KEY
   ```

   Enter the key at the secure prompt; do not put it in `.env.local`, source files, or chat.
2. Deploy Functions and copy the deployed `paystackWebhook` URL from the Firebase console.
3. In Paystack's webhook settings, register that URL and enable `charge.success` and `charge.failed`. The function verifies Paystack's HMAC signature and checks transaction reference, amount, and currency before changing payment status.
4. Test with Paystack test credentials and a real Firestore listing before using live credentials. Existing sample listings are in-memory demo data and cannot be purchased; create/import listings into Firestore first.

## Bootstrap the first administrator

Admin registration is intentionally closed to the public. Create the intended account through the app and verify its email. Then use an authorized Google Cloud identity with Firebase Authentication admin permissions:

Run the following from the `project` directory:

```powershell
gcloud auth application-default login
$env:GOOGLE_CLOUD_PROJECT = "your-firebase-project-id"
npm --prefix functions run set-admin-claim -- grant admin@example.com
```

To remove administrator access later:

```powershell
npm --prefix functions run set-admin-claim -- revoke admin@example.com
```

Never commit service-account credentials. After granting or revoking a claim, the account must sign out and sign in again before the app sees the change.

## Deployment and readiness

Run `npm run build` from the workspace root and `npm --prefix project/functions run build` to validate the frontend and backend bundles. Use Firebase emulators and Paystack test mode to exercise sign-up/email verification, profile permissions, property uploads, buyer/owner conversations, viewing requests, successful/failed payments, webhook retries, and administrator actions.

This repository has not been connected to a live Firebase or Paystack project, and this setup has not been deployed or end-to-end tested. Do not treat the app as production-ready until provider configuration, rules, email delivery, webhook handling, administrator access, and real test transactions have all been verified.
