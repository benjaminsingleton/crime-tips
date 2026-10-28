import moment from 'moment';

export function oneDayAgoTimestamp() {
  const d = new Date();
  return d.setDate(d.getDate() - 1);
}

export function oneDayAgoDate() {
  const d = new Date();
  const newDate = d.setDate(d.getDate() - 1);
  return new Date(newDate);
}

export function firstOfThisYearTimestamp() {
  const d = new Date();
  return new Date(d.getFullYear(), 0, 1).getTime();
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
    11: 'December',
  };

  const monthNumber = date.getMonth();
  const month = months[monthNumber];
  const day = date.getDate();
  return `${month} ${day}`;
}

export function tipTimeFormat(ts) {
  const timestamp = moment(new Date(ts));
  const now = new Date();
  if (timestamp.isSame(now, 'day')) {
    return timestamp.format('h:mm a');
  }
  if (timestamp.isSame(now, 'year')) {
    return timestamp.format('MMM D');
  }
  return timestamp.format('M/D/YY');
}

export function tipTimeFormatLong(ts) {
  const tipDateTime = moment(new Date(ts));
  return tipDateTime.format('MMMM Do YYYY, h:mm a');
}

export function relativeTime(ts) {
  const relativeTimeTs = moment(new Date(ts));
  return relativeTimeTs.fromNow();
}

export function reverse(obj) {
  if (!obj) return {};
  const reversedObj = {};
  Object.keys(obj).reverse().forEach((key) => {
    reversedObj[key] = obj[key];
  });
  return reversedObj;
}

export function omitUnchanged(now, prev) {
  const updated = {};
  Object.keys(now || {}).forEach((key) => {
    if (now[key] !== prev?.[key]) updated[key] = now[key];
  });
  return updated;
}
