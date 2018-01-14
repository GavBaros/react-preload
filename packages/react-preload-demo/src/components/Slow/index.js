import React from 'react';
import { withPreloading } from 'react-preload-core';
import styles from './styles.scss';

const Slow = () => <div className={styles.Slow}>Slow</div>;

export default withPreloading(() => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), 3000);
  });
})(Slow);
