const Microdata = require('microdata-node');
const Request = require('./Request.js');

class Parser {
  constructor (url) {
    return new Promise((resolve) => {
      return new Request(url)
        .then(this.getData)
        .then(resolve)
        .catch(console.error);
    });
  }

  getData (pageHtml) {
    return Microdata.toJson(pageHtml, {
      base: 'http://www.example.com'
    });
  }

  getDataByType (data, type) {
    let searchTypeElements = data.filter((element) => {
      return element.type === type;
    });

    return searchTypeElements;
  }
}

module.exports = Parser;
