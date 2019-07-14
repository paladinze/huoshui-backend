const Subscription = {
  review: {
    subscribe: async (parent, args, { prisma }, info) => {
      return await prisma.$subscribe.review().node();
    },
    resolve: payload => {
      console.log(payload);

      return payload;
    }
  }
};

module.exports = Subscription;
