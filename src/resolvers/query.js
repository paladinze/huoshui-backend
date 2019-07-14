const Query = {
  user: async (parent, args, { prisma }, info) => {
    return prisma.user(args.where);
  },
  users: async (parent, args, { prisma }, info) => {
    return prisma.users(args, info);
  },
  course: async (parent, args, { prisma }, info) => {
    return prisma.course(args.where);
  },
  courses: async (parent, args, { prisma }, info) => {
    return prisma.courses(args, info);
  }
};

module.exports = Query;
