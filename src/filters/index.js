// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function birthAge(val) {
  var birthdays = new Date(val.replace(/-/g, '/'))
  var d = new Date()
  var age =
    d.getFullYear() -
    birthdays.getFullYear() -
    (d.getMonth() < birthdays.getMonth() ||
    (d.getMonth() == birthdays.getMonth() &&
      d.getDate() < birthdays.getDate())
      ? 1
      : 0)
  return age
}

export function selectOptionFilter(val, options, value, label) {
  value = value || 'value'
  label = label || 'label'
  for (const j in options) {
    if (options[j][value] == val) {
      return options[j][label]
    }
  }
  return ''
}

export function numFilter(val, i) {
  if (i === -1) return val
  if (i === 0) { return val.toFixed(0) }
  i = i || 2
  if (!val) {
    return '0.00'
  }
  const regex = /^(-)?\d+\.*\d*$/
  if (!regex.test(val)) { return val }
  const vla = Number(Math.abs(val))
  const y = (String(vla).indexOf('.') + 1) || (String(vla).length + 1)// 获取小数点的位置
  const count = String(vla).length - y// 获取小数点后的个数
  if (y > 4) {
    return val.toFixed(0)
  }
  // if(y>0) {
  //   if(count>i) {
  //     return val.toFixed(i)
  //   } else {
  //     return val
  //   }
  // } else {
  //   return val
  // }
  return Number(val).toFixed(i)
}
