import pypdf
reader = pypdf.PdfReader('files/Bibeli_mimo.pdf')
search_text = "Sç fun awçn çmç Israeli"
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if text and search_text in text:
        print(f"Found '{search_text}' on page {i}")
