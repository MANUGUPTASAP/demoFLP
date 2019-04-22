sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/StandardListItem",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/List",
	"com/sap/colacolaCocaCola/model/oI18nModel",
	"com/sap/colacolaCocaCola/util/Util"
], function (UI5Object, MessageBox, Dialog, StandardListItem, JSONModel, Button, List, oI18nModel, Util) {
	"use strict";

	return UI5Object.extend("com.sap.colacolaCocaCola.controller.ErrorHandler", {

		/**
		 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 */
		constructor: function (oComponent) {
			this._oResourceBundle = oI18nModel.getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");
			this._errorModel = new JSONModel();
			this._oModel.attachMetadataFailed(function (oEvent) {
				var oParams = oEvent.getParameters();
				this._showServiceError(oParams.response);
			}, this);
		},

		/**
		 * Shows a {@link sap.m.MessageBox} when a service call has failed.
		 * Only the first error message will be display.
		 * @param {object} oError object
		 * @private
		 */
		_showServiceError: function (oError) {
			var oErrorMsg = this.parseError(oError);

			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;

			if (oErrorMsg.errordetails) {
				if (typeof (oErrorMsg.errordetails) === "string") {
					MessageBox.error(
						this._sErrorText, {
							details: oErrorMsg.errordetails,
							styleClass: "sapUiSizeCompact",
							actions: [MessageBox.Action.CLOSE],
							onClose: function () {
								this._bMessageOpen = false;
							}.bind(this)
						}
					);
					return;
				}

				if (typeof (oErrorMsg.errordetails) === "object") {
					this._errorModel.setProperty("/", oErrorMsg.errordetails);
					if (!this._dialog) {
						this._dialog = new Dialog({
							title: this._sErrorText,
							type: "Message",
							state: "Error",
							content: new List({
								items: {
									path: "errorModel>/",
									template: new StandardListItem({
										title: "{errorModel>message}",
										icon: "sap-icon://error"
									})
								}
							}),
							beginButton: new Button({
								text: "OK",
								press: function () {
									this._dialog.close();
									this._bMessageOpen = false;
								}.bind(this)
							})
						});
						this._dialog.setModel(this._errorModel, "errorModel");
					}

					this._dialog.open();
					return;
				}
			} else {
				MessageBox.error(
					this._sErrorText, {
						title: "Server Error",
						details: oErrorMsg,
						styleClass: "sapUiSizeCompact",
						actions: [MessageBox.Action.CLOSE],
						onClose: function () {
							this._bMessageOpen = false;
						}.bind(this)
					}
				);
				return;
			}

		},
		
		/**
			 * This function parses the error message
			 * @param  {Object} oError Error Object
			 * @return {string}          Parsed Error String
			 */
			parseError: function (oError) {
				var sError = "";

				if (oError && oError.responseText) {
					try {
						var response = JSON.parse(oError.responseText);
						if (response.error && response.error.innererror && response.error.innererror.errordetails && response.error.innererror.errordetails
							.length > 1) {

							return {
								message: oError.message,
								statusText: oError.statusText,
								errordetails: response.error.innererror.errordetails
							};

						} 
						else {
							return {
								message: oError.message,
								statusText: oError.statusText,
								errordetails: response.error.message.value
							};
						}
					} catch (e) {
						sError = oError.responseText;
					}
				}

				if (oError && oError.message) {
					sError += jQuery.sap.formatMessage(this._oResourceBundle.getText("SERVICE_ERROR_MSG"), oError.message);
				}

				if (oError && oError.statusText) {
					sError += jQuery.sap.formatMessage(this._oResourceBundle.getText("SERVICE_ERROR_STATUS_TXT"), oError.statusText);
				}

				if (!sError) {
					sError = oError;
				}

				return sError;
			}

	});
});