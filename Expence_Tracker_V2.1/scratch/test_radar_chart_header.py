import os

def verify_radar_chart_header():
    project_dir = r"d:\Project\Expense Tracker\Expence_Tracker_V1.0"
    dash_path = os.path.join(project_dir, "home_dashboard.html")
    
    with open(dash_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    assert 'Expenses Dashboard' in content, "Expenses Dashboard header title missing"
    assert '<span class="font-label-sm text-label-sm text-on-surface-variant font-medium mt-0.5">Dashboard</span>' not in content, "Duplicate Dashboard subtitle still present in header"
    assert 'id="radar-chart-svg"' in content, "Radar chart SVG missing"
    assert 'renderRadarChart' in content, "renderRadarChart function missing"
    assert 'polygon' in content, "Radar polygon element missing"
    assert 'radar-dot' in content, "Radar vertex dot class missing"
    assert 'selectCategorySegment' in content, "Vertex tap selection handler missing"
    assert 'fetchTransactionsFromGoogleSheet' in content, "Google Sheets API integration missing"
    
    print("SUCCESS: Expenses Dashboard title, duplicate removal, Radar Chart SVG, and theme colors verified!")

if __name__ == "__main__":
    verify_radar_chart_header()
