import type { Request, Response, NextFunction } from 'express'
import { verifyToken, type JwtPayload } from '../utils/jwt.ts'

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // console.log('Middleware hit')
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // console.log('token')

    if (!token) {
      return res.status(401).json({ error: 'Bad Request' })
    }
    // console.log('Before verify')
    const payload = await verifyToken(token)
    console.log(payload)
    ;(req as AuthenticatedRequest).user = payload
    next()
  } catch (e) {
    return res.status(403).json({ error: 'Forbidden' })
  }
}
