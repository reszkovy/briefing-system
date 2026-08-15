// Podmiana typografii w makiecie Figma: Inter → TWK Lausanne.
//
// KIEDY: fonty TWK Lausanne są zainstalowane w ~/Library/Fonts, ale Figma skanuje
// fonty przy starcie — dopóki jej nie zrestartujesz, listAvailableFontsAsync ich nie widzi
// i makieta stoi na Inter (zastępczo).
//
// JAK: zrestartuj Figmę, otwórz plik myx0hxLL63UuRLM7tmZrnK, potem uruchom ten kod
// przez use_figma (fileKey myx0hxLL63UuRLM7tmZrnK). Skrypt sam sprawdzi, czy font jest
// dostępny, i nic nie zmieni, jeśli go nie ma.
//
// Mapowanie wag wg BRAND.md §6: Light→300, Regular→350, Medium→500.

const A4_ID = '206:2';

const fonts = await figma.listAvailableFontsAsync();
const lausanne = fonts
  .filter(f => f.fontName.family === 'TWK Lausanne')
  .map(f => f.fontName.style);

if (!lausanne.length) {
  return { ok: false, powod: 'Figma nie widzi TWK Lausanne — zrestartuj Figmę i spróbuj ponownie.' };
}

// dopasuj realne nazwy stylów (bywa "300" albo "Light" — zależy od pliku fontu)
const pick = (...kandydaci) => kandydaci.find(s => lausanne.includes(s)) || lausanne[0];
const MAP = {
  'Light':   pick('300', 'Light', 'Regular'),
  'Regular': pick('350', 'Regular', 'Book'),
  'Medium':  pick('500', 'Medium', 'Regular'),
};

for (const style of new Set(Object.values(MAP))) {
  await figma.loadFontAsync({ family: 'TWK Lausanne', style });
}

const page = await figma.getNodeByIdAsync('188:2');
await figma.setCurrentPageAsync(page);
const A4 = await figma.getNodeByIdAsync(A4_ID);

const zmienione = [];
const pominiete = [];
for (const t of A4.query('TEXT')) {
  const segmenty = t.getStyledTextSegments(['fontName']);
  // węzeł z wieloma krojami obsłuż segment po segmencie
  for (const seg of segmenty) {
    const docelowy = MAP[seg.fontName.style];
    if (!docelowy) { pominiete.push(t.name + ' / ' + seg.fontName.style); continue; }
    await figma.loadFontAsync(seg.fontName); // stary font musi być wczytany, żeby móc pisać
    t.setRangeFontName(seg.start, seg.end, { family: 'TWK Lausanne', style: docelowy });
  }
  zmienione.push(t.id);
}

return { ok: true, mapowanie: MAP, zmienionych: zmienione.length, pominiete, mutatedNodeIds: zmienione };
