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

  if (req.method === 'GET') {
    const habits = await prisma.habit.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return res.status(200).json({ habits })
  }

  if (req.method === 'POST') {
    const { name, description, days } = req.body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'name is required' })
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ error: 'name must be 100 characters or fewer' })
    }

    const daysStr = parseDays(days)
    if (days !== undefined && daysStr === null) {
      return res.status(400).json({ error: 'days must be a non-empty array of integers 0–6' })
    }

    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: name.trim(),
        description: description?.trim() || null,
        days: daysStr ?? '0,1,2,3,4,5,6',
      },
    })
    return res.status(201).json({ habit })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
