import _ from 'lodash';
import {PanelCtrl} from 'app/plugins/sdk';
import {loadPluginCss} from 'app/plugins/sdk';
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

class FlowEventMapCtrl extends PanelCtrl {

  /** @ngInject */
  constructor($scope, $injector, $location, backendSrv) {
    super($scope, $injector);
    this.backendSrv = backendSrv;
    this.$location = $location;

    this.quotas = null;
    this.endpointStatus = "scopeEndpoints";
    this.collectorStatus = "scopeCollectors";
  }

  setEndpointStatus() {
    if (! this.quotas) {
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

  setCollectorStatus() {
    if (! this.quotas) {
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

  allDone() {
    if (! this.quotas) {
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
  refresh() {

  }
  refreshOLD() {
    var self = this;
    this.backendSrv.get('api/plugin-proxy/flowlogstats-app/api/org/quotas').then(function(quotas) {
      var quotaHash = {};
      _.forEach(quotas, function(q) {
        quotaHash[q.target] = q;
      });
      self.quotas = quotaHash;
      self.setEndpointStatus();
      self.setCollectorStatus();
    });
  }
}

FlowEventMapCtrl.templateUrl = 'public/plugins/flowlogstats-app/panels/flowevent-map/module.html';

export {
  FlowEventMapCtrl as PanelCtrl
};
