import React from 'react';
import { withPreloading } from 'react-preload-core';

const Slow = () => <div>Slow</div>;

export default withPreloading(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), 3000);
  });
})(Slow);
