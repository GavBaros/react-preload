import React from 'react';
import { walkTreeAndPreload } from '../walkTreeAndPreload';

describe('tree walker', () => {
  it('forwards custom options to the callback', async () => {
    const mockedCallback = jest.fn(() => Promise.resolve(true));
    class ComponentWithPreload extends React.Component {
      preloadComponent = mockedCallback;

      render() {
        return null;
      }
    }

    await walkTreeAndPreload(
      <ComponentWithPreload />,
      {},
      {
        foo: 'bar',
      },
    );

    expect(mockedCallback).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      { foo: 'bar' },
    );
  });
});
