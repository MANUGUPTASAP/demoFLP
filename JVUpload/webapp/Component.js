sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/colacolaCocaCola/model/models",
	"com/sap/colacolaCocaCola/controller/ErrorHandler",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, ErrorHandler, JSONModel) {
	"use strict";

	return UIComponent.extend("com.sap.colacolaCocaCola.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);

			this._getLoggeedInUser();
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(new JSONModel({
				selectedRequestType : "",
				fileTypes: [],
				mimeType: []
			}), "appModel");
			this.getModel().setSizeLimit(1000000);
			this.getRouter().initialize();
		},
		
		/**
		 * Method to get the user id
		 */
		_getLoggeedInUser: function() {
			var userModel = new sap.ui.model.json.JSONModel();
			userModel.loadData("/services/userapi/attributes", null, false);
			this.setModel(userModel, "userModel");
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function () {
			return "sapUiSizeCompact";
		}
	});
});