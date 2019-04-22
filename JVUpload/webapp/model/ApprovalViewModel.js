sap.ui.define([
		"./BaseViewModel",
		"com/sap/colacolaCocaCola/util/Configuration",
		"com/sap/colacolaCocaCola/util/OData"
	],
	function (BaseViewModel, Configuration, ODataUtil) {
		"use strict";

		return BaseViewModel.extend("com.sap.colacolaCocaCola.model.AppModel", {
			/**
			 * Initializes the model
			 * @param {object} controller object
			 * @param {object} i18n resource bundle
			 * @returns {object} instance of self for chaining
			 */
			init: function (controller, i18n, sRequestType) {
				var initialState = this.getInitialStateObject(sRequestType);

				this._controller = controller;
				this._resourceBundle = i18n;

				this.setProperty("/", initialState);
				return this;
			},
			/*************************************************************************
			 * Getter
			 *************************************************************************/

			/** 
			 * 
			 * @returns
			 */
			getInitialStateObject: function (sRequestType) {
				var model = this;
				return {
					"isF05": (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.F05) ? true : false,
					"isFBS1": (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBS1) ? true : false,
					"isFBD1": (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBD1) ? true : false,
					"RequestType": sRequestType,
					"COMPANY_CODES": Configuration.COMPANY_CODES,
					"CURRENCY_CODES": Configuration.CURRENCY_CODES,
					"FISCAL_CODES": Configuration.FISCAL_CODES,
					"LEDGER_CODES": Configuration.LEDGER_CODES,
					"APPROVER_NAMES": Configuration.APPROVER_NAMES,
					"ApprovalWorkCenterSet": [],
					"WorkCenter": "",
					"dialogBusy": false,
					"viewBusy": false,
					"busyDelay": 0,
					"CompanyCodeSet": [],
					"CompanyCode": "",
					"ShowErrorItemsBtnText": "Show Error Items",
					"HeaderData": model.getViewObject(sRequestType),
					"currentLineItemNo": "002",
					"GLAccountSet": [],
					"TaxCodeSet": [],
					"CostCenterSet": [],
					"ProfitCenterSet": [],
					"CurrencyKeySet": [],
					"attachments": {
						attachmentList: []
					},
					get getUploadEnabled() {
						return this.attachments.attachmentList.length > 2;
					},
					"LedgerGroupSet": [],
					"RunDate": Configuration.RUN_DATE,
					"PostingKey": Configuration.POSTING_KEY,
					"RecurringRunFrequencySet": Configuration.RecurringRunFrequencySet,
					"uploadUrl": "",
					"fileTypes": [],
					"toggleErrorItemsFlag": false,
					"mimeType": [],
					"dialogFileTypes": ["xlsx"],
					"dialogMimeType": ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
				};
			},

			/** 
			 * 
			 * @returns
			 */
			getViewObject: function (sRequestType) {

				var oHeaderObject = {};
				if ((Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.F05) ||
					(Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.F02)) {
					oHeaderObject = this.getHeaderObject(sRequestType);
				} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBS1) {
					oHeaderObject = this.getHeaderObjectForAccrual(sRequestType);
				} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBD1) {
					oHeaderObject = this.getHeaderObjectForRecurring(sRequestType);
				}
				oHeaderObject.FinsGLDocumentHeaderToItemNvg.push(this.getItemObject("001"));
				oHeaderObject.FinsGLDocumentHeaderToItemNvg.push(this.getItemObject("002"));
				return oHeaderObject;
			},

			/** 
			 * 
			 * @returns
			 */
			getHeaderObject: function (sRequestType) {
				var model = this,
					getGenericFunctions = function (defaultValue) {
						return this._getGenericFunctions(model, defaultValue);
					}.bind(this);
				return {
					"Bukrs": getGenericFunctions(""), //"",
					"Belnr": getGenericFunctions(""), //"",
					"Gjahr": getGenericFunctions(""), //"",
					"Blart": getGenericFunctions(sRequestType === "FBS1" ? "SB" : "SA"), //"",
					"Bldat": getGenericFunctions(new Date()), //null,
					"Budat": getGenericFunctions(new Date()), //null,
					"Monat": getGenericFunctions(""), //"",
					"Wwert": getGenericFunctions(new Date()), //null,
					"Usnam": "", //use user api after testing
					"Xblnr": getGenericFunctions(""), //"",
					"Bktxt": getGenericFunctions(""), //"",
					"Waers": getGenericFunctions(""), //"",
					"Kursf": getGenericFunctions("0.000"), //"0.000",
					"Ldgrp": getGenericFunctions(""), //"",
					"Pargb": getGenericFunctions(""), //"",
					"Message": getGenericFunctions(""), //"",
					"Objid": getGenericFunctions(""), //"",
					"WorkCenter": getGenericFunctions(""),
					get itemsCount() {
						return this.FinsGLDocumentHeaderToItemNvg.length;
					},
					get TotalDebit() {
						var fTotalDebit = 0.000;
						if (this.FinsGLDocumentHeaderToItemNvg.length > 0) {
							this.FinsGLDocumentHeaderToItemNvg.forEach(function (oItem) {
								fTotalDebit = fTotalDebit + (parseFloat(oItem.Wrsol.value) ? parseFloat(oItem.Wrsol.value) : 0.000);
							}, this);
							return fTotalDebit.toFixed(3);
						} else {
							return "0.000";
						}
					},
					get TotalCredit() {
						var fTotalCredit = 0.000;
						if (this.FinsGLDocumentHeaderToItemNvg.length > 0) {
							this.FinsGLDocumentHeaderToItemNvg.forEach(function (oItem) {
								fTotalCredit = fTotalCredit + (parseFloat(oItem.Wrhab.value) ? parseFloat(oItem.Wrhab.value) : 0.000);
							}, this);
							return fTotalCredit.toFixed(3);
						} else {
							return "0.000";
						}
					},
					"FinsDocHeaderToApproverNvg": [],
					"FinsGLDocumentHeaderToItemNvg": []
				};
			},

			/** 
			 * 
			 * @returns
			 */
			getHeaderObjectForAccrual: function (sRequestType) {
				var model = this,
					getGenericFunctions = function (defaultValue) {
						return this._getGenericFunctions(model, defaultValue);
					}.bind(this);
				return {
					"Bukrs": getGenericFunctions(""), //"",
					"Belnr": getGenericFunctions(""), //"",
					"Gjahr": getGenericFunctions(""), //"",
					"Blart": getGenericFunctions(sRequestType === "FBS1" ? "SB" : "SA"), //"",
					"Bldat": getGenericFunctions(new Date()), //null,
					"Budat": getGenericFunctions(new Date()), //null,
					"Monat": getGenericFunctions(""), //"",
					"Wwert": getGenericFunctions(new Date()), //null,
					"Usnam": "", //use user api after testing
					"Xblnr": getGenericFunctions(""), //"",
					"Bktxt": getGenericFunctions(""), //"",
					"Waers": getGenericFunctions(""), //"",
					"Kursf": getGenericFunctions("0.000"), //"0.000",
					"Ldgrp": getGenericFunctions(""), //"",
					"Pargb": getGenericFunctions(""), //"",
					"Stgrd": getGenericFunctions(""), //"",
					"Stodt": getGenericFunctions(new Date()), //"",
					"Message": getGenericFunctions(""), //"",
					"Action": getGenericFunctions(""), //"",
					"Objid": getGenericFunctions(""), //"",
					"WorkCenter": getGenericFunctions(""),
					get itemsCount() {
						return this.FinsGLDocumentHeaderToItemNvg.length;
					},
					get TotalDebit() {
						var fTotalDebit = 0.000;
						if (this.FinsGLDocumentHeaderToItemNvg.length > 0) {
							this.FinsGLDocumentHeaderToItemNvg.forEach(function (oItem) {
								fTotalDebit = fTotalDebit + (parseFloat(oItem.Wrsol.value) ? parseFloat(oItem.Wrsol.value) : 0.000);
							}, this);
							return fTotalDebit.toFixed(3);
						} else {
							return "0.000";
						}
					},
					get TotalCredit() {
						var fTotalCredit = 0.000;
						if (this.FinsGLDocumentHeaderToItemNvg.length > 0) {
							this.FinsGLDocumentHeaderToItemNvg.forEach(function (oItem) {
								fTotalCredit = fTotalCredit + (parseFloat(oItem.Wrhab.value) ? parseFloat(oItem.Wrhab.value) : 0.000);
							}, this);
							return fTotalCredit.toFixed(3);
						} else {
							return "0.000";
						}
					},
					"FinsDocHeaderToApproverNvg": [],
					"FinsGLDocumentHeaderToItemNvg": []
				};
			},

			/** 
			 * 
			 * @returns
			 */
			getHeaderObjectForRecurring: function (sRequestType) {
				var model = this,
					getGenericFunctions = function (defaultValue) {
						return this._getGenericFunctions(model, defaultValue);
					}.bind(this);
				return {
					"Bukrs": getGenericFunctions(""), //"",
					"Belnr": getGenericFunctions(""), //"",
					"Gjahr": getGenericFunctions(""), //"",
					"Blart": getGenericFunctions(sRequestType === "FBS1" ? "SB" : "SA"), //"",
					"Bldat": getGenericFunctions(new Date()), //null,
					"Budat": getGenericFunctions(new Date()), //null,
					"Monat": getGenericFunctions(""), //"",
					"Wwert": getGenericFunctions(new Date()), //null,
					"Usnam": "", //use user api after testing
					"Xblnr": getGenericFunctions(""), //"",
					"Bktxt": getGenericFunctions(""), //"",
					"Waers": getGenericFunctions(""), //"",
					"Kursf": getGenericFunctions("0.000"), //"0.000",
					"Ldgrp": getGenericFunctions(""), //"",
					"Pargb": getGenericFunctions(""), //"",
					"Message": getGenericFunctions(""), //"",
					"WorkCenter": getGenericFunctions(""),
					"Objid": getGenericFunctions(""), //"",
					"Dbtag": getGenericFunctions(""),
					"Dbakz": getGenericFunctions(""),
					"Dbmon": getGenericFunctions(""),
					"Dbbdt": getGenericFunctions(null),
					"Dbedt": getGenericFunctions(null),
					get itemsCount() {
						return this.FinsGLDocumentHeaderToItemNvg.length;
					},
					get TotalDebit() {
						var fTotalDebit = 0.000;
						if (this.FinsGLDocumentHeaderToItemNvg.length > 0) {
							this.FinsGLDocumentHeaderToItemNvg.forEach(function (oItem) {
								fTotalDebit = fTotalDebit + (parseFloat(oItem.Wrsol.value) ? parseFloat(oItem.Wrsol.value) : 0.000);
							}, this);
							return fTotalDebit.toFixed(3);
						} else {
							return "0.000";
						}
					},
					get TotalCredit() {
						var fTotalCredit = 0.000;
						if (this.FinsGLDocumentHeaderToItemNvg.length > 0) {
							this.FinsGLDocumentHeaderToItemNvg.forEach(function (oItem) {
								fTotalCredit = fTotalCredit + (parseFloat(oItem.Wrhab.value) ? parseFloat(oItem.Wrhab.value) : 0.000);
							}, this);
							return fTotalCredit.toFixed(3);
						} else {
							return "0.000";
						}
					},
					"FinsDocHeaderToApproverNvg": [],
					"FinsGLDocumentHeaderToItemNvg": []
				};
			},

			/** 
			 * 
			 * @param sLineItemNumber
			 * @returns
			 */
			getItemObject: function (sLineItemNumber) {
				var model = this,
					getGenericFunctions = function (defaultValue) {
						return this._getGenericFunctions(model, defaultValue);
					}.bind(this);
				return {
					"bExpand": false,
					"highlight": "Success",
					"Bukrs": getGenericFunctions(""), //"",
					"Belnr": getGenericFunctions(""), //"",
					"Gjahr": getGenericFunctions(""), //"",
					"Buzei": "", //Auto generated indexes in the form of 001, 002 etc
					"Hkont": getGenericFunctions(""), //"",
					"Sgtxt": getGenericFunctions(""), //"",
					"PstngKey": "50",
					"Wrsol": getGenericFunctions("0.000"), //"0.000",
					"Wrhab": getGenericFunctions("0.000"), //"0.000",
					"Dmbtr": getGenericFunctions("0.000"), //"0.000",
					"Dmbe2": getGenericFunctions("0.000"), //"0.000",
					"Mwskz": getGenericFunctions(""), //"",
					"Txjcd": getGenericFunctions(""), //"",
					"Kostl": getGenericFunctions(""), //"",
					"Prctr": getGenericFunctions(""), //"",
					"Aufnr": getGenericFunctions(""), //"",
					"Pspnr": getGenericFunctions(""), //"",
					"Valut": getGenericFunctions(new Date()), //null,
					"Hbkid": getGenericFunctions(""), //"",
					"Hktid": getGenericFunctions(""), //"",
					"Zounr": getGenericFunctions(""), //"",
					"Vbund": getGenericFunctions("")
				};
			},

			/**
			 * This function gets all the generic functions available
			 * @param {Object} model Current Object
			 * @return {Object} Return Getter Setter method
			 */
			_getGenericFunctions: function (model, defaultValue, bVisible) {
				return {
					_value: defaultValue,
					_valueState: "None",
					_valueStateText: "",
					get value() {
						return this._value;
					},
					set value(sValue) {
						this._value = sValue;
					},
					set valueState(sValueState) {
						this._valueState = sValueState;
					},
					get valueState() {
						return this._valueState;
					},
					set valueStateText(sValueStateText) {
						this._valueStateText = sValueStateText;
					},
					get valueStateText() {
						return this._valueStateText;
					},
					get visible() {
						return bVisible; //model.getFieldVisible();
					}
				};
			},

			/** 
			 * 
			 * @returns
			 */
			getPayloadData: function (sRequestType) {
				var oModelData = this.getProperty("/HeaderData"),
					aAttachmentData = this.getProperty("/attachments/attachmentList"),
					oPayloadData = {};

				if ((Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.F05) ||
					(Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.F02)) {
					oPayloadData = this._getHeaderPayload();
					oPayloadData.FinsDocHeaderToApproverNvg = oModelData.FinsDocHeaderToApproverNvg;
					oPayloadData.FinsGLDocumentHeaderToItemNvg = this._getItemPayload(oModelData.FinsGLDocumentHeaderToItemNvg);
					oPayloadData.FinsGLDocHeaderToAttachmentNvg = this._getAttachmentPayload(aAttachmentData);
				} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBS1) {
					oPayloadData = this._getHeaderPayloadAccrual();
					oPayloadData.FinsAccDocHeaderToApproverNvg = oModelData.FinsDocHeaderToApproverNvg;
					oPayloadData.FinsAccrualDocHeaderToItemNvg = this._getItemPayload(oModelData.FinsGLDocumentHeaderToItemNvg);
					oPayloadData.FinsAccDocHdrToAttachmentNvg = this._getAttachmentPayload(aAttachmentData);
				} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBD1) {
					oPayloadData = this._getHeaderPayloadRecurring();
					oPayloadData.FinsRecrDocHeaderToApproverNvg = oModelData.FinsDocHeaderToApproverNvg;
					oPayloadData.FinsRecrDocHeaderToItemNvg = this._getItemPayload(oModelData.FinsGLDocumentHeaderToItemNvg);
					oPayloadData.FinsRecrDocHdrToAttachmentNvg = this._getAttachmentPayload(aAttachmentData);
				}
				return oPayloadData;
			},

			/** 
			 * 
			 * @constructor 
			 * @returns
			 */
			_getHeaderPayload: function () {
				var oModelData = this.getProperty("/HeaderData"),
					oModel = this;
				return {
					Bukrs: oModelData.Bukrs.value,
					Belnr: oModelData.Belnr.value,
					Gjahr: oModelData.Gjahr.value,
					Blart: oModelData.Blart.value,
					Bldat: oModelData.Bldat.value,
					Budat: oModelData.Budat.value,
					Monat: oModelData.Monat.value,
					Wwert: oModelData.Wwert.value,
					Usnam: oModelData.Usnam.value,
					Xblnr: "By_JV_Tool", //oModelData.Xblnr.value,
					Bktxt: (oModelData.Bktxt.value).substring(0, 25),
					Waers: oModelData.Waers.value,
					Kursf: oModelData.Kursf.value ? oModelData.Kursf.value : "0.000",
					Ldgrp: oModelData.Ldgrp.value,
					Pargb: oModelData.Pargb.value,
					Message: oModelData.Message.value,
					WorkCenter: oModelData.WorkCenter.value,
					Objid: oModelData.Objid.value,
					JvType: oModel.getProperty("/RequestType") === "F02" ? "S" : "F"
				};
			},

			/** 
			 * 
			 * @constructor 
			 * @returns
			 */
			_getHeaderPayloadAccrual: function () {
				var oModelData = this.getProperty("/HeaderData");
				return {
					Bukrs: oModelData.Bukrs.value,
					Belnr: oModelData.Belnr.value,
					Gjahr: oModelData.Gjahr.value,
					Blart: oModelData.Blart.value,
					Bldat: oModelData.Bldat.value,
					Budat: oModelData.Budat.value,
					Monat: oModelData.Monat.value,
					Wwert: oModelData.Wwert.value,
					Usnam: oModelData.Usnam.value,
					Xblnr: "By_JV_Tool", //oModelData.Xblnr.value,
					Bktxt: (oModelData.Bktxt.value).substring(0, 25),
					Waers: oModelData.Waers.value,
					Kursf: oModelData.Kursf.value ? oModelData.Kursf.value : "0.000",
					Ldgrp: oModelData.Ldgrp.value,
					Pargb: oModelData.Pargb.value,
					Message: oModelData.Message.value,
					WorkCenter: oModelData.WorkCenter.value,
					Objid: oModelData.Objid.value,
					Stgrd: oModelData.Stgrd.value,
					Stodt: oModelData.Stodt.value
				};
			},

			/** 
			 * 
			 * @constructor 
			 * @returns
			 */
			_getHeaderPayloadRecurring: function () {
				var oModelData = this.getProperty("/HeaderData");
				return {
					Bukrs: oModelData.Bukrs.value,
					Belnr: oModelData.Belnr.value,
					Gjahr: oModelData.Gjahr.value,
					Blart: oModelData.Blart.value,
					Wwert: oModelData.Wwert.value,
					Usnam: oModelData.Usnam.value,
					Xblnr: "By_JV_Tool", //oModelData.Xblnr.value,
					Bktxt: (oModelData.Bktxt.value).substring(0, 25),
					Waers: oModelData.Waers.value,
					Kursf: oModelData.Kursf.value ? oModelData.Kursf.value : "0.000",
					Ldgrp: oModelData.Ldgrp.value,
					Pargb: oModelData.Pargb.value,
					Message: oModelData.Message.value,
					WorkCenter: oModelData.WorkCenter.value,
					Objid: oModelData.Objid.value,
					Dbtag: oModelData.Dbtag.value,
					Dbakz: oModelData.Dbakz.value,
					Dbmon: oModelData.Dbmon.value,
					Dbbdt: oModelData.Dbbdt.value,
					Dbedt: oModelData.Dbedt.value
				};
			},

			/** 
			 * 
			 * @param aItemList
			 * @returns
			 */
			_getItemPayload: function (aItemList) {
				return aItemList.map(function (oItem) {
					return {
						Buzei: oItem.Buzei.value ? oItem.Buzei.value : "",
						Hkont: oItem.Hkont.value ? oItem.Hkont.value : "",
						Sgtxt: oItem.Sgtxt.value ? oItem.Sgtxt.value : "",
						Wrsol: oItem.Wrsol.value ? oItem.Wrsol.value : "0.000",
						Wrhab: oItem.Wrhab.value ? oItem.Wrhab.value : "0.000",
						Dmbtr: oItem.Dmbtr.value ? oItem.Dmbtr.value : "0.000",
						Dmbe2: oItem.Dmbe2.value ? oItem.Dmbe2.value : "0.000",
						Mwskz: oItem.Mwskz.value ? oItem.Mwskz.value : "",
						Txjcd: oItem.Txjcd.value ? oItem.Txjcd.value : "",
						Kostl: oItem.Kostl.value ? oItem.Kostl.value : "",
						Prctr: oItem.Prctr.value ? oItem.Prctr.value : "",
						Aufnr: oItem.Aufnr.value ? oItem.Aufnr.value : "",
						Pspnr: oItem.Pspnr.value ? oItem.Pspnr.value : "",
						Valut: oItem.Valut.value,
						PstngKey: oItem.PstngKey,
						Hbkid: oItem.Hbkid.value ? oItem.Hbkid.value : "",
						Hktid: oItem.Hktid.value ? oItem.Hktid.value : "",
						Zounr: oItem.Zounr.value ? oItem.Zounr.value : "",
						Vbund: oItem.Vbund.value ? oItem.Vbund.value : ""
					};
				});
			},

			/** 
			 * 
			 * @param aItemList
			 * @returns
			 */
			_getItemPayloadExportDraft: function (aItemList) {
				return aItemList.map(function (oItem) {
					return {
						Buzei: oItem.Buzei.value ? oItem.Buzei.value : "",
						Hkont: oItem.Hkont.value ? oItem.Hkont.value : "",
						Sgtxt: oItem.Sgtxt.value ? oItem.Sgtxt.value : "",
						PstngKey: oItem.PstngKey,
						Amount: oItem.PstngKey === "40" ? oItem.Wrsol.value : oItem.Wrhab.value,
						Dmbtr: oItem.Dmbtr.value ? oItem.Dmbtr.value : "0.000",
						Dmbe2: oItem.Dmbe2.value ? oItem.Dmbe2.value : "0.000",
						Mwskz: oItem.Mwskz.value ? oItem.Mwskz.value : "",
						Txjcd: oItem.Txjcd.value ? oItem.Txjcd.value : "",
						Kostl: oItem.Kostl.value ? oItem.Kostl.value : "",
						Prctr: oItem.Prctr.value ? oItem.Prctr.value : "",
						Aufnr: oItem.Aufnr.value ? oItem.Aufnr.value : "",
						Pspnr: oItem.Pspnr.value ? oItem.Pspnr.value : "",
						Valut: oItem.Valut.value,
						Hbkid: oItem.Hbkid.value ? oItem.Hbkid.value : "",
						Hktid: oItem.Hktid.value ? oItem.Hktid.value : "",
						Zounr: oItem.Zounr.value ? oItem.Zounr.value : "",
						Vbund: oItem.Vbund.value ? oItem.Vbund.value : ""
					};
				});
			},

			/** 
			 * 
			 * @constructor 
			 * @param aList
			 * @returns
			 */
			_getAttachmentPayload: function (aList) {
				return aList.map(function (oItem) {
					return {
						Bukrs: oItem.Bukrs,
						Belnr: oItem.Belnr,
						Gjahr: oItem.Gjahr,
						DocId: oItem.DocId,
						ArObject: oItem.ArObject,
						Objdes: oItem.Filename
					};
				});
			},

			/** 
			 * 
			 * @returns
			 */
			getDraftDownloadData: function () {
				var oModelData = this.getProperty("/HeaderData"),
					sRequestType = this.getProperty("/RequestType"),
					oHeaderPayload = {},
					aItemPayload = this._getItemPayloadExportDraft(oModelData.FinsGLDocumentHeaderToItemNvg),
					aDraftData = [];

				if ((Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.F05) ||
					(Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.F02)) {
					oHeaderPayload = this._getHeaderPayload();
				} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBS1) {
					oHeaderPayload = this._getHeaderPayloadAccrual();
				} else if (Configuration.REQUEST_TYPE_TEXT[sRequestType] === Configuration.REQUEST_TYPE_TEXT.FBD1) {
					oHeaderPayload = this._getHeaderPayloadRecurring();
				}
				oHeaderPayload.Objid = this.getProperty("/WorkCenter");
				aItemPayload.forEach(function (oItemPayload) {
					var tempObj = {};
					aDraftData.push(jQuery.sap.extend(tempObj, oHeaderPayload, oItemPayload));
				});

				return aDraftData;

			},

			/*************************************************************************
			 * Setter
			 *************************************************************************/
			/** 
			 * 
			 * @param oData
			 */
			setCompanyCodeDataInModel: function (oData) {
				this.setProperty("/dialogBusy", false);
				if (oData && oData.results) {
					this.setProperty("/CompanyCodeSet", oData.results);
				}
			},

			/** 
			 * 
			 * @param oData
			 */
			setGLAccountDataInModel: function (oData) {
				this.setProperty("/dialogBusy", false);
				if (oData && oData.results) {
					this.setProperty("/GLAccountSet", oData.results);
				}
			},

			/** 
			 * 
			 * @param oData
			 */
			setTaxCodeDataInModel: function (oData) {
				this.setProperty("/dialogBusy", false);
				if (oData && oData.results) {
					this.setProperty("/TaxCodeSet", oData.results);
				}
			},

			/** 
			 * 
			 * @param oData
			 */
			setCostCenterDataInModel: function (oData) {
				this.setProperty("/dialogBusy", false);
				if (oData && oData.results) {
					this.setProperty("/CostCenterSet", oData.results);
				}
			},

			/** 
			 * 
			 * @param oData
			 */
			setProfitCenterDataInModel: function (oData) {
				this.setProperty("/dialogBusy", false);
				if (oData && oData.results) {
					this.setProperty("/ProfitCenterSet", oData.results);
				}
			},

			/** 
			 * 
			 * @param oData
			 */
			setFiscalPeriodInModel: function (oData) {
				if (oData && oData.Monat) {
					this.setProperty("/HeaderData/Monat/value", oData.Monat);
				}
			},

			/** 
			 * 
			 * @param oData
			 */
			setCurrencyKeyDataInModel: function (oData) {
				this.setProperty("/dialogBusy", false);
				if (oData && oData.results) {
					this.setProperty("/CurrencyKeySet", oData.results);
				}
			},

			/** 
			 * 
			 * @param oData
			 */
			setLedgerGroupDataInModel: function (oData) {
				this.setProperty("/dialogBusy", false);
				if (oData && oData.results) {
					oData.results.unshift({
						"Ldgrp": "",
						"Name": "All"
					});
					this.setProperty("/LedgerGroupSet", oData.results);
				}
			},

			/** 
			 * 
			 * @param oData
			 */
			setWorkCenterInModel: function (oData) {
				// this.setProperty("/dialogBusy", false);
				if (oData && oData.results) {
					this.setProperty("/ApprovalWorkCenterSet", oData.results);
				}
			},
			/*************************************************************************
			 * Promises
			 *************************************************************************/

			/** 
			 * 
			 * @param oDataModel
			 * @param oParameters
			 * @returns
			 */
			whenCompanyCodeDataLoaded: function (oDataModel, oParameters) {
				return ODataUtil.whenReadDone(oDataModel, "/CompanyCodeSet", oParameters);
			},

			/** 
			 * 
			 * @param oDataModel
			 * @param oObject
			 * @param oParameters
			 * @returns
			 */
			whenDocumentDataPosted: function (sEntity, oDataModel, oObject, oParameters) {
				return ODataUtil.whenCreateDone(oDataModel, sEntity, oObject, oParameters);
			},

			/** 
			 * 
			 * @param oDataModel
			 * @param oParameters
			 * @returns
			 */
			whenGLAccountDataLoaded: function (oDataModel, oParameters) {
				return ODataUtil.whenReadDone(oDataModel, "/GLAccountSet", oParameters);
			},

			/** 
			 * 
			 * @param oDataModel
			 * @param oParameters
			 * @returns
			 */
			whenTaxCodeDataLoaded: function (oDataModel, oParameters) {
				return ODataUtil.whenReadDone(oDataModel, "/TaxCodeSet", oParameters);
			},

			/** 
			 * 
			 * @param oDataModel
			 * @returns
			 */
			whenLedgerGroupDataLoaded: function (oDataModel) {
				return ODataUtil.whenReadDone(oDataModel, "/LedgerGroupSet", {});
			},

			/** 
			 * 
			 * @param oDataModel
			 * @param oParameters
			 * @returns
			 */
			whenCostCenterDataLoaded: function (oDataModel, oParameters) {
				return ODataUtil.whenReadDone(oDataModel, "/CostCenterSet", oParameters);
			},

			/** 
			 * 
			 * @param oDataModel
			 * @param oParameters
			 * @returns
			 */
			whenProfitCenterDataLoaded: function (oDataModel, oParameters) {
				return ODataUtil.whenReadDone(oDataModel, "/ProfitCenterSet", oParameters);
			},

			/** 
			 * 
			 * @param sUrl
			 * @param oPostData
			 * @returns
			 */
			whenWorkFlowDataPosted: function (sUrl, oPostData) {
				return ODataUtil.whenAjaxPosted(sUrl, oPostData);
			},

			/** 
			 * 
			 * @param oDataModel
			 * @param oParameters
			 * @returns
			 */
			whenFiscalPeriodLoaded: function (oDataModel, oParameters) {
				var sPath = oDataModel.createKey("/FinsFiscalPeriodSet", {
					"Bukrs": this.getProperty("/HeaderData/Bukrs/value"),
					"Budat": this.getProperty("/HeaderData/Budat/value")
				});
				return ODataUtil.whenReadDone(oDataModel, sPath);
			},

			/** 
			 * 
			 * @param oDataModel
			 * @param oParameters
			 * @returns
			 */
			whenCurrecnyKeyDataLoaded: function (oDataModel, oParameters) {
				return ODataUtil.whenReadDone(oDataModel, "/CurrencyKeySet", oParameters);
			},

			/** 
			 * 
			 * @param oDataModel
			 * @returns
			 */
			whenAttachmentTypesLoaded: function (oDataModel) {
				return ODataUtil.whenReadDone(oDataModel, "/FinsDocAttachmentTypeSet");
			},

			/** 
			 * 
			 * @param oDataModel
			 * @returns
			 */
			whenWorkCenterLoaded: function (oDataModel) {
				return ODataUtil.whenReadDone(oDataModel, "/ApprovalWorkCenterSet");
			}

		});
	}
);