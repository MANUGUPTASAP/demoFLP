sap.ui.define([
		"com/sap/colacolaCocaCola/model/oI18nModel"
	],
	function (oI18nModel) {
		"use strict";

		return {
			"COMPANY_CODES": [{
				"key": "01",
				"value": "0101"
			}, {
				"key": "02",
				"value": "01700"
			}, {
				"key": "03",
				"value": "0129"
			}, {
				"key": "04",
				"value": "0130"
			}, {
				"key": "05",
				"value": "0500"
			}, {
				"key": "06",
				"value": "0675"
			}],

			"CURRENCY_CODES": [{
				"key": "01",
				"value": "USD"
			}, {
				"key": "02",
				"value": "AUD"
			}, {
				"key": "03",
				"value": "EUR"
			}, {
				"key": "04",
				"value": "RUP"
			}, {
				"key": "05",
				"value": "GBP"
			}, {
				"key": "06",
				"value": "DIN"
			}],

			"FISCAL_CODES": [{
				"key": "01",
				"value": "1"
			}, {
				"key": "02",
				"value": "2"
			}, {
				"key": "03",
				"value": "3"
			}, {
				"key": "04",
				"value": "4"
			}],

			"LEDGER_CODES": [{
				"key": "01",
				"value": "0L"
			}, {
				"key": "02",
				"value": "1L"
			}, {
				"key": "03",
				"value": "2L"
			}],

			"APPROVER_NAMES": [{
				"key": "01",
				"value": "Eamonn Matthews"
			}, {
				"key": "02",
				"value": "Jennifer Fitts"
			}, {
				"key": "03",
				"value": "Sally Littlejohn"
			}, {
				"key": "04",
				"value": "John Nicholson"
			}],
			"WORK_CENTER": [{
				"key": "EMEA",
				"value": "Europe"
			}, {
				"key": "NA",
				"value": "North America"
			}, {
				"key": "LATAM",
				"value": "Latin America"
			}, {
				"key": "APAC",
				"value": "Asia Pacific"
			}],
			"REQUEST_TYPES": [{
				"key": "F02",
				"value": "Standard"
			}, {
				"key": "F05",
				"value": "Foreign Exchange"
			}, {
				"key": "FBD1",
				"value": "Recurring"
			}, {
				"key": "FBS1",
				"value": "Accrual"
			}],
			"REQUEST_TYPE_TEXT": {
				"F02": "Standard",
				"F05": "Foreign Exchange",
				"FBD1": "Recurring",
				"FBS1": "Accrual"
			},
			"RUN_DATE": [{
				"key": "01",
				"text": "01"
			}, {
				"key": "02",
				"text": "02"
			}, {
				"key": "03",
				"text": "03"
			}, {
				"key": "04",
				"text": "04"
			}, {
				"key": "05",
				"text": "05"
			}, {
				"key": "06",
				"text": "06"
			}, {
				"key": "07",
				"text": "07"
			}, {
				"key": "08",
				"text": "08"
			}, {
				"key": "09",
				"text": "09"
			}, {
				"key": "10",
				"text": "10"
			}, {
				"key": "11",
				"text": "11"
			}, {
				"key": "12",
				"text": "12"
			}, {
				"key": "13",
				"text": "13"
			}, {
				"key": "14",
				"text": "14"
			}, {
				"key": "15",
				"text": "15"
			}, {
				"key": "16",
				"text": "16"
			}, {
				"key": "17",
				"text": "17"
			}, {
				"key": "18",
				"text": "18"
			}, {
				"key": "19",
				"text": "19"
			}, {
				"key": "20",
				"text": "20"
			}, {
				"key": "21",
				"text": "21"
			}, {
				"key": "22",
				"text": "22"
			}, {
				"key": "23",
				"text": "23"
			}, {
				"key": "24",
				"text": "24"
			}, {
				"key": "25",
				"text": "25"
			}, {
				"key": "26",
				"text": "26"
			}, {
				"key": "27",
				"text": "27"
			}, {
				"key": "28",
				"text": "28"
			}, {
				"key": "29",
				"text": "29"
			}, {
				"key": "30",
				"text": "30"
			}, {
				"key": "31",
				"text": "31"
			}],
			"POSTING_KEY": [{
				"key": "50",
				"text": "Credit"
			}, {
				"key": "40",
				"text": "Debit"
			}],
			"ITEM_COLUMN_CONFIG": [{
					label: 'Company Code',
					property: 'Bukrs'
				}, {
					label: 'Journal Entry Type',
					property: 'Blart'
				}, {
					label: 'Journal Entry Date',
					property: 'Bldat',
					type: 'date'
				}, {
					label: 'Posting Date',
					property: 'Budat',
					type: 'date'
				}, {
					label: 'Fiscal period',
					property: 'Monat'
				}, {
					label: 'Document Header Text',
					property: 'Bktxt'
				}, {
					label: 'Transaction Currency',
					property: 'Waers'
				}, {
					label: 'Ledger Group',
					property: 'Ldgrp'
				},
				// {
				// 	label: 'Exchange Rate',
				// 	property: 'Kursf'
				// }, 
				// {
				// 	label: 'Currency Translation Date',
				// 	property: 'Wwert',
				// 	type: 'date'
				// }, 
				{
					label: 'Reference Document Number',
					property: 'Xblnr'
				}, {
					label: 'Approve Region',
					property: 'Objid'
				}, {
					label: 'Line Item Number',
					property: 'Buzei'
				}, {
					label: 'G/L Account',
					property: 'Hkont'
				}, {
					label: 'Item Text',
					property: 'Sgtxt'
				}, {
					label: "Posting Key",
					property: "PstngKey"
				}, {
					label: "Amount",
					property: "Amount"
				},
				// }, {
				// 	label: 'Debit',
				// 	property: 'Wrsol'
				// }, {
				// 	label: 'Credit',
				// 	property: 'Wrhab'
				// }, 
				// {
				// 	label: 'Amount in Company Code Currency',
				// 	property: 'Dmbtr'
				// }, {
				// 	label: 'Amount in second local currency',
				// 	property: 'Dmbe2'
				// }, 
				{
					label: 'Tax Code',
					property: 'Mwskz'
				}, {
					label: 'Tax Jurisdiction',
					property: 'Txjcd'
				}, {
					label: 'Cost Center',
					property: 'Kostl'
				}, {
					label: 'Profit Center',
					property: 'Prctr'
				}, {
					label: 'Order Number',
					property: 'Aufnr'
				}, {
					label: 'WBS Element',
					property: 'Pspnr'
				}, {
					label: 'Value Date',
					property: 'Valut',
					type: 'date'
				}, {
					label: 'House Bank',
					property: 'Hbkid'
				}, {
					label: 'House Bank Account',
					property: 'Hktid'
				}, {
					label: 'Assignment number',
					property: 'Zounr'
				}
			],

			"ITEM_COLUMN_CONFIG_F05": [{
					label: 'Company Code',
					property: 'Bukrs'
				}, {
					label: 'Journal Entry Type',
					property: 'Blart'
				}, {
					label: 'Journal Entry Date',
					property: 'Bldat',
					type: 'date'
				}, {
					label: 'Posting Date',
					property: 'Budat',
					type: 'date'
				}, {
					label: 'Fiscal period',
					property: 'Monat'
				}, {
					label: 'Document Header Text',
					property: 'Bktxt'
				}, {
					label: 'Transaction Currency',
					property: 'Waers'
				}, {
					label: 'Ledger Group',
					property: 'Ldgrp'
				},
				// {
				// 	label: 'Exchange Rate',
				// 	property: 'Kursf'
				// }, 
				// {
				// 	label: 'Currency Translation Date',
				// 	property: 'Wwert',
				// 	type: 'date'
				// }, 
				{
					label: 'Reference Document Number',
					property: 'Xblnr'
				}, {
					label: 'Approve Region',
					property: 'Objid'
				}, {
					label: 'Line Item Number',
					property: 'Buzei'
				}, {
					label: 'G/L Account',
					property: 'Hkont'
				}, {
					label: 'Item Text',
					property: 'Sgtxt'
				}, {
					label: "Posting Key",
					property: "PstngKey"
				}, {
					label: "Amount",
					property: "Amount"
				},
				// }, {
				// 	label: 'Debit',
				// 	property: 'Wrsol'
				// }, {
				// 	label: 'Credit',
				// 	property: 'Wrhab'
				// }, 
				{
					label: 'Amount in Company Code Currency',
					property: 'Dmbtr'
				}, {
					label: 'Amount in second local currency',
					property: 'Dmbe2'
				}, {
					label: 'Tax Code',
					property: 'Mwskz'
				}, {
					label: 'Tax Jurisdiction',
					property: 'Txjcd'
				}, {
					label: 'Cost Center',
					property: 'Kostl'
				}, {
					label: 'Profit Center',
					property: 'Prctr'
				}, {
					label: 'Order Number',
					property: 'Aufnr'
				}, {
					label: 'WBS Element',
					property: 'Pspnr'
				}, {
					label: 'Value Date',
					property: 'Valut',
					type: 'date'
				}, {
					label: 'House Bank',
					property: 'Hbkid'
				}, {
					label: 'House Bank Account',
					property: 'Hktid'
				}, {
					label: 'Assignment number',
					property: 'Zounr'
				}
			],

			"ITEM_COLUMN_CONFIG_FBS1": [{
					label: 'Company Code',
					property: 'Bukrs'
				}, {
					label: 'Journal Entry Type',
					property: 'Blart'
				}, {
					label: 'Journal Entry Date',
					property: 'Bldat',
					type: 'date'
				}, {
					label: 'Posting Date',
					property: 'Budat',
					type: 'date'
				}, {
					label: 'Reverse Date',
					property: 'Stodt',
					type: 'date'
				}, {
					label: 'Reverse Reason',
					property: 'Stgrd'
				}, {
					label: 'Fiscal period',
					property: 'Monat'
				}, {
					label: 'Document Header Text',
					property: 'Bktxt'
				}, {
					label: 'Transaction Currency',
					property: 'Waers'
				}, {
					label: 'Ledger Group',
					property: 'Ldgrp'
				},
				// {
				// 	label: 'Exchange Rate',
				// 	property: 'Kursf'
				// }, 
				// {
				// 	label: 'Currency Translation Date',
				// 	property: 'Wwert',
				// 	type: 'date'
				// }, 
				{
					label: 'Reference Document Number',
					property: 'Xblnr'
				}, {
					label: 'Approve Region',
					property: 'Objid'
				}, {
					label: 'Line Item Number',
					property: 'Buzei'
				}, {
					label: 'G/L Account',
					property: 'Hkont'
				}, {
					label: 'Item Text',
					property: 'Sgtxt'
				}, {
					label: "Posting Key",
					property: "PstngKey"
				}, {
					label: "Amount",
					property: "Amount"
				},
				// {
				// 	label: 'Debit',
				// 	property: 'Wrsol'
				// }, {
				// 	label: 'Credit',
				// 	property: 'Wrhab'
				// }, 
				// {
				// 	label: 'Amount in Company Code Currency',
				// 	property: 'Dmbtr'
				// }, {
				// 	label: 'Amount in second local currency',
				// 	property: 'Dmbe2'
				// }, 
				{
					label: 'Tax Code',
					property: 'Mwskz'
				}, {
					label: 'Tax Jurisdiction',
					property: 'Txjcd'
				}, {
					label: 'Cost Center',
					property: 'Kostl'
				}, {
					label: 'Profit Center',
					property: 'Prctr'
				}, {
					label: 'Order Number',
					property: 'Aufnr'
				}, {
					label: 'WBS Element',
					property: 'Pspnr'
				}, {
					label: 'Value Date',
					property: 'Valut',
					type: 'date'
				}, {
					label: 'House Bank',
					property: 'Hbkid'
				}, {
					label: 'House Bank Account',
					property: 'Hktid'
				}, {
					label: 'Assignment number',
					property: 'Zounr'
				}
			],

			"ITEM_COLUMN_CONFIG_FBD1": [{
					label: 'Company Code',
					property: 'Bukrs'
				}, {
					label: 'Journal Entry Type',
					property: 'Blart'
				}, {
					label: 'First Run On',
					property: 'Dbbdt',
					type: 'date'
				}, {
					label: 'Last Run On',
					property: 'Dbedt',
					type: 'date'
				}, {
					label: "Interval In Month",
					property: "Dbmon"
				}, {
					label: "Run Date",
					property: "Dbtag"
				}, {
					label: "Run Schedule",
					property: "Dbakz"
				}, {
					label: 'Document Header Text',
					property: 'Bktxt'
				}, {
					label: 'Transaction Currency',
					property: 'Waers'
				}, {
					label: 'Ledger Group',
					property: 'Ldgrp'
				},
				// {
				// 	label: 'Exchange Rate',
				// 	property: 'Kursf'
				// }, 
				// {
				// 	label: 'Currency Translation Date',
				// 	property: 'Wwert',
				// 	type: 'date'
				// }, 
				{
					label: 'Reference Document Number',
					property: 'Xblnr'
				}, {
					label: 'Approve Region',
					property: 'Objid'
				}, {
					label: 'Line Item Number',
					property: 'Buzei'
				}, {
					label: 'G/L Account',
					property: 'Hkont'
				}, {
					label: 'Item Text',
					property: 'Sgtxt'
				}, {
					label: "Posting Key",
					property: "PstngKey"
				}, {
					label: "Amount",
					property: "Amount"
				},
				// {
				// 	label: 'Debit',
				// 	property: 'Wrsol'
				// }, {
				// 	label: 'Credit',
				// 	property: 'Wrhab'
				// }, 
				// {
				// 	label: 'Amount in Company Code Currency',
				// 	property: 'Dmbtr'
				// }, {
				// 	label: 'Amount in second local currency',
				// 	property: 'Dmbe2'
				// }, 
				{
					label: 'Tax Code',
					property: 'Mwskz'
				}, {
					label: 'Tax Jurisdiction',
					property: 'Txjcd'
				}, {
					label: 'Cost Center',
					property: 'Kostl'
				}, {
					label: 'Profit Center',
					property: 'Prctr'
				}, {
					label: 'Order Number',
					property: 'Aufnr'
				}, {
					label: 'WBS Element',
					property: 'Pspnr'
				}, {
					label: 'Value Date',
					property: 'Valut',
					type: 'date'
				}, {
					label: 'House Bank',
					property: 'Hbkid'
				}, {
					label: 'House Bank Account',
					property: 'Hktid'
				}, {
					label: 'Assignment number',
					property: 'Zounr'
				}
			],

			"RecurringRunFrequencySet": [{
				"Dbmon": "01",
				"Ltext": "Per month"
			}, {
				"Dbmon": "02",
				"Ltext": "Every 2 months"
			}, {
				"Dbmon": "03",
				"Ltext": "Every 3 months"
			}, {
				"Dbmon": "04",
				"Ltext": "Every 4 months"
			}, {
				"Dbmon": "05",
				"Ltext": "Every 5 months"
			}, {
				"Dbmon": "06",
				"Ltext": "Every 6 months"
			}, {
				"Dbmon": "07",
				"Ltext": "Every 7 months"
			}, {
				"Dbmon": "08",
				"Ltext": "Every 8 months"
			}, {
				"Dbmon": "09",
				"Ltext": "Every 9 months"
			}, {
				"Dbmon": "10",
				"Ltext": "Every 10 months"
			}, {
				"Dbmon": "11",
				"Ltext": "Every 11 months"
			}, {
				"Dbmon": "12",
				"Ltext": "Every 12 months"
			}]
		};
	});