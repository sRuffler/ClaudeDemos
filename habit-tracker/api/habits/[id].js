import { getAuthUser } from '../_lib/auth.js'
import prisma from '../_lib/prisma.js'

const VALID_DAYS = [0, 1, 2, 3, 4, 5, 6]

function parseDays(days) {
  if (!Array.isArray(days) || days.length === 0) return null
  const nums = days.map(Number)
  if (nums.some((d) => !VALID_DAYS.includes(d))) return null
  return [...new Set(nums)].sort((a, b) => a - b).join(',')
}

export default async function handler(req, res) {
  const user = await getAuthUser(req, res)
  if (!user) return

  const { id } = req.query

  const habit = await prisma.habit.findUnique({ where: { id } })
  if (!habit) return res.status(404).json({ error: 'Habit not found' })
  if (habit.userId !== user.id) return res.status(403).json({ error: 'Forbidden' })

  if (req.method === 'GET') {
    return res.status(200).json({ habit })
  }

  if (req.method === 'PUT') {
    const { name, description, days, isActive } = req.body

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'name cannot be empty' })
      }
      if (name.trim().length > 100) {
        return res.status(400).json({ error: 'name must be 100 characters or fewer' })
      }
    }

    if (days !== undefined) {
      if (parseDays(days) === null) {
        return res.status(400).json({ error: 'days must be a non-empty array of integers 0–6' })
      }
    }

    const updated = await prisma.habit.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(days !== undefined && { days: parseDays(days) }),
        ...(isActive !== undefined && { isActive }),
      },
    })
    return res.status(200).json({ habit: updated })
  }

  if (req.method === 'DELETE') {
    await prisma.habit.update({
      where: { id },
      data: { isActive: false },
    })
    return res.status(200).json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
