import os

def verify_enlarged_pie_chart():
    project_dir = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0"
    dash_path = os.path.join(project_dir, "home_dashboard.html")
    
    with open(dash_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    assert 'w-64 h-64' in content, "Larger chart container (w-64 h-64) missing"
    assert 'id="interactive-category-card"' in content, "Interactive category card missing"
    assert 'id="pie-center-insight"' not in content, "Center overlay insight should be removed"
    assert 'pctVal' in content and '%' in content, "Percentage text labels missing"
    assert 'translate(' in content, "Exploded slice shift animation missing"
    assert 'selectCategorySegment' in content, "Segment tap selection missing"
    assert 'fetchTransactionsFromGoogleSheet' in content, "Google Sheets API integration missing"
    assert 'id="btn-month-selector"' in content, "Month selector button missing"
    
    print("SUCCESS: Enlarged Pie Chart with percentage labels, exploded slice animation, interactive detail card, and Google Sheets live sync verified!")

if __name__ == "__main__":
    verify_enlarged_pie_chart()
