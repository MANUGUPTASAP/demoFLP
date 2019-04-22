sap.ui.define([
  "sap/ui/model/type/String"
],
  function (StringType) {
    "use strict";
    return StringType.extend("com.sap.colacolaCocaCola.util.type.Integer", {
      /**
       * Custom type for handling non
       * @param {string} value as input
       * @param {type} internalType is internal Type
       * @returns {string} formatted value
       */
      formatValue: function (value, internalType) {
        var numberValue = parseFloat(value, 10);

        if (isNaN(numberValue)) {
          return "";
        }

        return numberValue;
      }

    });
  }
);