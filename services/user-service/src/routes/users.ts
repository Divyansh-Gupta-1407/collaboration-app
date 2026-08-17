import { Router } from 'express';
import { query, body } from 'express-validator';
import { userService } from '../services/userService';
import { validate } from '../middleware/validate';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get(
  '/search',
  authenticate,
  validate([query('q').isString().notEmpty().withMessage('Query parameter q is required')]),
  async (req: AuthRequest, res, next) => {
    try {
      const users = await userService.searchUsers(req.query.q as string);
      res.json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.put(
  '/profile',
  authenticate,
  validate([
    body('name').optional().isString(),
    body('avatarUrl').optional().isString()
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const { name, avatarUrl } = req.body;
      const user = await userService.updateProfile(req.user!.id, name, avatarUrl);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
