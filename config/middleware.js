module.exports = {
  load: {
    before: ['responseTime', 'gzip', 'poweredBy', 'populate'],
  },
  settings: {
    populate: {
      enabled: true,
    },
    gzip: {
      enabled: true,
      options: {
        br: false,
      },
    },
    responseTime: {
      enabled: true,
    },
    poweredBy: {
      enabled: false,
      value: '',
    },
  },
};
