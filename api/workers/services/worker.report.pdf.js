const fs = require('fs');
const Mustache = require('mustache');
const appPathRoot = require('app-root-path');
const date=require('util/date.util.js');
const { convertPdf } = require('../../../util/report.pdf.util');
module.exports = class WorkerReportPdf {
  constructor({worker}) {
    this.worker = worker;
  }

  formatFamily=(familiars,defaultValues)=>{
    return familiars.map(document=>{
      const info=document.information.reduce((acc,current)=>{
        acc[current.field]=current.value;
        return acc;
      },{});
      return {
        dni:info.document_number,
        names:`${info.last_name} ${info.mothers_last_name} ${info.name}`,
        relationship:defaultValues.relationship,
        sex:info.sex,
        birth_date:date.formatDate(info.date_of_birth),
      };
    });
  }

  formatExperiencePrev=(experiences)=>{
    return experiences.map(document=>{
      const info=document.information.reduce((acc,current)=>{
        acc[current.field]=current.value;
        return acc;
      },{});
      return {
        organization:info.name_of_experiencie_center,
        position:info.main_function_performed,
        start_date: date.formatDate(info.experiencie_start_date),
        end_date:date.formatDate(info.experiencie_end_date),
        sort_date:info.experiencie_end_date,
      };
    })
      .sort((a,b)=>{
        const dateA=new Date(a.sort_date); 
        const dateB=new Date(b.sort_date);
        return dateB-dateA;
      });
  }

  formatExperience=(experiences)=>{
    return experiences.map(document=>{
      const info=document.information.reduce((acc,current)=>{
        acc[current.field]=current.value;
        return acc;
      },{});
      return {
        organization:info.target_org_unit,
        position:info.main_function_to_perform,
        start_date: date.formatDate(info.initiation_start_date),
        sort_date:info.initiation_start_date,
      };
    })
      .sort((a,b)=>{
        const dateA=new Date(a.sort_date); 
        const dateB=new Date(b.sort_date);
        return dateB-dateA;
      });
  }

  formatBasicEducation=(educations)=>{
    return educations.map(document=>{
      const info=document.information.reduce((acc,current)=>{
        acc[current.field]=current.value;
        return acc;
      },{});
      return {
        organization:info.name_of_the_educational_institution,
        level:info.level_reached,
        year_start:info.beginning_year_of_studies,
        year_end:info.final_year_of_studies,
      };
    })
      .sort((a,b)=>b.year_end-a.year_end);
  }

  formatSuperiorEducation=(educations)=>{
    return educations.map(document=>{
      const info=document.information.reduce((acc,current)=>{
        acc[current.field]=current.value;
        return acc;
      },{});
      return {
        organization:info.name_of_the_study_center,
        grade_description:info.grade_description,
        degree_date:date.formatDate(info.date_of_issue_of_the_title_or_degree),
        years: info.years_of_training,
        sort_date:info.date_of_issue_of_the_title_or_degree,
      };
    })
      .sort((a,b)=>{
        const dateA=new Date(a.sort_date); 
        const dateB=new Date(b.sort_date);
        return dateB-dateA;
      });
  }

  formatCoursesEducation=(educations)=>{
    return educations
      .map(document=>{
        const info=document.information.reduce((acc,current)=>{
          acc[current.field]=current.value;
          return acc;
        },{});
        return {
          organization:info.organization,
          description:info.capacitation_description,
          start_date: date.formatDate(info.training_start_date),
          end_date: date.formatDate(info.training_end_date),
          hours: info.hours_of_training,
          years:info.formation_years,
          sort_date:info.training_end_date,
        };
      })
      .sort((a,b)=>{
        const dateA=new Date(a.sort_date); 
        const dateB=new Date(b.sort_date);
        return dateB-dateA;
      });
  }
  
  buildAnexo1Report=async()=> {
    const fileAppRoot = appPathRoot.resolve('./templates/anexo1.mustache');
    const template = fs.readFileSync(fileAppRoot, {
      encoding: 'UTF8',
    });
    const currentWorker=await strapi.query('workers').findOne({id:this.worker},[]);
    const pairDocuments=await strapi.query('documents').find({worker:this.worker,'document_factory.slug':'copia-del-dni-del-conyuge-o-concubino-a'},['document_factory']);
    const familiar_pair=this.formatFamily(pairDocuments,{relationship:'Conyuge'});
    const childrenDocuments=await strapi.query('documents').find({worker:this.worker,'document_factory.slug':'copia-de-dni-de-los-hijos-menores-de-edad'},['document_factory']);
    let familiar_childrens=this.formatFamily(childrenDocuments,{relationship:'Hijo(a)'});
    const familiars=[...familiar_pair,...familiar_childrens];
    
    const experiencePrevDocs=await strapi.query('documents').find({worker:this.worker,'document_factory.slug_in':['certificacion-y-constancias-de-trabajos-en-el-sector-publico','resoluciones-de-designacion-de-inicio-y-termino-del-vinculo-en-el-sector-publico-o-privado','contratos-u-ordenes-de-servicios-en-el-sector-publico-o-privado','otros-documentos-que-acrediten-fehacientemente-la-experiencia-laboral']},['document_factory']);
    const experiencesPrev=this.formatExperiencePrev(experiencePrevDocs);

    const experienceDocs=await strapi.query('documents').find({worker:this.worker,'document_factory.slug':'memorandums-sobre-asignacion-de-funciones'},['document_factory']);
    const experiences=this.formatExperience(experienceDocs);

    const basicEducationDocs=await strapi.query('documents').find({worker:this.worker,'document_factory.slug':'certificado-oficial-de-estudios-basicos-del-nivel-alcanzado'},['document_factory']);
    const basicEducations=this.formatBasicEducation(basicEducationDocs);
    const superiorEducationDocs=await strapi.query('documents').find({worker:this.worker,'document_factory.slug_in':['copia-de-titulos-o-grado-de-bachiller-de-estudios-tecnicos-superiores-no-universitarios-o-superiores-universitarios','diploma-de-diplomados-oficiales-o-grado-academico-de-maestria-o-doctorado-de-corresponder']},['document_factory']);
    const superiorEducations=this.formatSuperiorEducation(superiorEducationDocs);
    const coursesEducationDocs=await strapi.query('documents').find({worker:this.worker,'document_factory.slug_in':['certificados-constancias-o-diplomas-de-cursos-y-programas-de-capacitacion','constancias-de-participacion-en-congresos-convenciones-seminarios-talleres-forums-simposios-conferencias-charlas-y-otros-similares','otros-1']},['document_factory']);
    const coursesEducations=this.formatCoursesEducation(coursesEducationDocs);
    
    const data={
      identification_number:currentWorker.identification_number,
      today: date.getToday(),
      last_names:`${currentWorker.last_names||''}`,
      first_names:`${currentWorker.first_names||''}`,
      ruc:`${currentWorker.ruc||''}`,
      civil_status:`${currentWorker.info?.marital_status||''}`,
      sex:`${currentWorker.sex||''}`,
      languages:(currentWorker.info?.languages||[]).map((language)=>({name:language})),
      weight:`${currentWorker.info?.weight||''}`,
      height:`${currentWorker.info?.height||''}`,
      blood_group:`${currentWorker.info?.blood_group||''}`,
      email:`${currentWorker.info?.email||''}`,
      date_birth:`${date.formatDate(currentWorker.info?.date_of_birth)||''}`,
      district_birth:`${currentWorker.info?.district_of_birth||''}`,
      province_birth:`${currentWorker.info?.province_of_birth||''}`,
      region_birth:`${currentWorker.info?.department_of_birth||''}`,
      country_birth:`${currentWorker.info?.country_of_birth||''}`,
      home: `${currentWorker.info?.home_address || ''} ${currentWorker.info?.address_number || ''}`,
      district_home:`${currentWorker.info?.district_of_domicile||''}`,
      province_home:`${currentWorker.info?.province_of_domicile||''}`,
      region_home:`${currentWorker.info?.home_department||''}`,
      laboral_regime:`${currentWorker.info?.labor_regime||''}`,
      bonding_modality:`${currentWorker.info?.bonding_modality||''}`,
      position:`${currentWorker.info?.position||''}`,
      bonding_start_date:`${date.formatDate(currentWorker.info?.bonding_start_date)||''}`,
      assigned_org_unit:`${currentWorker.info?.assigned_org_unit||''}`,
      bonding_document:`${currentWorker.info?.document_number||''}`,
      regime_pension:`${currentWorker.info?.regime_name||''}`,
      name_pension:`${currentWorker.info?.regime_name||''}`,
      familiars,
      emergencyContacts:currentWorker.info?.emergency_contacts,
      experiencesPrev,
      experiences,
      license_class:currentWorker.info?.license_class||'',
      license_category:currentWorker.info?.license_category||'',
      basicEducations,
      superiorEducations,
      coursesEducations,
    };
    const html = Mustache.render(template, data);
    return convertPdf(html, {
      format: 'Letter',
      orientation: 'portrait',
      header: {
        height: '10mm',
        contents: '',
      },
      footer: {
        height: '10mm',
        contents: {
          default: '', // fallback value
        },
      },
    });
  }

  buildAnexo2Report=async()=> {
    const fileAppRoot = appPathRoot.resolve('./templates/anexo2.mustache');
    const template = fs.readFileSync(fileAppRoot, {
      encoding: 'UTF8',
    });
    const currentWorker=await strapi.query('workers').findOne({id:this.worker},[]);
    const data={
      identification_number:currentWorker.identification_number,
      names:`${currentWorker.first_names} ${currentWorker.last_names}`.toUpperCase(),
      today: date.getToday(),
      home: `${currentWorker.info.home_address || ''} ${currentWorker.info.address_number || ''}`,
      email: currentWorker.info.email || '',
      phone: currentWorker.info.telephone || '',
    };
    const html = Mustache.render(template, data);
    return convertPdf(html, {
      format: 'Letter',
      orientation: 'portrait',
      header: {
        height: '10mm',
        contents: '',
      },
      footer: {
        height: '10mm',
        contents: {
          default: '', // fallback value
        },
      },
    });
  }

  buildAnexo3Report = async ()=> {
    const fileAppRoot = appPathRoot.resolve('./templates/anexo3.mustache');
    const template = fs.readFileSync(fileAppRoot, {
      encoding: 'UTF8',
    });
    
    const currentWorker=await strapi.query('workers').findOne({id:this.worker},[]);
    const data={
      identification_number:currentWorker.identification_number,
      names:`${currentWorker.first_names} ${currentWorker.last_names}`.toUpperCase(),
      today: date.getToday()
    };
    const html = Mustache.render(template, data);
    return convertPdf(html, {
      format: 'Letter',
      orientation: 'portrait',
      header: {
        height: '10mm',
        contents: '',
      },
      footer: {
        height: '10mm',
        contents: {
          default: '', // fallback value
        },
      },
    });
  }

  buildAnexo4Report=async()=> {
    const fileAppRoot = appPathRoot.resolve('./templates/anexo4.mustache');
    const template = fs.readFileSync(fileAppRoot, {
      encoding: 'UTF8',
    });

    const currentWorker=await strapi.query('workers').findOne({id:this.worker},[]);
    const data={
      identification_number:currentWorker.identification_number,
      names:`${currentWorker.first_names} ${currentWorker.last_names}`.toUpperCase(),
      today: date.getToday()
    };
    
    const html = Mustache.render(template, data);
    return convertPdf(html, {
      format: 'Letter',
      orientation: 'portrait',
      header: {
        height: '10mm',
        contents: '',
      },
      footer: {
        height: '10mm',
        contents: {
          default: '', // fallback value
        },
      },
    });
  }
};
