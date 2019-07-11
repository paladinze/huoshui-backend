const { prisma } = require("../../src/generated/prisma-client");
const fs = require("fs");
const path = require("path");

const lc_users_path = path.resolve(__dirname, "./leancloud/_User.json");
const lc_users = JSON.parse(fs.readFileSync(lc_users_path)).results;

async function main() {
  console.log(lc_users[0]);
}

main();
