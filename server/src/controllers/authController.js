const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getQuery, runQuery } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'medicare_hub_super_secret_jwt_key_2026';

// Register User (Default Role: PATIENT)
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !name.trim() || !email || !email.trim() || !password || !password.trim()) {
      return res.status(400).json({ error: 'Full name, email/username, and password are required.' });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();
    const tenantId = 'tenant_central_medicare';
    const userRole = 'PATIENT';

    const existingUser = await getQuery(
      'SELECT id FROM users WHERE LOWER(email) = ? OR LOWER(name) = ?',
      [trimmedEmail, trimmedName.toLowerCase()]
    );
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email or username already exists. Please sign in instead.' });
    }

    const hashedPassword = await bcrypt.hash(trimmedPass, 10);

    const result = await runQuery(
      'INSERT INTO users (tenant_id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [tenantId, trimmedName, trimmedEmail, hashedPassword, userRole, phone ? phone.trim() : '']
    );

    const token = jwt.sign(
      { id: result.id, name: trimmedName, email: trimmedEmail, role: userRole, tenantId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: result.id, name: trimmedName, email: trimmedEmail, role: userRole, phone: phone || '', tenantId }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User with robust fallback for admin / pass123!
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required.' });
    }

    const trimmedInput = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    // Check database for user by email or name
    let user = await getQuery(
      'SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(name) = ?',
      [trimmedInput, trimmedInput]
    );

    // Fallback check for testing admin account (admin / pass123!)
    if ((trimmedInput === 'admin' || trimmedInput === 'admin@medicare.com') && trimmedPass === 'pass123!') {
      if (!user) {
        const hashedPassword = await bcrypt.hash('pass123!', 10);
        const resAdmin = await runQuery(
          'INSERT INTO users (tenant_id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
          ['tenant_central_medicare', 'Hospital Admin', 'admin@medicare.com', hashedPassword, 'ADMIN', '+15550192831']
        );
        user = {
          id: resAdmin.id,
          name: 'Hospital Admin',
          email: 'admin@medicare.com',
          role: 'ADMIN',
          phone: '+15550192831',
          tenant_id: 'tenant_central_medicare'
        };
      } else {
        // Ensure user object has ADMIN role
        user.role = 'ADMIN';
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: 'ADMIN', tenantId: 'tenant_central_medicare' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'ADMIN',
          phone: user.phone || '',
          tenantId: 'tenant_central_medicare'
        }
      });
    }

    // Fallback check for testing patient account (rahul / patient123)
    if ((trimmedInput === 'rahul' || trimmedInput === 'rahul@example.com') && trimmedPass === 'patient123') {
      if (!user) {
        const hashedPassword = await bcrypt.hash('patient123', 10);
        const resPatient = await runQuery(
          'INSERT INTO users (tenant_id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
          ['tenant_central_medicare', 'Rahul Sharma', 'rahul@example.com', hashedPassword, 'PATIENT', '+919876543210']
        );
        user = {
          id: resPatient.id,
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          role: 'PATIENT',
          phone: '+919876543210',
          tenant_id: 'tenant_central_medicare'
        };
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: 'PATIENT', tenantId: 'tenant_central_medicare' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'PATIENT',
          phone: user.phone || '',
          tenantId: 'tenant_central_medicare'
        }
      });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email/username or password.' });
    }

    const isMatch = await bcrypt.compare(trimmedPass, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email/username or password.' });
    }

    const tenantId = user.tenant_id || 'tenant_central_medicare';

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, tenantId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        tenantId
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await getQuery('SELECT id, name, email, role, phone, tenant_id FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware: Authenticate Token
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing or unauthorized.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token expired or invalid.' });
    req.user = decoded;
    next();
  });
};

// Middleware: Multi-Tenant & RBAC Enforcement
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role permissions for this endpoint.' });
    }
    next();
  };
};
