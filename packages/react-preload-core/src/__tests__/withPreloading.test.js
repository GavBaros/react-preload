import React from 'react';
import { withPreload } from '../withPreload';
import { walkTreeAndPreload } from '../walkTreeAndPreload';

describe('higher-order component', () => {
  it('works for class components', async () => {
    const fetchDataMock = jest.fn(() => Promise.resolve(true));
    const ComponentWithPreload = withPreload(
      (element, instance, context, options) => {
        return instance.fetchData();
      },
    )(
      class ComponentWithDataDependencies extends React.Component {
        fetchData = fetchDataMock;

        render() {
          return null;
        }
      },
    );

    await walkTreeAndPreload(<ComponentWithPreload />);
    expect(fetchDataMock).toHaveBeenCalled();
  });

  it('works for functional stateless components', async () => {
    const mockedCallback = jest.fn(() => Promise.resolve(true));
    const ComponentWithPreload = withPreload(mockedCallback)(() => null);

    await walkTreeAndPreload(<ComponentWithPreload />);
    expect(mockedCallback).toHaveBeenCalled();
  });
});
