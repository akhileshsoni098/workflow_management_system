const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Project API Documentation",
    description: "Auto generated swagger docs"
  },
  host: "localhost:3001",
  schemes: ["http"]
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"]; 

swaggerAutogen(outputFile, endpointsFiles, doc);