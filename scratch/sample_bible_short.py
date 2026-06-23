import pypdf
reader = pypdf.PdfReader('files/Bibeli_mimo.pdf')
with open('scratch/sample_output_short.txt', 'w', encoding='utf-8') as f:
    for i in range(15):
        print(f"Processing page {i}")
        text = reader.pages[i].extract_text()
        if text:
            f.write(f"Page {i}: {text[:200].replace('\n', ' ')}\n")
        else:
            f.write(f"Page {i}: NO TEXT\n")
