import _ from 'lodash';
import {PanelCtrl} from 'app/plugins/sdk';
import {loadPluginCss} from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/flowlogstats-app/css/flowlogstats-dark.css',
  light: 'plugins/flowlogstats-app/css/flowlogstats-light.css'
});

class CallToActionCtrl extends PanelCtrl {

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

CallToActionCtrl.templateUrl = 'public/plugins/flowlogstats-app/panels/call-to-action/module.html';

export {
  CallToActionCtrl as PanelCtrl
};
