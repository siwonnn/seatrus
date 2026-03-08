const SEOUL_TIMEZONE = "Asia/Seoul"
const DAY_MS = 24 * 60 * 60 * 1000

function toDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value)
}

function getSeoulYmd(date: Date) {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: SEOUL_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date)

  const year = Number(parts.find((part) => part.type === "year")?.value)
  const month = Number(parts.find((part) => part.type === "month")?.value)
  const day = Number(parts.find((part) => part.type === "day")?.value)

  return { year, month, day }
}

function toUtcDayNumber(year: number, month: number, day: number) {
  return Math.floor(Date.UTC(year, month - 1, day) / DAY_MS)
}

export function formatSeoulDate(value: string | Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: SEOUL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(toDate(value))
}

export function formatSeoulDateLong(value: string | Date) {
  const { year, month, day } = getSeoulYmd(toDate(value))

  if (!year || !month || !day) {
    return ""
  }

  return `${year}년 ${month}월 ${day}일`
}

export function formatSeoulRelativeDay(value: string | Date) {
  const target = getSeoulYmd(toDate(value))
  const today = getSeoulYmd(new Date())

  if (!target.year || !target.month || !target.day || !today.year || !today.month || !today.day) {
    return ""
  }

  const targetDayNumber = toUtcDayNumber(target.year, target.month, target.day)
  const todayDayNumber = toUtcDayNumber(today.year, today.month, today.day)
  const diff = todayDayNumber - targetDayNumber

  if (diff === 0) return "오늘"
  if (diff === 1) return "어제"
  if (diff === 2) return "그저께"
  if (diff > 2) return `${diff}일 전`
  if (diff === -1) return "내일"
  if (diff === -2) return "모레"
  return `${Math.abs(diff)}일 후`
}

export function formatSeoulDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: SEOUL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(toDate(value))
}
