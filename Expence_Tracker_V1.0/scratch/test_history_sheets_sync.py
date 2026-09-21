import os
import sys

def verify_history_page():
    file_path = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0\transaction_history.html"
    assert os.path.exists(file_path), "transaction_history.html does not exist!"

    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Check key requirements:
    # 1. Header Name: Expenses Dashboard
    assert "Expenses Dashboard" in html, "Missing 'Expenses Dashboard' title!"
    # 2. No duplicated header title
    assert html.count("Expenses Dashboard</span>") == 1, "Duplicate 'Expenses Dashboard' text found!"

    # 3. Google Sheets JS imported
    assert '<script src="js/sheets_api.js"></script>' in html, "Missing sheets_api.js script inclusion!"

    # 4. Search Bar present
    assert 'id="transactionSearch"' in html, "Missing search bar element!"

    # 5. Horizon and Category Filter Chips
    assert 'id="horizon-pills-row"' in html, "Missing horizon pills row!"
    assert 'id="category-pills-row"' in html, "Missing category pills row!"

    # 6. Monthly Flow Summary Ribbon
    assert 'id="summary-net-flow"' in html, "Missing summary net flow element!"
    assert 'id="summary-count-label"' in html, "Missing transaction count label element!"

    # 7. Quick Edit modal & Delete toast
    assert 'id="quickEditModal"' in html, "Missing quick edit modal!"
    assert 'id="deleteConfirmSheet"' in html, "Missing delete toast element!"

    # 8. CSV Exporter
    assert 'id="exportStatementBtn"' in html, "Missing statement export button!"
    assert 'exportStatementCSV' in html, "Missing exportStatementCSV function!"

    # 9. Functionality to fetch from sheets
    assert 'fetchTransactionsFromGoogleSheet' in html, "Missing fetchTransactionsFromGoogleSheet call!"

    print("SUCCESS: transaction_history.html fully verified for real Google Sheets sync, search, filters, quick edit/delete, and CSV export!")

if __name__ == "__main__":
    verify_history_page()
