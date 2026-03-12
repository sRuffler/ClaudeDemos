import { getAuthUser } from '../_lib/auth.js'
import prisma from '../_lib/prisma.js'

export default async function handler(req, res) {
  const user = await getAuthUser(req, res)
  if (!user) return

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { order } = req.body

  if (!Array.isArray(order) || order.length === 0) {
    return res.status(400).json({ error: 'order must be a non-empty array of { id, sortOrder }' })
  }

  // Verify ownership of all habits
  const ids = order.map((item) => item.id)
  const habits = await prisma.habit.findMany({
    where: { id: { in: ids }, userId: user.id },
    select: { id: true },
  })

  if (habits.length !== ids.length) {
    return res.status(403).json({ error: 'One or more habits not found or not owned by user' })
  }

  // Update all sortOrders in a transaction
  await prisma.$transaction(
    order.map(({ id, sortOrder }) =>
      prisma.habit.update({ where: { id }, data: { sortOrder } })
    )
  )

  return res.status(200).json({ success: true })
}
