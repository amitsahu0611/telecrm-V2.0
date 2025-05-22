// const PDFDocument = require('pdfkit');
// const fs = require('fs');

// function createInvoicePDF(invoiceData) {
//   const doc = new PDFDocument({ size: 'A4', margin: 0 });

//   // Create a write stream to save the PDF
//   const writeStream = fs.createWriteStream(`invoice-${invoiceData.quotation.number}.pdf`);
//   doc.pipe(writeStream);

//   // Header
//   doc.rect(0, 0, 595, 842).fill(invoiceData.company.bg_color || 'white'); // A4 size in points
//   doc.image(`https://invoice-api.myycrowsoft.com/docimage/${invoiceData.company.logoUrl}`, 20, 20, { width: 80, height: 60 });
  
//   doc.fillColor(invoiceData.company.color || 'black')
//      .fontSize(17)
//      .font('Helvetica-Bold')
//      .text(invoiceData.company.name, 120, 20, { width: 300, align: 'left' });

//   const addressLines = invoiceData.company.Address.split(',');
//   addressLines.forEach((line, index) => {
//     doc.fontSize(14).text(line.trim(), 120, 40 + index * 15);
//   });

//   doc.fontSize(14).text(`Tel: ${invoiceData.company.phone}`, 120, 40 + addressLines.length * 15);

//   // Invoice Type and Number
//   doc.moveDown(2);
//   doc.fontSize(20).text(invoiceData.type, { align: 'right' });
//   doc.fontSize(14).text(`No: ${invoiceData.company.prefix} ${invoiceData.quotation.number}`, { align: 'right' });

//   // Issue and Due Date
//   doc.moveDown(1);
//   doc.rect(20, doc.y, 555, 50).stroke();
//   doc.text(`Issue Date: ${invoiceData.quotation.footer.issue_date}`, 30, doc.y + 10);
//   doc.text(`Due Date: ${invoiceData.quotation.footer.due_date}`, 30, doc.y + 30);

//   // Table Header
//   doc.moveDown(2);
//   doc.fontSize(14);
//   const tableHeaders = ['Item', 'Item Name', 'Qty', 'U/ Price RM', 'Description', 'Total RM'];
//   const tableWidth = 555 / tableHeaders.length;

//   tableHeaders.forEach((header, index) => {
//     doc.text(header, 20 + index * tableWidth, doc.y, { width: tableWidth, align: 'center' });
//   });

//   // Table Rows
//   doc.moveDown(1);
//   invoiceData.quotation.itemDetails.forEach((item, index) => {
//     doc.text(index + 1, 20, doc.y);
//     doc.text(item.item, 20 + tableWidth, doc.y);
//     doc.text(item.qty, 20 + tableWidth * 2, doc.y, { align: 'center' });
//     doc.text(`${invoiceData.company.currency} ${item.unitPrice}`, 20 + tableWidth * 3, doc.y, { align: 'right' });
//     doc.text(item.description, 20 + tableWidth * 4, doc.y);
//     doc.text(`${invoiceData.company.currency} ${item.total_price}`, 20 + tableWidth * 5, doc.y, { align: 'right' });
//     doc.moveDown(1);
//   });

//   // Bank Details
//   if (invoiceData.bankData) {
//     doc.moveDown(2);
//     doc.fontSize(13).text('Bank Details', { underline: true });
//     doc.moveDown(1);
//     if (invoiceData.bankData.bankName) {
//       doc.text(`Bank Name: ${invoiceData.bankData.bankName}`);
//     }
//     if (invoiceData.bankData.accountName) {
//       doc.text(`Account Name: ${invoiceData.bankData.accountName}`);
//     }
//     if (invoiceData.bankData.accountNumber) {
//       doc.text(`Account Number: ${invoiceData.bankData.accountNumber}`);
//     }
//     if (invoiceData.bankData.swiftCode) {
//       doc.text(`SWIFT Code: ${invoiceData.bankData.swiftCode}`);
//     }
//     if (invoiceData.bankData.branch) {
//       doc.text(`Branch: ${invoiceData.bankData.branch}`);
//     }
//   }

