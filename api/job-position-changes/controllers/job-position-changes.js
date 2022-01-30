'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  find(ctx) {
    const { query } = ctx;
    return strapi.query('job-position-changes').find(query, ctx.populate);
  },
};