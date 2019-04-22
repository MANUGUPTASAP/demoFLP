sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"com/sap/colacolaCocaCola/util/Configuration",
	"com/sap/colacolaCocaCola/model/oI18nModel",
	"sap/ui/core/routing/History"
], function (Controller, JSONModel, Configuration, I18nModel, History) {
	"use strict";

	return Controller.extend("com.sap.colacolaCocaCola.controller.BaseController", {
		/**
		 * Common Init code
		 */
		onInit: function () {

		},

		/**
		 * Convenience method for accessing the router.
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the view model
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getViewModel: function () {
			return this.getModel("viewModel");
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setViewModel: function (oModel) {
			return this.setModel(oModel, "viewModel");
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return I18nModel.getResourceBundle();
		},

		/**
		 * Function called to trim the value
		 * @param  {String} sValue Value
		 * @return {String}        Trimmed Value
		 */
		trimValue: function (sValue) {
			if (typeof (sValue) === "string") {
				return sValue.trim();
			} else {
				return sValue;
			}
		},

		/**
		 * 
		 */
		getBackDate: function (date, months) {
			date.setMonth(date.getMonth() + months);
			return date;
		},

		/** 
		 * 
		 */
		navBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("home", true);
			}
		},
		
		/** 
		 * 
		 * @constructor 
		 * @returns
		 */
		getMessagePopover: function () {
			// create popover lazily (singleton)
			if (!this._oMessagePopover) {
				// create popover lazily (singleton)
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "com.sap.colacolaCocaCola.view.fragments.MessagePopover", this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;
		}

	});
});