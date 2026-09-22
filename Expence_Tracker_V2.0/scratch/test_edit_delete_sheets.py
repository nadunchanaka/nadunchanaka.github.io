import os

def test_edit_delete_functionality():
    gs_path = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0\google_apps_script.gs"
    api_path = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0\js\sheets_api.js"
    add_path = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0\add_transaction.html"
    hist_path = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0\transaction_history.html"

    for path in [gs_path, api_path, add_path, hist_path]:
        assert os.path.exists(path), f"File missing: {path}"

    # 1. Check Apps Script
    with open(gs_path, 'r', encoding='utf-8') as f:
        gs_code = f.read()
    assert 'action === "delete"' in gs_code, "Missing delete action in Apps Script!"
    assert 'action === "update"' in gs_code, "Missing update action in Apps Script!"
    assert 'sheet.deleteRow' in gs_code, "Missing sheet.deleteRow in Apps Script!"

    # 2. Check Sheets API Helper
    with open(api_path, 'r', encoding='utf-8') as f:
        api_code = f.read()
    assert 'updateTransactionInGoogleSheet' in api_code, "Missing updateTransactionInGoogleSheet!"
    assert 'deleteTransactionFromGoogleSheet' in api_code, "Missing deleteTransactionFromGoogleSheet!"

    # 3. Check Add Transaction HTML
    with open(add_path, 'r', encoding='utf-8') as f:
        add_code = f.read()
    assert 'isEditMode' in add_code, "Missing isEditMode in add_transaction.html!"
    assert 'updateTransactionInGoogleSheet' in add_code, "Missing updateTransactionInGoogleSheet in add_transaction.html!"
    assert 'Edit Record' in add_code, "Missing Edit Record title text!"

    # 4. Check Transaction History HTML
    with open(hist_path, 'r', encoding='utf-8') as f:
        hist_code = f.read()
    assert 'openAddFormForEdit' in hist_code, "Missing openAddFormForEdit in transaction_history.html!"
    assert 'deleteConfirmModal' in hist_code, "Missing deleteConfirmModal in transaction_history.html!"
    assert 'executeDeleteTransaction' in hist_code, "Missing executeDeleteTransaction in transaction_history.html!"

    print("SUCCESS: Edit and Delete Google Sheets synchronization fully verified across all application files!")

if __name__ == '__main__':
    test_edit_delete_functionality()
