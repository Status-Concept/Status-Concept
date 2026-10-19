"""Extract the supplied sales catalogue without changing catalogue product data."""
import json
import re
import sys
from pathlib import Path
from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
reader = PdfReader(source)
assets = root / 'public' / 'sales' / '2026'
assets.mkdir(parents=True, exist_ok=True)
offers = []
for number, page in enumerate(reader.pages[1:], 1):
    lines = [line.strip() for line in page.extract_text().splitlines() if line.strip()]
    marker = next(i for i, line in enumerate(lines) if line in ('INCLUDED ITEMS', 'AVAILABLE OPTIONS'))
    # The title and subtitle immediately precede the content marker on every offer.
    name, subtitle = lines[marker - 2:marker]
    category = lines[1]
    discount = next(int(re.match(r'(\d+)% OFF', line)[1]) for line in lines if re.match(r'\d+% OFF', line))
    money = lambda text: int(re.sub(r'[^0-9]', '', text))
    options = []
    if lines[marker] == 'AVAILABLE OPTIONS':
        stop = next(i for i, line in enumerate(lines) if re.match(r'\d+% OFF', line))
        details = lines[marker + 1:stop]
        for i, line in enumerate(lines):
            if re.fullmatch(r'\d+ CHAIRS', line):
                options.append({'quantity': int(line.split()[0]), 'original': money(lines[i + 1]), 'sale': money(lines[i + 2])})
    else:
        stop = lines.index('ORIGINAL')
        details = lines[marker + 1:stop]
        options = [{'quantity': None, 'original': money(lines[stop + 1]), 'sale': money(lines[lines.index('NOW') + 1])}]
    pictures = list(page.images)
    image = None
    if pictures:
        picture = max(pictures, key=lambda item: item.image.width * item.image.height)
        filename = f'offer-{number:02d}.webp'
        photo = picture.image.convert('RGB')
        photo.thumbnail((1400, 1000))
        photo.save(assets / filename, 'WEBP', quality=88)
        image = f'/sales/2026/{filename}'
    offers.append({'id': f'sale-2026-{number:02d}', 'page': number + 1, 'category': category,
                   'name': name, 'subtitle': subtitle, 'details': details,
                   'discount': discount, 'options': options, 'image': image})
assert len(offers) == 57
assert sum(offer['image'] is None for offer in offers) == 1
assert all(option['sale'] * 100 == option['original'] * (100 - offer['discount'])
           for offer in offers for option in offer['options'])
(root / 'src' / 'data' / 'sales2026.json').write_text(json.dumps(offers, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(offers)} offers; prices and discount arithmetic verified.')
