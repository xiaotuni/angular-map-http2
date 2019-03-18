// import axios from 'axios';
// const axios = require('axios');

const baseUrl = 'http://127.0.0.1:40000/xtn/api';

export default class HttpHelper {

  static convertQueryString(obj) {
    if (!obj) {
      return '';
    }
    const kv = [];
    Object.keys(obj).forEach((key) => {
      if (obj[key]) {
        kv.push(`${key}=${obj[key]}`);
      }
    });
    return kv.join('&');
  }

  static async _request(url, method, { params, data }) {
    const headers = {
      // Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    };
    const qs = this.convertQueryString(params);
    const _url = qs ? `${url}?${qs}` : url;
    const _url2 = `${baseUrl}${_url}`;
    // console.log(_url2);
    const options = { method, headers, mode: 'cors', credentials: 'include', body: JSON.stringify(data), };
    return fetch(_url2, options)
      .then(async (response) => {
        const { status } = response;
        if (status >= 200 && status < 300) {
          return response;
        } else {
          return Promise.reject(await response.json());
        }
      })
      .then((res) => res.json())
      .catch(async (ex) => {
        return Promise.reject(ex);
      });
  }

  /**
   * get 请求
   *
   * @static
   * @param {*} url
   * @param {*} { params }
   * @returns
   * @memberof HttpHelper
   */
  static async get(url, { params = {} }) {
    return this._request(url, 'get', { params, data: null });
  }

  /**
   * put 请求
   *
   * @static
   * @param {*} url
   * @param {*} { params, data }
   * @returns
   * @memberof HttpHelper
   */
  static async put(url, { params, data }) {
    return this._request(url, 'put', { params, data });
  }

  /**
   *  post 请求
   *
   * @static
   * @param {*} url
   * @param {*} { params = null, data }
   * @returns
   * @memberof HttpHelper
   */
  static async post(url, { params = null, data }) {
    return this._request(url, 'post', { params, data });
  }

  /**
   * delete 请求
   *
   * @static
   * @param {*} url
   * @param {*} { params }
   * @returns
   * @memberof HttpHelper
   */
  static async delete(url, { params }) {
    return this._request(url, 'delete', { params, data: null });
  }
}
