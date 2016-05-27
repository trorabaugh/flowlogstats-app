import {ConfigCtrl} from './components/config/config';
import {loadPluginCss} from 'app/plugins/sdk';
import './filters/all';
import './directives/all';

loadPluginCss({
  dark: 'plugins/flowlogstats-app/css/dark.css',
  light: 'plugins/flowlogstats-app/css/light.css'
});

export {
  ConfigCtrl
};
