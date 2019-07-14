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

const createFeedbacks = async () => {
  console.log("seeding feedbacks...");
  const feedbacks = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./leancloud/Feedback.json"))
  ).results;
  for (const feedback of feedbacks) {
    const { name, phone: contact, comment: content } = feedback;
    await prisma.createFeedback({
      name,
      contact,
      content
    });
  }
  console.log("seeding feedbacks: Done!");
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
        // console.log("dept not found for: " + name + " : " + dept);
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
        console.log("position not found for: " + name + " : " + position);
      }
    }

    const newProf = await prisma.createProf(args);
  }
  console.log("seeding profs: Done!");
};

const createCourses = async () => {
  console.log("seeding courses...");
  const datapath = path.resolve(__dirname, "./leancloud/Courses.json");
  const lc_courses = JSON.parse(fs.readFileSync(datapath)).results;
  for (const lc_course of lc_courses) {
    const {
      name,
      dept,
      prof,
      rate1: professional,
      rate2: expressive,
      rate3: kind,
      rateOverall: scoreOverall,
      reviewCount: countReview,
      reviewGoodCount: countGoodReview
    } = lc_course;

    let args = {
      name,
      professional,
      expressive,
      kind,
      scoreOverall,
      countReview,
      countGoodReview
    };

    let deptFound = null;
    if (dept) {
      const deptFound = await prisma.dept({ shortname: dept });
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

    let profFound = null;
    if (prof) {
      profFound = await prisma.profs({
        where: {
          name: prof
        }
      });
      if (profFound.length) {
        profFound = profFound[0];
        args.prof = {
          connect: {
            id: profFound.id
          }
        };
      } else {
        const newProf = await prisma.createProf({ name: prof });
        args.prof = {
          connect: {
            id: newProf.id
          }
        };
      }
    }
    const newCourse = await prisma.createCourse(args);
  }
  console.log("seeding courses: Done!");
};

const createReviews = async () => {
  console.log("seeding reviews...");
  const datapath = path.resolve(__dirname, "./leancloud/Reviews.json");
  const lc_reviews = JSON.parse(fs.readFileSync(datapath)).results;
  const userDatapath = path.resolve(__dirname, "./leancloud/_User.json");
  const lc_users = JSON.parse(fs.readFileSync(userDatapath)).results;
  for (const lc_review of lc_reviews) {
    let {
      // must data
      comment: text,
      rating: { rate1: professional = 0 },
      rating: { rate2: expressive = 0 },
      rating: { rate3: kind = 0 },
      attendance: { value: rateAttend = 0 },
      bird: { value: rateBirdy = 0 },
      homework: { value: rateHomework = 0 },
      authorId: { objectId: lcAuthorId },
      profName: prof,
      courseName: course,
      tags,
      downVote,
      upVote,
      // optional: exam data
      exam: { touched: hasExam },
      createdAt,
      updatedAt
    } = lc_review;

    let args = {
      text,
      professional,
      expressive,
      kind,
      downVote,
      upVote,
      hasExam,
      rateHomework: rateHomework++,
      rateBirdy: rateBirdy++,
      rateAttend: rateAttend++,
      createdAt,
      updatedAt
    };

    //optional: exam data
    if (hasExam) {
      args.examprep = lc_review.exam.examprep.checked;
      args.openbook = lc_review.exam.openbook.checked;
      args.oldquestion = lc_review.exam.oldquestion.checked;
      args.easymark = lc_review.exam.easiness.checked;
    }

    // connect to user
    let lcUser = lc_users.find(user => {
      return user.objectId == lcAuthorId;
    });
    args.author = {
      connect: {
        username: lcUser.username
      }
    };

    // connect to prof
    let profFound = null;
    if (prof) {
      profFound = await prisma.profs({
        where: {
          name: prof
        }
      });
      if (profFound.length) {
        profFound = profFound[0];
        args.prof = {
          connect: {
            id: profFound.id
          }
        };
      } else {
        const newProf = await prisma.createProf({ name: prof });
        args.prof = {
          connect: {
            id: newProf.id
          }
        };
      }
    }

    // connect to course
    if (profFound) {
      let courseFound = null;
      courseFound = await prisma.prof({ id: profFound.id }).courses({
        where: {
          name: course
        }
      });
      if (courseFound.length) {
        courseFound = courseFound[0];
        args.course = {
          connect: {
            id: courseFound.id
          }
        };
      } else {
        console.log("course not found for: " + prof + " : " + course);
      }
    }

    // connect tags
    args.tags = {
      connect: []
    };
    for (const tag of tags) {
      const tagName = tag.value;
      const tagFound = await prisma.tag({ name: tagName });
      args.tags.connect.push({ id: tagFound.id });
    }

    const newReview = await prisma.createReview(args);
  }
  console.log("seeding reviews: Done!");
};

const createLikedReviews = async () => {
  console.log("seeding liked reviews...");
  const datapath = path.resolve(
    __dirname,
    "./leancloud/_Join:Reviews:likedReviews:_User.json"
  );
  const lcLikedReviews = JSON.parse(fs.readFileSync(datapath)).results;
  const lcUsers = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./leancloud/_User.json"))
  ).results;
  const lcReviews = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./leancloud/Reviews.json"))
  ).results;

  for (const likedReview of lcLikedReviews) {
    const { relatedId: lcReviewId, owningId: lcUserId } = likedReview;

    // find the user
    let lcUser = lcUsers.find(user => {
      return user.objectId == lcUserId;
    });
    const user = await prisma.user({ username: lcUser.username });

    // find the review
    let lcReview = lcReviews.find(review => {
      return review.objectId == lcReviewId;
    });
    let review = await prisma.reviews({
      where: {
        author: {
          id: user.id
        },
        course: {
          name: lcReview.courseName
        },
        prof: {
          name: lcReview.profName
        }
      }
    });
    if (review.length) {
      review = review[0];
      await prisma.updateUser({
        data: {
          likedReviews: {
            connect: {
              id: review.id
            }
          }
        },
        where: {
          id: user.id
        }
      });
    }
  }
  console.log("seeding likedReviews: Done!");
};

