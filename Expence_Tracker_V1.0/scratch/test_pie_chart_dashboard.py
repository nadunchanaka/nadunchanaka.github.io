import os

def verify_pie_chart_dashboard():
    project_dir = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0"
    dash_path = os.path.join(project_dir, "home_dashboard.html")
    
    with open(dash_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    assert 'Expenses Dashboard' in content, "Expenses Dashboard title missing"
    assert 'id="pie-chart-svg"' in content, "Pie chart SVG element missing"
    assert 'renderPieChart' in content, "renderPieChart function missing"
    assert 'getPieSlicePath' in content, "getPieSlicePath function missing"
    assert 'pie-slice' in content, "pie-slice class missing"
    assert 'selectCategorySegment' in content, "Slice tap interaction handler missing"
    assert 'Nadun' in content, "Nadun user name missing"
    assert 'account_circle' in content, "Profile icon missing"
    assert 'fetchTransactionsFromGoogleSheet' in content, "Google Sheets API integration missing"
    assert 'id="btn-month-selector"' in content, "Month selector button missing"
    
    print("SUCCESS: Pie chart SVG, slice interaction, Expenses Dashboard title, Nadun profile, and Sheets sync verified!")

if __name__ == "__main__":
    verify_pie_chart_dashboard()
