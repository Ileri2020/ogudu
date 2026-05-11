import pypdf
import json
import re
import os

def normalize_text(s):
    if not s: return ""
    return re.sub(r'\s+', ' ', s).strip()

def normalize_header(s):
    # Remove everything except A-Z
    return re.sub(r'[^A-Z]', '', s.upper())

def convert_kjv(input_path, output_path):
    print(f"Converting {input_path}...")
    reader = pypdf.PdfReader(input_path)
    bible = {"metadata": {"name": "KJV", "lang": "en"}, "books": {}}
    
    book_map = {
        "Genesis": "gen", "Exodus": "exo", "Leviticus": "lev", "Numbers": "num", "Deuteronomy": "deu",
        "Joshua": "jos", "Judges": "jud", "Ruth": "rut", "1 Samuel": "1sa", "2 Samuel": "2sa",
        "1 Kings": "1ki", "2 Kings": "2ki", "1 Chronicles": "1ch", "2 Chronicles": "2ch",
        "Ezra": "ezr", "Nehemiah": "neh", "Esther": "est", "Job": "job", "Psalms": "psa",
        "Proverbs": "pro", "Ecclesiastes": "ecc", "Song of Solomon": "sos", "Isaiah": "isa",
        "Jeremiah": "jer", "Lamentations": "lam", "Ezekiel": "eze", "Daniel": "dan", "Hosea": "hos",
        "Joel": "joe", "Amos": "amo", "Obadiah": "oba", "Jonah": "jon", "Micah": "mic",
        "Nahum": "nah", "Habakkuk": "hab", "Zephaniah": "zep", "Haggai": "hag", "Zechariah": "zec",
        "Malachi": "mal", "Matthew": "mat", "Mark": "mar", "Luke": "luk", "John": "joh",
        "Acts": "act", "Romans": "rom", "1 Corinthians": "1co", "2 Corinthians": "2co",
        "Galatians": "gal", "Ephesians": "eph", "Philippians": "phi", "Colossians": "col",
        "1 Thessalonians": "1th", "2 Thessalonians": "2th", "1 Timothy": "1ti", "2 Timothy": "2ti",
        "Titus": "tit", "Philemon": "phm", "Hebrews": "heb", "James": "jam", "1 Peter": "1pe",
        "2 Peter": "2pe", "1 John": "1jo", "2 John": "2jo", "3 John": "3jo", "Jude": "jud",
        "Revelation": "rev"
    }

    current_book_id = ""
    
    for page in reader.pages:
        text = page.extract_text()
        if not text: continue
        
        lines = text.split('\n')
        if lines:
            header = lines[0]
            for bname, bid in book_map.items():
                if bname in header and "Page" in header:
                    current_book_id = bid
                    if current_book_id not in bible["books"]:
                        bible["books"][current_book_id] = {}
                    break
        
        if not current_book_id: continue
        
        verses = re.findall(r"\{(\d+):(\d+)\}\s*(.*?)(?=\{|$)", text.replace('\n', ' '), re.DOTALL)
        for chap, verse, content in verses:
            if chap not in bible["books"][current_book_id]:
                bible["books"][current_book_id][chap] = {}
            
            bible["books"][current_book_id][chap][verse] = content.strip()

    for bid in list(bible["books"].keys()):
        for chap in list(bible["books"][bid].keys()):
            v_dict = bible["books"][bid][chap]
            if not v_dict:
                del bible["books"][bid][chap]
                continue
            v_nums = sorted([int(v) for v in v_dict.keys()])
            max_v = max(v_nums)
            v_array = [""] * max_v
            for v, txt in v_dict.items():
                v_array[int(v)-1] = txt
            bible["books"][bid][chap] = v_array

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding='utf-8') as f:
        json.dump(bible, f, ensure_ascii=False)

