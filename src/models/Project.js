
import request from 'superagent'
import moment from 'moment'

const colors = ['#1D0CCC', '#4597FF', '#FFC685', '#CC6523', '#AAF235']

export function getProject (name) {
  return request(`http://192.168.1.137:4000/json/projects/${name}`)
    .then((response) => {
      return response.body
    })
}

export function getElems (displayedElems) {
  return displayedElems.map((elem) =>
    request(elem.url).then((response) => response.body))
}

export function applyTransform (object, transform) {
  let newObject = object
  if (transform) {
    if (transform.merge) {
      transform.merge.map((merge) => {
        let val = 0
        if (newObject[merge.name]) {
          val = newObject[merge.name]
        }
        merge.fields.map((property) => {
          if (newObject.hasOwnProperty(property)) {
            val += newObject[property]
            if (merge.hide) {
              transform.hide.push(property)
              delete newObject[property]
            }
          }
        })
        newObject[merge.name] = val
      })
    }
    if (transform.hide) {
      transform.hide.map((property) => {
        if (newObject.hasOwnProperty(property)) {
          delete newObject[property]
        }
      })
    }
    if (transform.show) {
      const newMetrics = {}
      transform.show.map((property) => {
        if (newObject.hasOwnProperty(property)) {
          newMetrics[property] = newObject[property]
        }
      })
      newObject = newMetrics
    }
  }
  return newObject
}

export function getChartdata (names, transform) {
  const seriesPromise = names.map((name) => request(`http://192.168.1.137:4000/json/timeseries/${name}`))
  return Promise.all(seriesPromise)
    .then((out) => {
      let reduction = out.map(resp =>
        resp.body
      )
      reduction = reduction.reduce((all, obj) => {
        Object.keys(obj).map((label) => {
          if (all.hasOwnProperty(label)) {
            all[label] = Array.concat(all[label], obj[label])
          } else {
            all[label] = obj[label]
          }
        })
        return all
      }, {})
      reduction = Object.keys(reduction).reduce((all, key) => {
        all[key] = reduction[key].reduce((acc, obj) => {
          Object.keys(obj).map((date) => {
            const timestamp = moment(date, 'YYYY-MM-DDTHH:mm:SS+00:00').format('YYYY-MM-DDTHH:mm')
            if (acc.hasOwnProperty(timestamp)) {
              acc[timestamp] += parseInt(obj[date])
            } else {
              acc[timestamp] = parseInt(obj[date])
            }
          })
          return acc
        }, {})
        return all
      }, {})
      let datasets = Object.keys(reduction).map((key) => {
        let background = colors[Object.keys(reduction).findIndex((obj) => obj === key) % colors.length]
        return {
          pointBackgroundColor: background,
          pointBorderColor: background,
          lineColor: background,
          backgroundColor: background,
          borderWidth: 3,
          borderColor: background,
          fill: false,
          label: key,
          data: Object.values(reduction[key])
        }
      })
      const labels = Object.keys(reduction).reduce((all, key) => {
        all.push(Object.keys(reduction[key]).map((date) => date))
        return all
      }, [])
      datasets = transformDataset(datasets, transform)
      return {labels: labels[0], datasets: datasets}
    })
}

export function mergeMetrics (metrics) {
  return metrics.map((elem) => elem.metrics)
    .reduce((all, elem) => {
      Object.keys(elem).map((key) => {
        if (!all.hasOwnProperty(key)) {
          all[key] = elem[key]
        } else {
          all[key] += elem[key]
        }
      })
      return all
    }, {})
}

export function transformDataset (dataset, transformStr) {
  let newData = dataset
  const transform = JSON.parse(transformStr)
  if (transform) {
    if (transform.hasOwnProperty('merge')) {
      transform.merge.map((merge) => {
        const val = []
        merge.fields.map((field) => {
          const data = newData.find((elem) => elem.label === field)
          data.data.map((value, index) => {
            val[index] = value
          })
        })
        let background = merge.color
        newData.push({
          pointBackgroundColor: background,
          pointBorderColor: background,
          lineColor: background,
          backgroundColor: background,
          borderWidth: 3,
          borderColor: background,
          fill: false,
          label: merge.name,
          data: val
        })
        if (merge.hide) {
          if (transform.hasOwnProperty('hide')) {
            transform.hide = Array.concat(transform.hide, merge.fields)
          } else {
            transform.hide = merge.fields
          }
        }
      })
    }
    if (transform.hasOwnProperty('hide')) {
      newData = newData.filter((data) =>
        transform.hide.findIndex((elem) => elem === data.label) <= -1
      )
    }
    if (transform.hasOwnProperty('show')) {
      newData = newData.filter((data) =>
        transform.show.findIndex((elem) => elem === data.label) > -1
      )
    }
  }
  return newData
}
