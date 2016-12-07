# Convert
Test task for converting archived CSV documents using node.js

You can launch converting from command line using the following command
```
node convert.js docs.zip
```
This will convert archived files in `docs.zip` file, output file will be named `docs.json`.

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
