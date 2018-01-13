import build from '../../rollup.config';
import pkg from './package.json';

export default build('reactPreload.universalComponent', pkg);
