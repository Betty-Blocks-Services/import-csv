import { parse, isValid, formatISO } from "date-fns";

const snakeToCamel = (str) => {
  str = str.replace(/_[0-9]/g, (m, chr) => "!" + m);
  str = str.replace(/[^a-zA-Z0-9!]+(.)/g, (m, chr) => chr.toUpperCase());
  return str.replace(/[!]/g, "_");
};

const convertToDBDateFormat = (dateString, format) => {
  const date = parse(dateString, format, new Date());
  if (!isValid(date)) return null;
  return formatISO(date).replace("T", " ").substring(0, format.length);
};

const convertToBoolean = (value) => {
  const checkValue = value ? value.toString().toLowerCase().trim() : "";

  if (
    checkValue === "true" ||
    checkValue === "false" ||
    checkValue === "1" ||
    checkValue === "0" ||
    checkValue === ""
  )
    return Boolean(JSON.parse(checkValue));
  else return Boolean(checkValue);
};

const throwError = (error) => {
  console.error(`Error: ${error.message || JSON.stringify(error)}`);
  throw new Error(`Error: ${error.message || JSON.stringify(error)}`);
};

export { snakeToCamel, convertToDBDateFormat, convertToBoolean, throwError };
