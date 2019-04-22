sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
  "use strict";

  return BaseController.extend("com.sap.colacolaCocaCola.controller.App", {

    onInit: function () {
      var oViewModel = new JSONModel({
        busy: true
      });

      this.setModel(oViewModel, "appView");

      // apply content density mode to root view
      this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
    }
  });

});