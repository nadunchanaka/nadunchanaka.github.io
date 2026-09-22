import os

def verify_github_deployment():
    target_dir = r"D:\Project\Github Project\nadunchanaka.github.io\Expence_Tracker_V1.0"
    assert os.path.exists(target_dir), "GitHub Pages project directory missing!"

    api_path = os.path.join(target_dir, "js", "sheets_api.js")
    gs_path = os.path.join(target_dir, "google_apps_script.gs")
    home_path = os.path.join(target_dir, "home_dashboard.html")
    hist_path = os.path.join(target_dir, "transaction_history.html")

    # 1. Verify no localhost URLs
    for root, dirs, files in os.walk(target_dir):
        for f in files:
            if f.endswith('.html') or f.endswith('.js') or f.endswith('.gs'):
                fp = os.path.join(root, f)
                with open(fp, 'r', encoding='utf-8', errors='ignore') as fc:
                    content = fc.read()
                    assert 'localhost' not in content, f"Localhost endpoint found in {f}!"

    # 2. Check Apps Script MIME type JSON return
    with open(gs_path, 'r', encoding='utf-8') as f:
        gs_content = f.read()
    assert 'ContentService.MimeType.JSON' in gs_content, "Apps Script must return JSON mime type!"
    assert 'action === "update"' in gs_content, "Missing update action in Apps Script!"
    assert 'action === "delete"' in gs_content, "Missing delete action in Apps Script!"

    # 3. Check JS Sheets API helper fallback logic
    with open(api_path, 'r', encoding='utf-8') as f:
        api_content = f.read()
    assert 'window.GOOGLE_SHEETS_SCRIPT_URL' in api_content, "Missing fallback script URL in sheets_api.js!"
    assert 'updateTransactionInGoogleSheet' in api_content, "Missing update helper!"
    assert 'deleteTransactionFromGoogleSheet' in api_content, "Missing delete helper!"

    print("SUCCESS: Deployment configuration, zero localhost endpoints, and Google Sheets API helpers verified for GitHub Pages hosting!")

if __name__ == '__main__':
    verify_github_deployment()
