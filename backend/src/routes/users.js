import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/checkRole.js';

const router = Router();
router.use(authMiddleware, requireRole('ADMIN'));

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: role || 'EMPLOYEE' },
  });
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (Number(id) === req.user.userId) {
    return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
  }

  await prisma.user.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

export default router;