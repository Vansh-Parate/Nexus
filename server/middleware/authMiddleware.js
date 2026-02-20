import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'vega-dev-secret-change-in-production'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function authMiddleware(req, res, next) {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const decoded = verifyToken(token)
  if (!decoded) {
    res.clearCookie('token')
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
  req.userId = decoded.userId
  req.role = decoded.role
  next()
}

export function optionalAuth(req, res, next) {
  const token = req.cookies?.token
  if (token) {
    const decoded = verifyToken(token)
    if (decoded) {
      req.userId = decoded.userId
      req.role = decoded.role
    }
  }
  next()
}
