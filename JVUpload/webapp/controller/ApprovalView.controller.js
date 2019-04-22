sap.ui.loader.config({
	shim: {
		'com/sap/colacolaCocaCola/util/xlsx': {
			amd: true, // URI.js reacts on an AMD loader, this flag lets UI5 temp. disable such loaders
			exports: 'XLSX' // name of the global variable under which URI.js exports its module value
		}
	}
});
sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"com/sap/colacolaCocaCola/util/Configuration",
	"com/sap/colacolaCocaCola/model/ApprovalViewModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageToast",
	"com/sap/colacolaCocaCola/util/xlsx",
	"com/sap/colacolaCocaCola/util/Util",
	"com/sap/colacolaCocaCola/util/formatter",
	"sap/m/MessageBox",
	"sap/ui/model/Sorter"
], function (BaseController, JSONModel, Configuration, ApprovalViewModel, Filter, FilterOperator, Spreadsheet, Export, ExportTypeCSV,
	MessageToast, xlsxjs, Util, formatter, MessageBox, Sorter) {
	"use strict";

	return BaseController.extend("com.sap.colacolaCocaCola.controller.ApprovalView", {
		formatter: formatter,

		onInit: function () {
			var oMessageManager;

			// set message model
			oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");

			// activate automatic message generation for complete view
			oMessageManager.registerObject(this.getView(), true);
			this.getRouter().getRoute("approvalView").attachPatternMatched(this._onRoutePatternMatched, this);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onMessagePopoverPress: function (oEvent) {
			this.getMessagePopover().openBy(oEvent.getSource());
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onBackNavigation: function (oEvent) {
			sap.ui.getCore().getMessageManager().removeAllMessages();
			this.navBack();
		},

		/** 
		 * 
		 * @constructor 
		 * @param oArgs
		 */
		_onRoutePatternMatched: function (oArgs) {
			var oRouteArguments = oArgs.getParameter("arguments"),
				oAppModel = this.getModel("appModel"),
				oUploadCollection = this.byId("UploadCollection"),
				oObjectPage = this.byId("idApprovalViewObjectPageLayout");
			if (oUploadCollection) {
				//Destroy Items to resolve the duplicate id issue
				oUploadCollection.destroyItems();
			}
			if (oRouteArguments && oRouteArguments.requestType) {
				this.setModel(
					(new ApprovalViewModel())
					.init(
						this,
						this.getResourceBundle(),
						oRouteArguments.requestType
					),
					"viewModel");
				oAppModel.setProperty("/selectedRequestType", Configuration.REQUEST_TYPE_TEXT[oRouteArguments.requestType]);
				this.getViewModel().setProperty("/uploadUrl", this._getAttachmentUploadUrl().completeUrl);
				this._getLedgerGroups();
				this._getWorkCenters();
				if (oRouteArguments.requestType === "F05") {
					this.getViewModel().setProperty("/isF05", true);
				} else {
					this.getViewModel().setProperty("/isF05", false);
				}
			}
			if (oObjectPage) {
				oObjectPage.scrollToSection(this.byId("idApprovalViewItemsSection").getId());
			}
			this.getViewModel().whenAttachmentTypesLoaded(this.getModel())
				.then(this._setAttachmentTypes.bind(this))
				.catch(this._handleAttachmentLoadError.bind(this));
		},

		/** 
		 * 
		 * @constructor 
		 * @param oData
		 */
		_setAttachmentTypes: function (oData) {
			var oViewModel = this.getViewModel(),
				oAppModel = this.getOwnerComponent().getModel("appModel"),
				aFileTypes = [],
				aMimeTypes = [];

			if (oData && oData.results && oData.results.length > 0) {
				oData.results.forEach(function (oType) {
					aFileTypes.push(oType.FileType);
					aMimeTypes.push(oType.MimeType);
				});
			}
			oViewModel.setProperty("/fileTypes", aFileTypes);
			oViewModel.setProperty("/mimeType", aMimeTypes);
			oAppModel.setProperty("/fileTypes", aFileTypes);
			oAppModel.setProperty("/mimeType", aMimeTypes);
		},

		/** 
		 * 
		 * @constructor 
		 * @param oError
		 */
		_handleAttachmentLoadError: function (oError) {
			var oViewModel = this.getViewModel(),
				oAppModel = this.getOwnerComponent().getModel("appModel"),
				aFileTypes = ["doc", "xls", "msg", "pdf", "txt", "ppt", "jpg"],
				aMimeTypes = ["application/msword", "application/vnd.ms-excel", "application/octet-stream", "application/pdf",
					"text/plain", "application/vnd.ms-powerpoint", "image/jpeg"
				];
			oViewModel.setProperty("/fileTypes", aFileTypes);
			oViewModel.setProperty("/mimeType", aMimeTypes);
			oAppModel.setProperty("/fileTypes", aFileTypes);
			oAppModel.setProperty("/mimeType", aMimeTypes);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		addCopy: function (oEvent) {
			var oViewModel = this.getViewModel(),
				oJVItemData = oViewModel.getProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg"),
				sNewLineItemNo = "00" + (parseInt(oViewModel.getProperty("/currentLineItemNo"), 10) + 1),
				oCurrentLineItem = jQuery.sap.extend(true, {}, oEvent.getSource().getBindingContext("viewModel").getObject());
			oCurrentLineItem.Buzei = sNewLineItemNo;
			oJVItemData.unshift(oCurrentLineItem);
			oViewModel.setProperty("/currentLineItemNo", sNewLineItemNo);
			oViewModel.setProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg", oJVItemData);
		},

		/** 
		 * 
		 */
		addNew: function () {
			var oViewModel = this.getViewModel(),
				oJVItemData = oViewModel.getProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg"),
				sNewLineItemNo = "00" + (parseInt(oViewModel.getProperty("/currentLineItemNo"), 10) + 1);
			oJVItemData.unshift(oViewModel.getItemObject(sNewLineItemNo));
			oViewModel.setProperty("/currentLineItemNo", sNewLineItemNo);
			oViewModel.setProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg", oJVItemData);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onDelete: function (oEvent) {
			var oViewModel = this.getViewModel(),
				sPath = oEvent.getSource().getBindingContext("viewModel").getPath(),
				oJVItemData = oViewModel.getProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg"),
				sIdx = parseInt(sPath.substr(sPath.lastIndexOf("/") + 1), 10);
			oJVItemData.splice(sIdx, 1);
			oViewModel.setProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg", oJVItemData);
		},

		/** 
		 * 
		 */
		onExport: function () {

			this._oGlobalBusyDialog = new sap.m.BusyDialog();
			this._oGlobalBusyDialog.open();

			var that = this,
				aCols, aProducts, oSettings,
				fileName = (this._getFileName(this.getViewModel().getProperty("/RequestType"))).fileName;

			aCols = this.createColumnConfig();

			var excelJsonModel = new sap.ui.model.json.JSONModel();
			excelJsonModel.setData([]);
			this.getView().setModel(excelJsonModel, "excelJsonModel");

			aProducts = this.getView().getModel("excelJsonModel").getData();

			oSettings = {
				workbook: {
					columns: aCols,
					context: {
						sheetName: (this._getFileName(this.getViewModel().getProperty("/RequestType"))).sheetName
					}
				},
				dataSource: aProducts,
				fileName: fileName
			};

			//var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			//oSpreadsheet.build();
			new Spreadsheet(oSettings)
				.build()
				.then(function () {
					that._oGlobalBusyDialog.close();
					MessageToast.show(this.getResourceBundle().getText("SPREADSHEET_EXPORT"));
				});

		},

		/** 
		 * 
		 * @param oEvent
		 */
		onExportDraft: function (oEvent) {
			this._oGlobalBusyDialog = new sap.m.BusyDialog();
			this._oGlobalBusyDialog.open();

			var that = this,
				aCols, aProducts, oSettings,
				fileName = (this._getFileName(this.getViewModel().getProperty("/RequestType"))).fileName;

			aCols = this.createColumnConfig();

			var excelJsonModel = new sap.ui.model.json.JSONModel();
			excelJsonModel.setData(this.getViewModel().getDraftDownloadData());
			this.getView().setModel(excelJsonModel, "excelJsonModel");

			aProducts = this.getView().getModel("excelJsonModel").getData();

			oSettings = {
				workbook: {
					columns: aCols,
					context: {
						sheetName: (this._getFileName(this.getViewModel().getProperty("/RequestType"))).sheetName
					}
				},
				dataSource: aProducts,
				fileName: fileName
			};

			//var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			//oSpreadsheet.build();
			new Spreadsheet(oSettings)
				.build()
				.then(function () {
					that._oGlobalBusyDialog.close();
					MessageToast.show(this.getResourceBundle().getText("SPREADSHEET_EXPORT"));
				});
		},

		/** 
		 * 
		 * @constructor 
		 * @param sRequestType
		 * @returns
		 */
		_getFileName: function (sRequestType) {
			if (sRequestType === "F02") {
				return {
					fileName: "Standard- " + (new Date()).toDateString(),
					sheetName: "Standard"
				};
			} else if (sRequestType === "F05") {
				return {
					fileName: "Foreign_Exchange- " + (new Date()).toDateString(),
					sheetName: "Foreign Exchange"
				};
			} else if (sRequestType === "FBD1") {
				return {
					fileName: "Recurring- " + (new Date()).toDateString(),
					sheetName: "Recurring"
				};
			} else if (sRequestType === "FBS1") {
				return {
					fileName: "Accrual- " + (new Date()).toDateString(),
					sheetName: "Accrual"
				};
			}

			return {
				fileName: "Standard- " + (new Date()).toDateString(),
				sheetName: "Standard"
			};

		},

		/** 
		 * 
		 * @returns
		 */
		createColumnConfig: function () {
			var oViewModel = this.getViewModel(),
				sRequestType = oViewModel.getProperty("/RequestType");
			if ((Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.F02)) {
				return Configuration.ITEM_COLUMN_CONFIG;
			} else if ((Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.F05)) {
				return Configuration.ITEM_COLUMN_CONFIG_F05;
			} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBS1) {
				return Configuration.ITEM_COLUMN_CONFIG_FBS1;
			} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBD1) {
				return Configuration.ITEM_COLUMN_CONFIG_FBD1;
			}

			return Configuration.ITEM_COLUMN_CONFIG;
		},

		/** 
		 * 
		 */
		onPost: function () {
			var bCheck = this._checkForError();
			if (bCheck) {
				var oViewModel = this.getViewModel(),
					sRequestType = oViewModel.getProperty("/RequestType"),
					sEntityPath = "",
					oObject = oViewModel.getPayloadData(sRequestType);

				if ((Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.F05) ||
					(Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.F02)) {
					sEntityPath = "/FinsGLDocumentHeaderSet";
				} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBS1) {
					sEntityPath = "/FinsAccrualDocumentHeaderSet";
				} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBD1) {
					sEntityPath = "/FinsRecurringDocumentHeaderSet";
				}
				sap.ui.getCore().getMessageManager().removeAllMessages();
				this._refreshErrorStates();
				oViewModel.setProperty("/viewBusy", true);
				oViewModel.whenDocumentDataPosted(sEntityPath, this.getModel(), oObject, {})
					.then(
						this._showSuccessMessage.bind(this)
					)
					.catch(
						this._showErrorOnPost.bind(this)
					);

			}
		},

		/** 
		 * 
		 * @constructor 
		 * @returns
		 */
		_checkForError: function () {
			var oViewModel = this.getViewModel(),
				oAppModel = this.getModel("appModel"),
				aItems = oViewModel.getProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg"),
				bValid = true;

			//CHeck for negative values in Header
			if (oViewModel.getProperty("/HeaderData/Kursf/value") < 0) {
				bValid = false;
				oViewModel.setProperty("/HeaderData/Kursf/valueState", "Error");
				oViewModel.setProperty("/HeaderData/Kursf/valueStateText", this.getResourceBundle().getText("NEGATIVE_VALUES_NOT_ALLOWED"));
			} else {
				oViewModel.setProperty("/HeaderData/Kursf/valueState", "None");
				oViewModel.setProperty("/HeaderData/Kursf/valueStateText", "");
			}

			//CHeck for negative values in Items
			aItems.forEach(function (oItem) {
				if (oItem.Wrsol.value < 0) {
					bValid = false;
					oItem.Wrsol.valueState = "Error";
					oItem.Wrsol.valueStateText = this.getResourceBundle().getText("NEGATIVE_VALUES_NOT_ALLOWED");
				} else {
					oItem.Wrsol.valueState = "None";
					oItem.Wrsol.valueStateText = "";
				}
				if (oItem.Wrhab.value < 0) {
					bValid = false;
					oItem.Wrhab.valueState = "Error";
					oItem.Wrhab.valueStateText = this.getResourceBundle().getText("NEGATIVE_VALUES_NOT_ALLOWED");
				} else {
					oItem.Wrhab.valueState = "None";
					oItem.Wrhab.valueStateText = "";
				}
			});

			//Check for mandatory Transaction currency for Foreign Currency Scenario
			// if (oAppModel.getProperty("/selectedRequestType") === Configuration.REQUEST_TYPE_TEXT["F05"]) {
			if (!Boolean(oViewModel.getProperty("/HeaderData/Waers/value"))) {
				bValid = false;
				oViewModel.setProperty("/HeaderData/Waers/valueState", "Error");
				oViewModel.setProperty("/HeaderData/Waers/valueStateText", this.getResourceBundle().getText("TRAN_CURR_MANDATORY"));
			} else {
				oViewModel.setProperty("/HeaderData/Waers/valueState", "None");
				oViewModel.setProperty("/HeaderData/Waers/valueStateText", "");
			}

			if (oViewModel.getProperty("/HeaderData/Objid/value") === "00000000") {
				bValid = false;
				oViewModel.setProperty("/HeaderData/Objid/valueState", "Error");
				oViewModel.setProperty("/HeaderData/Objid/valueStateText", this.getResourceBundle().getText("WORK_CENTER_MANDATORY"));
			} else {
				oViewModel.setProperty("/HeaderData/Objid/valueState", "None");
				oViewModel.setProperty("/HeaderData/Objid/valueStateText", "");
			}
			// }
			//Header Text is mandatory for all
			if (!Boolean(oViewModel.getProperty("/HeaderData/Bktxt/value"))) {
				bValid = false;
				oViewModel.setProperty("/HeaderData/Bktxt/valueState", "Error");
				oViewModel.setProperty("/HeaderData/Bktxt/valueStateText", this.getResourceBundle().getText("DOCU_HEADER_TXT_MANDATORY"));
			} else {
				oViewModel.setProperty("/HeaderData/Bktxt/valueState", "None");
				oViewModel.setProperty("/HeaderData/Bktxt/valueStateText", "");
			}

			if (oAppModel.getProperty("/selectedRequestType") === Configuration.REQUEST_TYPE_TEXT["FBS1"]) {
				//Validation for Reversal reason 
				if (!Boolean(oViewModel.getProperty("/HeaderData/Stgrd/value"))) {
					bValid = false;
					oViewModel.setProperty("/HeaderData/Stgrd/valueState", "Error");
					oViewModel.setProperty("/HeaderData/Stgrd/valueStateText", this.getResourceBundle().getText("REVERSAL_REASON_MANDATORY"));
				} else {
					oViewModel.setProperty("/HeaderData/Stgrd/valueState", "None");
					oViewModel.setProperty("/HeaderData/Stgrd/valueStateText", "");
				}
				//Validation for reverse date
				if (!Boolean(oViewModel.getProperty("/HeaderData/Stodt/value"))) {
					bValid = false;
					oViewModel.setProperty("/HeaderData/Stodt/valueState", "Error");
					oViewModel.setProperty("/HeaderData/Stodt/valueStateText", this.getResourceBundle().getText("REVERSE_DATE_MANDATORY"));
				} else {
					oViewModel.setProperty("/HeaderData/Stodt/valueState", "None");
					oViewModel.setProperty("/HeaderData/Stodt/valueStateText", "");
				}
			}

			if (oAppModel.getProperty("/selectedRequestType") === Configuration.REQUEST_TYPE_TEXT["FBS1"] ||
				oAppModel.getProperty("/selectedRequestType") === Configuration.REQUEST_TYPE_TEXT["F02"] ||
				oAppModel.getProperty("/selectedRequestType") === Configuration.REQUEST_TYPE_TEXT["F05"]) {
				//Validation for Journal date
				if (!Boolean(oViewModel.getProperty("/HeaderData/Bldat/value"))) {
					bValid = false;
					oViewModel.setProperty("/HeaderData/Bldat/valueState", "Error");
					oViewModel.setProperty("/HeaderData/Bldat/valueStateText", this.getResourceBundle().getText("JOURNAL_DATE_MANDATORY"));
				} else {
					oViewModel.setProperty("/HeaderData/Bldat/valueState", "None");
					oViewModel.setProperty("/HeaderData/Bldat/valueStateText", "");
				}
			}

			if (!(oViewModel.getProperty("/attachments/attachmentList").length > 0)) {
				bValid = false;
				MessageBox.error(
					"Please add supporting documents", {
						title: "Error",
						// details: oErrorMsg,
						styleClass: "sapUiSizeCompact",
						actions: [MessageBox.Action.CLOSE],
						onClose: function () {
							// this._bMessageOpen = false;
						}.bind(this)
					}
				);
			}

			//First Run and Last Run dates are Mandatory for Recurring
			if (oAppModel.getProperty("/selectedRequestType") === Configuration.REQUEST_TYPE_TEXT["FBD1"]) {
				if (!Boolean(oViewModel.getProperty("/HeaderData/Dbbdt/value"))) {
					bValid = false;
					oViewModel.setProperty("/HeaderData/Dbbdt/valueState", "Error");
					oViewModel.setProperty("/HeaderData/Dbbdt/valueStateText", this.getResourceBundle().getText("FIRST_RUN_MANDATORY"));
				} else {
					oViewModel.setProperty("/HeaderData/Dbbdt/valueState", "None");
					oViewModel.setProperty("/HeaderData/Dbbdt/valueStateText", "");
				}
				if (!Boolean(oViewModel.getProperty("/HeaderData/Dbbdt/value"))) {
					bValid = false;
					oViewModel.setProperty("/HeaderData/Dbedt/valueState", "Error");
					oViewModel.setProperty("/HeaderData/Dbedt/valueStateText", this.getResourceBundle().getText("LAST_RUN_MANDATORY"));
				} else {
					oViewModel.setProperty("/HeaderData/Dbedt/valueState", "None");
					oViewModel.setProperty("/HeaderData/Dbedt/valueStateText", "");
				}
			}

			oViewModel.setProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg", aItems);

			return bValid;
		},

		/**
		 * Method to expand all line items
		 * @param {sap.ui.base.Event} oEvent press event
		 * @public
		 */
		onExpandAllPressed: function (oEvent) {
			this.getModel("viewModel").getProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg").forEach(function (oJvModelItem) {
				oJvModelItem.bExpand = true;
			});
			this.getModel("viewModel").refresh(true);
		},

		/**
		 * Method to collapse all line items
		 * @param {sap.ui.base.Event} oEvent press event
		 * @public
		 */
		onCollapseAllPressed: function (oEvent) {
			this.getModel("viewModel").getProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg").forEach(function (oJvModelItem) {
				oJvModelItem.bExpand = false;
			});
			this.getModel("viewModel").refresh(true);
		},

		/**
		 * Method to handle the expand event of panel
		 * @param {sap.ui.base.Event} oEvent press event
		 * @public
		 */
		onPanelExpandCollapse: function (oEvent) {

		},

		/**
		 * 
		 */
		onCompanyCodeHelp: function (oEvent) {
			var oViewModel = this.getView().getModel("viewModel");
			if (!this._oCCPopup) {
				this._oCCPopup = sap.ui.xmlfragment(
					"com.sap.colacolaCocaCola.view.fragments.CompanyCodes", this);
				this.getView().addDependent(this._oCCPopup);

				// Sync the style class for mobiles & desktops as Popovers don't auto inherit it
				this._oCCPopup.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
			oViewModel.setProperty("/dialogBusy", true);
			oViewModel.whenCompanyCodeDataLoaded(this.getModel(), {})
				.then(
					oViewModel.setCompanyCodeDataInModel.bind(oViewModel)
				)
				.catch(
					this._showErrorMessage.bind(this)
				);
			// open the popup
			this._oCCPopup.open();
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onCCDialogSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter(
				"Bukrs",
				FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onCCDialogConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oViewModel = this.getViewModel(),
				oParameters = {
					filters: []
				};
			if (oSelectedItem) {
				oViewModel.setProperty("/HeaderData/Bukrs/value", oSelectedItem.getBindingContext("viewModel").getProperty("Bukrs"));
				oViewModel.setProperty("/HeaderData/Waers/value", oSelectedItem.getBindingContext("viewModel").getProperty("Waers"));
				oParameters.filters = [new Filter("Bukrs", FilterOperator.EQ, oViewModel.getProperty("/HeaderData/Bukrs/value"))];
				this._getGlaAccounts(oParameters);
				this._getTaxCodes(oParameters);
				this._getCostCenters(oParameters);
				this._getProfitCenters(oParameters);
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		/**
		 * 
		 */
		onCCCodeSuggestionSelect: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedRow"),
				oViewModel = this.getViewModel(),
				oParameters = {
					filters: []
				};
			if (oSelectedItem) {
				// oViewModel.setProperty("/HeaderData/Bukrs/value", oSelectedItem.getBindingContext("viewModel").getProperty("Bukrs"));
				oViewModel.setProperty("/HeaderData/Waers/value", oSelectedItem.getBindingContext().getProperty("Waers"));
				oParameters.filters = [new Filter("Bukrs", FilterOperator.EQ, oViewModel.getProperty("/HeaderData/Bukrs/value"))];
				this._getGlaAccounts(oParameters);
				this._getTaxCodes(oParameters);
				this._getCostCenters(oParameters);
				this._getProfitCenters(oParameters);
			}
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onCompanyCodeChange: function (oEvent) {
			var oViewModel = this.getViewModel(),
				aItemsData = oViewModel.getProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg"),
				oParameters = {
					filters: []
				};
			// oViewModel.setProperty("/HeaderData/Budat/value", null);
			// oViewModel.setProperty("/HeaderData/Waers/value", "");
			if (!Boolean(oEvent.getParameter("value"))) {
				aItemsData.forEach(function (oItemData) {
					oItemData.Hkont.value = "";
					oItemData.Prctr.value = "";
					oItemData.Kostl.value = "";
					oItemData.Mwskz.value = "";
				}, this);
			}
			oParameters.filters = [new Filter("Bukrs", FilterOperator.EQ, oViewModel.getProperty("/HeaderData/Bukrs/value"))];
			this._getGlaAccounts(oParameters);
			this._getTaxCodes(oParameters);
			this._getCostCenters(oParameters);
			this._getProfitCenters(oParameters);
			oViewModel.setProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg", aItemsData);
		},

		/**
		 * 
		 */
		onRunScheduleHelp: function (oEvent) {
			if (!this._oRCPopup) {
				this._oRCPopup = sap.ui.xmlfragment(
					"com.sap.colacolaCocaCola.view.fragments.RunSchedule", this);
				this.getView().addDependent(this._oRCPopup);

				// Sync the style class for mobiles & desktops as Popovers don't auto inherit it
				this._oRCPopup.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
			// open the popup
			this._oRCPopup.open();
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onRunScheduleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter(
				"Text1",
				FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onRunScheduleConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");

			if (oSelectedItem) {
				this.getViewModel().setProperty("/HeaderData/Dbakz/value", oSelectedItem.getBindingContext().getProperty("Dbakz"));
			}
			oEvent.getSource().getBinding("items").filter([]);
			//Use Promise.all after testing
		},

		onRunScheduleCancel: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onTemplateDownload: function (oEvent) {},

		/**
		 * 
		 */
		onGLAccountHelp: function (oEvent) {
			if (this.getViewModel().getProperty("/HeaderData/Bukrs/value")) {
				var oViewModel = this.getViewModel("viewModel"),
					oContext = oEvent.getSource().getBindingContext("viewModel"),
					oParameters = {
						filters: []
							// sorters: new Sorter("Glacct")
					};
				oParameters.filters = [new Filter("Bukrs", FilterOperator.EQ, oViewModel.getProperty("/HeaderData/Bukrs/value"))];
				if (!this._oGLAPopup) {
					this._oGLAPopup = sap.ui.xmlfragment(
						"com.sap.colacolaCocaCola.view.fragments.GLAccounts", this);
					this.getView().addDependent(this._oGLAPopup);

					// Sync the style class for mobiles & desktops as Popovers don't auto inherit it
					this._oGLAPopup.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				oViewModel.setProperty("/dialogBusy", true);
				this._getGlaAccounts(oParameters);
				// open the popup
				this._oGLAPopup.setBindingContext(oContext, "viewModel");
				this._oGLAPopup.open();
			} else {
				MessageToast.show(this.getResourceBundle().getText("ENTER_C_CODE"));
			}
		},

		onGLASuggest: function (oEvent) {
			var sTerm = oEvent.getParameter("suggestValue"),
				oFilterGLA = {},
				oFilterBukrs = {},
				oFilterText = {};
			if (sTerm) {
				oFilterGLA = new Filter("Glacct", FilterOperator.Contains, sTerm);
				oFilterBukrs = new Filter("Bukrs", FilterOperator.Contains, sTerm);
				oFilterText = new Filter("GlacctTxt20", FilterOperator.Contains, sTerm);
			}
			oEvent.getSource().getBinding("suggestionItems").filter(new Filter([oFilterGLA, oFilterBukrs, oFilterText], false));
		},

		/** 
		 * 
		 * @constructor 
		 * @param oParameters
		 */
		_getGlaAccounts: function (oParameters) {
			var oViewModel = this.getViewModel();
			oViewModel.whenGLAccountDataLoaded(this.getModel(), oParameters)
				.then(
					oViewModel.setGLAccountDataInModel.bind(oViewModel)
				)
				.catch(
					this._showErrorMessage.bind(this)
				);
		},

		/** 
		 * 
		 * @constructor 
		 * @param oParameters
		 */
		_getTaxCodes: function (oParameters) {
			var oViewModel = this.getViewModel();
			oViewModel.whenTaxCodeDataLoaded(this.getModel(), oParameters)
				.then(
					oViewModel.setTaxCodeDataInModel.bind(oViewModel)
				)
				.catch(
					this._showErrorMessage.bind(this)
				);
		},

		/** 
		 * 
		 * @constructor 
		 * @param oParameters
		 */
		_getCostCenters: function (oParameters) {
			var oViewModel = this.getViewModel();
			oViewModel.whenCostCenterDataLoaded(this.getModel(), oParameters)
				.then(
					oViewModel.setCostCenterDataInModel.bind(oViewModel)
				)
				.catch(
					this._showErrorMessage.bind(this)
				);
		},

		/** 
		 * 
		 * @constructor 
		 * @param oParameters
		 */
		_getProfitCenters: function (oParameters) {
			var oViewModel = this.getViewModel();
			oViewModel.whenProfitCenterDataLoaded(this.getModel(), oParameters)
				.then(
					oViewModel.setProfitCenterDataInModel.bind(oViewModel)
				)
				.catch(
					this._showErrorMessage.bind(this)
				);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onGLADialogSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter(
				"Glacct",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			var oFilter1 = new Filter(
				"GlacctTxt20",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter(
				new Filter([oFilter, oFilter1], false)
			);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onGLADialogConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oContextPath = oEvent.getSource().getBindingContext("viewModel").getPath();
			if (oSelectedItem) {
				this.getViewModel().setProperty(oContextPath + "/Hkont/value", oSelectedItem.getBindingContext("viewModel").getProperty("Glacct"));
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		/**
		 * 
		 */
		onGLADialogCancel: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
		},

		onGlAccountSuggest: function (oEvent) {
			if (this.getViewModel().getProperty("/HeaderData/Bukrs/value")) {
				var sTerm = oEvent.getParameter("suggestValue");
				var aFilters = [];
				if (sTerm) {
					aFilters.push(new Filter("Bukrs", sap.ui.model.FilterOperator.EQ, this.getViewModel().getProperty(
						"/HeaderData/Bukrs/value")));
					aFilters.push(new Filter("Glacct", sap.ui.model.FilterOperator.StartsWith, sTerm));
				}
				oEvent.getSource().getBinding("suggestionRows").filter(aFilters);
			}
		},

		onCancel: function () {
			sap.ui.getCore().getMessageManager().removeAllMessages();
			this.navBack();
		},

		/** 
		 * 
		 * @constructor 
		 * @param oData
		 */
		_showSuccessMessage: function (oData) {
			var oViewModel = this.getViewModel(),
				oPostData = {},
				sUrl = "/bpmworkflowruntime/workflow-service/rest/v1/workflow-instances",
				sRequestType = oViewModel.getProperty("/RequestType"),
				contextURL = new window.URL(new window.URI());

			var finalContextURL = contextURL.origin +
				(contextURL.pathname ? contextURL.pathname : "") +
				(contextURL.search ? contextURL.search : "");

			oViewModel.setProperty("/viewBusy", false);
			if (oData) {
				// MessageToast.show(oData.Message);
				oPostData = {
					"definitionId": "jv_workflow",
					"context": {
						"DocumentNo": oData.Belnr,
						"CompanyCode": oData.Bukrs,
						"DocumentType": oData.Blart,
						"Objid": oData.Objid,
						"WorkCenter": oData.WorkCenter,
						"FiscalYear": oData.Gjahr,
						"RequestType": sRequestType,
						"URL": finalContextURL,
						"RequestTypeText": Configuration.REQUEST_TYPE_TEXT[sRequestType],
						"results": {},
						"request": {},
						"DueDate": oData.PeriodTo, //Util.getFormatDateString(oData.PeriodTo),
						"DueDuration": (new Date(oData.PeriodTo) > new Date() ? Util.getISO8601StringFromDates(new Date(oData.PeriodTo), new Date()) :
							"P0D"),
						"VHighPriorityDuration": Util.getISO8601StringFromDates(new Date(oData.PeriodTo), new Date()),
						"HighPriorityDuration": Util.getISO8601StringFromDates(new Date(oData.PeriodTo), new Date()),
						"rejected": "",
						"requester": {
							"mail": this.getModel("userModel").getProperty("/mail"),
							"KOID": this.getModel("userModel").getProperty("/name"),
							"givenname": this.getModel("userModel").getProperty("/givenname"),
							"surname": this.getModel("userModel").getProperty("/surname")
						},
						"Approvers": [],
						"Emails": []
					}
				};

				if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBS1) {
					oPostData.context["Stodt"] = oViewModel.getProperty("/HeaderData/Stodt/value");
					oPostData.context["Stgrd"] = oViewModel.getProperty("/HeaderData/Stgrd/value");
					oPostData.context["Txt40"] = oData.Txt40 ? oData.Txt40 : "";

					oData.FinsAccDocHeaderToApproverNvg.results.forEach(function (oApprover) { //Email
						if (this.getModel("userModel").getProperty("/name") !== oApprover.Uname) {
							oPostData.context.Approvers.push(oApprover.Uname);
						}
					}.bind(this));
					oData.FinsAccDocHeaderToApproverNvg.results.forEach(function (oApprover) { //Email
						if (this.getModel("userModel").getProperty("/name") !== oApprover.Uname) {
							oPostData.context.Emails.push(oApprover.Email);
						}
					}.bind(this));
				} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBD1) {
					oPostData.context["Dbmon"] = oViewModel.getProperty("/HeaderData/Dbmon/value");
					oPostData.context["Dbtag"] = oViewModel.getProperty("/HeaderData/Dbtag/value");
					oPostData.context["Dbbdt"] = oViewModel.getProperty("/HeaderData/Dbbdt/value");
					oPostData.context["Dbedt"] = oViewModel.getProperty("/HeaderData/Dbedt/value");
					oPostData.context["Dbakz"] = oViewModel.getProperty("/HeaderData/Dbakz/value");
					oData.FinsRecrDocHeaderToApproverNvg.results.forEach(function (oApprover) { //Email
						if (this.getModel("userModel").getProperty("/name") !== oApprover.Uname) {
							oPostData.context.Approvers.push(oApprover.Uname);
						}
					}.bind(this));
					oData.FinsRecrDocHeaderToApproverNvg.results.forEach(function (oApprover) { //Email
						if (this.getModel("userModel").getProperty("/name") !== oApprover.Uname) {
							oPostData.context.Emails.push(oApprover.Email);
						}
					}.bind(this));
				} else {
					oData.FinsDocHeaderToApproverNvg.results.forEach(function (oApprover) { //Email
						if (this.getModel("userModel").getProperty("/name") !== oApprover.Uname) {
							oPostData.context.Approvers.push(oApprover.Uname);
						}
					}.bind(this));
					oData.FinsDocHeaderToApproverNvg.results.forEach(function (oApprover) { //Email
						if (this.getModel("userModel").getProperty("/name") !== oApprover.Uname) {
							oPostData.context.Emails.push(oApprover.Email);
						}
					}.bind(this));
				}

				this._completeTask(sUrl, oPostData, oData);
			}
		},

		/** 
		 * 
		 * @constructor 
		 * @returns
		 */
		_fetchToken: function () {
			var token;
			$.ajax({
				url: "/bpmworkflowruntime/workflow-service/rest/v1/xsrf-token",
				method: "GET",
				async: false,
				headers: {
					"X-CSRF-Token": "Fetch"
				},
				success: function (result, xhr, data) {
					token = data.getResponseHeader("X-CSRF-Token");
				}
			});
			return token;
		},

		/** 
		 * 
		 * @constructor 
		 * @param taskId
		 * @param approvalStatus
		 */
		_completeTask: function (sUrl, oPostData, oData) {
			var token = this._fetchToken();
			if (token) {
				$.ajax({
					url: sUrl,
					method: "POST",
					contentType: "application/json",
					async: false,
					data: JSON.stringify(oPostData),
					headers: {
						"X-CSRF-Token": token
					},
					success: function (oPrevOData, oData1) {
						if (oPrevOData.Message) {
							MessageToast.show(oPrevOData.Message, {
								closeOnBrowserNavigation: false,
								autoClose: true,
								duration: 30000
							});
						} else {
							MessageToast.show("Document No: " + oPrevOData.Belnr + "successfully created", {
								closeOnBrowserNavigation: false,
								autoClose: true,
								duration: 30000
							});
						}
						this.navBack();
					}.bind(this, oData)
				});
			}
		},

		/** 
		 * 
		 * @constructor 
		 * @param oData
		 */
		_showAjaxPostSuccess: function (oData) {},

		/**
		 * 
		 */
		_showErrorMessage: function () {
			var oViewModel = this.getView().getModel("viewModel");
			oViewModel.setProperty("/dialogBusy", false);
			oViewModel.setProperty("/viewBusy", false);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onUpload: function (oEvent) {
			if (jQuery.isEmptyObject(xlsxjs) || !xlsxjs) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				MessageBox.error("System Timeout occured. Click OK to refresh", {
					actions: [sap.m.MessageBox.Action.OK],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function () {
						window.location.reload();
					}.bind(this)
				});
				return;
			}

			if (!this._upload) {
				this._upload = sap.ui.xmlfragment("com.sap.colacolaCocaCola.view.fragments.Upload", this);
				this.getView().addDependent(this._upload);
				this._upload.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this._upload.open();
			} else {
				this._upload.open();
				sap.ui.getCore().byId("fileUploader").clear();
			}
		},

		onUploadCancel: function (oEvent) {
			if (this._upload) {
				this._upload.close();
			}

		},

		/** 
		 * 
		 * @param oEvent
		 */
		onUploadStart: function (oEvent) {
			this._import(oEvent.getParameter("files") && oEvent.getParameter("files")[0], this);
		},

		/** 
		 * 
		 * @constructor 
		 * @param file
		 * @param ref
		 */
		_import: function (file, ref) {
			var reader = new FileReader();
			reader.addEventListener("load", function (e) {
				var binary = "";
				var bytes = new Uint8Array(e.target.result);
				var length = bytes.byteLength;
				for (var i = 0; i < length; i++) {
					binary += String.fromCharCode(bytes[i]);
				}
				var oFile = xlsxjs.read(binary, {
					type: 'binary',
					cellDates: true,
					cellStyles: true
				});

				var oSheet1 = oFile.SheetNames[0];
				if ((this._getFileName(this.getViewModel().getProperty("/RequestType"))).sheetName === oSheet1) {
					var roa = xlsxjs.utils.sheet_to_row_object_array(oFile.Sheets[oSheet1]);
					if (roa.length > 0) {
						this._mapExcelDataToModel(roa);
					}
				} else {
					MessageToast.show("Incorrect template selected for " + (this._getFileName(this.getViewModel().getProperty("/RequestType"))).sheetName);
				}

			}.bind(this), false);
			reader.readAsArrayBuffer(file);
			if (this._upload) {
				this._upload.close();
			}
		},

		/** 
		 * 
		 * @constructor 
		 * @param aExcelData
		 */
		_mapExcelDataToModel: function (aExcelData) {
			var oViewModel = this.getViewModel(),
				oItemObj = {},
				aItems = [],
				sRequestType = oViewModel.getProperty("/RequestType"),
				oParameters = {
					filters: []
				},
				aList = oViewModel.getProperty("/attachments/attachmentList"),
				aApprovers = oViewModel.getProperty("/ApprovalWorkCenterSet");

			oViewModel.setProperty("/", oViewModel.getInitialStateObject(oViewModel.getProperty("/RequestType")));
			oViewModel.setProperty("/viewBusy", true);
			oViewModel.setProperty("/uploadUrl", this._getAttachmentUploadUrl().completeUrl);
			oViewModel.setProperty("/attachments/attachmentList", aList);
			if (aExcelData[0].hasOwnProperty("Company Code")) {
				oViewModel.setProperty("/HeaderData/Bukrs/value", aExcelData[0]["Company Code"] ? aExcelData[0]["Company Code"] : "");
				// oViewModel.setProperty("/HeaderData/Blart/value", aExcelData[0]["Journal Entry Type"] ? aExcelData[0]["Journal Entry Type"] : "");
				oViewModel.setProperty("/HeaderData/Bldat/value", aExcelData[0]["Journal Entry Date"] ? Util.getUTCDate(new Date(aExcelData[0][
						"Journal Entry Date"
					])) :
					null);
				oViewModel.setProperty("/HeaderData/Budat/value", aExcelData[0]["Posting Date"] ? Util.getUTCDate(new Date(aExcelData[0][
					"Posting Date"
				])) : null);
				oViewModel.setProperty("/HeaderData/Monat/value", aExcelData[0]["Fiscal period"] ? aExcelData[0]["Fiscal period"] : "");
				oViewModel.setProperty("/HeaderData/Bktxt/value", aExcelData[0]["Document Header Text"] ? aExcelData[0]["Document Header Text"] :
					"");
				oViewModel.setProperty("/HeaderData/Waers/value", aExcelData[0]["Transaction Currency"] ? aExcelData[0]["Transaction Currency"] :
					"");
				oViewModel.setProperty("/HeaderData/Ldgrp/value", aExcelData[0]["Ledger Group"] ? aExcelData[0]["Ledger Group"] : "");
				// oViewModel.setProperty("/HeaderData/Kursf/value", aExcelData[0]["Exchange Rate"] ? aExcelData[0]["Exchange Rate"] : "0.000");
				// oViewModel.setProperty("/HeaderData/Wwert/value", aExcelData[0]["Currency Translation Date"] ? Util.getUTCDate(new Date(aExcelData[
				// 	0][
				// 	"Currency Translation Date"
				// ])) : null);
				aApprovers.forEach(function (oWorkCenter) {
					if (Boolean(aExcelData[0]["Approve Region"])) {
						if ((oWorkCenter.WorkCenter).toUpperCase() === (aExcelData[0]["Approve Region"]).toUpperCase()) {
							oViewModel.setProperty("/HeaderData/Objid/value", oWorkCenter.Objid);
						}
					} else {
						//this.getView().byId("idCrApprViewCBWorkCenter").setSelectedItem(null);
					}
				}.bind(this));
				oViewModel.setProperty("/HeaderData/Xblnr/value", aExcelData[0]["Reference Document Number"] ? aExcelData[0][
					"Reference Document Number"
				] : "");
				// oViewModel.setProperty("/HeaderData/Objid/value", aExcelData[0]["Approve Region"] ? aExcelData[0]["Approve Region"] : this.getView()
				// 	.byId("idCrApprViewCBWorkCenter").setSelectedItem(null));

				oViewModel.setProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg", []);

				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

				if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBS1) {
					oViewModel.setProperty("/HeaderData/Stodt/value", aExcelData[0]["Reverse Date"] ? Util.getUTCDate(new Date(aExcelData[0][
						"Reverse Date"
					])) : null);
					oViewModel.setProperty("/HeaderData/Stgrd/value", aExcelData[0]["Reverse Reason"] ? aExcelData[0]["Reverse Reason"] : "");
				} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBD1) {
					oViewModel.setProperty("/HeaderData/Dbbdt/value", aExcelData[0]["First Run On"] ? Util.getUTCDate(new Date(aExcelData[0][
						"First Run On"
					])) : null);

					oViewModel.setProperty("/HeaderData/Dbedt/value", aExcelData[0]["Last Run On"] ? Util.getUTCDate(new Date(aExcelData[0][
						"Last Run On"
					])) : null);

					oViewModel.setProperty("/HeaderData/Dbmon/value", aExcelData[0]["Interval In Month"] ? aExcelData[0]["Interval In Month"] : "");

					oViewModel.setProperty("/HeaderData/Dbtag/value", aExcelData[0]["Run Date"] ? aExcelData[0]["Run Date"] : null);

					oViewModel.setProperty("/HeaderData/Dbakz/value", aExcelData[0]["Run Schedule"] ? aExcelData[0]["Run Schedule"] : "");
				}

				//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

				aExcelData.forEach(function (oExcelData, iIndex) { //FinsGLDocumentHeaderToItemNvg
					oItemObj = oViewModel.getItemObject();
					oItemObj.Hkont.value = aExcelData[iIndex]["G/L Account"] ? aExcelData[iIndex]["G/L Account"] : "";
					oItemObj.Sgtxt.value = aExcelData[iIndex]["Item Text"] ? aExcelData[iIndex]["Item Text"] : "";
					if (aExcelData[iIndex]["Posting Key"] === "50") {
						oItemObj.PstngKey = "50";
						oItemObj.Wrsol.value = "0.000";
						oItemObj.Wrhab.value = aExcelData[iIndex]["Amount"] ? aExcelData[iIndex]["Amount"] : "0.000";
					} else if (aExcelData[iIndex]["Posting Key"] === "40") {
						oItemObj.PstngKey = "40";
						oItemObj.Wrsol.value = aExcelData[iIndex]["Amount"] ? aExcelData[iIndex]["Amount"] : "0.000";
						oItemObj.Wrhab.value = "0.000";
					} else {
						oItemObj.PstngKey = "50";
						oItemObj.Wrsol.value = "0.000";
						oItemObj.Wrhab.value = "0.000";
					}

					oItemObj.Kostl.value = aExcelData[iIndex]["Cost Center"] ? aExcelData[iIndex]["Cost Center"] : "";
					oItemObj.Dmbtr.value = aExcelData[iIndex]["Amount in Company Code Currency"] ? aExcelData[iIndex][
						"Amount in Company Code Currency"
					] : "0.000";
					oItemObj.Dmbe2.value = aExcelData[iIndex]["Amount in second local currency"] ? aExcelData[iIndex][
						"Amount in second local currency"
					] : "0.000";
					oItemObj.Mwskz.value = aExcelData[iIndex]["Tax Code"] ? aExcelData[iIndex]["Tax Code"] : "";
					oItemObj.Txjcd.value = aExcelData[iIndex]["Tax Jurisdiction"] ? aExcelData[iIndex]["Tax Jurisdiction"] : "";
					oItemObj.Prctr.value = aExcelData[iIndex]["Profit Center"] ? aExcelData[iIndex]["Profit Center"] : "";
					oItemObj.Aufnr.value = aExcelData[iIndex]["Order Number"] ? aExcelData[iIndex]["Order Number"] : "";
					oItemObj.Pspnr.value = aExcelData[iIndex]["WBS Element"] ? aExcelData[iIndex]["WBS Element"] : "";
					oItemObj.Valut.value = aExcelData[iIndex]["Value Date"] ? Util.getUTCDate(new Date(aExcelData[iIndex]["Value Date"])) : null;
					oItemObj.Hbkid.value = aExcelData[iIndex]["House Bank"] ? aExcelData[iIndex]["House Bank"] : "";
					oItemObj.Hktid.value = aExcelData[iIndex]["House Bank Account"] ? aExcelData[iIndex]["House Bank Account"] : "";
					oItemObj.Zounr.value = aExcelData[iIndex]["Assignment number"] ? aExcelData[iIndex]["Assignment number"] : "";

					aItems.push(oItemObj);
				}, this);
				oViewModel.setProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg", aItems);
				sap.ui.getCore().getMessageManager().removeAllMessages();
				this._toggleErrorItems(false);
				oParameters.filters = [new Filter("Bukrs", FilterOperator.EQ, oViewModel.getProperty("/HeaderData/Bukrs/value"))];
				this._getGlaAccounts(oParameters);
				this._getTaxCodes(oParameters);
				this._getCostCenters(oParameters);
				this._getProfitCenters(oParameters);
				this._getFiscalPeriod();
				this._getLedgerGroups();
				this._getWorkCenters();
			} else {
				MessageToast.show("Incorrect file uploaded or Bad Format");
			}
			oViewModel.setProperty("/viewBusy", false);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onTaxCodeHelp: function (oEvent) {
			if (this.getViewModel().getProperty("/HeaderData/Bukrs/value")) {
				var oViewModel = this.getViewModel("viewModel"),
					oContext = oEvent.getSource().getBindingContext("viewModel"),
					oParameters = {
						filters: []
					};
				oParameters.filters = [new Filter("Bukrs", FilterOperator.EQ, oViewModel.getProperty("/HeaderData/Bukrs/value"))];
				if (!this._oTaxCodeDialog) {
					this._oTaxCodeDialog = sap.ui.xmlfragment(
						"com.sap.colacolaCocaCola.view.fragments.TaxCodeDialog", this);
					this.getView().addDependent(this._oTaxCodeDialog);

					// Sync the style class for mobiles & desktops as Popovers don't auto inherit it
					this._oTaxCodeDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				oViewModel.setProperty("/dialogBusy", true);
				this._getTaxCodes(oParameters);
				// open the popup
				this._oTaxCodeDialog.setBindingContext(oContext, "viewModel");
				this._oTaxCodeDialog.open();
			} else {
				MessageToast.show("Enter Company Code");
			}
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onTaxCodeDialogSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value"),
				oFilter = new Filter(
					"Mwskz",
					FilterOperator.Contains, sValue
				),
				oFilterText1 = new Filter(
					"Text1",
					FilterOperator.Contains, sValue
				);
			oEvent.getSource().getBinding("items").filter(new Filter([oFilter, oFilterText1], false));
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onTaxCodeDialogConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oContextPath = oEvent.getSource().getBindingContext("viewModel").getPath();
			if (oSelectedItem) {
				this.getViewModel().setProperty(oContextPath + "/Mwskz/value", oSelectedItem.getBindingContext("viewModel").getProperty("Mwskz"));
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onTaxCodeDialogCancel: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onCostCenterHelp: function (oEvent) {
			if (this.getViewModel().getProperty("/HeaderData/Bukrs/value")) {
				var oViewModel = this.getViewModel("viewModel"),
					oContext = oEvent.getSource().getBindingContext("viewModel"),
					oParameters = {
						filters: []
					};
				oParameters.filters = [new Filter("Bukrs", FilterOperator.EQ, oViewModel.getProperty("/HeaderData/Bukrs/value"))];
				if (!this._oCostCenterDialog) {
					this._oCostCenterDialog = sap.ui.xmlfragment(
						"com.sap.colacolaCocaCola.view.fragments.CostCenterDialog", this);
					this.getView().addDependent(this._oCostCenterDialog);

					// Sync the style class for mobiles & desktops as Popovers don't auto inherit it
					this._oCostCenterDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				oViewModel.setProperty("/dialogBusy", true);
				this._getCostCenters(oParameters);
				// open the popup
				this._oCostCenterDialog.setBindingContext(oContext, "viewModel");
				this._oCostCenterDialog.open();
			} else {
				MessageToast.show("Enter Company Code");
			}
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onCostCenterDialogSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value"),
				oFilter = new Filter(
					"Kostl",
					FilterOperator.Contains, sValue
				),
				oFilterKtext = new Filter("Ktext", FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter(new Filter([oFilter, oFilterKtext], false));
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onCostCenterDialogConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oContextPath = oEvent.getSource().getBindingContext("viewModel").getPath();
			if (oSelectedItem) {
				this.getViewModel().setProperty(oContextPath + "/Kostl/value", oSelectedItem.getBindingContext("viewModel").getProperty("Kostl"));
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onCostCenterDialogCancel: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onCurrencyKeyHelp: function (oEvent) {
			var oViewModel = this.getViewModel("viewModel");
			if (!this._oCurrencyKeyDialog) {
				this._oCurrencyKeyDialog = sap.ui.xmlfragment(
					"com.sap.colacolaCocaCola.view.fragments.CurrencyKey", this);
				this.getView().addDependent(this._oCurrencyKeyDialog);

				// Sync the style class for mobiles & desktops as Popovers don't auto inherit it
				this._oCurrencyKeyDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
			oViewModel.setProperty("/dialogBusy", true);
			oViewModel.whenCurrecnyKeyDataLoaded(this.getModel(), {})
				.then(
					oViewModel.setCurrencyKeyDataInModel.bind(oViewModel)
				)
				.catch(
					this._showErrorMessage.bind(this)
				);
			this._oCurrencyKeyDialog.open();
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onCurrencyKeyDialogSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter(
				"Waers",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onCurrencyKeyDialogConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getViewModel().setProperty("/HeaderData/Waers/value", oSelectedItem.getBindingContext("viewModel").getProperty("Waers"));
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onCurrencyKeyDialogCancel: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onProfitCenterHelp: function (oEvent) {
			if (this.getViewModel().getProperty("/HeaderData/Bukrs/value")) {
				var oViewModel = this.getViewModel("viewModel"),
					oContext = oEvent.getSource().getBindingContext("viewModel"),
					oParameters = {
						filters: []
					};
				oParameters.filters = [new Filter("Bukrs", FilterOperator.EQ, oViewModel.getProperty("/HeaderData/Bukrs/value"))];
				if (!this._oProfitCenterDialog) {
					this._oProfitCenterDialog = sap.ui.xmlfragment(
						"com.sap.colacolaCocaCola.view.fragments.ProfitCenterDialog", this);
					this.getView().addDependent(this._oProfitCenterDialog);

					// Sync the style class for mobiles & desktops as Popovers don't auto inherit it
					this._oProfitCenterDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				oViewModel.setProperty("/dialogBusy", true);
				this._getProfitCenters(oParameters);
				// open the popup
				this._oProfitCenterDialog.setBindingContext(oContext, "viewModel");
				this._oProfitCenterDialog.open();
			} else {
				MessageToast.show("Enter Company Code");
			}
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onProfitCenterDialogSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value"),
				oFilterPrctr = new Filter(
					"Prctr",
					FilterOperator.Contains, sValue
				),
				oFilterLText = new Filter("Ltext", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter(
				new Filter([oFilterPrctr, oFilterLText], false)
			);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onProfitCenterDialogConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oContextPath = oEvent.getSource().getBindingContext("viewModel").getPath();
			if (oSelectedItem) {
				this.getViewModel().setProperty(oContextPath + "/Prctr/value", oSelectedItem.getBindingContext("viewModel").getProperty("Prctr"));
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onProfitCenterDialogCancel: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onShowErrorItems: function (oEvent) {
			this._toggleErrorItems(oEvent.getParameter("pressed"));
		},

		/** 
		 * 
		 * @constructor 
		 */
		_toggleErrorItems: function (bPressed) {
			var oItemsTable = this.getView().byId("asnListTable"),
				oViewModel = this.getViewModel();
			oViewModel.setProperty("/toggleErrorItemsFlag", bPressed);
			if (oViewModel.getProperty("/toggleErrorItemsFlag")) {
				var oFilter = new Filter(
					"highlight",
					FilterOperator.Contains, "Error"
				);
				oItemsTable.getBinding("items").filter([oFilter]);
				oViewModel.setProperty("/ShowErrorItemsBtnText", this.getResourceBundle().getText("BTN_ERROR_ITEM"));
			} else {
				oItemsTable.getBinding("items").filter([]);
				oViewModel.setProperty("/ShowErrorItemsBtnText", this.getResourceBundle().getText("BTN_ERROR_ITEMS_SHOW"));
			}
		},

		/** 
		 * 
		 * @constructor 
		 * @param oError
		 */
		_showErrorOnPost: function (oError) {
			var oViewModel = this.getViewModel(),
				messages = Util.parseError(oError),
				bErrorInItems = false;
			oViewModel.setProperty("/viewBusy", false);
			if (messages.errordetails && messages.errordetails.length > 0) {
				messages.errordetails.forEach(function (oErroMessage) {
					var iIndex = parseInt(oErroMessage.target, 10),
						sPropertyRef = oErroMessage.propertyref.substr(oErroMessage.propertyref.lastIndexOf("/"));
					if (iIndex > 0 && oErroMessage.severity === "error") {
						bErrorInItems = true;
						oViewModel.setProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg/" + (iIndex - 1) + "/highlight", "Error");
						oViewModel.setProperty(
							"/HeaderData/FinsGLDocumentHeaderToItemNvg/" + (iIndex - 1) + sPropertyRef + "/valueState",
							"Error");
						oViewModel.setProperty(
							"/HeaderData/FinsGLDocumentHeaderToItemNvg/" + (iIndex - 1) + sPropertyRef + "/valueStateText",
							oErroMessage.message);
					}
					if (iIndex === 0 && oErroMessage.severity === "error") {
						oViewModel.setProperty(
							"/HeaderData" + sPropertyRef + "/valueState",
							"Error");
						oViewModel.setProperty(
							"/HeaderData" + sPropertyRef + "/valueStateText",
							oErroMessage.message);
					}
				}, this);
			}

			if (bErrorInItems) {
				this._toggleErrorItems(true);
			}
		},

		/** 
		 * 
		 * @constructor 
		 */
		_refreshErrorStates: function () {
			var oViewModel = this.getViewModel(),
				oHeaderData = oViewModel.getProperty("/HeaderData"),
				aItemsData = oViewModel.getProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg");

			for (var headerProp in oHeaderData) {
				if (oHeaderData.hasOwnProperty(headerProp)) {
					if (oHeaderData[headerProp].valueState) {
						oHeaderData[headerProp].valueState = "None";
					}
					if (oHeaderData[headerProp].valueStateText) {
						oHeaderData[headerProp].valueStateText = "";
					}
				}
			}
			aItemsData.forEach(function (oItem) {
				oItem.highlight = "Success";
				for (var itemProp in oItem) {
					if (oItem.hasOwnProperty(itemProp)) {
						if (oItem[itemProp].valueState) {
							oItem[itemProp].valueState = "None";
						}
						if (oItem[itemProp].valueStateText) {
							oItem[itemProp].valueStateText = "";
						}
					}
				}
			}, this);
			oViewModel.setProperty("/HeaderData", oHeaderData);
			oViewModel.setProperty("/HeaderData/FinsGLDocumentHeaderToItemNvg", aItemsData);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onPostingDateChange: function (oEvent) {
			this._getFiscalPeriod();
		},

		/** 
		 * 
		 * @constructor 
		 */
		_getFiscalPeriod: function () {
			var oViewModel = this.getViewModel();
			if (Boolean(oViewModel.getProperty("/HeaderData/Bukrs/value")) && Boolean(oViewModel.getProperty("/HeaderData/Budat/value"))) {
				oViewModel.whenFiscalPeriodLoaded(this.getModel(), {
						filters: [
							new Filter("Bukrs", FilterOperator.EQ, oViewModel.getProperty("/HeaderData/Bukrs/value")),
							new Filter("Budat", FilterOperator.EQ, oViewModel.getProperty("/HeaderData/Budat/value"))
						]
					})
					.then(
						oViewModel.setFiscalPeriodInModel.bind(oViewModel)
					)
					.catch(
						this._showErrorMessage.bind(this)
					);
			}
		},

		/** 
		 * 
		 * @constructor 
		 */
		_getLedgerGroups: function () {
			this.getModel("viewModel").whenLedgerGroupDataLoaded(this.getModel())
				.then(
					this.getModel("viewModel").setLedgerGroupDataInModel.bind(this.getModel("viewModel"))
				)
				.catch(
					this._showErrorMessage.bind(this)
				);
		},

		/** 
		 * 
		 * @constructor 
		 */
		_getWorkCenters: function () {
			this.getModel("viewModel").whenWorkCenterLoaded(this.getModel())
				.then(
					this.getModel("viewModel").setWorkCenterInModel.bind(this.getModel("viewModel"))
				)
				.catch(
					this._showErrorMessage.bind(this)
				);
		},

		/** 
		 * 
		 * @param oEvent
		 */
		onItemPostingKeyChange: function (oEvent) {
			var oViewModel = this.getViewModel(),
				oBindingContext = oEvent.getSource().getBindingContext("viewModel"),
				oPath = oBindingContext.getPath();

			if (oViewModel.getProperty(oPath + "/PstngKey") === "50") {
				oViewModel.setProperty(oPath + "/Wrhab/value", oViewModel.getProperty(oPath + "/Wrsol/value"));
				oViewModel.setProperty(oPath + "/Wrsol/value", "0.000");
			} else {
				oViewModel.setProperty(oPath + "/Wrsol/value", oViewModel.getProperty(oPath + "/Wrhab/value"));
				oViewModel.setProperty(oPath + "/Wrhab/value", "0.000");
			}
		},

		/**
		 * Function to get Upload Url of Attachments
		 * @return {Object} Attachment Upload URL object
		 */
		_getAttachmentUploadUrl: function () {
			var sServiceURL = this.getOwnerComponent().getManifestEntry(
				"/sap.app/dataSources/ZFI_JOURNAL_VOUCHER_POST_SRV/uri");
			var sEntity;
			sEntity = "FinsDocumentAttachmentSet";

			return {
				completeUrl: sServiceURL + sEntity,
				entity: sEntity
			};
		},

		/**
		 * This is called when the file is changes
		 * @param  {Object} oEvent User Change Event
		 */
		onFileChange: function (oEvent) {

			//Add csrf Token
			var sToken = this.getView().getModel().getHeaders()["x-csrf-token"],
				oUploadCollection = oEvent.getSource(),
				oToken = new sap.m.UploadCollectionParameter({
					name: "x-csrf-token",
					value: sToken
				});
			oUploadCollection.addHeaderParameter(oToken);

		},

		/**
		 * Event handler called once upload is complete
		 * @param {Object} oEvent Attachment Upload Complete Event
		 */
		onUploadComplete: function (oEvent) {

			var aUploadedFiles = oEvent.getParameter("files");
			var bSucess = false;
			var bFailure = false;
			var aCreatedFiles = [];
			var oFileResponse;
			this.getViewModel().setProperty("/viewBusy", false);

			aUploadedFiles.forEach(function (oItem) {

				if (oItem.status === 201) {
					bSucess = true;
					//Extract and add the response to the list of files that was created
					//"d" is the response identfier added in in JSOn response from OData
					oFileResponse = JSON.parse(oItem.responseRaw)["d"];
					aCreatedFiles.push(oFileResponse);

				} else {
					bFailure = true;
				}
			}, this);

			if (bSucess && aCreatedFiles.length > 0) {
				//Add created files to Model
				this._addAttachmentToList(aCreatedFiles);
			}
		},

		/**
		 * Function to Add attachment to list
		 * @param {Array} aData Created Attachment List
		 */
		_addAttachmentToList: function (aData) {
			var aCombinedFilesList = [];
			// Fetch exsisting Attachments
			var oViewModel = this.getViewModel();
			var oExisiting = oViewModel.getProperty("/attachments/attachmentList");
			//Combine
			aCombinedFilesList = aData.concat(oExisiting);
			//Update to Model
			oViewModel.setProperty("/attachments/attachmentList", aCombinedFilesList);
		},

		/**
		 * Function that is called before the file upload starts
		 * The method is used to add header params like:
		 * - The selcted file names
		 * - Response format (required as upload is outside of odata model)
		 * @param {Object} oEvent Attachment Upload Begin Event
		 */
		onBeforeUploadStarts: function (oEvent) {

			// Header Slug
			var oFileNameHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});

			//set header for json response - this is required to ensure response is parsable 
			var oResponseType = new sap.m.UploadCollectionParameter({
				name: "Accept",
				value: "application/json"
			});
			this.getViewModel().setProperty("/viewBusy", true);
			oEvent.getParameters().addHeaderParameter(oFileNameHeaderSlug);
			oEvent.getParameters().addHeaderParameter(oResponseType);
		},

		/**
		 * Function that is called when the user deletes a file in the Upoad Collection
		 * @param {Object} oEvent File Delete Event
		 */
		onFileDeleted: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var oAttachment = oItem.getBindingContext("viewModel").getObject();
			var sUrl;
			var oParams;

			sUrl = this.getModel().createKey("/FinsDocumentAttachmentSet", oAttachment);

			if (sUrl) {
				oParams = {
					error: this._removeAttachmentError.bind(this, oItem, oAttachment),
					success: this._removeAttachmentSuccess.bind(this)
				};
				this.getModel().remove(sUrl + "/$value", oParams);
				this.getViewModel().setProperty("/viewBusy", true);
				this._removeAttachment(oAttachment);
			}
		},

		/**
		 * Function That is called when a attachment deletion is a Sucess 
		 * @param {Object} oAttachment Attachment Object
		 */
		_removeAttachment: function (oAttachment) {

			var oViewModel = this.getViewModel();
			var aList = oViewModel.getProperty("/attachments/attachmentList");
			var aItems = jQuery.extend([], aList);

			aItems = aList.filter(function (oOriginalAttach, oItem) {
				return !(oOriginalAttach.DocId === oItem.DocId);
			}.bind(this, oAttachment));

			oViewModel.setProperty("/attachments/attachmentList", aItems);
		},

		/**
		 * Function That is called when a attachment deletion succeed 
		 * @param {Object} oData Success response
		 */
		_removeAttachmentSuccess: function (oData) {
			this.getViewModel().setProperty("/viewBusy", false);
		},

		/**
		 * Function That is called when a attachment deletion fails 
		 * @param {Object} oItem File Item
		 * @param {Object} oAttachment Attachment Object
		 * @param {Object} oError Error Object
		 */
		_removeAttachmentError: function (oItem, oAttachment, oError) {
			var oViewModel = this.getViewModel();
			var aList = oViewModel.getProperty("/attachments/attachmentList");
			this.getViewModel().setProperty("/viewBusy", false);
			// Add Attchment back to list
			aList.push(oAttachment);
			oViewModel.setProperty("/attachments/attachmentList", aList);

			MessageToast.show(this.getResourceBundle().getText("ATTACHMENT_DELETE_FAIL"));

		},

		/** 
		 * 
		 */
		onTypeMissmatch: function () {
			MessageToast.show(this.getResourceBundle().getText("FILE_TYPE_MISMATCH"));
		},

		/** 
		 * 
		 */
		onFileExceeded: function () {
			MessageToast.show(this.getResourceBundle().getText("FILE_SIZE_MISMATCH"));
		},

		onWorkCenterChange: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oObject = oSelectedItem.getBindingContext("viewModel").getObject();

			this.getViewModel().setProperty("/WorkCenter", oObject.WorkCenter);
		}

	});

});