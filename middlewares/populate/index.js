module.exports = (strapi) => {
  return {
    initialize() {
      strapi.app.use(async (ctx, next) => {
        const { populate = [], ...query } = ctx.query;
        ctx.query = query;
        ctx.populate = populate;
        await next();
      });
    },
  };
};
