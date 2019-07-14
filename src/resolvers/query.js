const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        OR: [{ username_contains: args.query }, { email_contains: args.query }]
      };
    }

    return prisma.users(opArgs, info);
  }
};

module.exports = Query;
