import { getAuthUser } from '../_lib/auth.js'
import prisma from '../_lib/prisma.js'

export default async function handler(req, res) {
  const user = await getAuthUser(req, res)
  if (!user) return

  if (req.method === 'GET') {
    const habits = await prisma.habit.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: { createdAt: 'asc' },
    })
    return res.status(200).json({ habits })
  }

  if (req.method === 'POST') {
    const { name, description, frequency } = req.body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'name is required' })
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ error: 'name must be 100 characters or fewer' })
    }

    const validFrequencies = ['DAILY', 'WEEKDAYS', 'WEEKENDS']
    if (frequency && !validFrequencies.includes(frequency)) {
      return res.status(400).json({ error: 'frequency must be DAILY, WEEKDAYS, or WEEKENDS' })
    }

    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: name.trim(),
        description: description?.trim() || null,
        frequency: frequency || 'DAILY',
      },
    })
    return res.status(201).json({ habit })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
