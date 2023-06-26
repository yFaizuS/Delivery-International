const jquery = require('jquery');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const { window } = dom;

global.window = window;
global.document = window.document;
const $ = jquery(window);

global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key];
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
};




const ajaxRequest = (
  url,
  method,
  data,
  successCallback,
  errorCallback,
  headers,
  xhr = new XMLHttpRequest() // Default to new XMLHttpRequest if not provided
) => {
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        successCallback(JSON.parse(xhr.responseText));
      } else {
        errorCallback(xhr, xhr.statusText, xhr.responseText);
      }
    }
  };

  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  for (const header in headers) {
    if (headers.hasOwnProperty(header)) {
      xhr.setRequestHeader(header, headers[header]);
    }
  }
  xhr.send(data);
};

module.exports = ajaxRequest;



$(document).ready(function () {
  $('#form').submit(function (event) {
    event.preventDefault();
    const data = {
      email: $('#email').val(),
      password: $('#password').val()
    };
    const headers = {
      'Content-Type': 'application/json'
    };
    // Get API Login dengan menggunakan method POST
    ajaxRequest(
      'api/account/login',
      'POST',
      JSON.stringify(data),
      function (response) {
        localStorage.setItem('token', response.token)
        window.location.href = 'index.html'
        console.log("Login Success");
      },
      function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseJSON.message);
      },
      headers
    );
  });
})