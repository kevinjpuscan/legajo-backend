'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async updateStatus(){
    console.log('entro');
    const knex = strapi.connections.default;

    await knex('work_licenses')
      .where('date_start', '<', knex.fn.now())
      .andWhere('date_end', '>',knex.fn.now())
      .update({
        status: 'EN_CURSO',
      });

    await knex('work_licenses')
      .where('date_end', '<',knex.fn.now())
      .update({
        status: 'FINALIZADA',
      });
  }
   
};
