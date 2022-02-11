'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    afterCreate(bonus) {
      strapi.query('bonus').update({id:bonus.id},{document_url:bonus.document.document_files[0]?.url});
    },
  },
};
