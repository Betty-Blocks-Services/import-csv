import { parse, isValid, formatISO } from "date-fns";

const snakeToCamel = (str) => {
  str = str.replace(/_[0-9]/g, (m, chr) => "!" + m);
  str = str.replace(/[^a-zA-Z0-9!]+(.)/g, (m, chr) => chr.toUpperCase());
  return str.replace(/[!]/g, "_");
};

const returnDateTimeValue = (dateString, dateType) => {
  switch (dateType) {
    case "Time":
      return dateString.substr(11, 8);
      break;
    case "Date":
      return dateString.substring(0, 10);
      break;
    case "DateTime":
      return dateString.substring(0, 19);
      break;
    default:
      return dateString;
      break;
  }
};

const convertToDBDateFormat = (dateString, format, dateType) => {
  const date = !isValid(dateString)
    ? parse(dateString, format, new Date())
    : dateString;
  if (!isValid(dateString)) return null;
  return returnDateTimeValue(formatISO(dateString).replace("T", " "), dateType);
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

const gqlIntroSpectionToDBSchema = (introSpectionObject) => {
  const lists = introSpectionObject.gqlLists;
  const types = introSpectionObject.gqlTypes;
  if (!lists || !types) {
    return introSpectionObject;
  }
  const datamodels = [];
  let properties = {};
  lists.forEach((modellist) => {
    properties = {};
    const modelName = modellist.name.slice(0, -4);
    const modelDetails = types.find(
      (model) => model.kind === "OBJECT" && model.name == modelName
    );
    if (modelDetails && modelDetails.fields) {
      modelDetails.fields.forEach((field) => {
        properties[field.name] = { type: field.type.name };
      });
      datamodels.push({
        name: modelName,
        properties: properties,
      });
    }
  });
  return datamodels;
};

export {
  snakeToCamel,
  convertToDBDateFormat,
  convertToBoolean,
  throwError,
  gqlIntroSpectionToDBSchema,
};
