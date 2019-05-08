/*
* created by lu.yixin on 2019/01/30
*/

import axios from 'axios'
import { Base64 } from 'js-base64'

axios.interceptors.request.use(config => {
  const userInfo = window.localStorage.getItem('userInfo')
  if (!userInfo) return config
  try {
    const userInfoObj = JSON.parse(Base64.decode(Base64.decode(userInfo)))
    config.headers.common['token'] = userInfoObj.token
  } catch (e) {
    config.headers.common['token'] = ''
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default {
  get (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, { params }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, data).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  put (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, data).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  patch (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.patch(url, data).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  delete (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.delete(url, data).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
