"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMyAccount = exports.schedulePropertyViewing = exports.notifyConversationRecipient = exports.startPropertyConversation = exports.deleteManagedUser = exports.setManagedUserStatus = exports.setManagedUserRole = exports.inviteManagedUser = exports.listManagedUsers = exports.broadcastNotification = exports.submitContactMessage = exports.paystackWebhook = exports.verifyPaystackCheckout = exports.initializePaystackCheckout = void 0;
const node_crypto_1 = require("node:crypto");
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
const params_1 = require("firebase-functions/params");
const firestore_2 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const firebase_functions_1 = require("firebase-functions");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
const paystackSecret = (0, params_1.defineSecret)('PAYSTACK_SECRET_KEY');
const appBaseUrl = (0, params_1.defineString)('APP_BASE_URL', { default: 'http://localhost:5173' });
const supportEmail = (0, params_1.defineString)('SUPPORT_EMAIL', { default: 'support@habixaproperties.com' });
const requireAdmin = (request) => {
    if (request.auth?.token.admin !== true) {
        throw new https_1.HttpsError('permission-denied', 'Administrator access is required.');
    }
};
const paystackRequest = async (path, init) => {
    const response = await fetch(`https://api.paystack.co${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${paystackSecret.value()}`,
            'Content-Type': 'application/json',
            ...init?.headers,
        },
    });
    if (!response.ok) {
        firebase_functions_1.logger.error('Paystack request failed', { path, status: response.status });
        throw new https_1.HttpsError('unavailable', 'The payment provider is currently unavailable. Please try again.');
    }
    return response.json();
};
const verifyReference = async (reference) => (paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`));
const completeTransaction = async (transactionRef, transactionData) => {
    const buyerSnapshot = await db.collection('users').doc(transactionData.buyerId).get();
    const buyerEmail = buyerSnapshot.data()?.email;
    const mailRef = db.collection('mail').doc();
    const notificationRef = db.collection('notifications').doc();
    return db.runTransaction(async (firestoreTransaction) => {
        const latest = await firestoreTransaction.get(transactionRef);
        if (!latest.exists || latest.data()?.status === 'completed')
            return false;
        firestoreTransaction.update(transactionRef, {
            status: 'completed',
            paystackStatus: 'success',
            completedAt: new Date().toISOString(),
        });
        if (typeof buyerEmail === 'string') {
            firestoreTransaction.set(mailRef, {
                to: [buyerEmail],
                message: {
                    subject: 'Habixa Properties payment confirmed',
                    text: `Your Paystack payment for ${transactionData.propertyTitle} has been confirmed. It was settled to the Habixa Properties merchant account and is not held in escrow. Reference: ${transactionData.reference}`,
                },
            });
        }
        firestoreTransaction.set(notificationRef, {
            recipientId: transactionData.buyerId,
            type: 'payment',
            title: 'Payment confirmed',
            message: `Your payment for ${transactionData.propertyTitle} has been confirmed by Paystack.`,
            timestamp: new Date().toISOString(),
            read: false,
            actionUrl: '/dashboard',
        });
        return true;
    });
};
const failTransaction = async (transactionRef) => (db.runTransaction(async (firestoreTransaction) => {
    const latest = await firestoreTransaction.get(transactionRef);
    if (!latest.exists || latest.data()?.status === 'completed')
        return false;
    firestoreTransaction.update(transactionRef, {
        status: 'failed',
        paystackStatus: 'failed',
    });
    return true;
}));
exports.initializePaystackCheckout = (0, https_1.onCall)({ secrets: [paystackSecret] }, async (request) => {
    const uid = request.auth?.uid;
    const email = request.auth?.token.email;
    const propertyId = request.data?.propertyId;
    if (!uid || typeof email !== 'string') {
        throw new https_1.HttpsError('unauthenticated', 'Sign in with a verified email before starting a payment.');
    }
    if (request.auth?.token.email_verified !== true) {
        throw new https_1.HttpsError('failed-precondition', 'Verify your email address before starting a payment.');
    }
    if (typeof propertyId !== 'string' || propertyId.length > 200) {
        throw new https_1.HttpsError('invalid-argument', 'A valid property is required.');
    }
    const propertySnapshot = await db.collection('properties').doc(propertyId).get();
    if (!propertySnapshot.exists) {
        throw new https_1.HttpsError('not-found', 'This listing is not available for online payment.');
    }
    const property = propertySnapshot.data();
    const amountNgn = property.price?.ngn;
    if (property.availabilityStatus !== 'available' || !Number.isSafeInteger(amountNgn) || !amountNgn || amountNgn < 1) {
        throw new https_1.HttpsError('failed-precondition', 'This property cannot currently be paid for online.');
    }
    const amountKobo = amountNgn * 100;
    if (!Number.isSafeInteger(amountKobo)) {
        throw new https_1.HttpsError('failed-precondition', 'The listed amount is invalid for online payment.');
    }
    const transactionRef = db.collection('transactions').doc();
    const reference = `HBX_${transactionRef.id}`;
    const callbackUrl = `${appBaseUrl.value().replace(/\/$/, '')}/payment/${encodeURIComponent(propertyId)}`;
    await transactionRef.set({
        propertyId,
        propertyTitle: property.title || 'Property purchase',
        buyerId: uid,
        amount: { usd: property.price?.usd || 0, ngn: amountNgn },
        currency: 'NGN',
        paymentMethod: 'paystack',
        status: 'pending',
        settlement: 'merchant',
        reference,
        createdAt: new Date().toISOString(),
    });
    try {
        const initialized = await paystackRequest('/transaction/initialize', {
            method: 'POST',
            body: JSON.stringify({
                email,
                amount: amountKobo,
                currency: 'NGN',
                reference,
                callback_url: callbackUrl,
                metadata: {
                    transactionId: transactionRef.id,
                    propertyId,
                    buyerId: uid,
                },
            }),
        });
        const authorizationUrl = initialized.data?.authorization_url;
        if (!initialized.status || !authorizationUrl || initialized.data?.reference !== reference) {
            firebase_functions_1.logger.error('Paystack did not return a valid checkout session', { transactionId: transactionRef.id });
            throw new https_1.HttpsError('unavailable', 'Could not start the payment. Please try again.');
        }
        return { authorizationUrl, reference, transactionId: transactionRef.id };
    }
    catch (error) {
        await transactionRef.update({ status: 'failed' });
        throw error;
    }
});
exports.verifyPaystackCheckout = (0, https_1.onCall)({ secrets: [paystackSecret] }, async (request) => {
    const uid = request.auth?.uid;
    const reference = request.data?.reference;
    if (!uid)
        throw new https_1.HttpsError('unauthenticated', 'Sign in to verify your payment.');
    if (typeof reference !== 'string' || !/^HBX_[A-Za-z0-9_-]+$/.test(reference)) {
        throw new https_1.HttpsError('invalid-argument', 'A valid payment reference is required.');
    }
    const transactions = await db.collection('transactions').where('reference', '==', reference).limit(1).get();
    const transactionDoc = transactions.docs[0];
    if (!transactionDoc || transactionDoc.data().buyerId !== uid) {
        throw new https_1.HttpsError('not-found', 'The payment could not be found for this account.');
    }
    const transaction = transactionDoc.data();
    if (transaction.status === 'completed') {
        return { status: 'completed', transactionId: transactionDoc.id };
    }
    if (transaction.status === 'failed')
        return { status: 'failed' };
    const verified = await verifyReference(reference);
    const expectedAmount = Number(transaction.amount?.ngn) * 100;
    const matchesTransaction = verified.status
        && verified.data?.currency === 'NGN'
        && verified.data.amount === expectedAmount
        && verified.data.reference === reference;
    if (!matchesTransaction)
        return { status: 'pending' };
    if (verified.data?.status === 'success') {
        await completeTransaction(transactionDoc.ref, transaction);
        return { status: 'completed', transactionId: transactionDoc.id };
    }
    if (verified.data?.status === 'failed' || verified.data?.status === 'abandoned') {
        const failed = await failTransaction(transactionDoc.ref);
        return failed
            ? { status: 'failed' }
            : { status: 'completed', transactionId: transactionDoc.id };
    }
    return { status: 'pending' };
});
exports.paystackWebhook = (0, https_1.onRequest)({ secrets: [paystackSecret] }, async (request, response) => {
    if (request.method !== 'POST') {
        response.status(405).send('Method not allowed');
        return;
    }
    const signature = request.header('x-paystack-signature');
    if (!signature || !request.rawBody) {
        response.status(400).send('Missing signature');
        return;
    }
    const expected = (0, node_crypto_1.createHmac)('sha512', paystackSecret.value()).update(request.rawBody).digest();
    let supplied;
    try {
        supplied = Buffer.from(signature, 'hex');
    }
    catch {
        response.status(400).send('Invalid signature');
        return;
    }
    if (supplied.length !== expected.length || !(0, node_crypto_1.timingSafeEqual)(supplied, expected)) {
        response.status(401).send('Invalid signature');
        return;
    }
    const event = request.body;
    if (!event.data?.reference) {
        response.status(200).send('Ignored');
        return;
    }
    const found = await db.collection('transactions').where('reference', '==', event.data.reference).limit(1).get();
    const transactionDoc = found.docs[0];
    if (!transactionDoc) {
        firebase_functions_1.logger.warn('Received Paystack event for an unknown transaction', { reference: event.data.reference });
        response.status(200).send('Unknown transaction');
        return;
    }
    const transaction = transactionDoc.data();
    const expectedAmount = Number(transaction.amount?.ngn) * 100;
    const matchesTransaction = event.data.currency === 'NGN' && event.data.amount === expectedAmount;
    if (!matchesTransaction) {
        firebase_functions_1.logger.error('Paystack webhook amount or currency mismatch', { transactionId: transactionDoc.id });
        response.status(400).send('Transaction mismatch');
        return;
    }
    if (event.event === 'charge.success' && event.data.status === 'success') {
        await completeTransaction(transactionDoc.ref, transaction);
    }
    else if (event.event === 'charge.failed' && event.data.status === 'failed') {
        await failTransaction(transactionDoc.ref);
    }
    else {
        response.status(200).send('Ignored');
        return;
    }
    response.status(200).send('OK');
});
exports.submitContactMessage = (0, https_1.onCall)(async (request) => {
    const { name, email, subject, message } = request.data || {};
    const isValidString = (value, maxLength) => (typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength);
    if (!isValidString(name, 120)
        || !isValidString(email, 254)
        || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        || !isValidString(subject, 180)
        || !isValidString(message, 5000)) {
        throw new https_1.HttpsError('invalid-argument', 'Complete each contact field with valid information.');
    }
    const contactRef = db.collection('contactMessages').doc();
    const mailRef = db.collection('mail').doc();
    const receivedAt = new Date().toISOString();
    const batch = db.batch();
    batch.set(contactRef, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        senderId: request.auth?.uid || null,
        status: 'new',
        createdAt: receivedAt,
    });
    batch.set(mailRef, {
        to: [supportEmail.value()],
        message: {
            subject: `Habixa website inquiry: ${subject.trim()}`,
            text: `From: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`,
        },
        contactMessageId: contactRef.id,
    });
    await batch.commit();
    return { received: true, id: contactRef.id };
});
exports.broadcastNotification = (0, https_1.onCall)(async (request) => {
    requireAdmin(request);
    const { title, message, type, targetRole } = request.data || {};
    const allowedTypes = ['payment', 'property', 'system', 'message'];
    const allowedTargets = ['all', 'admin', 'user'];
    if (typeof title !== 'string' || title.trim().length === 0 || title.length > 150
        || typeof message !== 'string' || message.trim().length === 0 || message.length > 4000
        || !allowedTypes.includes(type)
        || !allowedTargets.includes(targetRole)) {
        throw new https_1.HttpsError('invalid-argument', 'Provide a valid title, message, type, and audience.');
    }
    const users = await db.collection('users').get();
    const recipients = users.docs.filter((userDoc) => {
        const role = userDoc.data().role;
        if (targetRole === 'all')
            return true;
        if (targetRole === 'admin')
            return role === 'admin';
        return role !== 'admin';
    });
    for (let offset = 0; offset < recipients.length; offset += 450) {
        const batch = db.batch();
        recipients.slice(offset, offset + 450).forEach((recipient) => {
            batch.set(db.collection('notifications').doc(), {
                recipientId: recipient.id,
                type,
                title: title.trim(),
                message: message.trim(),
                timestamp: new Date().toISOString(),
                read: false,
                targetRole,
            });
        });
        await batch.commit();
    }
    return { delivered: recipients.length };
});
exports.listManagedUsers = (0, https_1.onCall)(async (request) => {
    requireAdmin(request);
    const users = await db.collection('users').get();
    return {
        users: users.docs.map((userDoc) => {
            const data = userDoc.data();
            return {
                id: userDoc.id,
                name: data.name || '',
                email: data.email || '',
                role: data.role || 'buyer',
                status: data.status || 'active',
            };
        }),
    };
});
exports.inviteManagedUser = (0, https_1.onCall)(async (request) => {
    requireAdmin(request);
    const { name, email, role } = request.data || {};
    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 120
        || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        || !['buyer', 'agent', 'landlord', 'admin'].includes(role)) {
        throw new https_1.HttpsError('invalid-argument', 'Provide a valid name, email, and account role.');
    }
    let newUser;
    try {
        newUser = await (0, auth_1.getAuth)().createUser({
            email: email.trim().toLowerCase(),
            displayName: name.trim(),
            emailVerified: false,
        });
    }
    catch (error) {
        firebase_functions_1.logger.error('Failed to create invited Firebase user', error);
        throw new https_1.HttpsError('already-exists', 'An account with this email may already exist.');
    }
    await (0, auth_1.getAuth)().setCustomUserClaims(newUser.uid, { admin: role === 'admin' });
    await db.collection('users').doc(newUser.uid).set({
        name: name.trim(),
        email: newUser.email,
        role,
        isVerified: false,
        kycStatus: 'pending',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    const passwordResetLink = await (0, auth_1.getAuth)().generatePasswordResetLink(email.trim().toLowerCase());
    await db.collection('mail').add({
        to: [email.trim().toLowerCase()],
        message: {
            subject: 'Your Habixa Properties account invitation',
            text: `Hello ${name.trim()},\n\nAn account has been created for you. Set your password using this secure link:\n${passwordResetLink}\n\nIf you were not expecting this invitation, you can ignore this email.`,
        },
    });
    return { id: newUser.uid };
});
exports.setManagedUserRole = (0, https_1.onCall)(async (request) => {
    requireAdmin(request);
    const { userId, role } = request.data || {};
    if (typeof userId !== 'string' || !['buyer', 'agent', 'landlord', 'admin'].includes(role)) {
        throw new https_1.HttpsError('invalid-argument', 'Provide a valid user and role.');
    }
    if (userId === request.auth?.uid) {
        throw new https_1.HttpsError('failed-precondition', 'You cannot change your own administrator role.');
    }
    const authUser = await (0, auth_1.getAuth)().getUser(userId);
    await (0, auth_1.getAuth)().setCustomUserClaims(userId, { ...authUser.customClaims, admin: role === 'admin' });
    await db.collection('users').doc(userId).update({ role, updatedAt: new Date().toISOString() });
    return { updated: true };
});
exports.setManagedUserStatus = (0, https_1.onCall)(async (request) => {
    requireAdmin(request);
    const { userId, suspended } = request.data || {};
    if (typeof userId !== 'string' || typeof suspended !== 'boolean') {
        throw new https_1.HttpsError('invalid-argument', 'Provide a valid user and account status.');
    }
    if (userId === request.auth?.uid) {
        throw new https_1.HttpsError('failed-precondition', 'You cannot suspend your own account.');
    }
    await (0, auth_1.getAuth)().updateUser(userId, { disabled: suspended });
    await db.collection('users').doc(userId).update({
        status: suspended ? 'suspended' : 'active',
        updatedAt: new Date().toISOString(),
    });
    return { updated: true };
});
exports.deleteManagedUser = (0, https_1.onCall)(async (request) => {
    requireAdmin(request);
    const { userId } = request.data || {};
    if (typeof userId !== 'string' || userId === request.auth?.uid) {
        throw new https_1.HttpsError('invalid-argument', 'Provide a different user account to delete.');
    }
    await (0, auth_1.getAuth)().deleteUser(userId);
    await db.collection('users').doc(userId).delete();
    await db.collection('userActivity').doc(userId).delete();
    return { deleted: true };
});
exports.startPropertyConversation = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid;
    const propertyId = request.data?.propertyId;
    if (!uid)
        throw new https_1.HttpsError('unauthenticated', 'Sign in to message about a property.');
    if (typeof propertyId !== 'string' || propertyId.length > 200) {
        throw new https_1.HttpsError('invalid-argument', 'A valid property is required.');
    }
    const propertySnapshot = await db.collection('properties').doc(propertyId).get();
    if (!propertySnapshot.exists)
        throw new https_1.HttpsError('not-found', 'The property listing was not found.');
    const property = propertySnapshot.data();
    const ownerId = property.owner?.id;
    const agentId = property.agent?.id;
    const recipientId = agentId && agentId !== uid ? agentId : ownerId;
    if (typeof recipientId !== 'string' || recipientId === uid) {
        throw new https_1.HttpsError('failed-precondition', 'There is no other property contact available for this listing.');
    }
    const participants = [uid, recipientId].sort();
    const conversationId = `${propertyId}_${participants.join('_')}`;
    const conversationRef = db.collection('conversations').doc(conversationId);
    const [buyer, recipient] = await Promise.all([
        db.collection('users').doc(uid).get(),
        db.collection('users').doc(recipientId).get(),
    ]);
    if (!recipient.exists)
        throw new https_1.HttpsError('failed-precondition', 'The listing contact does not have an active app account.');
    await db.runTransaction(async (transaction) => {
        const existing = await transaction.get(conversationRef);
        if (!existing.exists) {
            transaction.set(conversationRef, {
                propertyId,
                propertyTitle: property.title || 'Property inquiry',
                participants,
                participantNames: {
                    [uid]: buyer.data()?.name || request.auth?.token.name || 'User',
                    [recipientId]: recipient.data()?.name || property.owner?.name || 'Property contact',
                },
                lastMessage: '',
                createdAt: firestore_1.FieldValue.serverTimestamp(),
                updatedAt: firestore_1.FieldValue.serverTimestamp(),
            });
        }
    });
    return { conversationId };
});
exports.notifyConversationRecipient = (0, firestore_2.onDocumentCreated)('conversations/{conversationId}/messages/{messageId}', async (event) => {
    const message = event.data?.data();
    const conversationId = event.params.conversationId;
    if (!message || typeof message.senderId !== 'string' || typeof message.text !== 'string')
        return;
    const conversationSnapshot = await db.collection('conversations').doc(conversationId).get();
    if (!conversationSnapshot.exists)
        return;
    const conversation = conversationSnapshot.data();
    const recipientId = conversation.participants.find((participantId) => participantId !== message.senderId);
    if (!recipientId)
        return;
    const recipient = await db.collection('users').doc(recipientId).get();
    const recipientEmail = recipient.data()?.email;
    if (typeof recipientEmail !== 'string') {
        firebase_functions_1.logger.warn('Message recipient has no email address', { conversationId, recipientId });
        return;
    }
    await db.collection('mail').add({
        to: [recipientEmail],
        message: {
            subject: `New message about ${conversation.propertyTitle || 'a property'}`,
            text: `${message.senderName || 'A property contact'} sent you a message:\n\n${message.text}\n\nSign in to Habixa Properties to reply.`,
        },
    });
    await db.collection('notifications').add({
        recipientId,
        type: 'message',
        title: 'New property message',
        message: `${message.senderName || 'A property contact'} sent you a message about ${conversation.propertyTitle || 'a property'}.`,
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: `/messages`,
    });
});
exports.schedulePropertyViewing = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid;
    const { propertyId, date, time, message, phone } = request.data || {};
    if (!uid)
        throw new https_1.HttpsError('unauthenticated', 'Sign in to schedule a property viewing.');
    if (typeof propertyId !== 'string'
        || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)
        || typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
        || (message !== undefined && (typeof message !== 'string' || message.length > 1000))
        || (phone !== undefined && (typeof phone !== 'string' || phone.length > 40))) {
        throw new https_1.HttpsError('invalid-argument', 'Provide a valid viewing date, time, and contact information.');
    }
    const requestedAt = new Date(`${date}T${time}:00`);
    if (Number.isNaN(requestedAt.getTime()) || requestedAt.getTime() <= Date.now()) {
        throw new https_1.HttpsError('invalid-argument', 'Choose a future viewing date and time.');
    }
    const [propertySnapshot, buyerSnapshot] = await Promise.all([
        db.collection('properties').doc(propertyId).get(),
        db.collection('users').doc(uid).get(),
    ]);
    if (!propertySnapshot.exists)
        throw new https_1.HttpsError('not-found', 'The property listing was not found.');
    const property = propertySnapshot.data();
    const buyer = buyerSnapshot.data();
    const ownerId = property.owner?.id;
    const owner = typeof ownerId === 'string' ? await db.collection('users').doc(ownerId).get() : null;
    const appointmentRef = db.collection('appointments').doc();
    await appointmentRef.set({
        propertyId,
        propertyTitle: property.title || 'Property viewing',
        buyerId: uid,
        buyerName: buyer?.name || request.auth?.token.name || '',
        buyerEmail: buyer?.email || request.auth?.token.email || '',
        buyerPhone: typeof phone === 'string' ? phone : buyer?.phone || '',
        ownerId: ownerId || null,
        date,
        time,
        message: typeof message === 'string' ? message.trim() : '',
        status: 'requested',
        createdAt: new Date().toISOString(),
    });
    const mailBatch = db.batch();
    const buyerEmail = buyer?.email || request.auth?.token.email;
    if (typeof buyerEmail === 'string') {
        mailBatch.set(db.collection('mail').doc(), {
            to: [buyerEmail],
            message: {
                subject: 'Property viewing request received',
                text: `Your request to view ${property.title} on ${date} at ${time} has been received.`,
            },
        });
    }
    const ownerEmail = owner?.data()?.email || property.owner?.email;
    if (typeof ownerEmail === 'string') {
        mailBatch.set(db.collection('mail').doc(), {
            to: [ownerEmail],
            message: {
                subject: `New viewing request: ${property.title}`,
                text: `${buyer?.name || 'A user'} requested a viewing on ${date} at ${time}.${message ? `\n\nMessage: ${message}` : ''}`,
            },
        });
    }
    if (ownerId) {
        mailBatch.set(db.collection('notifications').doc(), {
            recipientId: ownerId,
            type: 'property',
            title: 'New viewing request',
            message: `${buyer?.name || 'A user'} requested a viewing for ${property.title} on ${date} at ${time}.`,
            timestamp: new Date().toISOString(),
            read: false,
        });
    }
    await mailBatch.commit();
    return { appointmentId: appointmentRef.id };
});
exports.deleteMyAccount = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid;
    if (!uid)
        throw new https_1.HttpsError('unauthenticated', 'Sign in before deleting your account.');
    await (0, auth_1.getAuth)().deleteUser(uid);
    const batch = db.batch();
    batch.delete(db.collection('users').doc(uid));
    batch.delete(db.collection('userActivity').doc(uid));
    await batch.commit();
    return { deleted: true };
});
//# sourceMappingURL=index.js.map