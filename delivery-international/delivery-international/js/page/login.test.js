const jsdomGlobal = require('jsdom-global');
const cleanup = jsdomGlobal();

const ajaxRequest = require('./login.js');

describe('ajaxRequest error handling', () => {
  let mockXHR;

  beforeEach(() => {
    mockXHR = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(),
        readyState: 4,
        status: 0,
        responseText:'',
        onreadystatechange: null,
    }
    global.XMLHttpRequest = jest.fn(() => mockXHR);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    cleanup();
  });

  test('handles error in ajaxRequest', () => {
    const errorCallback = jest.fn();

    ajaxRequest(
      'api/account/login',
      'POST',
      JSON.stringify({}),
      function (response) {
        localStorage.setItem('token', response.token);
        window.location.href = 'index.html';
        console.log('Login Success');
      },
      errorCallback, // Pass the errorCallback function directly
      {}
    );

    const errorResponse = {
      status: 500,
      responseJSON: {
        message: 'Internal Server Error',
      },
    };

    mockXHR.status = errorResponse.status;
    mockXHR.responseText = JSON.stringify(errorResponse.responseJSON);
    mockXHR.onreadystatechange();

    expect(errorCallback).toHaveBeenCalled();
  });
});