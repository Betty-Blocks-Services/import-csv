# Import CSV.

This function can be used to import the contents of a CSV file into Betty Blocks.
You can map column names from the CSV to properties in your model.
You can specify different CSV columns to database property mappings for new records or updated records.
With the deduplication option you can prevent duplicate records based on a column name of your CSV file with the unique value of the records.

## Configure the function

### URL TO THE CSV FILE:
![image](https://user-images.githubusercontent.com/96063344/227200202-98752469-b186-4e11-8033-d6a923d455b1.png)

Specify an URL to your CSV file. This can be a static public reachable URL or a variable from a file property of a record.

### IMPORT MODEL:
![image](https://user-images.githubusercontent.com/96063344/227200400-48686778-9c22-4d61-970d-0961973887ef.png)

Specify the model in which the CSV records will be imported.

### CSV MAPPING:
![image](https://user-images.githubusercontent.com/96063344/227200534-0323cf3f-ecf7-4f1d-83ab-feaa30cd099b.png)

A key/value combination that allows you to map your CSV column names to the properties of the selected model.
The key column contains the (exact) column name of your CSV file.
The value column contains the database name of your property (snake_case)

example:

### FORMAT MAPPING FOR CSV COLUMNS:
![image](https://user-images.githubusercontent.com/96063344/227200633-9e87659f-f47e-48c4-b406-9b26a0972f80.png)

A key/value combination to allow you to specify if a column is a checkbox or a specific date format.
Text, number, decimal fields will all work out of the box and should not be included here.

The key column specifies the CSV column name.
The value column specifies either the word checkbox or a specific date format.
We use the formats defined by the date-fns package and the specifics can be found here: https://date-fns.org/v2.16.1/docs/format
Make sure a mapping exists for each of your date columsn in the CSV, otherwise the column will not be imported correctly.

example:

### DEDUPLICATE RECORDS (UPDATE RECORDS IF MATCHED):
![image](https://user-images.githubusercontent.com/96063344/227200721-31d1812b-87aa-4529-9768-ac4441ff872d.png)

This toggle will determine if the CSV records will be matched to records inside Betty Blocks.
If selected, make sure you enter the UNIQUE RECORD IDENTIFIER option.

### UNIQUE RECORD IDENTIFIER (CSV COLUMN NAME):
![image](https://user-images.githubusercontent.com/96063344/227200790-0ccb9d8a-6854-479f-a045-f7bb2169cfe9.png)

Specify the column name (from your CSV file) which uniquely identify your records.

### UPDATE CSV MAPPING FOR EXISTING RECORDS (LEAVE EMPTY TO USE DEFAULT):
![image](https://user-images.githubusercontent.com/96063344/227200906-b10a21ac-4ced-48b4-ae49-a3add274cf7f.png)

Same principle as the CSV MAPPING, but these mappings will only be used for existing records. for new records the CSV MAPPING options will be used.

### TURN ON LOGGING FOR THIS ACTION:
![image](https://user-images.githubusercontent.com/96063344/227200968-a8898a64-1ae9-4c19-b84e-9d82456b02eb.png)

When selected, debug information will be logged to the logs.

### RESULT:
![image](https://user-images.githubusercontent.com/96063344/227201040-034a15b3-c7af-4745-a19b-55a1b5583da9.png)

This is the output of the function and will contain the number of records created and the number of records updated in the following format:
records created: 1, records updated: 1

### Using the result

The output of this action function could be used by other action functions or as the result of your action.

## Packages

This action function uses the following packages:

- https://www.npmjs.com/package/papaparse
- https://www.npmjs.com/package/date-fns
- https://www.npmjs.com/package/lodash

Versions of the used packages can be found in the in package.json file in the source code.

## Limitations

- No relational data can be imported.
- At the time of this writing Betty Blocks NextGen actions have a maximum runtime of 60 seconds. The import csv function (and any other functions in your action) need to complete within 60 seconds.
  To make sure the import does not exceed this 60 seconds time limit, the action funciton will impose limits on the number of records it can create and a limit for the number of records it can update (for updates the function also needs to retrieve the data first, which causes overhead).
