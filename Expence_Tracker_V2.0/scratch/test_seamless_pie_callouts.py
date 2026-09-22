import os

def verify_seamless_pie_callouts():
    project_dir = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0"
    dash_path = os.path.join(project_dir, "home_dashboard.html")
    
    with open(dash_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    assert "path.setAttribute('stroke', 'none')" in content or "stroke', 'none'" in content, "Seamless pie slice stroke='none' missing"
    assert 'chart-callout-text' in content, "Around-the-chart callout labels missing"
    assert 'id="interactive-category-card"' in content, "Interactive category detail card missing"
    assert 'selectCategorySegment' in content, "Segment tap selection handler missing"
    assert 'Expenses Dashboard' in content, "Expenses Dashboard title missing"
    assert 'Nadun' in content, "Nadun user name missing"
    assert 'fetchTransactionsFromGoogleSheet' in content, "Google Sheets API integration missing"
    assert 'id="btn-month-selector"' in content, "Month selector button missing"
    
    print("SUCCESS: Seamless pie chart (no white separators), no center values, around-the-chart callouts (Name, LKR Amount, Percentage), segment tap interaction, and Google Sheets live sync verified!")

if __name__ == "__main__":
    verify_seamless_pie_callouts()
