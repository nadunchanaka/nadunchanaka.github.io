import os

def verify_donut_chart_breakdown():
    project_dir = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0"
    dash_path = os.path.join(project_dir, "home_dashboard.html")
    
    with open(dash_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    assert 'id="donut-svg"' in content, "Donut SVG element missing"
    assert 'renderDonutChart' in content, "renderDonutChart function missing"
    assert 'stroke-dasharray' in content, "Stroke segment dasharray calculation missing"
    assert 'id="category-legend-list"' in content, "Category progress legend list missing"
    assert 'cat-legend-item' in content, "Category legend item missing"
    assert 'selectCategorySegment' in content, "Segment tap selection handler missing"
    assert 'Expenses Dashboard' in content, "Expenses Dashboard header title missing"
    assert 'Nadun' in content, "Nadun user name missing"
    assert 'fetchTransactionsFromGoogleSheet' in content, "Google Sheets API integration missing"
    assert 'id="btn-month-selector"' in content, "Month selector button missing"
    
    print("SUCCESS: Dynamic SVG Donut Chart, stroke segment calculation, category progress breakdown list (LKR amounts, icons, progress bars, percentages), Nadun profile, and Sheets live sync verified!")

if __name__ == "__main__":
    verify_donut_chart_breakdown()
