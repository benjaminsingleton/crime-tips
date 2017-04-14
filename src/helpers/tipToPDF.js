import jsPDF from 'jspdf';

export default function tipToPDF() {
    var doc = new jsPDF()
    doc.setFontSize(20)
    doc.text(20, 20, 'Gotham Crime Tips Report')

    doc.setFontSize(14)
    doc.text(20, 30, 'Confidential text.')

    doc.save("tip.pdf"); 
}

