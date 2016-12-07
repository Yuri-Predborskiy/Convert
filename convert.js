"use strict";

var fs = require("fs");
var JSZip = require("jszip");
var dsv = require("d3-dsv");
var jsonfile = require('jsonfile');

var fileName = process.argv[2];
var fileNameJSON = fileName.replace("zip", "json");

function parseData(data) {
	/*
	 * expected input
	 * "first_name"||"last_name"||"user"||"email"||"name"||"phone"||"cc"||"amount"||"date"
	 * 
	 * desired output
		{
			"name": "string", // <last_name> + <first_name>
			"phone": "string", // normalized <phone> (numbers only)
			"person": {
				"firstName": "string",
				"lastName": "string"
			},
			"amount": "number",
			"date": "date", // <date> in YYYY-MM-DD format
			"costCenterNum": "string" // <cc> without prefix (i.e. ACN00006 00006)
		}
	*/

	var getNumbers = function(n) {
		var re = /\d+/g;
		return n.match(re).join("");
	};
	
	// transforms date "DD/M/YYYY" into YYYY-MM-DD format
	var getDate = function(ds) {
		ds = ds.split("/");
		var d = new Date(ds[2], ds[1]-1, ds[0]);
		var darr = [d.getFullYear(), d.getMonth()+1, d.getDate()];
		if(darr[1].toString().length < 2) {
			darr[1] = "0" + darr[1];
		}
		if(darr[2].toString().length < 2) {
			darr[2] = "0" + darr[2];
		}
		return darr.join("-");
	};
	var result = {
			name: data.last_name + " " + data.first_name,
			phone: getNumbers(data.phone),
			person: {
				firstName: data.first_name,
				lastName: data.last_name
			},
			amount: (Math.round(data.amount*100)/100),
			date: getDate(data.date),
			costCenterNum: getNumbers(data.cc)
	};
	return result;
}

// read a zip file
fs.readFile(fileName, function(err, data) {
	if (err) { throw err; }
	JSZip.loadAsync(data).then(function (zip) {
		var entries = Object.keys(zip.files).map(name => zip.files[name]);
		var listOfPromises = entries.map(function(entry) {
			return entry.async("string").then(function (content) {
				return [entry.name, content];
			});
		});
		var promiseOfList = Promise.all(listOfPromises);
		promiseOfList.then(function (list) {
			var result = list.reduce(function (accumulator, current) {
				 var currentName = current[0];
				 var currentValue = current[1];
				 accumulator[currentName] = currentValue;
				 return accumulator;
			}, {});
			var keys = Object.keys(result);
			var table = [];
			for(var i = 0; i < keys.length; i++) {
				var file = dsv.csvParse(result[keys[i]].replace(/\|\|/g, ","));
				delete file.columns;
				table = table.concat(file);
			}
			table = table.map(item => parseData(item));
			jsonfile.writeFile(fileNameJSON, table, { spaces: 2 }, function(err) {
				if(err) {
					console.error(err);
				} else {
					console.log("Success! Output file: " + fileNameJSON);
				}
			});
		});
	});
});

