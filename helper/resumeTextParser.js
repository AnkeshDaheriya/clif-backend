const fs = require("fs");
const pdfParse = require("pdf-parser");

const textExtraction = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, pdfBuffer) => {
      if (err) {
        return reject(`Error reading file: ${err.message}`);
      }

      pdfParse.pdf2json(pdfBuffer, (error, data) => {
        if (error) {
          return reject(`Error parsing PDF: ${error.message}`);
        }

        // Check if the data contains the expected structure
        if (!data.pages) {
          return reject("Invalid PDF structure or no pages found.");
        }
        console.log("DATA", data.pages);
        // const pages = data.pages.map((page)=>{
        //     return page.texts
        // })
        const pages = data.pages.map((page) => {
          return page.texts
            .map((textObj) => textObj.text)
            .join(" ")
            .trim();
        });

        // Create a structured JSON object
        const jsonOutput = {
          pages: pages,
        };
        // console.log("JSON Output:", JSON.stringify(jsonOutput, null, 2));
        resolve(jsonOutput);
      });
    });
  });
};

module.exports.textExtraction = textExtraction;
