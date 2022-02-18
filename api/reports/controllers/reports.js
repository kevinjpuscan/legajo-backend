'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async getData(ctx){
    const {slug,filters=[],page=1}=ctx.query;
    const knex = strapi.connections.default;
    const [report]=await strapi.query('reports').find({slug},['data_source']);

    console.log(filters);
    //Add query of order
    let order_query='';
    const {order}=report.config || {order:false};
    if(order){
      order_query=`order by ${order}`;
    }

    //Add query of pagination
    let paginate_query='';
    const {perPage}=report.config?.paginate || {perPage:false};
    if(perPage){
      paginate_query=`limit ${perPage} offset ${(page-1)*perPage}`;
    }

    let queryDB=`${report.data_source.query} ${order_query} ${paginate_query};`;

    let where_query='';

    if(filters.length>0){
      where_query=report.where; 
    }

    for(const {param,value} of filters){
      console.log(param,value);
      where_query=where_query.replace(`{{${param}}}`,value);
    }

    queryDB=queryDB.replace('{{where}}',where_query);
    
    console.log(queryDB);
    const data=await knex.raw(queryDB,[]);
    return {
      data:data.rows
    };
  },

  async getFilterOptions(ctx){
    const {query} = ctx.request.body;
    const knex = strapi.connections.default;
    const data = await knex.raw(query,[]);
    return data.rows;
  }
};
