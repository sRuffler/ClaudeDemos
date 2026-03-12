/**
 * Returns today's date as a YYYY-MM-DD string in local time.
 */
export function useToday() {
  function getTodayString() {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return { getTodayString }
}
