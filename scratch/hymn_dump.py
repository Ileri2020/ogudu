import pypdf
reader = pypdf.PdfReader('files/Order-of-Service.pdf')
with open('scratch/hymn_dump.txt', 'w', encoding='utf-8') as f:
    for i in range(len(reader.pages)):
        text = reader.pages[i].extract_text()
        if text:
            if "HYMN" in text.upper() or "ORIN" in text.upper():
                f.write(f"Page {i}: {text[:300].replace('\n', ' ')}\n")
