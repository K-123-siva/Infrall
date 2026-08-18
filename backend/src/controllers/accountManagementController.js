const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const emailService = require('../services/emailService');
const { Op } = require('sequelize');

// ==================== OWNER ACCOUNT MANAGEMENT ====================

// Get all owner accounts
exports.getOwnerAccounts = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const { Sequelize } = require('sequelize');
    
    const where = { role: 'user' };
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status === 'pending') {
      where.passwordSetupToken = { [Op.ne]: null };
    } else if (status === 'active') {
      where.passwordSetupToken = null;
      where.isVerified = true;
    }
    
    // Get users with property counts
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { 
        exclude: ['password'],
        include: [
          [Sequelize.literal('(SELECT COUNT(*) FROM listings WHERE listings.userId = User.id)'), 'propertyCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM listings WHERE listings.userId = User.id AND listings.status = "active")'), 'activePropertyCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM listings WHERE listings.userId = User.id AND listings.status = "rented")'), 'rentedPropertyCount']
        ]
      },
      include: [
        {
          model: require('../models/Listing'),
          as: 'Listings',
          attributes: [
            'id', 'title', 'category', 'status', 'price', 'city', 'images',
            'ownerDocuments', 'thalukaDocuments', 'agreementDocument',
            'contactPerson', 'contactPhone', 'contactEmail',
            'ownerAadhaar', 'ownerPan', 'commissionPercentage'
          ],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });
    
    // Filter out users who are vendors (have vendor profile) and users with 0 properties
    const Vendor = require('../models/Vendor');
    const ownerIds = rows.map(u => u.id);
    
    // Get vendor user IDs
    const vendors = await Vendor.findAll({
      where: { userId: { [Op.in]: ownerIds } },
      attributes: ['userId']
    });
    const vendorUserIds = vendors.map(v => v.userId);
    
    // Filter: exclude vendors and users with 0 properties
    const filteredOwners = rows.filter(user => {
      const isVendor = vendorUserIds.includes(user.id);
      const hasProperties = user.Listings && user.Listings.length > 0;
      return !isVendor && hasProperties;
    });
    
    res.json({ 
      owners: filteredOwners, 
      total: filteredOwners.length,
      pages: Math.ceil(filteredOwners.length / limit)
    });
  } catch (error) {
    console.error('Get owner accounts error:', error);
    res.status(500).json({ message: 'Failed to fetch owner accounts', error: error.message });
  }
};

