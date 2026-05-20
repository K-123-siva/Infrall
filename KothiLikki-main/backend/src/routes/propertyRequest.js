const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { upload } = require('../middleware/upload');
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus
} = require('../controllers/propertyRequestController');

// User routes
router.post('/', auth, upload.array('photos', 10), createRequest);
router.get('/my-requests', auth, getMyRequests);

// Admin routes
router.get('/admin/all', adminAuth, getAllRequests);
router.put('/admin/:id', adminAuth, updateRequestStatus);

module.exports = router;