//   // Footer
//   doc.moveDown(2);
//   doc.fontSize(14).text(`Validity: 2 Months from Invoice Date`, { align: 'left' });
//   doc.text(`Sub Total: ${invoiceData.company.currency} ${invoiceData.quotation.footer.subTotalExTax}`, { align: 'right' });
//   doc.text(`Tax (${invoiceData.tax_type}): ${invoiceData.company.currency} ${(invoiceData.quotation.footer.totalTax).toFixed(2)}`, { align: 'right' });
//   doc.fontSize(18).text(`Grand Total (Incl. Tax): ${invoiceData.company.currency} ${parseFloat(invoiceData.quotation.footer.subTotalExTax + invoiceData.quotation.footer.totalTax).toFixed(2)}`, { align: 'right', color: 'red' });

//   // Finalize PDF file
//   doc.end();
//   writeStream.on('finish', function () {
//     console.log('PDF created successfully!');
//   });
// }

// // Example usage
// const invoiceData = {
//   company: {
//     name: "Dummy Company",
//     Address: "123 Dummy St, Dummy City, DC 12345",
//     phone: "123-456-7890",
//     logoUrl: "dummy-logo.png",
//     color: "black",
//     bg_color: "white",
//     currency: "RM"
//   },
//   quotation: {
//     number: "INV-001",
//     footer: {
//       issue_date: "2023-10-01",
//       due_date: "2023-10-15",
//       subTotalExTax: 250,
//       totalTax: 15
//     },
//     itemDetails: [
//       {
//         item: "Product 1",
//         qty: 2,
//         unitPrice: 50,
//         description: "Description of Product 1",
//         total_price: 100
//       },
//       {
//         item: "Product 2",
//         qty: 1,
//         unitPrice: 150,
//         description: "Description of Product 2",
//         total_price: 150
//       }
//     ]
//   },
//   tax_type: "GST",
//   bankData: {
//     bankName: "Dummy Bank",
//     accountName: "Dummy Account",
//     accountNumber: "123456789",
//     swiftCode: "DUMMY123",
//     branch: "Dummy Branch"
//   }
// };

// // Call the function to create the PDF
// createInvoicePDF(invoiceData);



const PDFDocument = require('pdfkit');
const fs = require('fs');

const invoiceData = {
    company: {
      name: "Dummy Company",
      Address: "123 Dummy St, Dummy City, DC 12345",
      phone: "123-456-7890",
      logoUrl: "dummy-logo.png",
      color: "black",
      bg_color: "white",
      currency: "RM"
    },
    quotation: {
      number: "INV-001",
      footer: {
        issue_date: "2023-10-01",
        due_date: "2023-10-15",
        subTotalExTax: 250,
        totalTax: 15
      },
      itemDetails: [
        {
          item: "Product 1",
          qty: 2,
          unitPrice: 50,
          description: "Description of Product 1",
          total_price: 100
        },
        {
          item: "Product 2",
          qty: 1,
          unitPrice: 150,
          description: "Description of Product 2",
          total_price: 150
        }
      ]
    },
    tax_type: "GST",
    bankData: {
      bankName: "Dummy Bank",
      accountName: "Dummy Account",
      accountNumber: "123456789",
      swiftCode: "DUMMY123",
      branch: "Dummy Branch"
    }
  };

