import re
import os

infile = "code.html"
outfile = "code.html"

with open(infile, "r", encoding="utf-8") as f:
    content = f.read()

# Extract everything from DOCTYPE up to </head>
head_match = re.search(r'(<!DOCTYPE html>.*?</head>)', content, flags=re.DOTALL | re.IGNORECASE)
head_content = head_match.group(1)

# Extract <main> ... </main>
main_match = re.search(r'(<main[^>]*>.*?</main>)', content, flags=re.DOTALL | re.IGNORECASE)
main_content = main_match.group(1)

# Remove 'ml-80' and 'pt-32' from <main> class
main_content = re.sub(r'\bml-80\b', 'w-full h-full overflow-y-auto overflow-x-hidden', main_content)
main_content = re.sub(r'\bpt-32\b', 'pt-8', main_content)
main_content = re.sub(r'\bmin-h-screen\b', 'min-h-[100dvh]', main_content)

# Remove internal <footer> if found, so it doesn't double with outer layer things though index.html doesn't have a main footer, but we'll leave it if they want it. BUT, let's just dump main_content.

# Reconstruct document
new_html = head_content + "\n<body class=\"bg-[#0c1324] text-[#dce1fb] font-body selection:bg-[#ffba20]/30 overflow-y-auto overflow-x-hidden w-full h-full\">\n" + main_content + "\n</body>\n</html>"

with open(outfile, "w", encoding="utf-8") as f:
    f.write(new_html)

print("Finished processing code.html.")
