import { getAuthUser } from '../_lib/auth.js'
import prisma from '../_lib/prisma.js'

export default async function handler(req, res) {
  const user = await getAuthUser(req, res)
  if (!user) return

  const { id } = req.query

  if (req.method === 'PUT') {
    const log = await prisma.habitLog.findUnique({ where: { id } })
    if (!log) return res.status(404).json({ error: 'Log not found' })
    if (log.userId !== user.id) return res.status(403).json({ error: 'Forbidden' })

    const { completed, notes } = req.body

    const updated = await prisma.habitLog.update({
      where: { id },
      data: {
        ...(completed !== undefined && { completed }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
      },
    })
    return res.status(200).json({ log: updated })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
