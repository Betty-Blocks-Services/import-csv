const getOne = async (modelName, properties, where) => {
  const queryName = `one${modelName}`;
  const query = `{
      ${queryName}(where: ${where}) {
        id
        ${properties.join("\n")}
      }
    }
  `;

  const { data, errors } = await gql(query);
  if (errors) {
    throw new Error(errors);
  }

  const { [queryName]: record } = data;

  return record;
};

const getAll = async (gqlQuery, skip, take, results) => {
  const gqlResponse = await gql(gqlQuery, { skip, take });
  if (gqlResponse) {
    const gqlQueryObject = Object.values(gqlResponse)[0]; // the data object
    const tmpResults = Object.values(gqlQueryObject)[0]; // the all query object which contains the result and totalcount

    if (tmpResults.totalCount > 20000)
      throwError(
        "The number of records to update is too large. Please turn on batching for this step and select a batch size between 0 and 10.000."
      );

    skip += take;
    if (tmpResults.results.length) {
      const newResults = [...results, ...tmpResults.results];
      results = newResults;
      if (skip <= tmpResults.totalCount) {
        results = await getAll(gqlQuery, skip, take, results);
      }
    }
  }
  return results;
};

const authenticateOnDataApi = async (
  apiUrl,
  authProfileId,
  userName,
  password,
  logging
) => {
  query = {
    operationName: "login",
    variables: {},
    query: `mutation login {\n  login(authProfileUuid: "${authProfileId}", username: "${userName}", password: "${password}") {\n    jwtToken\n  }\n}\n`,
  };
  const bearerToken = fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
  })
    .then((authRes) => authRes.json())
    .then((authResult) => {
      if (authResult.data.login.jwtToken) {
        const bearerToken = "Bearer " + authResult.data.login.jwtToken;
        if (logging) console.log("Authentication successfull");
        return bearerToken;
      } else throw "Authentication failed";
    })
    .catch((e) => {
      return "Error: " + e;
    });
  return bearerToken;
};

const getGQLIntrospection = async (apiUrl, bearerToken) => {
  query = {
    operationName: "IntrospectionQuery",
    variables: {},
    query: `query IntrospectionQuery{\n__schema{\ntypes{\nname\nfields{\nname\n}\nkind\n}\n}\n}\n`,
  };
  const gqlObject = fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerToken,
    },
    body: JSON.stringify(query),
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.data.__schema.types) {
        const types = result.data.__schema.types;
        const lists = types.filter(
          (record) => record.kind === "OBJECT" && record.name.endsWith("List")
        );
        return { gqlLists: lists, gqlTypes: types };
      } else
        throw "Introspection fetched, but no LIST/Model schemas were found";
    })
    .catch((e) => {
      return "Error: " + e;
    });
  return gqlObject;
};

export { getOne, getAll, authenticateOnDataApi, getGQLIntrospection };
