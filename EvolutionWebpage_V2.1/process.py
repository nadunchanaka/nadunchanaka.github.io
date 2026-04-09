import os
import re

directories = [
    ("primordial_earth_sinhala", "primordial_earth_sinhala.html"),
    ("cataclysm_sinhala", "cataclysm_sinhala.html"),
    ("fossil_formation_sinhala", "fossil_creation_sinhala.html"),
    ("human_ingenuity_sinhala", "human_skill_sinhala.html"),
    ("exponential_growth_sinhala", "rapid_growth_sinhala.html"),
    ("ai_revolution_sinhala", "ai_revolution_sinhala.html"),
    ("adaptation_sinhala", "adaptation_sinhala.html"),
    ("the_exponential_journey_of_humanity_home_sinhala", "aethel_horizon_sinhala.html")
]

for folder, outfile in directories:
    infile = os.path.join(folder, "code.html")
    if not os.path.exists(infile):
        print(f"Skipping {infile}")
        continue
    
    with open(infile, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract everything from DOCTYPE up to </head>
    head_match = re.search(r'(<!DOCTYPE html>.*?</head>)', content, flags=re.DOTALL | re.IGNORECASE)
    if not head_match:
        print(f"No head found in {infile}")
        continue
    head_content = head_match.group(1)

    # Extract <main> ... </main>
    main_match = re.search(r'(<main[^>]*>.*?</main>)', content, flags=re.DOTALL | re.IGNORECASE)
    if not main_match:
        print(f"No main found in {infile}")
        continue
    main_content = main_match.group(1)
    
    # Remove 'ml-72' and 'pt-16' from <main> class
    main_content = re.sub(r'\bml-72\b', 'w-full h-full overflow-y-auto overflow-x-hidden', main_content)
    main_content = re.sub(r'\bpt-16\b', '', main_content)
    # also remove any min-h-screen to ensure proper iframe fill without pushing
    main_content = re.sub(r'\bmin-h-screen\b', 'min-h-[100dvh]', main_content)

    # Reconstruct document
    new_html = head_content + "\n<body class=\"bg-[#0c1324] text-[#dce1fb] font-body selection:bg-[#ffba20]/30 selection:text-[#ffba20] overflow-y-auto overflow-x-hidden\">\n" + main_content + "\n</body>\n</html>"
    
    with open(outfile, "w", encoding="utf-8") as f:
        f.write(new_html)
    print(f"Wrote {outfile}")

print("Done.")
