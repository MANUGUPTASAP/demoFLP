sap.ui.define([
		"sap/ui/model/odata/v2/ODataModel"
	],
	function (ODataModel) {
		"use strict";

		/*****************************************************************************
		 * OData Utilities
		 *****************************************************************************/
		var ODataUtil = {};
		/**
		 * Wrapper method on OData Model's read method returning a Promise
		 *
		 * @param {sap.ui.model.odata.v2.ODataModel} model for OData service call
		 * @param {string} path to OData entity which needs to be read
		 * @param {object} parameters to be used in OData read call
		 * @returns {Promise} Promise object for the OData Call
		 */
		ODataUtil.whenReadDone = function (model, path, parameters) {
			var promise,
				filters,
				sorters,
				urlParameters;

			if (parameters) {
				if (parameters.filters) {
					filters = parameters.filters;
				}
				if (parameters.sorters) {
					sorters = parameters.sorters;
				}
				if (parameters.urlParameters) {
					urlParameters = parameters.urlParameters;
				}
			}

			if (model && path) {
				promise = new Promise(function (resolve, reject) {
					ODataModel.prototype.read.call(model, path, {
						filters: filters,
						sorters: sorters,
						urlParameters: urlParameters,
						success: function (data) {
							resolve(data);
						},
						error: function (error) {
							reject(error);
						}
					});
				});
			} else {
				jQuery.sap.log.warning(
					"Invalid arguments",
					null,
					"ODataUtil.whenReadDone");
				promise = Promise.reject("Invalid arguments: " + JSON.stringify(arguments));
			}

			return promise;
		};

		/**
		 * Wrapper method on OData Model's create method returning a Promise
		 *
		 * @param {sap.ui.model.odata.v2.ODataModel} model for OData service call
		 * @param {string} path to OData entityset where create needs to be done
		 * @param {object} object to be used in OData create call
		 * @param {object} parameters to be used in OData create call
		 * @returns {Promise} Promise object for the OData Call
		 */
		ODataUtil.whenCreateDone = function (model, path, object, parameters) {
			var promise,
				urlParameters;

			if (parameters) {
				if (parameters.urlParameters) {
					urlParameters = parameters.urlParameters;
				}
			}

			if (model && path && object) {
				promise = new Promise(function (resolve, reject) {
					ODataModel.prototype.create.call(model, path, object, {
						urlParameters: urlParameters,
						success: function (data) {
							resolve(data);
						},
						error: function (error) {
							reject(error);
						}
					});
				});
			} else {
				jQuery.sap.log.warning(
					"Invalid arguments",
					null,
					"ODataUtil.whenCreateDone");
				promise = Promise.reject("Invalid arguments: " + JSON.stringify(arguments));
			}

			return promise;
		};

		/**
		 * Wrapper method on OData Model's remove method returning a Promise
		 *
		 * @param {sap.ui.model.odata.v2.ODataModel} model for OData service call
		 * @param {string} path to OData entity path which needs to be removed
		 * @param {object} parameters to be used in OData remove call
		 * @returns {Promise} Promise object for the OData Call
		 */
		ODataUtil.whenRemoveDone = function (model, path, parameters) {
			var promise,
				urlParameters;

			if (parameters) {
				if (parameters.urlParameters) {
					urlParameters = parameters.urlParameters;
				}
			}

			if (model && path) {
				promise = new Promise(function (resolve, reject) {
					ODataModel.prototype.remove.call(model, path, {
						urlParameters: urlParameters,
						success: function (data) {
							resolve(data);
						},
						error: function (error) {
							reject(error);
						}
					});
				});
			} else {
				jQuery.sap.log.warning(
					"Invalid arguments",
					null,
					"ODataUtil.whenRemoveDone");
				promise = Promise.reject("Invalid arguments: " + JSON.stringify(arguments));
			}

			return promise;
		};

		/**
		 * Wrapper method on OData Model's callFunction method returning a Promise
		 *
		 * @param {sap.ui.model.odata.v2.ODataModel} model for OData service call
		 * @param {string} path to OData function import which needs to be read
		 * @param {object} parameters to be used in OData function import call
		 * @returns {Promise} Promise object for the OData Call
		 */
		ODataUtil.whenCallFunctionDone = function (model, path, parameters) {
			var promise,
				urlParameters,
				headers,
				method,
				changeSetId,
				groupId;

			if (parameters) {
				if (parameters.urlParameters) {
					urlParameters = parameters.urlParameters;
				}
				if (parameters.headers) {
					headers = parameters.headers;
				}
				if (parameters.method) {
					method = parameters.method;
				}
				if (parameters.changeSetId) {
					changeSetId = parameters.changeSetId;
				}
				if (parameters.groupId) {
					groupId = parameters.groupId;
				}
			}

			if (model && path && method && (["GET", "POST"].indexOf(method) >= 0)) {
				promise = new Promise(function (resolve, reject) {
					ODataModel.prototype.callFunction.call(model, path, {
						method: method,
						urlParameters: urlParameters,
						headers: headers,
						groupId: groupId,
						changeSetId: changeSetId,
						success: function (data) {
							resolve(data);
						},
						error: function (error) {
							reject(error);
						}
					});
				});
			} else {
				jQuery.sap.log.warning(
					"Invalid arguments",
					null,
					"ODataUtil.whenCallFunctionDone");
				promise = Promise.reject("Invalid arguments: " + JSON.stringify(arguments));
			}

			return promise;
		};

		/**
		 * Wrapper method on OData Model's update method returning a Promise
		 *
		 * @param {sap.ui.model.odata.v2.ODataModel} model for OData service call
		 * @param {string} path to OData entity path which needs to be updated
		 * @param {object} object to be sent for update
		 * @param {object} parameters to be used in OData update call
		 * @returns {Promise} Promise object for the OData Call
		 */
		ODataUtil.whenUpdateDone = function (model, path, object, parameters) {
			var promise,
				urlParameters,
				headers,
				changeSetId,
				eTag;

			if (parameters) {
				if (parameters.urlParameters) {
					urlParameters = parameters.urlParameters;
				}
				if (parameters.headers) {
					headers = parameters.headers;
				}
				if (parameters.changeSetId) {
					changeSetId = parameters.changeSetId;
				}
				if (parameters.eTag) {
					eTag = parameters.eTag;
				}
			}

			if (model && path && object) {
				promise = new Promise(function (resolve, reject) {
					ODataModel.prototype.update.call(model, path, object, {
						urlParameters: urlParameters,
						headers: headers,
						changeSetId: changeSetId,
						eTag: eTag,
						success: function (data) {
							resolve(data);
						},
						error: function (error) {
							reject(error);
						}
					});
				});
			} else {
				jQuery.sap.log.warning(
					"Invalid arguments",
					null,
					"ODataUtil.whenUpdateDone");
				promise = Promise.reject("Invalid arguments: " + JSON.stringify(arguments));
			}

			return promise;
		};
		
		/**
		 * Method to update/insert effort data
		 * @param {String}
		 */
		ODataUtil.whenAjaxPosted = function (sUrl, oPostData) {
			var oPromise;

			//TO-DO : Create js file for ajax/odata calls handling
			oPromise = new Promise(function (resolve, reject) {
				jQuery.post(sUrl, oPostData)
					.done(function (data) {
						resolve(data);
					}).fail(function (xhr, status, error) {
						reject(error);
					});
			});

			return oPromise;
		};

		return ODataUtil;
	}
);