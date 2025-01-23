import re
import json

# File paths
input_file = "ListOfProducts.txt"
output_file = "output.json"

# Regular expression to extract details
pattern = r"^(.*?)\s*-\s*(\d+(?:\.\d+)?)\s*ש״ח\s*(.*?)$"

# Read the input file
with open(input_file, "r", encoding="utf-8") as file:
    lines = file.readlines()

# Process the lines
products = []
for line in lines:
    line = line.strip()
    match = re.match(pattern, line)
    if match:
        name = match.group(1).strip()
        price = float(match.group(2))
        units = match.group(3).strip()
        products.append({"name": name, "price": price, "units": units})

# Write the output JSON
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(products, file, ensure_ascii=False, indent=4)

print(f"Data successfully converted to {output_file}")