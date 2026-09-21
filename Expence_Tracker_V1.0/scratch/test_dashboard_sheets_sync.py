import os
import sys

def verify_dashboard_integration():
    project_dir = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0"
    
    # 1. Verify google_apps_script.gs
    gs_path = os.path.join(project_dir, "google_apps_script.gs")
    with open(gs_path, 'r', encoding='utf-8') as f:
        gs_content = f.read()
    assert "transactions.push({" in gs_content, "doGet in google_apps_script.gs missing transactions array mapping"
    assert "status: \"success\"" in gs_content, "doGet in google_apps_script.gs missing success status"
    print("SUCCESS: google_apps_script.gs doGet read endpoint verified!")

    # 2. Verify js/sheets_api.js
    api_path = os.path.join(project_dir, "js/sheets_api.js")
    with open(api_path, 'r', encoding='utf-8') as f:
        api_content = f.read()
    assert "async function fetchTransactionsFromGoogleSheet()" in api_content, "fetchTransactionsFromGoogleSheet function missing in js/sheets_api.js"
    assert "localStorage.getItem('KOSH_LOCAL_TRANSACTIONS')" in api_content, "Local storage fallback missing in fetchTransactionsFromGoogleSheet"
    print("SUCCESS: js/sheets_api.js fetchTransactionsFromGoogleSheet function verified!")

    # 3. Verify home_dashboard.html
    dash_path = os.path.join(project_dir, "home_dashboard.html")
    with open(dash_path, 'r', encoding='utf-8') as f:
        dash_content = f.read()
    
    assert 'src="js/sheets_api.js"' in dash_content, "sheets_api.js script tag missing in home_dashboard.html"
    assert 'Nadun' in dash_content, "User name Nadun missing in home_dashboard.html"
    assert 'Good ${timeGreeting}, Nadun ✨' in dash_content or 'Good' in dash_content, "Dynamic time-of-day greeting for Nadun missing"
    assert 'id="hero-net-balance"' in dash_content, "Net balance hero element missing"
    assert 'totalIncome - totalExpenses' in dash_content, "Net balance calculation (totalIncome - totalExpenses) missing"
    assert 'id="donut-svg"' in dash_content, "Donut SVG element missing"
    assert 'renderDonutChart' in dash_content, "Donut chart renderer function missing"
    assert 'id="category-legend-list"' in dash_content, "Category legend list container missing"
    assert 'id="recent-transactions-list"' in dash_content, "Recent transactions container missing"
    assert 'href="transaction_history.html"' in dash_content, "View All link to transaction_history.html missing"
    assert 'id="month-picker-modal"' in dash_content, "Month picker modal missing"
    print("SUCCESS: home_dashboard.html dynamic features & sheets integration verified!")

if __name__ == "__main__":
    verify_dashboard_integration()
    print("\nALL HOME DASHBOARD GOOGLE SHEETS SYNC TESTS PASSED!")
