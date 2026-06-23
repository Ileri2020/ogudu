import pypdf
reader = pypdf.PdfReader('files/Bibeli_mimo.pdf')
with open('scratch/sample_output.txt', 'w', encoding='utf-8') as f:
    for i in range(100):
        text = reader.pages[i].extract_text()
        if text:
            f.write(f"Page {i}: {text[:200].replace('\n', ' ')}\n")
