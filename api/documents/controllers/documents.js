'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx){
    const { query } = ctx;
    const documents = await strapi.query('documents').find(query, ctx.populate);
    return documents;
  }
};
