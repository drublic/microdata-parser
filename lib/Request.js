const Hoek = require('hoek');
const request = require('request');
const http = require('http');
const zlib = require('zlib');

class Request {

  // Make the request
  constructor (url) {
    this.url = url;

    return new Promise((resolve, reject) => {
      if (this.url.substr(this.url.length - 3) === '.gz') {
        this.getGzipped(resolve, reject);
      } else {
        this.getFile(resolve, reject);
      }
    });
  }

  getGzipped (resolve, reject) {
    let buffer = [];

    http.get(this.url, (res) => {
      const gunzip = zlib.createGunzip();

      res.pipe(gunzip);

      gunzip
        .on('data', (data) => {
          buffer.push(data.toString());
        }).on('end', () => {
          resolve(buffer.join(''));
        }).on('error', (error) => {
          reject(error);
        });
    }).on('error', (error) => {
      reject(error);
    });
  }

  getFile (resolve, reject) {
    request(this.url, (error, response, body) => {
      Hoek.assert(!error, error);

      if (response.statusCode !== 200) {
        return reject();
      }

      resolve(body);
    });
  }
}

module.exports = Request;
