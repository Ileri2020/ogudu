import pypdf
reader = pypdf.PdfReader('files/Bibeli_mimo.pdf')
with open('scratch/header_dump.txt', 'w', encoding='utf-8') as f:
    for i in range(9, 200):
        text = reader.pages[i].extract_text()
        if text:
            lines = text.split('\n')
            if lines:
                f.write(f"Page {i}: {lines[0]}\n")
