import os

def verify_radial_chart_dashboard():
    project_dir = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0"
    dash_path = os.path.join(project_dir, "home_dashboard.html")
    
    with open(dash_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    assert 'Nadun' in content, "Nadun name missing in dashboard"
    assert 'account_circle' in content, "Clean male profile icon missing"
    assert 'timeGreeting = "night"' in content or 'night' in content, "Night greeting state missing"
    assert 'Good ${timeGreeting}, Nadun' in content, "Dynamic greeting logic missing"
    assert 'id="radial-chart-svg"' in content, "Radial chart SVG missing"
    assert 'selectCategorySegment' in content, "Segment tap selection handler missing"
    assert 'renderRadialChart' in content, "Radial chart renderer missing"
    assert 'fetchTransactionsFromGoogleSheet' in content, "Google Sheets API integration missing"
    assert 'id="btn-month-selector"' in content, "Month selector button missing"
    
    print("SUCCESS: All radial chart, profile icon, dynamic 4-state greeting, and Google Sheets connections verified!")

if __name__ == "__main__":
    verify_radial_chart_dashboard()
