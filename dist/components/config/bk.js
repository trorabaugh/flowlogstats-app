'use strict';

System.register(['./config.html!text', 'lodash'], function (_export, _context) {
  "use strict";

  var configTemplate, _, _createClass, FlowLogStatsConfigCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_configHtmlText) {
      configTemplate = _configHtmlText.default;
    }, function (_lodash) {
      _ = _lodash.default;
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

      _export('ConfigCtrl', FlowLogStatsConfigCtrl = function () {
        function FlowLogStatsConfigCtrl($scope, $injector, backendSrv) {
          _classCallCheck(this, FlowLogStatsConfigCtrl);

          this.backendSrv = backendSrv;
          this.validKey = true;
          // FIX should be false
          this.quotas = {};
          // Needs to be fixed to use API keys
          // this.appEditCtrl.setPreUpdateHook(this.preUpdate.bind(this));
          // this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
          this.appEditCtrl.importDashboards().then(function () {
            return {
              url: "dashboard/db/flowlogstats-home",
              message: "FlowLogStats app installed!"
            };
          });
          if (this.appModel.jsonData === null) {
            this.appModel.jsonData = {};
          }
          if (!this.appModel.secureJsonData) {
            this.appModel.secureJsonData = {};
          }
          // if (this.appModel.enabled) {
          // FIX Should check for valid key
          // this.validateKey();
          // }
        }

        _createClass(FlowLogStatsConfigCtrl, [{
          key: 'validateKey',
          value: function validateKey() {
            var self = this;
            var p = this.backendSrv.get('api/plugin-proxy/flowlogstats-app/api/org/quotas');
            p.then(function (quotas) {
              self.validKey = true;
              self.quotas = quotas;
            }, function () {
              if (self.appModel.enabled) {
                self.appModel.jsonData.apiKeySet = false;
                self.appModel.secureJsonData.apiKey = "";
                self.errorMsg = "invlid apiKey";
              }
            });
            return p;
          }
        }, {
          key: 'preUpdate',
          value: function preUpdate() {
            var model = this.appModel;
            if (!model.enabled) {
              return Promise.resolve();
            }

            if (!model.jsonData.apiKeySet && !model.secureJsonData.apiKey) {
              model.enabled = false;
              return Promise.reject("apiKey not set.");
            }
            // if the apiKey is being set, check and make sure that
            // we have initialized our datasource and dashboards.
            if (model.secureJsonData.apiKey) {
              model.jsonData.apiKeySet = true;

              if (!model.jsonData.datasourceSet) {
                var p = this.initDatasource();
                p.then(function () {
                  model.jsonData.datasourceSet = true;
                });
                return p;
              }
            }

            return Promise.resolve();
          }
        }, {
          key: 'postUpdate',
          value: function postUpdate() {
            if (!this.appModel.enabled) {
              return Promise.resolve();
            }
            var self = this;
            return this.validateKey().then(function () {
              return self.appEditCtrl.importDashboards().then(function () {
                return {
                  url: "dashboard/db/flowlogstats-home",
                  message: "FlowLogStats app installed!"
                };
              });
            });
          }
        }, {
          key: 'configureDatasource',
          value: function configureDatasource() {
            var _this = this;

            this.appModel.jsonData.datasourceSet = false;
            this.initDatasource().then(function () {
              _this.appModel.jsonData.datasourceSet = true;
            });
          }
        }, {
          key: 'initDatasource',
          value: function initDatasource() {
            var self = this;
            //check for existing datasource.
            var p = self.backendSrv.get('/api/datasources');
            p.then(function (results) {
              var foundGraphite = false;
              var foundElastic = false;
              _.forEach(results, function (ds) {
                if (foundGraphite && foundElastic) {
                  return;
                }
                if (ds.name === "raintank") {
                  foundGraphite = true;
                }
                if (ds.name === "raintankEvents") {
                  foundElastic = true;
                }
              });
              var promises = [];
              if (!foundGraphite) {
                // create datasource.
                var graphite = {
                  name: 'raintank',
                  type: 'graphite',
                  url: 'api/plugin-proxy/flowlogstats-app/api/graphite',
                  access: 'direct',
                  jsonData: {}
                };
                promises.push(self.backendSrv.post('/api/datasources', graphite));
              }
              if (!foundElastic) {
                // create datasource.
                var elastic = {
                  name: 'raintankEvents',
                  type: 'elasticsearch',
                  url: 'api/plugin-proxy/flowlogstats-app/api/elasticsearch',
                  access: 'direct',
                  database: '[events-]YYYY-MM-DD',
                  jsonData: {
                    esVersion: 1,
                    interval: "Daily",
                    timeField: "timestamp"
                  }
                };
                promises.push(self.backendSrv.post('/api/datasources', elastic));
              }
              return Promise.all(promises);
            });
            return p;
          }
        }]);

        return FlowLogStatsConfigCtrl;
      }());

      FlowLogStatsConfigCtrl.template = configTemplate;

      _export('ConfigCtrl', FlowLogStatsConfigCtrl);
    }
  };
});
//# sourceMappingURL=bk.js.map
