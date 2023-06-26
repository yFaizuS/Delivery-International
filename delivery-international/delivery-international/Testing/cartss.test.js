const jquery = require('jquery');
const { JSDOM } = require('jsdom');
const localStorageMock = require('jest-localstorage-mock');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const { window } = dom;

global.window = window;
global.document = window.document;
global.$ = jquery(window);

const { getCartAjax } = require('../js/page/cart.js');
const ajaxRequest = require('../js/page/ajaxRequest.js');

jest.mock('./ajaxRequest', () => jest.fn());

describe('Profile', () => {
  describe('getCartAjax', () => {
    it('should fetch cart data and update UI', async () => {
      // Set up the necessary variables and mocks
      const mockResponse = [
        { id: 1, name: 'Item 1', price: 10 },
        { id: 2, name: 'Item 2', price: 15 },
      ];
      const getCartMock = jest.fn();

      ajaxRequest.mockReturnValue(Promise.resolve(mockResponse));

      // Call the getCartAjax function
      console.log('calling ajaxRequest...');
      await getCartAjax();

      // Assert that the expected API request is made
      expect(ajaxRequest).toHaveBeenCalledWith(
        'api/basket',
        'GET',
        '',
        expect.any(Function),
        expect.any(Function),
        expect.objectContaining({
            'Authorization' : expect.any(String),
            'Content-Type' : expect.any(String)
        })
      );

      // Assert that the getCart function is called with the mocked response
      expect(getCartMock).toHaveBeenCalledWith(mockResponse);

      // You can also assert any other expectations related to the UI update

      // Restore the original implementation of ajaxRequest
      ajaxRequest.mockRestore();
    });
  });
});