import { parseISO, format } from 'date-fns'

// 日付
const Date = ({ dateString }: { dateString: string }) => {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'LLLL d,yyy')}</time>
}

export default Date
