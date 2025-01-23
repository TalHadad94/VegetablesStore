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

# Function to determine the section (fruits/vegetables)
def get_section(name):
    fruits = ["אבוקדו", "אבטיח", "אגס", "אננס", "אפרסמון", "אפרסק", "בננה",
               "דובדבן", "הדר", "חמוציות", "טנג'רינה", "יוזו", "ליים", "לימון",
                 "מנגו", "מלון", "משמש", "נקטרינה", "ענבים", "פומלה", "פטל", "תות",
                   "תפוז", "פפאיה", "קיווי", "שסק", "ליצ'י", "רמבוטן", "גויאבה", "קוקוס",
                     "ג'קפרות", "לונגאן", "דרגון פרות", "סטאר פרות", "אקאי", "מנגוסטין",
                       "אשכולית", "בילבאו", "דוריאן", "אוכמניות", "פסיפלורה", "שזיף",
                         "תאנה", "קלמנטינה", "נקטרין", "פומפלמוס", "מנגוסטן", "רימון", "קאקי",
                           "קנרבות", "אגוז קוקוס", "נשי", "גוונבה", "מירבל", "פייטהיה", "ספודילה",
                             "טאמארילו", "פומארוזה", "קארמבולה", "ספונדיאס", "חבוש", "מסקרפונה",
                               "חמוצייה", "אפרסק מדבר", "אבוקאטה", "קאפוק", "פייג'ואה", "מומבין",
                                 "אפרסק סיני", "מלון קטן", "בוקאיה", "אדאמס", "קאניסטל", "אפרסק דבש",
                                   "אפרסק עץ", "קוקוס מלאי", "מלון חמוץ", "גויאבה בננה", "סברס", "קיוי",
                                     "פומלית", "תפוח", "מילון", "רימונים"]  # Add more fruits
    return "fruits" if any(fruit in name for fruit in fruits) else "vegetables"

# Process the lines
products = []
for line in lines:
    line = line.strip()
    match = re.match(pattern, line)
    if match:
        name = match.group(1).strip()
        price = float(match.group(2))
        units = match.group(3).strip()
        section = get_section(name)
        image_path = f"Images/{section.capitalize()}/{name}.jpg"
        products.append({
            "name": name,
            "price": price,
            "units": units,
            "imagePath": image_path,
            "section": section
        })

# Write the output JSON
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(products, file, ensure_ascii=False, indent=4)

print(f"Data successfully converted to {output_file}")