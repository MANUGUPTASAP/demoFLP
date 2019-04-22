sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "com/sap/colacolaCocaCola/util/Util"
], function (JSONModel, Filter, FilterOperator, Util) {
  "use strict";

  return JSONModel.extend("com.sap.colacolaCocaCola.model.BaseViewModel", {
    /**
     * Override the default size limit to 1000 from JSONModel's 100
     */
    constructor: function () {
      JSONModel.apply(this, arguments);
      this.setSizeLimit(10000);
    },

    /***************************************************************************
     * Getters
     ***************************************************************************/

    /***************************************************************************
     * Setters
     ***************************************************************************/
    /**
     * Utility method to set multiple properties at once
     * @param {Object} properties object containing key-value pair of properties
     * @param {Object} context relative to which the properties should be set
     */
    setProperties: function (properties, context) {
      if (properties) {
        Object.keys(properties)
          .forEach(function (property) {
            this.setProperty(property, properties[property], context);
          }, this);
      } else {
        jQuery.sap.log.warning(
          "Expected object, got instead: " + JSON.stringify(properties),
          null,
          "BaseViewModel.setProperties"
        );
      }
    },

    /**
     * Sets list property in model using data.results
     * @param {string} propertyName is the name of the property
     * @param {object} data is the data returned from OData list read/function import
     * @param {Function} filterFunction to use to filter data before setting
     * call and expected to be of the format: {results: [... array of objects]}
     */
    setListProperty: function (propertyName, data, filterFunction) {
      if (propertyName && data && data.results) {
        if (filterFunction) {
          this.setProperty(propertyName, data.results.filter(filterFunction));
        }
        else {
          this.setProperty(propertyName, data.results);
        }
      }
      else {
        jQuery.sap.log.error(
          "Invalid arguments: " + JSON.stringify(arguments),
          null,
          "BaseViewModel.setListProperty"
        );
      }
    }

  });
});