const createDislikedReviews = async () => {
  console.log("seeding disliked reviews...");
  const datapath = path.resolve(
    __dirname,
    "./leancloud/_Join:Reviews:dislikedReviews:_User.json"
  );
  const lcDislikedReviews = JSON.parse(fs.readFileSync(datapath)).results;
  const lcUsers = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./leancloud/_User.json"))
  ).results;
  const lcReviews = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./leancloud/Reviews.json"))
  ).results;

  for (const dislikedReview of lcDislikedReviews) {
    const { relatedId: lcReviewId, owningId: lcUserId } = dislikedReview;

    // find the user
    let lcUser = lcUsers.find(user => {
      return user.objectId == lcUserId;
    });
    const user = await prisma.user({ username: lcUser.username });

    // find the review
    let lcReview = lcReviews.find(review => {
      return review.objectId == lcReviewId;
    });
    let review = await prisma.reviews({
      where: {
        author: {
          id: user.id
        },
        course: {
          name: lcReview.courseName
        },
        prof: {
          name: lcReview.profName
        }
      }
    });
    if (review.length) {
      review = review[0];
      await prisma.updateUser({
        data: {
          dislikedReviews: {
            connect: {
              id: review.id
            }
          }
        },
        where: {
          id: user.id
        }
      });
    }
  }
  console.log("seeding dislikedReviews: Done!");
};

const createLikedCourses = async () => {
  console.log("seeding liked courses...");
  const lcLikedCourses = JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        "./leancloud/_Join:Courses:likedCourses:_User.json"
      )
    )
  ).results;
  const lcUsers = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./leancloud/_User.json"))
  ).results;
  const lcCourses = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./leancloud/Courses.json"))
  ).results;

  for (const likedCourse of lcLikedCourses) {
    const { relatedId: lcCourseId, owningId: lcUserId } = likedCourse;

    // find the user
    let lcUser = lcUsers.find(user => {
      return user.objectId == lcUserId;
    });
    const user = await prisma.user({ username: lcUser.username });

    // find the course
    let lcCourse = lcCourses.find(course => {
      return course.objectId == lcCourseId;
    });
    let course = await prisma.courses({
      where: {
        name: lcCourse.name,
        prof: {
          name: lcCourse.prof
        }
      }
    });
    if (course.length) {
      course = course[0];
      await prisma.updateUser({
        data: {
          likedCourses: {
            connect: {
              id: course.id
            }
          }
        },
        where: {
          id: user.id
        }
      });
    }
  }
  console.log("seeding likedCourses: Done!");
};

async function main() {
  console.log("starts seeding!");

  await createDepts();
  await createPositions();
  await createTags();
  await createProfs();
  await createCourses();
  await createUsers();
  await createReviews();
  await createLikedReviews();
  await createDislikedReviews();
  await createLikedCourses();
  await createFeedbacks();

  console.log("All Done!");
}

main();
