'use strict';

System.register(['lodash', '../../filters/all', '../../directives/all', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var _, PanelCtrl, loadPluginCss, _typeof, _createClass, EndpointNavCtrl;

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
    }, function (_filtersAll) {}, function (_directivesAll) {}, function (_appPluginsSdk) {
      PanelCtrl = _appPluginsSdk.PanelCtrl;
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

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

      loadPluginCss({
        dark: 'plugins/flowlogstats-app/css/flowlogstats.dark.css',
        light: 'plugins/flowlogstats-app/css/flowlogstats.light.css'
      });

      _export('PanelCtrl', EndpointNavCtrl = function (_PanelCtrl) {
        _inherits(EndpointNavCtrl, _PanelCtrl);

        /** @ngInject */

        function EndpointNavCtrl($scope, $injector, $location, backendSrv, templateSrv) {
          _classCallCheck(this, EndpointNavCtrl);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EndpointNavCtrl).call(this, $scope, $injector));

          _this.$location = $location;
          _this.backendSrv = backendSrv;
          _this.templateSrv = templateSrv;
          _this.endpointSlugs = [];

          $scope.ctrl.panel.title = "";
          $scope.ctrl.panel.transparent = true;

          _this.pageReady = false;
          _this.statuses = [{ label: "Ok", value: 0 }, { label: "Warning", value: 1 }, { label: "Error", value: 2 }, { label: "Unknown", value: -1 }];
          _this.endpoints = [];
          _this.endpointState = {
            "0": 0,
            "1": 0,
            "2": 0,
            "-1": 0
          };
          return _this;
        }

        _createClass(EndpointNavCtrl, [{
          key: 'getEndpointSlugs',
          value: function getEndpointSlugs() {
            var values = null;
            _.forEach(this.templateSrv.variables, function (tmplVar) {
              if (tmplVar.name === 'endpoint') {
                values = tmplVar.current.value;
                if (!_.isArray(values)) {
                  values = [values];
                }
                values;
              }
            });
            this.endpointSlugs = values;
            return values;
          }
        }, {
          key: 'refresh',
          value: function refresh() {
            var endpointSlugs = this.getEndpointSlugs();
            this.getEndpoints(endpointSlugs);
          }
        }, {
          key: 'isEndPointReady',
          value: function isEndPointReady(endpoint) {
            return endpoint && endpoint.hasOwnProperty('ready') && endpoint.ready;
          }
        }, {
          key: 'getEndpoints',
          value: function getEndpoints(endpointSlugs) {
            var self = this;
            this.backendSrv.get('api/plugin-proxy/flowlogstats-app/api/endpoints').then(function (endpoints) {
              self.endpoints = [];
              self.isGoogleDemo = endpointSlugs.length === 1 && endpointSlugs[0] === '~google_com_demo';
              _.forEach(endpoints, function (endpoint) {
                if (_.indexOf(endpointSlugs, endpoint.slug) >= 0) {
                  self.endpoints.push(endpoint);
                  endpoint.states = [];
                  endpoint.monitors = {};
                  endpoint.ready = false;

                  self.backendSrv.get('api/plugin-proxy/flowlogstats-app/api/monitors', { "endpoint_id": endpoint.id }).then(function (monitors) {
                    var seenStates = {};
                    _.forEach(monitors, function (mon) {
                      if (!mon.enabled) {
                        return;
                      }
                      seenStates[mon.state] = true;
                      endpoint.monitors[mon.monitor_type_name.toLowerCase()] = mon;
                    });
                    for (var s in seenStates) {
                      self.endpointState[s]++;
                      endpoint.states.push(parseInt(s));
                    }
                    endpoint.ready = true;
                  });
                }
              });
              self.pageReady = true;
            });
          }
        }, {
          key: 'monitorStateTxt',
          value: function monitorStateTxt(endpoint, type) {
            var mon = endpoint.monitors[type];
            if ((typeof mon === 'undefined' ? 'undefined' : _typeof(mon)) !== "object") {
              return "disabled";
            }
            if (!mon.enabled) {
              return "disabled";
            }
            if (mon.state < 0 || mon.state > 2) {
              return 'nodata';
            }
            var states = ["online", "warn", "critical"];
            return states[mon.state];
          }
        }, {
          key: 'monitorStateChangeStr',
          value: function monitorStateChangeStr(endpoint, type) {
            var mon = endpoint.monitors[type];
            if ((typeof mon === 'undefined' ? 'undefined' : _typeof(mon)) !== "object") {
              return "";
            }
            var duration = new Date().getTime() - new Date(mon.state_change).getTime();
            if (duration < 10000) {
              return "for a few seconds ago";
            }
            if (duration < 60000) {
              var secs = Math.floor(duration / 1000);
              return "for " + secs + " seconds";
            }
            if (duration < 3600000) {
              var mins = Math.floor(duration / 1000 / 60);
              return "for " + mins + " minutes";
            }
            if (duration < 86400000) {
              var hours = Math.floor(duration / 1000 / 60 / 60);
              return "for " + hours + " hours";
            }
            var days = Math.floor(duration / 1000 / 60 / 60 / 24);
            return "for " + days + " days";
          }
        }, {
          key: 'gotoDashboard',
          value: function gotoDashboard(endpoint, type) {
            if (!type) {
              type = 'summary';
            }
            var search = {
              "var-collector": "All",
              "var-endpoint": endpoint.slug
            };
            switch (type) {
              case "summary":
                this.$location.path("/dashboard/db/flowlogstats-endpoint-summary").search(search);
                break;
              case "ping":
                this.$location.path("/dashboard/db/flowlogstats-endpoint-ping").search(search);
                break;
              case "dns":
                this.$location.path("/dashboard/db/flowlogstats-endpoint-dns").search(search);
                break;
              case "http":
                search['var-protocol'] = "http";
                this.$location.path("/dashboard/db/flowlogstats-endpoint-web").search(search);
                break;
              case "https":
                search['var-protocol'] = "https";
                this.$location.path("/dashboard/db/flowlogstats-endpoint-web").search(search);
                break;
              default:
                this.$location.path("/dashboard/db/flowlogstats-endpoint-summary").search(search);
                break;
            }
          }
        }, {
          key: 'gotoEndpointURL',
          value: function gotoEndpointURL(endpoint) {
            this.$location.path('plugins/flowlogstats-app/page/endpoint-details?endpoint=' + endpoint.id);
          }
        }]);

        return EndpointNavCtrl;
      }(PanelCtrl));

      EndpointNavCtrl.templateUrl = 'public/plugins/flowlogstats-app/panels/nav-panel/module.html';

      _export('PanelCtrl', EndpointNavCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
