'use strict';

System.register(['./components/config/config', 'app/plugins/sdk', './filters/all', './directives/all'], function (_export, _context) {
  "use strict";

  var ConfigCtrl, loadPluginCss;
  return {
    setters: [function (_componentsConfigConfig) {
      ConfigCtrl = _componentsConfigConfig.ConfigCtrl;
    }, function (_appPluginsSdk) {
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }, function (_filtersAll) {}, function (_directivesAll) {}],
    execute: function () {

      loadPluginCss({
        dark: 'plugins/flowlogstats-app/css/dark.css',
        light: 'plugins/flowlogstats-app/css/light.css'
      });

      _export('ConfigCtrl', ConfigCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
