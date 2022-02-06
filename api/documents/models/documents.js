'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const updateInfoWorker= async(document)=>{
  const worker=await strapi.query('workers').findOne({id:document.worker.id},[]);
  const info=document.information.reduce((acc,current)=>{
    acc[current.field]=current.value;
    return acc;
  },{});
  const newInfo={...worker.info};
  if(['contrato',
    'resolucion-administrativa-de-designacion',
    'resolucion-administrativa-del-servicio-civil-de-carrera-o-de-nombramiento',
    'sentencia-judicial-de-reposicion',
    'otro-documento-que-acredite-fehacientemente-la-vinculacion-del-servidor-con-la-municipalidad'].includes(document?.document_factory.slug)){
    newInfo.document_number=info['document_number'] || newInfo.document_number || '';
    newInfo.bonding_modality=info['bonding_modality'] || newInfo.bonding_modality || '';
    newInfo.bonding_start_date=info['bonding_start_date'] || newInfo.bonding_start_date || '';
    newInfo.position=info['position'] || newInfo.position || '';
    newInfo.assigned_org_unit=info['assigned_org_unit'] || newInfo.assigned_org_unit || '';

    newInfo.labor_regime=info['labor_regime'] || newInfo.labor_regime || '';
    newInfo.marital_status=info['marital_status'] || newInfo.marital_status || '';
    newInfo.date_of_birth=info['date_of_birth'] || newInfo.date_of_birth || '';
    newInfo.district_of_birth=info['district_of_birth'] || newInfo.district_of_birth || '';
    newInfo.province_of_birth=info['province_of_birth'] || newInfo.province_of_birth || '';
    newInfo.department_of_birth=info['department_of_birth'] || newInfo.department_of_birth || '';
    newInfo.country_of_birth=info['country_of_birth'] || newInfo.country_of_birth || '';
    newInfo.home_address=info['home_address'] || newInfo.home_address || '';
    newInfo.address_number=info['address_number'] || newInfo.address_number || '';
    newInfo.district_of_domicile=info['district_of_domicile'] || newInfo.district_of_domicile || '';
    newInfo.province_of_domicile=info['province_of_domicile'] || newInfo.province_of_domicile || '';
    newInfo.home_department=info['home_department'] || newInfo.home_department || '';
    newInfo.email=info['email'] || newInfo.email || '';
    newInfo.telephone=info['telephone'] || newInfo.telephone || '';
    newInfo.weight=info['weight'] || newInfo.weight || '';
    newInfo.height=info['height'] || newInfo.height || '';
    newInfo.blood_group=info['blood_group'] || newInfo.blood_group || '';

    newInfo['emergency_contacts']=[{
      name:info['emergency_contact_name_1']||'',
      phone:info['emergency_contact_number_1']||'',
      email:info['emergency_contact_email_1']||'',
    },
    {
      name:info['emergency_contact_name_2']||'',
      phone:info['emergency_contact_number_2']||'',
      email:info['emergency_contact_email_2']||'',
    }
    ];
    
    strapi.query('workers').update({id:document.worker.id},{info:newInfo});
  }

  if('constancia-de-afiliacion-o-traslado'===document?.document_factory.slug){
    newInfo.regime_name=info['regime_name'] || newInfo.regime_name || '';
    newInfo.afp_name=info['afp_name'] || newInfo.afp_name || '';
    strapi.query('workers').update({id:document.worker.id},{info:newInfo});
  }

  if('certificaciones-y-o-licencias-licencias-de-conducir-otros'===document?.document_factory.slug){
    newInfo.license_class=info['license_class'] || newInfo.license_class || '';
    newInfo.license_category=info['license_category'] || newInfo.license_category || '';
    strapi.query('workers').update({id:document.worker.id},{info:newInfo});

  }
};
module.exports = {
  lifecycles: {
    async afterCreate(document) {
      updateInfoWorker(document);
    },
  },
};
