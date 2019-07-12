"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Course",
    embedded: false
  },
  {
    name: "Prof",
    embedded: false
  },
  {
    name: "Sex",
    embedded: false
  },
  {
    name: "Review",
    embedded: false
  },
  {
    name: "Position",
    embedded: false
  },
  {
    name: "Tag",
    embedded: false
  },
  {
    name: "Dept",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
