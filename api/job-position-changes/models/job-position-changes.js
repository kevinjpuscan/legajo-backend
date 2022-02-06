'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const updateWorker=async(worker)=>{
  const {id}=worker;
  const lastChangePositions=await strapi.query('job-position-changes').find({_where:{worker:id},_sort:'date_change:desc',_limit:1},[]);
  const lastPositionId=lastChangePositions[0]?.job_position_to;
  await strapi.query('workers').update({id},{job_position:lastPositionId || null});
};
module.exports = {
  lifecycles: {
    async afterUpdate({ worker }) {
      await updateWorker(worker);
    },
    async afterCreate({worker}) {
      await updateWorker(worker);
    },
    async afterDelete({worker}) {
      await updateWorker(worker);
    },
  },
};
