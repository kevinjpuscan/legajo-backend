'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');
const WorkerReportPdf = require('api/workers/services/worker.report.pdf');

module.exports = {
  async find(ctx) {
    const { query } = ctx;
    const workers = await strapi.query('workers').find(query, ctx.populate);
    return sanitizeEntity(workers, { model: strapi.models.workers });
  },
  async getReportPdf(ctx){
    const {anexo,worker} = ctx.params;
    const workerReport = new WorkerReportPdf({worker});
    const BUILDERS_REPORT={
      '1':workerReport.buildAnexo1Report,
      '2':workerReport.buildAnexo2Report,
      '3':workerReport.buildAnexo3Report,
      '4':workerReport.buildAnexo4Report
    };
    const buildReport=BUILDERS_REPORT[anexo];
    if(!buildReport){
      throw strapi.errors['badRequest']('Anexo not exist');
    }
    ctx.response.body = await BUILDERS_REPORT[anexo]();
    ctx.type = 'application/pdf';
  }
};
