import request from 'superagent'
import Promise from 'bluebird'

export default class CustomProject {
  constructor (project) {
    this.source = project
  }

  getTrello () {
    let trelloPromises = this.source.trello.reduce((all, board) => {
      Object.keys(board).map((key) =>
        all.push(request(`http://localhost:4000/json/trello/${key}`)
          .then((response) => {
            return response.body.metrics
          }))
      )
      return all
    }, [])
    return Promise.all(trelloPromises)
      .then((out) => {
        this.trello = out.reduce((all, metrics) => {
          metrics.map((metric) =>
            all.push(metric)
          )
          return all
        })
        return this.trello
      })
  }

  getRepos () {
    let gitPromises = this.source.git.reduce((all, repo) => {
      all.push(request(`http://localhost:4000/json/git/${repo.name}`)
          .then((response) => {
            return response.body.metrics
          })
      )
      return all
    }, [])
    let cbPromises = this.source.cb.reduce((all, repo) => {
      all.push(request(`http://localhost:4000/json/cb/${repo.name}`)
          .then((response) => {
            return response.body.metrics
          })
      )
      return all
    }, [])
    return Promise.all([gitPromises, cbPromises])
      .then((out) => out.reduce((all, metrics) => {
        metrics.map((metric) =>
          all.push(metric)
        )
        return all
      }, []))
      .then((out) => {
        const metrics = {}
        out.map((metricPromise) =>
          metricPromise.then((out) => {
            Object.keys(out).map((key) => {
              if (metrics.hasOwnProperty(key)) {
                metrics[key] += out[key]
              } else {
                metrics[key] = out[key]
              }
            })
          }))
        return metrics
      })
  }

  fetch () {
    const trelloPromise = this.getTrello()
    const repoPromise = this.getRepos()
    return Promise.join(trelloPromise, repoPromise,
      (trello, repo) => ({
        trello: trello, repo: repo
      }))
  }
}
