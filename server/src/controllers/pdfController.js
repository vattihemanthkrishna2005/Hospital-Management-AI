const PDFDocument = require('pdfkit');
const { getQuery } = require('../config/db');

// Generate Appointment Confirmation Letter PDF
exports.generateAppointmentPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await getQuery('SELECT * FROM appointments WHERE id = ? OR reference_code = ?', [id, id]);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers for inline PDF preview or download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Appointment_${appointment.reference_code}.pdf`);

    doc.pipe(res);

    // Header Banner
    doc.fillColor('#0f172a').rect(0, 0, doc.page.width, 120).fill();

    doc.fillColor('#38bdf8').fontSize(24).font('Helvetica-Bold').text('MediCare Hub Hospital', 50, 35);
    doc.fillColor('#94a3b8').fontSize(11).font('Helvetica').text('Official Appointment Confirmation & Visitor Slip', 50, 65);
    doc.fillColor('#ffffff').fontSize(10).text('Emergency Support: 1-800-MEDICARE', 50, 85);

    // Appointment Reference Box
    doc.fillColor('#f1f5f9').roundedRect(380, 25, 170, 70, 8).fill();
    doc.fillColor('#0284c7').fontSize(10).font('Helvetica-Bold').text('REFERENCE CODE', 395, 40);
    doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold').text(appointment.reference_code, 395, 58);

    doc.moveDown(4);

    // Section Title
    doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold').text('Appointment Details', 50, 150);
    doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, 170).lineTo(545, 170).stroke();

    // Table Content
    const startY = 190;
    const details = [
      ['Patient Name:', appointment.patient_name],
      ['Email:', appointment.patient_email],
      ['Phone Number:', appointment.patient_phone || 'N/A'],
      ['Consulting Doctor:', appointment.doctor_name],
      ['Department / Specialization:', appointment.specialization],
      ['Date of Appointment:', appointment.appointment_date],
      ['Time Slot:', appointment.appointment_time],
      ['Current Status:', appointment.status],
      ['Symptoms / Notes:', appointment.symptoms || 'Routine Visit']
    ];

    let currentY = startY;
    details.forEach(([label, value], index) => {
      if (index % 2 === 0) {
        doc.fillColor('#f8fafc').rect(50, currentY - 5, 495, 26).fill();
      }
      doc.fillColor('#475569').fontSize(11).font('Helvetica-Bold').text(label, 60, currentY);
      doc.fillColor('#0f172a').fontSize(11).font('Helvetica').text(value, 230, currentY);
      currentY += 28;
    });

    // Instructions Box
    doc.moveDown(2);
    doc.fillColor('#e0f2fe').roundedRect(50, currentY + 10, 495, 80, 8).fill();
    doc.fillColor('#0369a1').fontSize(12).font('Helvetica-Bold').text('Important Patient Instructions:', 65, currentY + 22);
    doc.fillColor('#0c4a6e').fontSize(10).font('Helvetica')
      .text('1. Please arrive 15 minutes before your scheduled appointment time.', 65, currentY + 40)
      .text('2. Carry your government photo ID and previous medical records/prescriptions if applicable.', 65, currentY + 55)
      .text('3. Show this digital or printed slip at the main OPD reception counter.', 65, currentY + 70);

    // Footer Signature
    doc.fillColor('#94a3b8').fontSize(9).font('Helvetica')
      .text('Generated electronically by MediCare Hub System. No signature required.', 50, 750, { align: 'center' });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
