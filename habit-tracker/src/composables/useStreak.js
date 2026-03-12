/**
 * Calculates the current streak from an array of completed date strings (YYYY-MM-DD).
 * A streak is consecutive days ending today or yesterday.
 *
 * @param {string[]} completedDates - Sorted array of YYYY-MM-DD strings where the habit was completed.
 * @returns {number} Current streak count.
 */
export function calculateStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0

  const sorted = [...completedDates].sort().reverse() // most recent first

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  let cursor = new Date(today)

  for (const dateStr of sorted) {
    const date = new Date(dateStr + 'T00:00:00')
    if (date.getTime() === cursor.getTime()) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else if (date < cursor) {
      // gap found — streak is broken
      break
    }
    // dates in the future are skipped
  }

  // If today isn't completed yet, allow streak to still count from yesterday
  if (streak === 0) {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    cursor = new Date(yesterday)

    for (const dateStr of sorted) {
      const date = new Date(dateStr + 'T00:00:00')
      if (date.getTime() === cursor.getTime()) {
        streak++
        cursor.setDate(cursor.getDate() - 1)
      } else if (date < cursor) {
        break
      }
    }
  }

  return streak
}

export function useStreak() {
  return { calculateStreak }
}
