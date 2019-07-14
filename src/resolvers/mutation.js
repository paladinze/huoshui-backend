const bycrypt = require("bcryptjs");
const getUserId = require("../utils/getUserId");
const generateToken = require("../utils/generateToken");
const hashPassword = require("../utils/hashPassword");

const mutation = {
  createReview: async (parent, args, { prisma }, info) => {
    const review = await prisma.createReview({
      ...args.data,
      updatedAt: new Date(),
      createdAt: new Date()
    });
    return review;
  },
  async login(parent, args, { prisma }, info) {
    const user = await prisma.user({
      email: args.data.email
    });

    if (!user) {
      throw new Error("Unable to login");
    }
    const verified = await bycrypt.compare(args.data.password, user.password);
    if (!verified) {
      throw new Error("user credential invalid");
    }
    return {
      user,
      token: generateToken(user.id)
    };
  },

  async createUser(parent, args, { prisma }, info) {
    // validate email
    const emailTaken = await prisma.$exists.user({ email: args.data.email });
    if (emailTaken) {
      throw new Error("email taken");
    }

    // hash password`
    const password = await hashPassword(args.data.password);
    const user = await prisma.createUser({
      ...args.data,
      password
    });
    return {
      user,
      token: generateToken(user.id)
    };
  },

  async updateUser(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);
    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password);
    }

    const user = await prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );
    return user;
  }
};

module.exports = mutation;
