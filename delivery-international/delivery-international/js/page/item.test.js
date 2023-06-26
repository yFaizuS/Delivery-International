const ajaxRequest = require('./item.js');

describe('ajaxRequest error handling', () => {
  test('handles error in ajaxRequest', () => {
    const mockXHR = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      readyState: 4,
      status: 500,
      responseText: 'Internal server error',
    };
    global.XMLHttpRequest = jest.fn(() => mockXHR);

    const successCallback = jest.fn();
    const errorCallback = jest.fn();

    const idParams = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    ajaxRequest(
      `api/dish/${idParams}`,
      'GET',
      JSON.stringify({}),
      successCallback,
      errorCallback,
      {}
    );

    expect(mockXHR.open).toHaveBeenCalled();
    expect(mockXHR.setRequestHeader).toHaveBeenCalled();
    expect(mockXHR.send).toHaveBeenCalled();

    mockXHR.onreadystatechange(); // Simulate the readyState change

    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalledWith(mockXHR, mockXHR.statusText, mockXHR.responseText);
  });
});