// Initiate owner account creation (send email)
exports.initiateOwnerAccount = async (req, res) => {
  try {
    const { email, name, phone } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    
    if (existingUser && !existingUser.passwordSetupToken) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    
    // Generate password setup token
    const setupToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
    
    if (existingUser) {
      // Update existing pending account
      existingUser.passwordSetupToken = setupToken;
      existingUser.passwordSetupExpiry = tokenExpiry;
      if (name) existingUser.name = name;
      if (phone) existingUser.phone = phone;
      await existingUser.save();
    } else {
      // Create new pending account
      await User.create({
        email: email.toLowerCase().trim(),
        name: name || 'Owner',
        phone: phone || '',
        password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10), // Temporary random password
        role: 'user',
        isVerified: false,
        passwordSetupToken: setupToken,
        passwordSetupExpiry: tokenExpiry
      });
    }
    
    // Send password setup email
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const setupLink = `${baseUrl}/owner/setup-password?token=${setupToken}`;
    const loginLink = `${baseUrl}/owner/login`;
    
    await emailService.sendEmail({
      to: email,
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
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .credentials-box { background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #667eea; }
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
              <h2>Hello ${name || 'Property Owner'},</h2>
              
              <p>An admin has created an Owner Portal account for you on INFRAALL. To complete your account setup, please set your password by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${setupLink}" class="button">Set Up My Password</a>
              </div>
              
              <div class="credentials-box">
                <h3 style="margin-top: 0; color: #667eea;">🔐 Your Login Credentials</h3>
                <p><strong>Username:</strong> ${email}</p>
                <p><strong>Password:</strong> <span style="color: #dc2626;">Set your new password using the button above</span></p>
                <p style="margin-bottom: 0;"><strong>Login URL:</strong> <a href="${loginLink}" style="color: #667eea;">${loginLink}</a></p>
              </div>
              
              <div class="info-box">
                <p><strong>📧 Your Email:</strong> ${email}</p>
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
    
    res.json({ 
      message: 'Password setup email sent successfully',
      email: email,
      expiresIn: '48 hours'
    });
  } catch (error) {
    console.error('Initiate owner account error:', error);
    res.status(500).json({ message: 'Failed to initiate account creation', error: error.message });
  }
};

// Resend password setup email for owner
exports.resendOwnerSetupEmail = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate new token
    const setupToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);
    
    user.passwordSetupToken = setupToken;
    user.passwordSetupExpiry = tokenExpiry;
    await user.save();
    
    // Send email
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const setupLink = `${baseUrl}/owner/setup-password?token=${setupToken}`;
    
    await emailService.sendEmail({
      to: user.email,
      subject: 'Set Up Your INFRAALL Owner Account - Reminder',
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 INFRAALL Owner Portal</h1>
              <p>Password Setup Reminder</p>
            </div>
            <div class="content">
              <h2>Hello ${user.name},</h2>
              <p>This is a reminder to complete your INFRAALL Owner Portal account setup.</p>
              <div style="text-align: center;">
                <a href="${setupLink}" class="button">Set Up My Password</a>
              </div>
              <p>This link will expire in 48 hours.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    res.json({ message: 'Setup email resent successfully' });
  } catch (error) {
    console.error('Resend owner setup email error:', error);
    res.status(500).json({ message: 'Failed to resend email', error: error.message });
  }
};

// ==================== VENDOR ACCOUNT MANAGEMENT ====================

// Get all vendor accounts
exports.getVendorAccounts = async (req, res) => {
  try {
    const { search, status, vendorType, page = 1, limit = 20 } = req.query;
    
    const vendorWhere = {};
    const userWhere = {};
    
    if (search) {
      vendorWhere[Op.or] = [
        { businessName: { [Op.like]: `%${search}%` } },
        { contactPerson: { [Op.like]: `%${search}%` } },
        { contactEmail: { [Op.like]: `%${search}%` } },
        { contactPhone: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status === 'pending') {
      userWhere.passwordSetupToken = { [Op.ne]: null };
    } else if (status === 'active') {
      userWhere.passwordSetupToken = null;
      userWhere.isVerified = true;
    }
    
    if (vendorType) {
      vendorWhere.vendorType = vendorType;
    }
    
    const { count, rows } = await Vendor.findAndCountAll({
      where: vendorWhere,
      include: [{
        model: User,
        as: 'user',
        where: userWhere,
        attributes: { exclude: ['password'] }
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });
    
    res.json({ 
      vendors: rows, 
      total: count,
      pages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Get vendor accounts error:', error);
    res.status(500).json({ message: 'Failed to fetch vendor accounts', error: error.message });
  }
};

// Initiate vendor account creation (send email)
exports.initiateVendorAccount = async (req, res) => {
  try {
    const { email, businessName, contactPerson, phone, vendorType } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    
    if (existingUser && !existingUser.passwordSetupToken) {
      return res.status(400).json({ message: 'A user account with this email already exists' });
    }
    
    // Generate password setup token
    const setupToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
    
    let user;
    if (existingUser) {
      // Update existing pending account
      existingUser.passwordSetupToken = setupToken;
      existingUser.passwordSetupExpiry = tokenExpiry;
      if (contactPerson) existingUser.name = contactPerson;
      if (phone) existingUser.phone = phone;
      await existingUser.save();
      user = existingUser;
    } else {
      // Create new pending user account
      user = await User.create({
        email: email.toLowerCase().trim(),
        name: contactPerson || 'Vendor',
        phone: phone || '',
        password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10), // Temporary random password
        role: 'user',
        isVerified: false,
        passwordSetupToken: setupToken,
        passwordSetupExpiry: tokenExpiry
      });
    }
    
    // Create vendor profile linked to user
    const existingVendor = await Vendor.findOne({ where: { userId: user.id } });
    if (!existingVendor) {
      await Vendor.create({
        businessName: businessName || 'Vendor Business',
        contactPerson: contactPerson || 'Vendor',
        contactPhone: phone || '',
        contactEmail: email.toLowerCase().trim(),
        vendorType: vendorType || 'home_services',
        city: 'Not specified',
        locality: 'Not specified',
        isActive: false,
        userId: user.id
      });
    }
    
    // Send password setup email
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const setupLink = `${baseUrl}/vendor/setup-password?token=${setupToken}`;
    
    await emailService.sendEmail({
      to: email,
      subject: 'Set Up Your INFRAALL Vendor Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔧 Welcome to INFRAALL</h1>
              <p>Vendor Portal Account Setup</p>
            </div>
            <div class="content">
              <h2>Hello ${contactPerson || businessName || 'Vendor Partner'},</h2>
              
              <p>An admin has created a Vendor Portal account for you on INFRAALL. To complete your account setup, please set your password by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${setupLink}" class="button">Set Up My Password</a>
              </div>
              
              <div class="info-box">
                <p><strong>🏢 Business Name:</strong> ${businessName || 'Not specified'}</p>
                <p><strong>📧 Your Email:</strong> ${email}</p>
                <p><strong>🔧 Vendor Type:</strong> ${vendorType || 'Home Services'}</p>
                <p><strong>⏰ Link Valid For:</strong> 48 hours</p>
              </div>
              
              <p><strong>What you can do with your Vendor Portal:</strong></p>
              <ul>
                <li>Receive and manage service requests</li>
                <li>View assigned properties and tasks</li>
                <li>Track your earnings and payments</li>
                <li>Update service status and reports</li>
                <li>Communicate with property owners</li>
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
    
    res.json({ 
      message: 'Password setup email sent successfully',
      email: email,
      expiresIn: '48 hours'
    });
  } catch (error) {
    console.error('Initiate vendor account error:', error);
    res.status(500).json({ message: 'Failed to initiate account creation', error: error.message });
  }
};

// Resend password setup email for vendor
exports.resendVendorSetupEmail = async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    const vendor = await Vendor.findByPk(vendorId, {
      include: [{ model: User, as: 'user' }]
    });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    const user = vendor.user;
    
    // Generate new token
    const setupToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);
    
    user.passwordSetupToken = setupToken;
    user.passwordSetupExpiry = tokenExpiry;
    await user.save();
    
    // Send email
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const setupLink = `${baseUrl}/vendor/setup-password?token=${setupToken}`;
    
    await emailService.sendEmail({
      to: user.email,
      subject: 'Set Up Your INFRAALL Vendor Account - Reminder',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔧 INFRAALL Vendor Portal</h1>
              <p>Password Setup Reminder</p>
            </div>
            <div class="content">
              <h2>Hello ${vendor.contactPerson || vendor.businessName},</h2>
              <p>This is a reminder to complete your INFRAALL Vendor Portal account setup.</p>
              <div style="text-align: center;">
                <a href="${setupLink}" class="button">Set Up My Password</a>
              </div>
              <p>This link will expire in 48 hours.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    res.json({ message: 'Setup email resent successfully' });
  } catch (error) {
    console.error('Resend vendor setup email error:', error);
    res.status(500).json({ message: 'Failed to resend email', error: error.message });
  }
};

// ==================== PASSWORD SETUP (PUBLIC ENDPOINTS) ====================

// Verify token and get account info
exports.verifySetupToken = async (req, res) => {
  try {
    const { token, type } = req.query; // type: 'owner' or 'vendor'
    
    if (!token || !type) {
      return res.status(400).json({ message: 'Token and type are required' });
    }
    
    const user = await User.findOne({ 
      where: { 
        passwordSetupToken: token,
        passwordSetupExpiry: { [Op.gt]: new Date() }
      },
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    let responseData = {
      valid: true,
      email: user.email,
      name: user.name
    };
    
    // If vendor, get vendor profile info
    if (type === 'vendor') {
      const vendor = await Vendor.findOne({ where: { userId: user.id } });
      if (vendor) {
        responseData.businessName = vendor.businessName;
        responseData.vendorType = vendor.vendorType;
      }
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Verify setup token error:', error);
    res.status(500).json({ message: 'Failed to verify token', error: error.message });
  }
};

// Complete password setup
exports.completePasswordSetup = async (req, res) => {
  try {
    const { token, password, type } = req.body; // type: 'owner' or 'vendor'
    
    if (!token || !password || !type) {
      return res.status(400).json({ message: 'Token, password, and type are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const user = await User.findOne({ 
      where: { 
        passwordSetupToken: token,
        passwordSetupExpiry: { [Op.gt]: new Date() }
      }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    // Set password and activate account
    user.password = await bcrypt.hash(password, 10);
    user.passwordSetupToken = null;
    user.passwordSetupExpiry = null;
    user.isVerified = true;
    
    await user.save();
    
    // If vendor, activate vendor profile
    if (type === 'vendor') {
      const vendor = await Vendor.findOne({ where: { userId: user.id } });
      if (vendor) {
        vendor.isActive = true;
        await vendor.save();
      }
    }
    
    res.json({ 
      message: 'Password set successfully! You can now login.',
      accountType: type
    });
  } catch (error) {
    console.error('Complete password setup error:', error);
    res.status(500).json({ message: 'Failed to set password', error: error.message });
  }
};

module.exports = exports;