function createInvoicePDF() {
  const doc = new PDFDocument({ size: 'A4', margin: 0 });

  // Create a write stream to save the PDF
  const writeStream = fs.createWriteStream(`invoice-${invoiceData.quotation.number}.pdf`);
  doc.pipe(writeStream);

  // Header
  doc.rect(0, 0, 595, 842).fill(invoiceData.company.bg_color || 'white'); // A4 size in points
//   doc.image(`../public/docimages/Capture12 (2) - Copy - Copy-06-07-2024-11-30-22.png`, 20, 20, { width: 80, height: 60 });
  
  doc.fillColor(invoiceData.company.color || 'black')
     .fontSize(17)
     .font('Helvetica-Bold')
     .text(invoiceData.company.name, 120, 20, { width: 300, align: 'left' });

  const addressLines = invoiceData?.company?.Address?.split(',');
  addressLines?.forEach((line, index) => {
    doc.fontSize(14).text(line.trim(), 120, 40 + index * 15);
  });

  doc.fontSize(14).text(`Tel: ${invoiceData.company.phone}`, 120, 40 + addressLines?.length * 15);

  // Invoice Type and Number
  doc.moveDown(2);
  doc.fontSize(20).text(invoiceData.type, { align: 'right' });
  doc.fontSize(14).text(`No: ${invoiceData.company.prefix} ${invoiceData.quotation.number}`, { align: 'right' });

  // Issue and Due Date
  doc.moveDown(1);
  doc.rect(20, doc.y, 555, 50).stroke();
  doc.text(`Issue Date: ${invoiceData.quotation.footer.issue_date}`, 30, doc.y + 10);
  doc.text(`Due Date: ${invoiceData.quotation.footer.due_date}`, 30, doc.y + 30);

  // Table Header
  doc.moveDown(2);
  doc.fontSize(14);
  const tableHeaders = ['Item', 'Item Name', 'Qty', 'U/ Price RM', 'Description', 'Total RM'];
  const tableWidth = 555 / tableHeaders?.length;

  tableHeaders?.forEach((header, index) => {
    doc.text(header, 20 + index * tableWidth, doc.y, { width: tableWidth, align: 'center' });
  });

  // Table Rows
  doc.moveDown(1);
  invoiceData.quotation.itemDetails.forEach((item, index) => {
    doc.text(index + 1, 20, doc.y);
    doc.text(item.item, 20 + tableWidth, doc.y);
    doc.text(item.qty, 20 + tableWidth * 2, doc.y, { align: 'center' });
    doc.text(`${invoiceData.company.currency} ${item.unitPrice}`, 20 + tableWidth * 3, doc.y, { align: 'right' });
    doc.text(item.description, 20 + tableWidth * 4, doc.y);
    doc.text(`${invoiceData.company.currency} ${item.total_price}`, 20 + tableWidth * 5, doc.y, { align: 'right' });
    doc.moveDown(1);
  });

  // Bank Details
  if (invoiceData.bankData) {
    doc.moveDown(2);
    doc.fontSize(13).text('Bank Details', { underline: true });
    doc.moveDown(1);
    if (invoiceData.bankData.bankName) {
      doc.text(`Bank Name: ${invoiceData.bankData.bankName}`);
    }
    if (invoiceData.bankData.accountName) {
      doc.text(`Account Name: ${invoiceData.bankData.accountName}`);
    }
    if (invoiceData.bankData.accountNumber) {
      doc.text(`Account Number: ${invoiceData.bankData.accountNumber}`);
    }
    if (invoiceData.bankData.swiftCode) {
      doc.text(`SWIFT Code: ${invoiceData.bankData.swiftCode}`);
    }
    if (invoiceData.bankData.branch) {
      doc.text(`Branch: ${invoiceData.bankData.branch}`);
    }
  }

  // Footer
  doc.moveDown(2);
  doc.fontSize(14).text(`Validity: 2 Months from Invoice Date`, { align: 'left' });
  doc.text(`Sub Total: ${invoiceData.company.currency} ${invoiceData.quotation.footer.subTotalExTax}`, { align: 'right' });
  doc.text(`Tax (${invoiceData.tax_type}): ${invoiceData.company.currency} ${(invoiceData.quotation.footer.totalTax).toFixed(2)}`, { align: 'right' });
  doc.fontSize(18).text(`Grand Total (Incl. Tax): ${invoiceData.company.currency} ${parseFloat(invoiceData.quotation.footer.subTotalExTax + invoiceData.quotation.footer.totalTax).toFixed(2)}`, { align: 'right', color: 'red' });

  // Finalize PDF file
  doc.end();
  writeStream.on('finish', function () {
    console.log('PDF created successfully!');
  });
}

// Export the function
module.exports = {
  createInvoicePDF,
};