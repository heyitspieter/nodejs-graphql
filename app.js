const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");

const graphqlSchema = require("./schema");
const graphqlResolver = require("./resolvers");

const app = express();

// app.use(bodyParser.urlencoded({ extended: false })); //x-www-form-urlencoded
app.use(bodyParser.json()); //application/json
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }

      const data = err.originalError.data;
      const message = err.message;
      const statusCode = err.originalError.code;

      return { message, status: statusCode, data };
    },
  })
);

app.use(function (err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message;
  res.status(statusCode).json({ message });
});

async function mongooseConnect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/nodejs-blog");
    app.listen(8080);
    console.log("Connected to Database");
  } catch (err) {
    console.log(err);
  }
}

mongooseConnect();
