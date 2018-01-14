import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.scss';

const Navigation = () => (
  <div className={styles.Navigation}>
    <Link to="/" className={styles.Link}>
      Home
    </Link>
    <Link to="/slow" className={styles.Link}>
      Slow
    </Link>
  </div>
);

export default Navigation;
