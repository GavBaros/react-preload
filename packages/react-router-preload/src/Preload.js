// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { createLocation } from 'history';

type PreloadProps = {
  location: Object | string,
};

export class Preload extends React.Component<PreloadProps> {
  static contextTypes = {
    router: PropTypes.shape({
      preload: PropTypes.func.isRequired,
    }),
  };

  componentDidMount() {
    this.context.router.preload(this.props.location);
  }

  render() {
    return null;
  }
}
