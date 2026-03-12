import { getAuthUser } from '../_lib/auth.js'
import prisma from '../_lib/prisma.js'

export default async function handler(req, res) {
  const user = await getAuthUser(req, res)
  if (!user) return

  if (req.method === 'GET') {
    const { date, habitId } = req.query

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'date query param is required (YYYY-MM-DD)' })
    }

    const where = { userId: user.id, date }
    if (habitId) where.habitId = habitId

    const logs = await prisma.habitLog.findMany({
      where,
      include: { habit: { select: { name: true } } },
    })
    return res.status(200).json({ logs })
  }

  if (req.method === 'POST') {
    const { habitId, date, completed, notes } = req.body

    if (!habitId || !date) {
      return res.status(400).json({ error: 'habitId and date are required' })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'date must be YYYY-MM-DD' })
    }

    // Verify the user owns the habit
    const habit = await prisma.habit.findUnique({ where: { id: habitId } })
    if (!habit) return res.status(404).json({ error: 'Habit not found' })
    if (habit.userId !== user.id) return res.status(403).json({ error: 'Forbidden' })

    const log = await prisma.habitLog.upsert({
      where: { habitId_date: { habitId, date } },
      update: {
        completed: completed ?? false,
        notes: notes?.trim() || null,
      },
      create: {
        habitId,
        userId: user.id,
        date,
        completed: completed ?? false,
        notes: notes?.trim() || null,
      },
    })
    return res.status(200).json({ log })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
