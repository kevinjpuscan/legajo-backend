'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const { query } = ctx;
    const documentFactories = await strapi.query('document-factories').find(query, ctx.populate);
    return documentFactories;
  },
};
