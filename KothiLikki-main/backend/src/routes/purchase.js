const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const vendorAuth = require('../middleware/vendorAuth');
const { kycUpload } = require('../middleware/upload');

// User routes
router.post('/create-order', auth, purchaseController.createPurchaseOrder);
router.post('/verify-payment', auth, purchaseController.verifyPurchasePayment);
router.post('/furniture-rental', auth, purchaseController.requestFurnitureRental);
router.get('/my-purchases', auth, purchaseController.getUserPurchases);
router.get('/:id/details', auth, purchaseController.getPurchaseDetails);
router.put('/cancel/:id', auth, purchaseController.cancelPurchase);

// Materials 25%+75% payment flow
router.post('/materials/create-order', auth, purchaseController.createMaterialsOrder);
router.post('/materials/verify-advance', auth, purchaseController.verifyMaterialsAdvance);
router.post('/materials/create-remaining-order', auth, purchaseController.createMaterialsRemainingOrder);
router.post('/materials/verify-remaining', auth, purchaseController.verifyMaterialsRemaining);

// Document submission workflow
router.post('/:id/documents', auth, kycUpload.array('documents', 10), purchaseController.submitPurchaseDocuments);

// Vendor routes — materials orders
router.get('/vendor/materials-orders', auth, vendorAuth, purchaseController.getVendorMaterialsOrders);
router.patch('/vendor/materials-orders/:id/out-for-delivery', auth, vendorAuth, purchaseController.vendorMarkOutForDelivery);
router.patch('/vendor/materials-orders/:id/confirm-delivery', auth, vendorAuth, purchaseController.vendorConfirmDelivery);

// Admin routes
router.get('/', adminAuth, purchaseController.getAllPurchases);
router.get('/review-queue', adminAuth, purchaseController.getPurchasesForReview);
router.get('/stats', adminAuth, purchaseController.getPurchaseStats);
router.put('/:id', adminAuth, purchaseController.updatePurchaseStatus);
router.put('/:id/approve', adminAuth, purchaseController.approvePropertyPurchase);
router.put('/:id/verify-documents', adminAuth, purchaseController.verifyPurchaseDocuments);

module.exports = router;
