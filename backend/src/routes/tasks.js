import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/checkRole.js';

const router = Router();
router.use(authMiddleware);

// Empleado ve solo sus tareas; admin ve todas
router.get('/', async (req, res) => {
  const where = req.user.role === 'ADMIN' ? {} : { assignedToId: req.user.userId };
  const tasks = await prisma.task.findMany({
    where,
    include: { assignedTo: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(tasks);
});

// Solo admin crea y asigna tareas
router.post('/', requireRole('ADMIN'), async (req, res) => {
  const { title, description, assignedToId } = req.body;
  const task = await prisma.task.create({
    data: { title, description, assignedToId, createdById: req.user.userId },
  });
  res.status(201).json(task);
});

// Empleado puede actualizar el estado de SU tarea; admin cualquiera
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = await prisma.task.findUnique({ where: { id: Number(id) } });
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

  if (req.user.role !== 'ADMIN' && task.assignedToId !== req.user.userId) {
    return res.status(403).json({ error: 'No puedes modificar esta tarea' });
  }

  const updated = await prisma.task.update({ where: { id: Number(id) }, data: { status } });
  res.json(updated);
});

router.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({ where: { id: Number(id) } });
  res.status(204).send();
});
export default router;