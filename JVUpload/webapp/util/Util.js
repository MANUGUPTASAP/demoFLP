sap.ui.define([
		"sap/ui/core/format/DateFormat",
		"com/sap/colacolaCocaCola/util/Configuration",
		"sap/ui/core/util/Export",
		"sap/ui/core/util/ExportTypeCSV",
		"sap/m/MessageBox",
		"com/sap/colacolaCocaCola/model/oI18nModel"
	],
	function (DateFormat, Configuration, Export, ExportTypeCSV, MessageBox, oI18nModel) {
		"use strict";

		var Util = {

			/**
			 * This function checks if the date is in future
			 * @param  {Object}  oDate Date Object
			 * @return {Boolean}       [description]
			 */
			isFutureDate: function (oDate) {
				if (oDate) {
					var oTodayDate = new Date(),
						oClonedDate = new Date(oDate.getTime());

					oTodayDate.setHours(0, 0, 0, 0);
					oClonedDate.setHours(0, 0, 0, 0);

					if (oClonedDate.getTime() > oTodayDate.getTime()) {
						return true;
					} else {
						return false;
					}
				}

				return true;
			},

			/**
			 * Checks if the current date is in range
			 * @param  {Object}  oFromDate From Date
			 * @param  {Object}  oToDate   To Date
			 * @return {Boolean}           true/false
			 */
			isCurrentDateInRange: function (oFromDate, oToDate) {
				if (oFromDate && oToDate) {
					var oCloneFromDate = new Date(oFromDate.getTime()),
						oCloneToDate = new Date(oToDate.getTime()),
						oTodayDate = new Date();

					oCloneFromDate.setHours(0, 0, 0, 0);
					oCloneToDate.setHours(0, 0, 0, 0);
					oTodayDate.setHours(0, 0, 0, 0);

					return (oCloneFromDate <= oTodayDate && oTodayDate <= oCloneToDate);
				} else {
					return false;
				}
			},

			/**
			 * This function checks if first date is after second date
			 * @param  {Object}  oDate1 first date
			 * @param  {Object}  oDate2 second date
			 * @return {Boolean} true if first date is after second date
			 */
			isDate1MoreThanDate2: function (oDate1, oDate2) {
				if (oDate1 && oDate2) {
					var oCloneDate1 = new Date(oDate1.getTime()),
						oCloneDate2 = new Date(oDate2.getTime());

					oCloneDate1.setHours(0, 0, 0, 0);
					oCloneDate2.setHours(0, 0, 0, 0);

					if (oCloneDate1.getTime() > oCloneDate2.getTime()) {
						return true;
					} else {
						return false;
					}
				}

				return false;
			},

			/**
			 * This function gets the infinity date
			 * @return {Object} Date Object
			 */
			getInfinityDate: function () {
				var oDate = new Date();
				oDate.setFullYear(9999, 11, 31);
				return this.getUTCDate(oDate);
			},

			/**
			 * Function called to check if the dates are equal
			 * @param  {Object} oFirstDate  First Date
			 * @param  {Object} oSecondDate Second Date
			 * @return {Object}             Min Date
			 */
			isDateEqual: function (oFirstDate, oSecondDate) {
				var oCloneFirstDate,
					oCloneSecDate;

				if (!oFirstDate || !oSecondDate) {
					return false;
				}

				oCloneFirstDate = this.getOnlyDate(oFirstDate);
				oCloneSecDate = this.getOnlyDate(oSecondDate);

				return (oCloneFirstDate.getTime() === oCloneSecDate.getTime());
			},

			/**
			 * Checks if the date is in range
			 * @param {Object} oDate Date
			 * @param  {Object}  oFromDate From Date
			 * @param  {Object}  oToDate   To Date
			 * @return {Boolean}           true/false
			 */
			isDateInRange: function (oDate, oFromDate, oToDate) {
				if (oDate && oFromDate && oToDate) {
					var oCloneFromDate = new Date(oFromDate.getTime()),
						oCloneToDate = new Date(oToDate.getTime()),
						oCloneDate = new Date(oDate.getTime());

					oCloneFromDate.setHours(0, 0, 0, 0);
					oCloneToDate.setHours(0, 0, 0, 0);
					oCloneDate.setHours(0, 0, 0, 0);

					return (oCloneFromDate <= oCloneDate && oCloneDate <= oCloneToDate);
				} else {
					return false;
				}
			},

			/**
			 * Function called to remove the leading zero
			 * @param  {String} sValue Value
			 * @return {String}        Value without leading zero
			 */
			removeLeadingZero: function (sValue) {
				if (sValue) {
					return sValue.replace(/^0+/, "");
				}
				return sValue;
			},

			/**
			 * This function return 1 day before date
			 * @param  {Object} oDate Date Object
			 * @return {Object}       One day before date
			 */
			getOneDayBefore: function (oDate) {
				if (oDate) {
					var oNewDate = new Date(oDate.getTime());
					oNewDate.setDate(oDate.getDate() - 1);
					return this.getUTCDate(oNewDate);
				}

				return null;
			},

			/**
			 * This function return 1 day before date
			 * @param  {Object} oDate Date Object
			 * @param {boolean} bNonUTC should be true if UTC conversion should not be done
			 * @return {Object}       One day before date
			 */
			getNextDay: function (oDate, bNonUTC) {
				if (oDate) {
					var oNewDate = new Date(oDate.getTime());
					oNewDate.setDate(oDate.getDate() + 1);
					if (!bNonUTC) {
						return this.getUTCDate(oNewDate);
					} else {
						return oNewDate;
					}
				}
				return null;
			},

			/**
			 * Function called to get the MinDate
			 * @param  {Object} oDate Date Object
			 * @return {Object}       Min Date
			 */
			getMinDate: function (oDate) {
				var oNextDate = this.getNextDay(oDate, true),
					oTodayDate = new Date();

				oNextDate.setHours(0, 0, 0, 0);
				oTodayDate.setHours(0, 0, 0, 0);

				if (oNextDate.getTime() < oTodayDate.getTime()) {
					return oTodayDate;
				} else {
					return oNextDate;
				}
			},

			/**
			 * Function called to get the actual date
			 * @param  {Object} oDate Date Object
			 * @return {Object}       Actual Date
			 */
			getOnlyDate: function (oDate) {
				var date = null;

				if (oDate) {
					date = new Date(oDate.getTime());
					date.setHours(0, 0, 0, 0);
				}

				return date;
			},

			/**
			 * Function called to get the mindate between the two
			 * @param  {Object} oFirstDate  First Date
			 * @param  {Object} oSecondDate Second Date
			 * @return {Object}             Min Date
			 */
			compareMinDate: function (oFirstDate, oSecondDate) {
				var oDate1 = this.getOnlyDate(oFirstDate),
					oDate2 = this.getOnlyDate(oSecondDate);

				if (oDate1 < oDate2) {
					return oFirstDate;
				} else {
					return oSecondDate;
				}
			},

			/**
			 * Function called to get the maxdate between the two
			 * @param  {Object} oFirstDate  First Date
			 * @param  {Object} oSecondDate Second Date
			 * @return {Object}             Min Date
			 */
			compareMaxDate: function (oFirstDate, oSecondDate) {
				var oDate1,
					oDate2;

				if (!oFirstDate) {
					return oSecondDate;
				} else if (!oSecondDate) {
					return oFirstDate;
				}

				oDate1 = this.getOnlyDate(oFirstDate);
				oDate2 = this.getOnlyDate(oSecondDate);

				if (oDate1 > oDate2) {
					return oFirstDate;
				} else {
					return oSecondDate;
				}
			},

			/**
			 * Function called to remove the wild character
			 * @param  {String} sValue String Value
			 * @return {String}        String without wild character
			 */
			removeWildCharacter: function (sValue) {
				return this.trimValue(sValue).replace(/[*]/gi, "");
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
			 * This function formats the Date
			 * @param  {Object} oDate Date Object
			 * @return {String}       Formatter String
			 */
			getShortFormatDate: function (oDate) {
				var oFormat = DateFormat.getDateInstance({
						style: "short"
					}),
					sDate = oFormat.format(oDate);

				return sDate;
			},

			/**
			 * This function formats the Date
			 * @param  {Object} oDate Date Object
			 * @return {String}       Formatter String
			 */
			getFormatDateString: function (oDate) {
				var oFormat = DateFormat.getDateInstance({
						style: "long",
						pattern: "yyyyMMddHHmmss"
					}),
					sDate = oFormat.format(oDate);

				return sDate;
			},

			/**
			 * This function return the decimal value
			 * @param  {String} sValue is decimal value in string
			 * @return {Object}       One day before date
			 */
			getDecimalPayload: function (sValue) {
				if (String(sValue).length > 0 && parseFloat(sValue, 10) > 0) {
					var numberValue = parseFloat(sValue, 10),
						stringvalue = String(sValue);

					if ((stringvalue.indexOf(".") > -1) && (stringvalue.length > 2) && !isNaN(numberValue)) {
						// Do not format unless we have a value in the format "?.*"
						return numberValue === 0 ? "" : sValue;
					}
					return sValue;
				}
				return "0.0";
			},

			/**
			 * Function checks if from date is before to date
			 * @param  {Object}  oFromDate From Date
			 * @param  {Object}  oToDate   To Date
			 * @return {Boolean}           true/false
			 */
			isFromDateBeforeToDate: function (oFromDate, oToDate) {
				var oCloneFrom = new Date(oFromDate.getTime()),
					oCloneTo = new Date(oToDate.getTime());

				oCloneFrom.setHours(0, 0, 0, 0);
				oCloneTo.setHours(0, 0, 0, 0);

				return (oCloneFrom < oCloneTo);
			},

			/**
			 * Function checks if from date is before and equal to date
			 * @param  {Object}  oFromDate From Date
			 * @param  {Object}  oToDate   To Date
			 * @return {Boolean}           true/false
			 */
			isFromDateBeforeAndEqualToDate: function (oFromDate, oToDate) {
				var oCloneFrom = new Date(oFromDate.getTime()),
					oCloneTo = new Date(oToDate.getTime());

				oCloneFrom.setHours(0, 0, 0, 0);
				oCloneTo.setHours(0, 0, 0, 0);

				return (oCloneFrom <= oCloneTo);
			},

			/**
			 * Function checks if to date is before and equal to current date
			 * @param  {Object}  oToDate To Date
			 * @return {Boolean}  true/false
			 */
			isToDateBeforeCurrentDate: function (oToDate) {
				var oCloneTo = new Date(oToDate.getTime()),
					oCurrentDate = this.getUTCDate(new Date());

				oCloneTo.setHours(0, 0, 0, 0);
				oCurrentDate.setHours(0, 0, 0, 0);

				return (oCloneTo < oCurrentDate);
			},

			/**
			 * Returns UTC value of the daye
			 * @param {Date} oDate is the date to be converted
			 * @returns {Date} date converted to UTC
			 */
			getUTCDate: function (oDate) {
				// the input may not be in UTC. We want to use the date part of the input only
				// and create a UTC value of it. This problem comes when the DatePicker
				// does not give UTC date-time on selection through the getDateValue function.
				if (oDate) {
					return (new Date(Date.UTC(
						oDate.getFullYear(),
						oDate.getMonth(),
						oDate.getDate()
					)));
				}

				return oDate;
			},

			/**
			 * Provides the Excel download configuration
			 * @param {object} config containing columns, path and fileName
			 * @param {object} exportModel is model containing data for download
			 * @param {object} i18n resource model
			 * @returns {object} download configuration.
			 */
			getDownloadConfig: function (config, exportModel, i18n) {
				var fileName = config.fileName,
					columns;

				columns = config.columns.map(function (column) {
					if (column.nameI18nKey) {
						column.name = i18n.getText(column.nameI18nKey);
					} else {
						column.name = column.nameI18nKey;
					}
					return column;
				});

				return {
					model: exportModel,
					path: config.path,
					columns: columns,
					fileName: fileName
				};
			},

			/** 
			 * 
			 * @param oFutureDate
			 * @param oCurrDate
			 * @returns
			 */
			getISO8601StringFromDates: function (oFutureDate, oCurrDate) {
				// var sIsoString = "";
				var delta = Math.abs(oFutureDate - oCurrDate) / 1000;

				// calculate (and subtract) whole days
				var days = Math.floor(delta / 86400);
				delta -= days * 86400;

				// calculate (and subtract) whole hours
				var hours = Math.floor(delta / 3600) % 24;
				delta -= hours * 3600;

				// calculate (and subtract) whole minutes
				var minutes = Math.floor(delta / 60) % 60;
				delta -= minutes * 60;

				// what's left is seconds
				// var seconds = delta % 60; // in theory the modulus is not required
				// 47.580000000001746

				return "P" + days + "DT" + hours + "H" + minutes + "M";
			},

			/**
			 * CSV Export Utility method
			 * @param {object} model to export data from
			 * @param {string} path of the rows to be exported
			 * @param {array} columns configuration. Each item in this array follows the
			 *  following structure
			 *  {
			 *    name: <column header:string>,
			 *    template: {
			 *      content: {
			 *        path: <path to cell data in the context of row:string>
			 *      }
			 *    }
			 *  }
			 * @param {string} fileName is the name with which to save the file with
			 */
			exportAsCommaSeparatedSheet: function (model, path, columns, fileName) {
				var exporter,
					fileNameToSave = fileName || "data";

				if (model && path && columns) {
					exporter = new Export({
						exportType: new ExportTypeCSV({
							separatorChar: ","
						}),
						models: model,
						rows: {
							path: path
						},
						columns: columns
					});

					exporter.saveFile(fileNameToSave)
						.always(function () {
							this.destroy();
						});
				} else {
					jQuery.sap.log.warning(
						"Unexpected input: " + JSON.stringify(arguments),
						null,
						"Util.Common.exportAsCommaSeparatedSheet"
					);
				}
			},

			/**
			 * Method to show the error in case search filters are empty
			 * @param {String} message message text
			 * @param {string} title of the message
			 */
			showEmptyFilterError: function (message, title) {
				var messageConfig = {
					title: title,
					actions: [MessageBox.Action.CLOSE]
				};

				MessageBox.information(message, messageConfig);
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
							.length > 0) {

							return {
								message: oError.message,
								statusText: oError.statusText,
								errordetails: response.error.innererror.errordetails
							};

						}
					} catch (e) {
						sError = oError.responseText;
					}
				}

				if (oError && oError.message) {
					sError += jQuery.sap.formatMessage(oI18nModel.getResourceBundle().getText("SERVICE_ERROR_MSG"), oError.message);
				}

				if (oError && oError.statusText) {
					sError += jQuery.sap.formatMessage(oI18nModel.getResourceBundle().getText("SERVICE_ERROR_STATUS_TXT"), oError.statusText);
				}

				if (!sError) {
					sError = oError;
				}

				return sError;
			}

		};

		return Util;
	});