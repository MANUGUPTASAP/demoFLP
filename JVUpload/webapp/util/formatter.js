sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/format/FileSizeFormat",
	"sap/ui/core/ValueState",
	"sap/ui/core/format/DateFormat"
], function (jQuery, NumberFormat, FileSizeFormat, ValueState, DateFormat) {
	"use strict";

	return {
		/**
		 * Method to format odata date format into a javascript object
		 * the Function accepts a json string date in the format of /Date(<timestamp>)/
		 * and parses it into a valid js date.
		 * 
		 *This formater is used for response of a file upload as it does not flow through the odata model 
		 *hence does not get parsed and needs manual parsing
		 * @param   {String} sJsonDate String containg the Json date to be parsed
		 * @return  {Date}             Parsed Js Date Object
		 */
		convertJSONToDate: function (sJsonDate) {
			var iOffset = new Date().getTimezoneOffset();
			var sTimeStamp = /\/Date\((-?\d+)\)\//.exec(sJsonDate);

			if (sTimeStamp) {
				return new Date(+sTimeStamp[1] + iOffset);
			}
			return undefined;
		},

		/**
		 * Method to format odata edm.time 
		 * the Function accepts a json string date in the format of Edm.Time
		 * and parses it into an object representing time.
		 *
		 * Code is copied from method 'parseDuration' in datajs file and then adjusted for our need.
		 * 
		 *This formater is used for response of a file upload as it does not flow through the odata model 
		 *hence does not get parsed and needs manual parsing
		 * @param   {String} sDuration String containg the Json time to be parsed
		 * @return  {Date}             Parsed Js Time Object
		 */
		convertEdmTimeToTime: function (sDuration) {

			var aTimeParts = /^([+-])?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(?:\.(\d+))?S)?)?/.exec(sDuration);

			var sDays = parseInt(aTimeParts[4] || 0, 10);
			var sHours = parseInt(aTimeParts[5] || 0, 10);
			var sMinutes = parseInt(aTimeParts[6] || 0, 10);
			var sSeconds = parseFloat(aTimeParts[7] || 0);

			var iMilliseconds = sSeconds * 1000 + sMinutes * 60000 + sHours * 3600000 + sDays * 86400000;

			var oResult = {
				ms: iMilliseconds,
				__edmType: "Edm.Time"
			};

			return oResult;
		}
	};

});