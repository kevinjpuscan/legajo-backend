const pdf = require('html-pdf');
const convertPdf = function (html, options = {}) {
  return new Promise((resolve, reject) => {
    pdf.create(html, options).toBuffer(function (err, buffer) {
      if (err) {
        reject(err);
        return;
      }
      resolve(buffer);
    });
  });
};

module.exports = { convertPdf };
