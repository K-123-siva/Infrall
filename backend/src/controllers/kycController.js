const KYC = require('../models/KYC');
const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/upload');

exports.submitKYC = async (req, res) => {
  try {
    const userId = req.user.id;
    const { occupation, otherDocName, aadhaarNumber } = req.body;

    if (req.user.role === 'admin') {
      return res.status(400).json({ message: 'Admins do not require KYC verification.' });
    }

    let kyc = await KYC.findOne({ where: { userId } });
    if (kyc && kyc.status === 'verified') {
      return res.status(400).json({ message: 'KYC already verified. No changes needed.' });
    }

    if (!occupation) return res.status(400).json({ message: 'Please select your occupation.' });
    if (!aadhaarNumber || aadhaarNumber.replace(/\s/g, '').length !== 12) {
      return res.status(400).json({ message: 'Please enter a valid 12-digit Aadhaar number.' });
    }

    const files = req.files || {};
    const hasAadhaar = files.aadhaar?.[0] || kyc?.aadhaarUrl;
    if (!hasAadhaar) return res.status(400).json({ message: 'Aadhaar card document is mandatory.' });

    if (occupation === 'salaried' && !files.jobId?.[0] && !kyc?.jobIdUrl)
      return res.status(400).json({ message: 'Job ID / Employee ID is required for salaried employees.' });
    if (occupation === 'business' && !files.pan?.[0] && !kyc?.panUrl)
      return res.status(400).json({ message: 'PAN card is required for business owners.' });
    if (occupation === 'business' && !files.businessReg?.[0] && !kyc?.businessRegUrl)
      return res.status(400).json({ message: 'Business Registration document is required.' });
    if (occupation === 'student' && !files.collegeId?.[0] && !kyc?.collegeIdUrl)
      return res.status(400).json({ message: 'College ID is required for students.' });
    if (occupation === 'self_employed' && !files.pan?.[0] && !kyc?.panUrl)
      return res.status(400).json({ message: 'PAN card is required for self-employed.' });

    const updates = {
      occupation,
      aadhaarNumber: aadhaarNumber.replace(/\s/g, ''),
      status: 'pending',
      adminNotes: null
    };

    const fileMap = {
      aadhaar:     'aadhaarUrl',
      pan:         'panUrl',
      jobId:       'jobIdUrl',
      salarySlip:  'salarySlipUrl',
      businessReg: 'businessRegUrl',
      gstCert:     'gstCertUrl',
      collegeId:   'collegeIdUrl',
      bonafide:    'bonafideUrl',
      workProof:   'workProofUrl',
      otherDoc:    'otherDocUrl',
    };

    // Upload each file to Cloudinary with retry logic
    for (const [fieldName, urlKey] of Object.entries(fileMap)) {
      if (files[fieldName]?.[0]) {
        const file = files[fieldName][0];
        
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          return res.status(400).json({ 
            message: `File ${fieldName} is too large. Maximum size is 10MB. Please compress the image and try again.` 
          });
        }
        
        try {
          console.log(`Uploading ${fieldName} (${(file.size / 1024).toFixed(2)} KB)...`);
          updates[urlKey] = await uploadToCloudinary(file.buffer, file.mimetype);
          console.log(`✅ ${fieldName} uploaded successfully`);
        } catch (uploadError) {
          console.error(`❌ Failed to upload ${fieldName}:`, uploadError.message);
          return res.status(500).json({ 
            message: `Failed to upload ${fieldName}. Please try again with a smaller file size or check your internet connection.`,
            error: 'UPLOAD_FAILED',
            field: fieldName
          });
        }
      }
    }
    if (files.otherDoc?.[0] && otherDocName) updates.otherDocName = otherDocName;

    if (kyc) {
      await kyc.update(updates);
    } else {
      kyc = await KYC.create({ userId, ...updates });
    }

    res.json({ message: 'KYC documents submitted successfully. Awaiting admin verification.', kyc });
  } catch (err) {
    console.error('KYC submit error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getMyKYC = async (req, res) => {
  try {
    const kyc = await KYC.findOne({ where: { userId: req.user.id } });
    if (!kyc) return res.json({ status: 'not_submitted' });
    res.json(kyc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllKYC = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const kycs = await KYC.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(kycs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateKYCStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    if (!['verified', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Status must be verified or rejected' });
    const kyc = await KYC.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
    });
    if (!kyc) return res.status(404).json({ message: 'KYC not found' });
    await kyc.update({ status, adminNotes: adminNotes || null, verifiedAt: status === 'verified' ? new Date() : null });
    res.json({ message: `KYC ${status} successfully`, kyc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
