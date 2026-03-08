const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Project API Documentation",
    description: "Auto generated swagger docs"
  },
  host: "workflow-management-system-4spr.onrender.com",
  schemes: ["https"]
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"]; 

swaggerAutogen(outputFile, endpointsFiles, doc);