// @flow

import React from 'react';
import { withAsyncRouter } from 'react-router-preload';
import styles from './styles.scss';

const Throbber = ({ transitioning }) =>
  (transitioning && (
    <div className={styles.Throbber}>
      <div className={styles.ThrobberItem}>
        <div className={styles.LoadingBar} />
      </div>
      <div className={styles.ThrobberItem}>
        <div className={styles.LoadingBar} />
      </div>
    </div>
  )) ||
  null;

export default withAsyncRouter(Throbber);
