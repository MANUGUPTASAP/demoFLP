sap.ui.define([
	"./BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"com/sap/colacolaCocaCola/util/Configuration",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, Controller, JSONModel, Configuration, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.sap.colacolaCocaCola.controller.Home", {
		/** 
		 * 
		 */
		onInit: function() {
			var oMessageManager;

			// set message model
			oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			
			// activate automatic message generation for complete view
			oMessageManager.registerObject(this.getView(), true);
			
			this.setModel(new JSONModel({
				RequestTypes: [],
				busyDelay: 0,
				busy: false
			}), "viewModel");
			
			this.getRouter().getRoute("home").attachPatternMatched(this._onRoutePatternMatched, this);
		},
		
		_onRoutePatternMatched: function(oArgs) {
			var oDataModel = this.getModel(),
				oViewModel = this.getViewModel(),
				oFilter = new Filter("Uname", FilterOperator.EQ, "");
		//		oFilter = new Filter("Uname", FilterOperator.EQ, this.getModel("userModel").getProperty("/name"));
			oViewModel.setProperty("/busy", true);
			oDataModel.read("/FinsAuthRoleCheckSet", {
				filters: [oFilter],
				success: this._onSuccess.bind(this),
				error: this._onError.bind(this)
			});
		},
		
		_onSuccess: function(oData) {
			this.getViewModel().setProperty("/busy", false);
			if(oData && oData.results) {
				this.getViewModel().setProperty("/RequestTypes", oData.results);
			} else {
				this.getViewModel().setProperty("/RequestTypes", []);
			}
		},
		
		_onError: function(oError) {
			this.getViewModel().setProperty("/busy", false);
		},
		
		/** 
		 * 
		 * @param oEvent
		 */
		onItemClick: function (oEvent) {
			this.getRouter().navTo("approvalView", {
				requestType : oEvent.getSource().getBindingContext("viewModel").getProperty("Key")
			}, false);
		},
		
		/** 
		 * 
		 * @param oEvent
		 */
		onMessagePopoverPress: function (oEvent) {
			this.getMessagePopover().openBy(oEvent.getSource());
		}
	});
});