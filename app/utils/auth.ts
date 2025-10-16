import jwt from 'jsonwebtoken';

// Static admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin'
};

// JWT secret key - in production, this should be in environment variables
const JWT_SECRET = '52a40127be368893fa720f3639335a1565123c12d5748d1af52e65af7372e4eb6ca02199d251d1fb10060c57ed96207d10222024d562df66c577e531a97acd4a';
const JWT_EXPIRES_IN = '7d';

// Authenticate user with static credentials
export const authenticateUser = (email: string, password: string) => {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    // Create user object without password
    const user = {
      id: '1',
      email: ADMIN_CREDENTIALS.email,
      name: ADMIN_CREDENTIALS.name,
      role: ADMIN_CREDENTIALS.role
    };
    
    // Generate JWT token
    const token = generateToken(user);
    
    return { success: true, token, user };
  }
  
  return { success: false, message: 'Invalid credentials' };
};

// Generate JWT token
export const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error };
  }
};

// Get user from token
export const getUserFromToken = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    const { valid, decoded } = verifyToken(token);
    
    if (valid && decoded) {
      return decoded;
    }
  }
  
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getUserFromToken() !== null;
};

// Check if user is admin
export const isAdmin = () => {
  const user = getUserFromToken();
  return user  === 'admin';
};

// Logout user
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};