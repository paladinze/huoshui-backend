const { prisma } = require("../src/generated/prisma-client");

async function main() {
  const user1 = await prisma.createUser({
    email: "paladinze@hotmail.com",
    username: "paladinze",
    password: "$2a$10$cigS.az9DvWKAqWSsnmf4ep6CcTjSSXqbkvke8.1VGG4ZEC3CMTku" //Zfmttm01
  });
  const user2 = await prisma.createUser({
    email: "manny@hotmail.com",
    username: "manny",
    password: "$2a$10$cigS.az9DvWKAqWSsnmf4ep6CcTjSSXqbkvke8.1VGG4ZEC3CMTku" //Zfmttm01
  });
  const user3 = await prisma.createUser({
    email: "alice@prisma.io",
    username: "Alice",
    password: "$2b$10$dqyYw5XovLjpmkYNiRDEWuwKaRAvLaG45fnXE5b3KTccKZcRPka2m" // "secret42"
  });
  const user4 = await prisma.createUser({
    email: "bob@prisma.io",
    username: "Bob",
    password: "$2b$10$o6KioO.taArzboM44Ig85O3ZFZYZpR3XD7mI8T29eP4znU/.xyJbW" // "secret43"
  });
}

main();
