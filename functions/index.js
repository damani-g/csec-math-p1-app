/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// PayPal webhook handler
exports.handlePayPalWebhook = onRequest(async (req, res) => {
  // Log the incoming webhook
  logger.info("Received PayPal webhook", {
    eventType: req.body?.event_type,
    timestamp: new Date().toISOString()
  });

  // Verify the webhook signature
  const webhookId = 'YOUR_WEBHOOK_ID'; // You'll get this from PayPal
  const webhookSecret = 'YOUR_WEBHOOK_SECRET'; // You'll get this from PayPal
  const signatureHeader = req.headers['paypal-transmission-sig'];
  const transmissionId = req.headers['paypal-transmission-id'];
  const timestamp = req.headers['paypal-transmission-time'];
  const webhookEvent = req.headers['paypal-auth-algo'];
  const reqBody = JSON.stringify(req.body);

  try {
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(transmissionId + '|' + timestamp + '|' + webhookId + '|' + crypto.createHash('sha256').update(reqBody).digest('hex'))
      .digest('base64');

    if (signatureHeader !== expectedSignature) {
      logger.error('Invalid webhook signature');
      return res.status(401).send('Invalid signature');
    }

    // Handle the webhook event
    const event = req.body;
    
    if (event.event_type === 'CHECKOUT.ORDER.APPROVED') {
      const orderId = event.resource.id;
      const customId = event.resource.purchase_units[0].custom_id; // This will be the user's UID
      const amount = event.resource.purchase_units[0].amount.value;

      logger.info('Processing approved order', {
        orderId,
        customId,
        amount
      });

      // Calculate subscription end date (1 year from now)
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);

      // Update user's pro status in Firestore
      await admin.firestore().collection('users').doc(customId).update({
        isPro: true,
        subscriptionEndDate: admin.firestore.Timestamp.fromDate(subscriptionEndDate),
        lastPaymentDate: admin.firestore.Timestamp.now(),
        lastPaymentAmount: amount,
        lastPaymentOrderId: orderId
      });

      // Log the transaction
      await admin.firestore().collection('transactions').add({
        userId: customId,
        orderId: orderId,
        amount: amount,
        currency: event.resource.purchase_units[0].amount.currency_code,
        status: 'completed',
        provider: 'paypal',
        timestamp: admin.firestore.Timestamp.now(),
        subscriptionEndDate: admin.firestore.Timestamp.fromDate(subscriptionEndDate)
      });

      // Send confirmation email
      const user = await admin.firestore().collection('users').doc(customId).get();
      const userEmail = user.data().email;

      await admin.firestore().collection('mail').add({
        to: userEmail,
        template: {
          name: 'pro-subscription-confirmation',
          data: {
            subscriptionEndDate: subscriptionEndDate.toLocaleDateString(),
            amount: amount,
            orderId: orderId
          }
        }
      });

      logger.info(`Successfully processed payment for user ${customId}`);
      return res.status(200).send('Webhook processed successfully');
    }

    // Handle other event types if needed
    logger.info('Unhandled webhook event type:', event.event_type);
    return res.status(200).send('Webhook received');

  } catch (error) {
    logger.error('Error processing webhook:', error);
    return res.status(500).send('Error processing webhook');
  }
});
