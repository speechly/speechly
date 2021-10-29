import React, { useEffect, useRef, useState } from "react";

type Props = {
  date?: Date
  onDatePick?: (value: Date) => void
}

const DAY = 24*3600*1000
const buildCalendar = (firstDate: Date): Date[] => {
  let dates = []
  for (let i = 0 - firstDate.getDay(); i < 29 || dates.length % 7 != 1 ; i++) {
    dates.push(new Date(firstDate.getTime() + i*DAY))
  }
  return dates
}

const groupByWeek = (acc: Date[][], date: Date): Date[][] => {
  let row = acc.length
  if (row === 0) {
    // init
    acc[row] = []
    acc[row].push(date)
    return acc
  }

  if (acc[row-1].length === 7) {
    row++
  }

  if (acc[row-1] === undefined) {
    acc[row-1] = []
  }
  acc[row-1].push(date)
  return acc
}

export const Calendar = ({date, onDatePick} : Props) => {

  const [ _date, setDate ] = useState(date ?? new Date())

  const firstDate = new Date(Date.parse(`${(_date.getMonth() + 1).toString().padStart(2, '0')}-01-${_date.getFullYear()}`))

  const dates: Date[] = buildCalendar(firstDate)

  const weekDays = [
    'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'
  ]

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ]

  const prevMonth = (e: React.FormEvent) => {
    e.preventDefault()
    let year = _date.getFullYear()
    let month = _date.getMonth()
    if (_date.getMonth() === 0) {
      year--
      month = 11
    } else {
      month--
    }
    const prevMonth = new Date(Date.parse(`${(month+1).toString().padStart(2, '0')}-01-${year}`))
    setDate(prevMonth)
  }

  const nextMonth = (e: React.FormEvent) => {
    e.preventDefault()
    let year = _date.getFullYear()
    let month = _date.getMonth()
    if (_date.getMonth() === 11) {
      year++
      month = 0
    } else {
      month++
    }
    const nextMonth = new Date(Date.parse(`${(month + 1).toString().padStart(2, '0')}-01-${year}`))
    setDate(nextMonth)
  }

  const pick = (pickedDate: Date) => {
    if (onDatePick) {
      onDatePick(pickedDate)
    }
  }

  return (
    <div className="calendar">
      <div className="row">
        <div className="span12">
          <table className="table-condensed table-bordered table-striped">
            <thead>
                <tr className="header">
                  <th>
                    <button className="prev-button" onClick={prevMonth}>&#60;</button>
                  </th>
                  <th colSpan={5}>
                    <div>{_date && months[_date.getMonth()] + ' ' + _date.getFullYear()}</div>
                  </th>
                  <th>
                    <button className="next-bottin" onClick={nextMonth}>&#62;</button>
                  </th>
                </tr>
                <tr>
                  {weekDays.map(d => <th key={d}>{d}</th>)}
                </tr>
            </thead>
            <tbody>
              { dates && dates.reduce(groupByWeek, []).map((datesInWeek, i) => 
                <tr key={i}>
                  {datesInWeek.map(d => <td key={d.getTime()}
                    className={date && _date.getMonth() !== d.getMonth() ? 'muted' :
                      (date && _date.getDate() === d.getDate() ? 'selected' : '')}
                    onClick={() => pick(d)}>
                    {d.getDate()}
                  </td>)}
                </tr>
                )}
            </tbody>
          </table>    
        </div>
      </div>
    </div>
  )
}
