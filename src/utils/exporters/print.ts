export const printContent = (id: string) => {
  const printWindow = window.open('', '', 'height=600,width=800');
  const printableContent = document.getElementById(id)?.innerHTML;
  
  if (printableContent && printWindow) {
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>@media print { /* Your print-specific styles here */ }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printableContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close(); // Necessary for IE >= 10
    printWindow.print();
  }
};
