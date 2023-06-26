const jsdomGlobal = require('jsdom-global');
const cleanup = jsdomGlobal();

const ajaxRequest = require('./order.js');

describe('ajaxRequest error handling', () => {
  let mockXHR;

  beforeEach(() => {
    mockXHR = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      readyState: 4,
      status: 0,
      responseText: '',
      addEventListener: jest.fn(),
    };
    global.XMLHttpRequest = jest.fn(() => mockXHR);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    cleanup();
  });

  test('handles error in ajaxRequest', (done) => {
    jest.setTimeout(1000);
    const errorCallback = jest.fn();
    const successCallback = jest.fn();

    const id = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    ajaxRequest(
      `api/order/${id}`,
      'GET',
      JSON.stringify({}),
      successCallback,
      errorCallback,
      {}
    );

    expect(mockXHR.open).toHaveBeenCalled();
    expect(mockXHR.setRequestHeader).toHaveBeenCalled();
    expect(mockXHR.send).toHaveBeenCalled();

    mockXHR.status = 500;
    mockXHR.addEventListener.mock.calls[0][1](); // Simulate the readyState change

    setTimeout(() => {
      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalledWith(
        mockXHR,
        mockXHR.statusText,
        mockXHR.responseText
      );
      done();
    }, 0);
  });
});