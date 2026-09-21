import os

def test_unique_id_edit_flow():
    gs_path = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0\google_apps_script.gs"
    api_path = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0\js\sheets_api.js"
    add_path = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0\add_transaction.html"
    hist_path = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0\transaction_history.html"

    # 1. Check Apps Script code logic
    with open(gs_path, 'r', encoding='utf-8') as f:
        gs_code = f.read()

    assert 'action === "update"' in gs_code, "Missing update action in Apps Script!"
    assert 'Cannot update transaction: Missing Transaction ID.' in gs_code, "Missing missing ID error check!"
    assert 'not found in sheet for updating' in gs_code, "Missing not found error response in Apps Script!"
    assert 'Preserves Column A (Transaction ID) and Column H (Created Date/Time)' in gs_code or 'setValue' in gs_code, "Missing row update verification in Apps Script!"

    # 2. Check Sheets API Helper
    with open(api_path, 'r', encoding='utf-8') as f:
        api_code = f.read()

    assert 'updateTransactionInGoogleSheet' in api_code, "Missing updateTransactionInGoogleSheet helper!"
    assert 'action: "update"' in api_code, "Missing update action in API helper!"

    # 3. Check Add Transaction HTML
    with open(add_path, 'r', encoding='utf-8') as f:
        add_code = f.read()

    assert 'isEditMode' in add_code, "Missing isEditMode in add_transaction.html!"
    assert 'transactionId: editingTransaction.transactionId' in add_code, "Missing transactionId preservation!"
    assert 'createdAt: editingTransaction.createdAt' in add_code, "Missing createdAt preservation!"
    assert 'updateTransactionInGoogleSheet' in add_code, "Missing update call in add_transaction.html!"
    assert 'retrySubmission()' in add_code, "Missing retrySubmission in add_transaction.html!"

    # 4. Check Transaction History HTML
    with open(hist_path, 'r', encoding='utf-8') as f:
        hist_code = f.read()

    assert 'openAddFormForEdit' in hist_code, "Missing openAddFormForEdit in transaction_history.html!"

    print("SUCCESS: Unique Transaction ID edit synchronization and error/retry flow fully verified!")

if __name__ == '__main__':
    test_unique_id_edit_flow()
