const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Listing = require('../models/Listing');
const User = require('../models/User');
const LeisureLease = require('../models/LeisureLease');
const { uploadToCloudinary } = require('../middleware/upload');

// Import associations to ensure they are loaded
require('../models/associations');

console.log('🚀 LISTING CONTROLLER LOADED - NEW VERSION WITH OWNER ACCOUNT CREATION');

exports.createListing = async (req, res) => {
  try {
    console.log('🔍 CREATE LISTING - Request body:', {
      contactEmail: req.body.contactEmail,
      contactPerson: req.body.contactPerson,
      contactPhone: req.body.contactPhone,
      category: req.body.category,
      title: req.body.title
    });
    
    const images = [];
    const documents = [];
    
    // Handle file uploads
    if (req.files) {
      // Separate images and documents
      const imageFiles = req.files.filter(file => file.fieldname === 'images');
      const documentFiles = req.files.filter(file => file.fieldname === 'documents');
      
      // Upload images
      for (const file of imageFiles) {
        const url = await uploadToCloudinary(file.buffer, file.mimetype);
        images.push(url);
      }
      
      // Upload documents
      for (const file of documentFiles) {
        const url = await uploadToCloudinary(file.buffer, file.mimetype);
        documents.push({
          url,
          originalName: file.originalname,
          uploadedAt: new Date()
        });
      }
    }
    
    // Auto-create owner account if contactEmail is provided and doesn't exist
    let ownerUser = null;
    let ownerAccountCreated = false;
    
    console.log('🔍 Checking contactEmail:', req.body.contactEmail);
    
    if (req.body.contactEmail) {
      const contactEmail = req.body.contactEmail.toLowerCase().trim();
      
      console.log('✅ contactEmail provided:', contactEmail);
      
      // Check if user already exists with this email
      ownerUser = await User.findOne({ where: { email: contactEmail } });
      
      console.log('🔍 Existing user:', ownerUser ? `Found (ID: ${ownerUser.id})` : 'Not found');
      
      if (!ownerUser) {
        console.log('📝 Creating new owner account...');
        // Create new owner account with password setup token
        const bcrypt = require('bcryptjs');
        const crypto = require('crypto');
        const setupToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
        
        ownerUser = await User.create({
          name: req.body.contactPerson || 'Property Owner',
          email: contactEmail,
          password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10),
          phone: req.body.contactPhone || '0000000000',
          role: 'user',
          isVerified: false,
          passwordSetupToken: setupToken,
          passwordSetupExpiry: tokenExpiry
        });
        
        ownerAccountCreated = true;
        
        console.log('✅ Owner account created:', ownerUser.id, ownerUser.email);
        
        // Send password setup email ONLY for new accounts
        const emailService = require('../services/emailService');
        const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const setupLink = `${baseUrl}/owner/setup-password?token=${setupToken}`;
        const loginLink = `${baseUrl}/owner/login`;
        
        try {
          await emailService.sendEmail({
            to: contactEmail,
            subject: 'Set Up Your INFRAALL Owner Account',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                  .credentials-box { background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #667eea; }
                  .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                  .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🏠 Welcome to INFRAALL</h1>
                    <p>Owner Portal Account Setup</p>
                  </div>
                  <div class="content">
                    <h2>Hello ${req.body.contactPerson || 'Property Owner'},</h2>
                    
                    <p>Your property has been listed on INFRAALL and an Owner Portal account has been created for you. To complete your account setup, please set your password by clicking the button below:</p>
                    
                    <div style="text-align: center;">
                      <a href="${setupLink}" class="button">Set Up My Password</a>
                    </div>
                    
                    <div class="credentials-box">
                      <h3 style="margin-top: 0; color: #667eea;">🔐 Your Login Credentials</h3>
                      <p><strong>Username:</strong> ${contactEmail}</p>
                      <p><strong>Password:</strong> <span style="color: #dc2626;">Set your new password using the button above</span></p>
                      <p style="margin-bottom: 0;"><strong>Login URL:</strong> <a href="${loginLink}" style="color: #667eea;">${loginLink}</a></p>
                    </div>
                    
                    <div class="info-box">
                      <p><strong>📧 Your Email:</strong> ${contactEmail}</p>
                      <p><strong>⏰ Link Valid For:</strong> 48 hours</p>
                      <p style="margin-bottom: 0;"><strong>💡 Note:</strong> After setting your password, use your email as username to login</p>
                    </div>
                    
                    <p><strong>What you can do with your Owner Portal:</strong></p>
                    <ul>
                      <li>View and manage your property listings</li>
                      <li>Track rental agreements and payments</li>
                      <li>Monitor property performance</li>
                      <li>Communicate with tenants</li>
                      <li>Access financial reports</li>
                    </ul>
                    
                    <p>If you didn't expect this email or have any questions, please contact our admin team.</p>
                    
                    <div class="footer">
                      <p>This link will expire in 48 hours</p>
                      <p>INFRAALL - Property Management Platform</p>
                      <p>Contact: ${process.env.ADMIN_EMAIL}</p>
                    </div>
                  </div>
                </div>
              </body>
              </html>
            `
          });
          
          console.log(`✅ Password setup email sent to new owner: ${contactEmail}`);
        } catch (emailErr) {
          console.error('❌ Failed to send owner password setup email:', emailErr);
        }
      } else {
        // Account already exists - just link the property, NO email sent
        console.log(`ℹ️  Account already exists for ${contactEmail} - property will be added to existing account`);
      }
    }
    
    // For property listings, set initial status as pending for admin review
    const isProperty = req.body.category === 'property_sell' || req.body.category === 'property_rent';
    const status = isProperty ? 'pending' : 'active';
    
    // Use contactEmail user as the listing owner if provided, otherwise use current user
    const listingUserId = ownerUser ? ownerUser.id : req.user.id;
    
    const listing = await Listing.create({ 
      ...req.body, 
      images, 
      ownerDocuments: documents,
      userId: listingUserId, // Use contactEmail user as owner
      status,
      commissionPercentage: req.body.commissionPercentage || 10.00,
      // Store owner info for dashboard matching
      ownerAccountId: ownerUser ? ownerUser.id : null
    });
    
    const message = isProperty 
      ? 'Property listing submitted successfully! Admin will review and approve within 24 hours.'
      : 'Listing created successfully!';
    
    // Add owner account info to response if created
    const response = { listing, message };
    if (ownerAccountCreated) {
      response.ownerAccountCreated = true;
      response.ownerEmail = req.body.contactEmail;
      response.message = isProperty
        ? 'Property listing submitted! An account has been created for you. Please check your email to set your password.'
        : 'Listing created! An account has been created for you. Please check your email to set your password.';
    } else if (ownerUser) {
      response.message = isProperty
        ? 'Property listing submitted! You can check it in your account.'
        : 'Listing created! You can check it in your account.';
    }
    
    res.status(201).json(response);
  } catch (err) {
    console.error('Create listing error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getListings = async (req, res) => {
  try {
    const { 
      category, city, minPrice, maxPrice, subCategory, search, bhk, 
      condition, brand, materialType, availability, propertyType,
      page = 1, limit = 12, sort = 'newest'
    } = req.query;
    
    const where = { 
      status: 'active'
    };
    
    // Basic filters
    if (category) where.category = category;
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (subCategory) where.subCategory = { [Op.like]: `%${subCategory}%` };
    if (propertyType) where.subCategory = { [Op.like]: `%${propertyType}%` };
    
    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    
    // Search filter
    if (search) {
      where[Op.or] = [
        { location: { [Op.like]: `%${search}%` } },
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { pincode: { [Op.like]: `%${search}%` } },
      ];
    }
    
    // BHK filter: map "1 BHK" -> bedrooms=1, "2 BHK" -> bedrooms=2, etc.
    if (bhk) {
      const bhkList = bhk.split(',').map((b) => {
        const match = b.trim().match(/^(\d+)/);
        return match ? parseInt(match[1]) : null;
      }).filter(Boolean);
      if (bhkList.length > 0) {
        where.bedrooms = { [Op.in]: bhkList };
      }
    }
    
    // New enhanced filters
    
    // Condition filter (for furniture and electronics)
    if (condition) {
      // Normalize condition values from frontend to backend enum format
      const conditionMap = {
        'New': 'new',
        'Like New': 'like_new', 
        'Good': 'good',
        'Fair': 'fair',
        'Needs Repair': 'needs_repair'
      };
      const normalizedCondition = conditionMap[condition] || condition.toLowerCase().replace(/\s+/g, '_');
      where.condition = normalizedCondition;
    }
    
    // Brand filter (for furniture and electronics)
    if (brand) {
      where.brand = brand;
    }
    
    // Material type/Quality grade filter (for building materials)
    if (materialType) {
      where.materialType = materialType;
    }
    
    // Availability filter (for services)
    if (availability) {
      where.availability = availability;
    }
    
    const offset = (page - 1) * limit;
    const currentYear = new Date().getFullYear();
    
    // Determine sort order
    let orderClause;
    if (sort === 'random') {
      // Random order using RAND() function
      orderClause = sequelize.literal('RAND()');
    } else if (sort === 'price_low') {
      orderClause = [['price', 'ASC']];
    } else if (sort === 'price_high') {
      orderClause = [['price', 'DESC']];
    } else {
      // Default: newest first
      orderClause = [['createdAt', 'DESC']];
    }
    
    const { count, rows } = await Listing.findAndCountAll({
      where,
      include: [
        { model: User, as: 'seller', attributes: ['id', 'name', 'avatar', 'isVerified'] },
        {
          model: LeisureLease,
          as: 'leisureLeases',
          required: false,
          where: {
            status: 'active',
            paymentStatus: 'paid',
            endDate: { [Op.gte]: new Date() } // Only active leases that haven't ended yet
          }
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: orderClause,
    });

    // Filter out properties that have ANY active leisure lease
    const availableListings = rows.filter(listing => {
      // If it's not a leisure property, always show it
      if (!listing.isLeisure) return true;
      
      // If it's a leisure property, only show if it has NO active leases
      return !listing.leisureLeases || listing.leisureLeases.length === 0;
    });

    const availableTotal = availableListings.length < parseInt(limit)
      ? (parseInt(offset) + availableListings.length)
      : count;

    res.json({ 
      listings: availableListings, 
      total: availableTotal, 
      pages: Math.ceil(availableTotal / parseInt(limit))
    });
  } catch (err) {
    console.error('Get listings error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'avatar', 'isVerified'] }],
    });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    await listing.increment('views');
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await listing.update(req.body);
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await listing.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    const listings = await Listing.findAll({
      where: { isFeatured: true, status: 'active' },
      include: [
        { model: User, as: 'seller', attributes: ['id', 'name', 'avatar', 'isVerified'] },
        {
          model: LeisureLease,
          as: 'leisureLeases',
          required: false,
          where: {
            status: 'active',
            paymentStatus: 'paid',
            endDate: { [Op.gte]: new Date() } // Only active leases that haven't ended yet
          }
        }
      ],
      limit: 8,
      order: [['createdAt', 'DESC']],
    });

    // Filter out properties that have ANY active leisure lease
    const availableListings = listings.filter(listing => {
      // If it's not a leisure property, always show it
      if (!listing.isLeisure) return true;
      
      // If it's a leisure property, only show if it has NO active leases
      return !listing.leisureLeases || listing.leisureLeases.length === 0;
    });

    res.json(availableListings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

