

const jquery = require('jquery');
const {JSDOM} = require('jsdom');


const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const {window} = dom;

global.window = window;
global.document = window.document;
global.$ = jquery(window);

global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key];
  },
  setItem(key, value) {
    this.store[key] = value ;
  },
  removeItem(key) {
    delete this.store[key];
  },
};

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};

const ajaxRequest = require('./profile.js');

describe('ajaxRequest error handling', () => {
  test('handles error in ajaxRequest', () => {
    // Mock the XMLHttpRequest object
    const mockXMLHttpRequest = jest.fn();
    global.XMLHttpRequest = mockXMLHttpRequest;

    // Mock the error callback function
    const errorCallback = jest.fn();

    // Perform the Ajax request
    ajaxRequest(
      'api/account/profile',
      'GET',
      JSON.stringify({}),
      function (response) {
        // Success callback function
        getProfile(response);
      },
      errorCallback,
      headers
    );

    // Simulate an error in the Ajax request
    const errorResponse = {
      status: 500,
      responseText: 'Internal Server Error',
    };
    

    // Expect the error callback to have been called
    expect(errorCallback).toHaveBeenCalled();
  });
});