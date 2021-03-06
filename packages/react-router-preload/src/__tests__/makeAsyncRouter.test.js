import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { MemoryRouter, Route, Switch } from 'react-router';
import { withPreloading } from 'react-preload-core';
import { makeAsyncRouter } from '../makeAsyncRouter';

describe('when using the async router', () => {
  it('route transitions are delayed until after preloading is done', async () => {
    const asyncPagePromise = Promise.resolve(true);
    const asyncPagePreloadMock = jest.fn(() => asyncPagePromise);

    const AsyncRouter = makeAsyncRouter(MemoryRouter);
    const SyncPage = () => 'Sync Page';
    const AsyncPage = withPreloading(asyncPagePreloadMock)(() => 'Async Page');

    const component = mount(
      <AsyncRouter initialEntries={['/foo']}>
        <Fragment>
          <Switch>
            <Route path="/foo" exact={true} component={SyncPage} />
            <Route path="/bar" exact={true} component={AsyncPage} />
          </Switch>

          <Link to="/bar">Go to "Bar"</Link>
        </Fragment>
      </AsyncRouter>,
    );

    // Before and right after clicking the link, the current page should
    // still be active because the next page is still being preloaded.
    expect(component.find(Switch).text()).toMatch('Sync Page');
    component.find(Link).simulate('click', { button: 0 });
    expect(component.find(Switch).text()).toMatch('Sync Page');

    // TODO: Find a better solution for this delay.
    await new Promise(resolve => {
      setTimeout(() => resolve());
    });

    // After the promise has been resolved, the next page should be rendered.
    expect(asyncPagePreloadMock).toHaveBeenCalled();
    expect(component.find(Switch).text()).toMatch('Async Page');
  });
});
