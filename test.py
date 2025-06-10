import pandas as pd
import json

def excel_to_json(excel_file, json_file):
  df = pd.read_excel(excel_file)
  json_string = df.to_json(orient='records', indent=2)
  json_data = json.loads(json_string)
  with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(json_data, f, indent=2, ensure_ascii=False)
  
  print(f"Excel file '{excel_file}' converted to JSON file '{json_file}'")

if __name__ == "__main__":
  excel_file = "./Câu-hỏi-tổng-ôn-Mr-Xuân-Anh.xlsx"  
  json_file = "./output.json"  
  
  excel_to_json(excel_file, json_file)