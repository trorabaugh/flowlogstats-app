'use strict';

System.register(['lodash', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var _, PanelCtrl, loadPluginCss, _createClass, FlowEventMapCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_appPluginsSdk) {
      PanelCtrl = _appPluginsSdk.PanelCtrl;
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      //import 'plugins/flowlogstats-app/panels/flowevent-map/country_info.js';
      //import 'plugins/flowlogstats-app/panels/flowevent-map/markerclusterer_compiled.js';
      //import 'plugins/flowlogstats-app/panels/flowevent-map/utils.js';
      //import 'https://s3.amazonaws.com/data.flowlog-stats.com/dashboard/demo_user_1/111111111/2016-04-06/country_data/country_data.js';
      //import 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-rc1/jquery.min.js';
      //import 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js';

      loadPluginCss({
        dark: 'plugins/flowlogstats-app/css/flowlogstats-dark.css',
        light: 'plugins/flowlogstats-app/css/flowlogstats-light.css'
      });

      _export('PanelCtrl', FlowEventMapCtrl = function (_PanelCtrl) {
        _inherits(FlowEventMapCtrl, _PanelCtrl);

        /** @ngInject */

        function FlowEventMapCtrl($scope, $injector, $location, backendSrv) {
          _classCallCheck(this, FlowEventMapCtrl);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlowEventMapCtrl).call(this, $scope, $injector));

          _this.backendSrv = backendSrv;
          _this.$location = $location;

          _this.quotas = null;
          _this.endpointStatus = "scopeEndpoints";
          _this.collectorStatus = "scopeCollectors";
          return _this;
        }

        _createClass(FlowEventMapCtrl, [{
          key: 'setEndpointStatus',
          value: function setEndpointStatus() {
            if (!this.quotas) {
              return;
            }
            if (this.quotas.endpoint.used === 0) {
              this.endpointStatus = "noEndpoints";
              return;
            }
            if (this.quotas.endpoint.used >= 1) {
              this.endpointStatus = "hasEndpoints";
              return;
            }
            //default.
            this.endpointStatus = "hasEndpoints";
            return;
          }
        }, {
          key: 'setCollectorStatus',
          value: function setCollectorStatus() {
            if (!this.quotas) {
              return;
            }
            if (this.quotas.collector.used === 0) {
              this.collectorStatus = "noCollectors";
              return;
            }
            if (this.quotas.collector.used >= 1) {
              this.collectorStatus = "hasCollectors";
              return;
            }
            //default.
            this.collectorStatus = "hasCollectors";
            return;
          }
        }, {
          key: 'allDone',
          value: function allDone() {
            if (!this.quotas) {
              return false;
            }
            if (this.quotas.collector.used === 0) {
              return false;
            }
            if (this.quotas.endpoint.used === 0) {
              return false;
            }
            //default.
            return true;
          }
        }, {
          key: 'refresh',
          value: function refresh() {}
        }, {
          key: 'refreshOLD',
          value: function refreshOLD() {
            var self = this;
            this.backendSrv.get('api/plugin-proxy/flowlogstats-app/api/org/quotas').then(function (quotas) {
              var quotaHash = {};
              _.forEach(quotas, function (q) {
                quotaHash[q.target] = q;
              });
              self.quotas = quotaHash;
              self.setEndpointStatus();
              self.setCollectorStatus();
            });
          }
        }]);

        return FlowEventMapCtrl;
      }(PanelCtrl));

      FlowEventMapCtrl.templateUrl = 'public/plugins/flowlogstats-app/panels/flowevent-map/module.html';

      _export('PanelCtrl', FlowEventMapCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
