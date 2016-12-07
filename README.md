# Convert
Test task for converting archived CSV documents using node.js. You can use Convert either as a module, or from command line.

## Script, executed from command line
To execute Convert from command line, with targeted file `data.zip`, do the following:

1. Clone or download this repository

2. Install dependencies with `npm install` commmand

3. Put required archive file into the project folder and execute the following command:
```
node convert-cmd.js data.zip
```

## Module
To use Convert as a module in another javascript file, install npm dependencies for the project:
* d3-dsv
* jsonfile
* jszip

In order to convert `data.zip` file, require `convert.js` and launch it with file name as a parameter:
```
var convert = require('./convert.js');
...
convert("data.zip");
```
This will create `data.json` in the project folder. Resulting `.json` file has the same name as `.zip` archive. If such file already exists, convert will try to overwrite it. If `data.zip` file does not exist, or it cannot be accessed, file system exception will be thrown.

## Expected input file format
```
"first_name"||"last_name"||"user"||"email"||"name"||"phone"||"cc"||"amount"||"date"
```

## Resulting JSON file format
```
{
  "name": "string", // <last_name> + <first_name>
  "phone": "string", // normalized <phone> (numbers only)
  "person": {
    "firstName": "string",
    "lastName": "string"
  },
  "amount": "number", // rounded to 2 digits
  "date": "date", // <date> in YYYY-MM-DD format with leading zeroes
  "costCenterNum": "string" // <cc> without prefix (i.e. ACN00006 00006)
}
```
