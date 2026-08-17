import { Router } from 'express';
import { body } from 'express-validator';
import { userService } from '../services/userService';
import { validate } from '../middleware/validate';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post(
  '/register',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ]),
  async (req, res, next) => {
    try {
      const { email, name, password } = req.body;
      const user = await userService.register(email, name, password);
      res.status(201).json({ success: true, data: user });
    } catch (err: any) {
      if (err.message === 'Email already in use') {
        res.status(409).json({ success: false, error: err.message });
      } else {
        next(err);
      }
    }
  }
);

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const data = await userService.login(email, password);
      res.json({ success: true, data });
    } catch (err: any) {
      if (err.message === 'Invalid email or password') {
        res.status(401).json({ success: false, error: err.message });
      } else {
        next(err);
      }
    }
  }
);

router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await userService.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
