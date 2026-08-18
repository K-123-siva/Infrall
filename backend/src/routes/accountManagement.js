const express = require('express');
const router = express.Router();
const accountManagementController = require('../controllers/accountManagementController');
const adminAuth = require('../middleware/adminAuth');

// ==================== OWNER ACCOUNT ROUTES (Admin Protected) ====================
router.get('/owners', adminAuth, accountManagementController.getOwnerAccounts);
router.post('/owners/initiate', adminAuth, accountManagementController.initiateOwnerAccount);
router.post('/owners/:userId/resend', adminAuth, accountManagementController.resendOwnerSetupEmail);

// ==================== VENDOR ACCOUNT ROUTES (Admin Protected) ====================
router.get('/vendors', adminAuth, accountManagementController.getVendorAccounts);
router.post('/vendors/initiate', adminAuth, accountManagementController.initiateVendorAccount);
router.post('/vendors/:vendorId/resend', adminAuth, accountManagementController.resendVendorSetupEmail);

// ==================== PUBLIC PASSWORD SETUP ROUTES ====================
router.get('/verify-token', accountManagementController.verifySetupToken);
router.post('/complete-setup', accountManagementController.completePasswordSetup);

module.exports = router;
