const PropertyRequest = require('../models/PropertyRequest');
const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/upload');

// ── USER: Submit a new property request ──────────────────────────────────────
exports.createRequest = async (req, res) => {
  try {
    const {
      ownerName, ownerEmail, ownerPhone,
      listingType, title, address, city,
      price, bedrooms, bathrooms, area, description
    } = req.body;

    // Validate required fields
    if (!ownerName || !ownerEmail || !ownerPhone || !listingType || !title || !address || !city) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Upload photos to Cloudinary
    const photos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, file.mimetype);
        photos.push(url);
      }
    }

    const request = await PropertyRequest.create({
      ownerName,
      ownerEmail,
      ownerPhone,
      listingType,
      title,
      address,
      city,
      price: price || null,
      bedrooms: bedrooms || null,
      bathrooms: bathrooms || null,
      area: area || null,
      description: description || null,
      photos,
      userId: req.user?.id || null,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Your property request has been submitted successfully! Our admin team will review it within 24 hours.',
      request: {
        id: request.id,
        title: request.title,
        status: request.status,
        createdAt: request.createdAt
      }
    });
  } catch (err) {
    console.error('Create property request error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ── USER: Get own requests ────────────────────────────────────────────────────
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await PropertyRequest.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'listingType', 'city', 'status', 'adminNotes', 'listingId', 'createdAt']
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ADMIN: Get all requests ───────────────────────────────────────────────────
exports.getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const requests = await PropertyRequest.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'submittedBy', attributes: ['id', 'name', 'email'], required: false }
      ]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ADMIN: Update request status (approve / reject) ───────────────────────────
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, listingId } = req.body;

    const request = await PropertyRequest.findByPk(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    await request.update({
      status: status || request.status,
      adminNotes: adminNotes || request.adminNotes,
      listingId: listingId || request.listingId
    });

    res.json({ message: `Request ${status} successfully`, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
