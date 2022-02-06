const MONTHS=[
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'setiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const getToday=()=>{
  const today=new Date();
  return `${today.getDate()} de ${MONTHS[today.getMonth()]} de ${today.getFullYear()}`;
};

const formatDate=(date)=>{
  if(!date){
    return '';
  }
  const currentDate=new Date(date);
  return `${currentDate.getDate()} de ${MONTHS[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;
};

module.exports={
  getToday,
  formatDate,
};