def convert_yoruba(input_path, output_path):
    print(f"Converting {input_path}...")
    reader = pypdf.PdfReader(input_path)
    bible = {"metadata": {"name": "Mimo", "lang": "yo"}, "books": {}}
    
    # Using normalized keys (all uppercase, no symbols)
    yo_book_map = {
        "GENESISI": "gen", 
        "EKISODU": "exo", "EKSODU": "exo", 
        "LEFITIKU": "lev", "LEFITIKTL": "lev", "IEFITIKU": "lev", "LEFITIKU": "lev",
        "NONBA": "num", "NUMERI": "num", "NUMERL": "num",
        "DIUTARONOMI": "deu", "DIUTARGNOMI": "deu",
        "JOSUA": "jos", "ONIDAAJO": "jud", "RUUTU": "rut", 
        "SAMUELII": "1sa", "SAMUELIII": "2sa",
        "AWONOBAI": "1ki", "AWONOBAII": "2ki", 
        "KIRONIKAI": "1ch", "KIRONIKAII": "2ch",
        "ESIRA": "ezr", "NEHEMAYA": "neh", "ESITA": "est", "JOOBU": "job", "SAAMU": "psa",
        "OWE": "pro", "ONIWAASU": "ecc", "ORINSOLOMONI": "sos", "AISAYA": "isa",
        "JEREMAYA": "jer", "IDARO": "lam", "ESIKIELI": "eze", "DANIELI": "dan", "HOSIA": "hos",
        "JOELI": "joe", "AMOSI": "amo", "OBADAYA": "oba", "JONA": "jon", "MIKA": "mic",
        "NAHUMU": "nah", "HABAKUKU": "hab", "SEFANAYA": "zep", "HAGAI": "hag", "SEKARAYA": "zec",
        "MALAKI": "mal", "MATIU": "mat", "MAAKU": "mar", "LUUKU": "luk", "JOHANU": "joh",
        "ISE": "act", "ROMU": "rom", "KORINTII": "1co", "KORINTIII": "2co",
        "GALATIA": "gal", "EFESU": "eph", "FILIPI": "phi", "KOLOSE": "col",
        "TESALONIKAI": "1th", "TESALONIKAII": "2th", "TIMOTII": "1ti", "TIMOTIII": "2ti",
        "TITU": "tit", "FILEMONI": "phm", "HEBERU": "heb", "JAKOBU": "jam", "PETERUI": "1pe",
        "PETERUII": "2pe", "JOHANUI": "1jo", "JOHANUII": "2jo", "JOHANVIII": "3jo", "JUDA": "jud",
        "IFIHAN": "rev"
    }
    
    book_order = [
        "gen", "exo", "lev", "num", "deu", "jos", "jud", "rut", "1sa", "2sa", "1ki", "2ki", "1ch", "2ch",
        "ezr", "neh", "est", "job", "psa", "pro", "ecc", "sos", "isa", "jer", "lam", "eze", "dan", "hos",
        "joe", "amo", "oba", "jon", "mic", "nah", "hab", "zep", "hag", "zec", "mal", "mat", "mar", "luk",
        "joh", "act", "rom", "1co", "2co", "gal", "eph", "phi", "col", "1th", "2th", "1ti", "2ti", "tit",
        "phm", "heb", "jam", "1pe", "2pe", "1jo", "2jo", "3jo", "jud", "rev"
    ]

    current_book_id = ""
    current_chap = ""
    
    for p_idx in range(9, len(reader.pages)):
        page = reader.pages[p_idx]
        text = page.extract_text()
        if not text: continue
        
        lines = text.split('\n')
        if not lines: continue
        
        # Book Detection
        header_norm = normalize_header(lines[0])
        first_lines_norm = normalize_header(" ".join(lines[:5]))
        
        found_bid = ""
        # 1. Search for strong "IWE ... NI [BOOK]" or "NI [BOOK]"
        for bname, bid in yo_book_map.items():
            if f"NI{bname}" in first_lines_norm or f"IWE{bname}" in first_lines_norm:
                found_bid = bid
                break
        
        # 2. Search in header if not found
        if not found_bid:
            for bname, bid in yo_book_map.items():
                if bname in header_norm:
                    # Stricter check for short book names
                    if len(bname) <= 3:
                        if bname == header_norm or f" {bname} " in f" {header_norm} ":
                            found_bid = bid
                            break
                    else:
                        found_bid = bid
                        break
        
        if found_bid and found_bid != current_book_id:
            # Validate transition: only allow forward movement in book_order to avoid random jumps
            curr_idx = book_order.index(current_book_id) if current_book_id in book_order else -1
            new_idx = book_order.index(found_bid)
            if new_idx >= curr_idx:
                print(f"Page {p_idx}: Switched book from {current_book_id} to {found_bid} (Header: {lines[0][:20]})")
                current_book_id = found_bid
                if current_book_id not in bible["books"]:
                    bible["books"][current_book_id] = {}
                current_chap = ""

        if not current_book_id: continue
        
        body = " ".join(lines[1:])
        segments = re.split(r"(ORI\s+\d+)", body, flags=re.IGNORECASE)
        
        for i in range(0, len(segments)):
            seg = segments[i]
            if re.match(r"ORI\s+\d+", seg, re.IGNORECASE):
                new_chap = re.search(r"\d+", seg).group()
                # Prevent random chapter jumps (e.g. from 2 to 29 on the same page unless it's a huge gap)
                # But sometimes OCR is just weird. Let's trust ORI markers.
                current_chap = new_chap
                if current_chap not in bible["books"][current_book_id]:
                    bible["books"][current_book_id][current_chap] = {}
                continue
            
            if not seg.strip(): continue
            if not current_chap: continue
            
            chap_dict = bible["books"][current_book_id][current_chap]
            markers = list(re.finditer(r"\b\d{1,3}\b", seg))
            
            # Text before the first verse number
            if markers:
                first_m = markers[0]
                text_before = normalize_text(seg[:first_m.start()])
                if text_before:
                    # If this is the start of a chapter, it's Verse 1
                    if "1" not in chap_dict:
                        chap_dict["1"] = text_before
                    else:
                        # Append to the last found verse
                        v_nums = sorted([int(k) for k in chap_dict.keys()])
                        if v_nums:
                            last_k = str(max(v_nums))
                            chap_dict[last_k] = chap_dict[last_k] + " " + text_before
            elif seg.strip():
                # No markers, append to last verse
                v_nums = sorted([int(k) for k in chap_dict.keys()])
                if v_nums:
                    last_k = str(max(v_nums))
                    chap_dict[last_k] = chap_dict[last_k] + " " + normalize_text(seg)
                elif "1" not in chap_dict:
                    chap_dict["1"] = normalize_text(seg)

            # Process numbered verses
            for j, m in enumerate(markers):
                v_num = m.group()
                if not v_num.isdigit() or int(v_num) > 180: continue
                
                start_v = m.end()
                end_v = markers[j+1].start() if j + 1 < len(markers) else len(seg)
                v_txt = normalize_text(seg[start_v:end_v])
                
                if v_num not in chap_dict:
                    chap_dict[v_num] = v_txt
                else:
                    # Append if it's already there (should not happen with re.split logic but to be safe)
                    chap_dict[v_num] += " " + v_txt

    # Final post-processing to lists
    for bid in list(bible["books"].keys()):
        for chap in list(bible["books"][bid].keys()):
            v_dict = bible["books"][bid][chap]
            if not v_dict:
                del bible["books"][bid][chap]
                continue
            v_nums = sorted([int(k) for k in v_dict.keys()])
            if not v_nums:
                del bible["books"][bid][chap]
                continue
            max_v = max(v_nums)
            v_list = [""] * max_v
            for v_str, txt in v_dict.items():
                idx = int(v_str) - 1
                if 0 <= idx < max_v:
                    v_list[idx] = txt
            bible["books"][bid][chap] = v_list

    with open(output_path, "w", encoding='utf-8') as f:
        json.dump(bible, f, ensure_ascii=False)

if __name__ == "__main__":
    convert_kjv("files/The-Holy-Bible-King-James-Version.pdf", "assets/bible/en_kjv.json")
    convert_yoruba("files/Bibeli_mimo.pdf", "assets/bible/yo_mimo.json")
