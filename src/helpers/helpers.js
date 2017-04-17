import moment from 'moment'

export function oneDayAgoTimestamp() {
  var d = new Date();
  return d.setDate(d.getDate() - 1);
}

export function oneDayAgoDate() {
  var d = new Date();
  var newDate = d.setDate(d.getDate() - 1);
  return new Date(newDate)
}

export function firstOfThisYearTimestamp() {
  var d = new Date();
  return new Date(d.getFullYear(), 0, 1).getTime()
}

export function getMonthAndDay(date) {
  const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  }

  var monthNumber = date.getMonth();
  var month = months[monthNumber]
  var day = date.getDate();
  var monthDay = month + ' ' + day
  return monthDay
}

export function tipTimeFormat(ts) {
  const timestamp = moment(new Date(ts))
  const now = new Date()
  if (timestamp.isSame(now, "day")) {
    // if today, show 8:25 am
    return timestamp.format('h:mm a')
  } else if (timestamp.isSame(now, "year")) {
    // if same year, show Apr 8
    return timestamp.format('MMM D')
  } else {
    // otherwise, show 9/2/16
    return timestamp.format('M/D/YY')
  }
}

export function tipTimeFormatLong(ts) {
  const tipDateTime = moment(new Date(ts))
  return tipDateTime.format('MMMM Do YYYY, h:mm a')
}

export function relativeTime(ts) {
  const relativeTime = moment(new Date(ts))
  return relativeTime.fromNow()
}

export function reverse(obj) {
  const reversedObj = {};
  Object.keys(obj).reverse().forEach((key) => reversedObj[key] = obj[key])
  return reversedObj
}