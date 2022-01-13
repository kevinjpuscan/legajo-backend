'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
 const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async find(ctx) {
    const { query } = ctx;
    const workers = await strapi.query('workers').find(query, ctx.populate);
    return sanitizeEntity(workers, { model: strapi.models.workers });
  },
};
