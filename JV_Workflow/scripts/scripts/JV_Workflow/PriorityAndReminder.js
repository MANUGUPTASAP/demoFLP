/*****************************************************************************************
 * This script task is being used to set priority Due Duration as per business requirement
 *****************************************************************************************/
var dueDate = $.context.DueDate;
var dueDuration = $.context.DueDuration;
if(dueDuration === "P0D")
{
	$.context.HighPriorityDuration = "P0DT0H5M";
	$.context.VHighPriorityDuration = "P0DT0H10M";
}
else
{
var d1 = new Date();
var d2 = new Date(dueDate);
var delta = Math.abs(d2 - d1) / 1000;

// calculate (and subtract) whole days
var days = Math.floor(delta / 86400);
delta -= days * 86400;

// calculate (and subtract) whole hours
var hours = Math.floor(delta / 3600) % 24;
delta -= hours * 3600;

// calculate (and subtract) whole minutes
var minutes = Math.floor(delta / 60) % 60;
delta -= minutes * 60;

var HDays = parseInt(days) - 3;
var VHDays = parseInt(days) - 1;

if (HDays >= 0) {
	$.context.HighPriorityDuration = "P" + HDays + "DT" + hours + "H" + minutes + "M";
} else {
	$.context.HighPriorityDuration = "P0DT0H5M";
}
if (VHDays >= 0) {
	$.context.VHighPriorityDuration = "P" + VHDays + "DT" + hours + "H" + minutes + "M";
} else {
	$.context.VHighPriorityDuration = "P0DT0H10M";
}
}
var data = {
	"priority": "High"
};
var data1 = {
	"priority": "Very_High"
};
$.context.HighPriority = data;
$.context.VHighPriority = data1;