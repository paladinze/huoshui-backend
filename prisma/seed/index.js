const { prisma } = require("../../src/generated/prisma-client");
const fs = require("fs");
const path = require("path");

const createUsers = async () => {
  console.log("seeding users...");
  const datapath = path.resolve(__dirname, "./leancloud/_User.json");
  const lc_users = JSON.parse(fs.readFileSync(datapath)).results;
  for (const lc_user of lc_users) {
    const { username, email, year, dept, password, salt } = lc_user;
    const deptFound = await prisma.dept({ shortname: dept });
    if (deptFound) {
      const user = await prisma.createUser({
        email,
        username,
        firstYear: year,
        isLcUser: true,
        lcSalt: salt,
        password,
        dept: {
          connect: {
            shortname: dept
          }
        }
      });
    } else {
      console.log("dept no found for: " + username + " : " + dept);
    }
  }
  console.log("seeding users: Done!");
};

const createDepts = async () => {
  console.log("seeding depts...");
  const datapath = path.resolve(__dirname, "./data_common/dept.json");
  const depts = JSON.parse(fs.readFileSync(datapath));
  for (const { shortname, longname } of depts) {
    await prisma.createDept({
      shortname,
      longname
    });
  }
  console.log("seeding depts: Done!");
};

const createPositions = async () => {
  console.log("seeding positions...");
  const datapath = path.resolve(__dirname, "./data_common/position.json");
  const positions = JSON.parse(fs.readFileSync(datapath));
  for (const position of positions) {
    const { name } = position;
    await prisma.createPosition({
      name
    });
  }
  console.log("seeding positions: Done!");
};

const createTags = async () => {
  console.log("seeding tags...");
  const datapath = path.resolve(__dirname, "./data_common/tag.json");
  const tags = JSON.parse(fs.readFileSync(datapath));
  for (const { name, isPositive, category } of tags) {
    await prisma.createTag({
      name,
      isPositive,
      category
    });
  }
  console.log("seeding tags: Done!");
};

const createCourses = async () => {
  console.log("seeding courses...");
  const datapath = path.resolve(__dirname, "./leancloud/Courses.json");
  const courses = JSON.parse(fs.readFileSync(datapath)).results;
  for (const course of courses) {
    const { name, isElective, audience } = course;
    await prisma.createCourse({
      name,
      isElective,
      audience
    });
  }
  console.log("seeding courses: Done!");
};

const createProfs = async () => {
  console.log("seeding profs...");

  const XLSX = require("xlsx");
  const datapath = path.resolve(__dirname, "./leancloud/prof.xls");
  const workbook = XLSX.readFile(datapath);
  const sheet_name_list = workbook.SheetNames;
  let parsedData = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheet_name_list[0]]
  );
  parsedData.splice(0, 2); // remove 3 addtional lines of header
  const profs = parsedData;
  for (const prof of profs) {
    let {
      name,
      code,
      dept,
      position,
      gender,
      birth,
      email,
      phone,
      hometown,
      exp,
      group,
      motto,
      intro,
      eduation,
      research,
      achievement,
      legacyCourses
    } = prof;
    if (gender == "男") {
      gender = "MALE";
    } else if (gender == "女") {
      gender = "FEMALE";
    }
    if (!birth || isNaN(parseFloat(birth)) || birth > 1930 || birth < 2010) {
      birth = null;
    }
    if (!exp || isNaN(parseFloat(exp))) {
      exp = null;
    }
    if (typeof research != "string") {
      research = null;
    }
    if (phone && typeof phone != "string") {
      phone = phone.toString();
    }

    let args = {
      name,
      code: code.toString(),
      birth,
      gender,
      email,
      phone,
      hometown,
      exp,
      group,
      motto,
      intro,
      eduation,
      research,
      achievement,
      legacyCourses
    };

    let deptFound = null;
    if (dept) {
      deptFound = await prisma.dept({ longname: dept });
      if (deptFound) {
        args.dept = {
          connect: {
            id: deptFound.id
          }
        };
      } else {
        console.log("dept not found for: " + name + " : " + dept);
      }
    }

    let positionFound = null;
    if (position) {
      positionFound = await prisma.position({ name: position });
      if (positionFound) {
        args.position = {
          connect: {
            id: positionFound.id
          }
        };
      } else {
        console.log("position no found for: " + name + " : " + position);
      }
    }

    const newProf = await prisma.createProf(args);
  }

  console.log("seeding profs: Done!");
};

const createCourses = async () => {
  console.log("seeding users...");
  const datapath = path.resolve(__dirname, "./leancloud/_User.json");
  const lc_users = JSON.parse(fs.readFileSync(datapath)).results;
  for (const lc_user of lc_users) {
    const { username, email, year, dept, password, salt } = lc_user;
    const deptFound = await prisma.dept({ shortname: dept });
    if (deptFound) {
      const user = await prisma.createUser({
        email,
        username,
        firstYear: year,
        isLcUser: true,
        lcSalt: salt,
        password,
        dept: {
          connect: {
            shortname: dept
          }
        }
      });
    } else {
      console.log("dept no found for: " + username + " : " + dept);
    }
  }
  console.log("seeding users: Done!");
};


async function main() {
  console.log("starts seeding!");

  await createDepts();
  await createPositions();
  await createTags();
  await createProfs();
  // await createCourses();
  // await createUsers();



  console.log("All Done!");
}

main();
