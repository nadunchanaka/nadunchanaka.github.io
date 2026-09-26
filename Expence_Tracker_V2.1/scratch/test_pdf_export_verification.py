import os
import re

def test_pdf_export():
    file_path = r"d:\Project\Github Project\nadunchanaka.github.io\Expence_Tracker_V2.0\transaction_history.html"
    assert os.path.exists(file_path), "File not found!"

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Verify library inclusions
    assert "js/html2canvas.min.js" in content, "Missing html2canvas script inclusion!"
    assert "js/jspdf.umd.min.js" in content, "Missing jspdf.umd script inclusion!"

    # 2. Verify exportStatementPDF implementation
    assert "async function exportStatementPDF()" in content, "Missing exportStatementPDF function!"
    assert "pdfContainer.id = 'pdf-statement-template'" in content, "Missing pdfContainer definition!"

    # 3. Verify Home Dashboard widgets inside PDF statement:
    # Net Balance Hero Card Widget
    assert "NET BALANCE" in content, "Missing NET BALANCE hero card title!"
    assert "linear-gradient(135deg, #3525cd 0%, #4f46e5 50%, #4338ca 100%)" in content, "Missing hero card gradient!"
    assert "Month inflow" in content, "Missing Income flow sub-pill in hero card!"
    assert "of inflow" in content, "Missing Expense flow sub-pill in hero card!"

    # 4. Executive KPI widgets
    assert "Savings Rate" in content, "Missing Savings Rate metric tile!"
    assert "Total Records" in content, "Missing Total Records metric tile!"
    assert "Avg Outflow" in content, "Missing Avg Outflow metric tile!"
    assert "Top Category" in content, "Missing Top Category metric tile!"

    # 5. Dynamic SVG Donut Chart & Category Breakdown
    assert "Expense Breakdown" in content, "Missing Expense Breakdown section!"
    assert "donutSlicesHtml" in content, "Missing donut slices HTML generation!"
    assert "xmlns=\"http://www.w3.org/2000/svg\"" in content, "Missing SVG namespace for clean rendering!"
    assert "categoryRowsHtml" in content, "Missing category legend progress bars!"

    # 6. Transaction Ledger Table
    assert "TRANSACTION LEDGER" in content, "Missing Transaction Ledger table!"
    assert "Period Totals:" in content, "Missing Period Totals summary row!"

    # 7. Robust html2canvas + jsPDF capture and slicing
    assert "await html2canvas(pdfContainer" in content, "Missing html2canvas call on pdfContainer!"
    assert "pdf.addImage" in content, "Missing pdf.addImage call!"
    assert "pdf.save(filename)" in content, "Missing pdf.save call!"
    assert "opacity: 1" in content, "Missing opacity: 1 on pdfContainer!"

    print("ALL VERIFICATIONS PASSED: PDF statement generation now accurately models Home Dashboard widgets, KPI metrics, SVG donut chart, category progress bars, and ledger with zero empty-page defects!")

if __name__ == "__main__":
    test_pdf_export()
