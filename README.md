# Import CSV.

This function can be used to import the contents of a CSV file into Betty Blocks.<br />
You can map column names from the CSV to properties in your model.<br />
You can specify different CSV columns to database property mappings for new records or updated records.<br />
With the deduplication option you can prevent duplicate records based on a column name of your CSV file with the unique value of the records.

## Configure the function

### URL TO THE CSV FILE:
![image](https://user-images.githubusercontent.com/96063344/227200202-98752469-b186-4e11-8033-d6a923d455b1.png)

Specify an URL to your CSV file. This can be a static public reachable URL or a variable from a file property of a record.<br />
The file will be checked for the mime type of the file and the current accepted mime-types are:<br /> text/csv, text/x-csv, application/x-csv, application/csv, text/x-comma-separated-values, text/comma-separated-values.<br />Note, not all of these have mime-types have been properly tested. All test have been done with files with the mime-type of "text/csv". <br /> 

### IMPORT MODEL:
![image](https://user-images.githubusercontent.com/96063344/227200400-48686778-9c22-4d61-970d-0961973887ef.png)

Specify the model in which the CSV records will be imported.

### CSV MAPPING:
![image](https://user-images.githubusercontent.com/96063344/227200534-0323cf3f-ecf7-4f1d-83ab-feaa30cd099b.png)

A key/value combination that allows you to map your CSV column names to the properties of the selected model.<br />
The key column contains the (exact) column name of your CSV file.<br />
The value column contains the database name of your property (snake_case).<br />
For belong to relations you can use model.property (in snake_case) combination.<br />

example:

### FORMAT MAPPING FOR CSV COLUMNS:
![image](https://user-images.githubusercontent.com/96063344/227590135-1bdb92e3-08c4-4a99-a71d-3935d4ffc741.png)

A key/value combination to allow you to specify if a column is a checkbox or a specific date format.<br />
Text, number, decimal fields will all work out of the box and should not be included here.<br />

The key column specifies the CSV column name.<br />
The value column specifies either the word checkbox or a specific date format.<br />
We use the formats defined by the date-fns package and the specifics can be found here: https://date-fns.org/v2.16.1/docs/format<br />
Make sure a mapping exists for each of your date columsn in the CSV, otherwise the column will not be imported correctly.<br />
See the limitations below for the supported patterns.

example:

### DEDUPLICATE RECORDS (UPDATE RECORDS IF MATCHED):
![image](https://user-images.githubusercontent.com/96063344/227200721-31d1812b-87aa-4529-9768-ac4441ff872d.png)

This toggle will determine if the CSV records will be matched to records inside Betty Blocks.<br />
If selected, make sure you enter the UNIQUE RECORD IDENTIFIER option.<br />

### UNIQUE RECORD IDENTIFIER (CSV COLUMN NAME):
![image](https://user-images.githubusercontent.com/96063344/227200790-0ccb9d8a-6854-479f-a045-f7bb2169cfe9.png)

Specify the column name (from your CSV file) which uniquely identify your records.

### UNIQUE RECORD TYPE
![image](https://user-images.githubusercontent.com/96063344/232803057-0051661c-d364-4ce0-bf73-fd93879ba95a.png)

Specify the property type of the unique record property type. Current supported types are: Id, Text, Number or Decimal property types. 
Please make sure you enter this when selecting deduplication.

### UPDATE CSV MAPPING FOR EXISTING RECORDS (LEAVE EMPTY TO USE DEFAULT):
![image](https://user-images.githubusercontent.com/96063344/227200906-b10a21ac-4ced-48b4-ae49-a3add274cf7f.png)

Same principle as the CSV MAPPING, but these mappings will only be used for existing records. For new records the CSV MAPPING options will be used.<br />
This should be left empty if you do not want to distinct the columns to import between creates and updates.

### TURN ON BATCHED PROCESSING FOR THE IMPORT
![image](https://github.com/Betty-Services/import-csv/assets/96063344/df4c5306-6b29-45c5-b0bd-9f816ea131e6)

When on, the system will use multiple calls (batches) for processing the import and store the progress in the model/properties selected below. This can be useful if you have huge amounts of data and the import can't finish in a single run.

### THE MODEL IN WHICH WE STORE THE BATCH SIZE AND CURRENT OFFSET.
![image](https://github.com/Betty-Services/import-csv/assets/96063344/899683ff-ac4d-4f1b-a95a-e5c00b908f13)

### THE (NUMBER) PROPERTY TO STORE THE SIZE OF EACH BATCH.
![image](https://github.com/Betty-Services/import-csv/assets/96063344/8644c183-b231-4c93-8844-4655f7901cff)

### BATCH SIZE (NUMBER OF RECORDS TO PROCESS IN A BATCH).
![image](https://github.com/Betty-Services/import-csv/assets/96063344/5306af99-5470-4e30-9680-1c9b06d42686)

### THE (NUMBER) PROPERTY TO STORE THE OFFEST WHILE RUNNING THE IMPORT.
![image](https://github.com/Betty-Services/import-csv/assets/96063344/8981da78-50cc-4a70-bc48-1ce8660e501d)

### THE (TEXT) PROPERTY TO STORE THE FILE NAME TO UNIQUELY IDENTIFY THIS IMPORT.
![image](https://github.com/Betty-Services/import-csv/assets/96063344/96096206-de5e-4176-aa70-f47c8ab142c5)

### TURN ON LOGGING FOR THIS ACTION:
![image](https://user-images.githubusercontent.com/96063344/227200968-a8898a64-1ae9-4c19-b84e-9d82456b02eb.png)

When selected, debug information will be logged into the logs.

### RESULT:
![image](https://user-images.githubusercontent.com/96063344/227201040-034a15b3-c7af-4745-a19b-55a1b5583da9.png)

This is the (Text) output of the function and will contain the number of records which have been created and the number of records updated in the following format:<br />
records created: 1, records updated: 1

### Using the result

The output of this action function could be used by other action functions or as the final result of your action.

## Packages

This action function uses the following packages:

~~- https://www.npmjs.com/package/papaparse~~ in v2.2 papaparse has been replaced by our internal helper function parseData.
- https://www.npmjs.com/package/date-fns
- https://www.npmjs.com/package/lodash

The versions of the used packages, can be found in the package.json file.

## Limitations

- Limited support for relational data (belongs to relations only).
- At the time of this writing Betty Blocks NextGen actions have a maximum runtime of 60 seconds.<br />This function (and any other functions in your action) need to complete within 60 seconds.<br />
  If the import does not exceed this 60 seconds time limit, turn on batched processed, so that you run the same action multiple times and the step will continue processing from the moment the action timed-out previously.
- Time properties have not been tested and are currently not supported.
- The date-fns format patterns which have been tested include:  yyyy (year), dd (day in 2 digits), MM (month in 2 digits), HH (hours), mm (minutes), ss (seconds). 
- AM/PM times in date time properties are currently NOT supported.  
