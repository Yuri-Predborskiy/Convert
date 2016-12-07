# Convert
Test task for converting archived CSV documents using node.js


To install required modules, execute npm install command
```
npm install
```

To convert one archive using command line, use convert-cmd.js
```
node convert-cmd.js data.zip
```

This will convert `data.zip` contents into JSON, resulting file will be named `data.json`

To use Convert as a module in another javascript file, simply require it
```
var convert = require('./convert.js');
```

In order to use Convert as a module, make sure you have the following NPM modules installed in your project:
d3-dsv
jsonfile
jszip

Then, call convert with a file name as the only parameter
```
convert("data.zip");
```

This will convert archived CSV files in `data.zip` file, output file will be named `data.json`.

Expected input file formatting:
```
"first_name"||"last_name"||"user"||"email"||"name"||"phone"||"cc"||"amount"||"date"
```

Output file format:
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
