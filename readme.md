# Keyrsla

## *ef locally þá runna fyrst: export DATABASE_URL="postgres://postgres:passwordiðmitt@localhost:5432/postgres"
## *Til að keyra bakenda: fara í backend og keyra node server.js 
## *Til að keyra framenda: fara í cal.html og Go Live, þetta þarf ekkiiiii


# TODO
## *breyta nöfnum á öllum ferðum
## *bæat inn saltvík
## *setja inn description á allar ferðir, þau skrifa texta
## *beige eða ljósgrár á popup
## *finna út úr excel dótinu
## *laga fótinn, betur inn á síðuna
## *eh skrautlínur?
## *laga black sand
## *gera síu

gamla í calendar.js

 const eventId = info.event.id;
        const relatedChunks = document.querySelectorAll(`[data-event-id="${eventId}"]`);

        relatedChunks.forEach((chunk, index) => {
          const chunkWidth = chunk.offsetWidth;
          const titleFits = chunkWidth > 20; // tweak this threshold based on your font size
      
          // Insert title into first chunk that has space
          if (!chunk.innerText.trim() && titleFits) {
            chunk.innerText = info.event.title;
          }});



Gerði þetta 16.jan

Taka út úr railway
hekla adv: 6 ágúst
Landmannalaugar: 24 júlí
spirit of hekla: 19. júní, 26 júní
saltvík: 12.júlí

bæta við:
sheep round up: 15.9
Snæfellsnes: 8 júlí
solar eclipse: 8.ág
southern comfort: 21 júlí
spirit of the highlands: 3.júlí HVAÐ ER ÞETTA
the dark side of the sun: 8 ágHMM ÞESSI HEITIR SÍÐAN SOLAR ECLIPSE INN Í??
15 apríl: saltvíkHERE IS 2024 IN THE TEXT
horse round up: 9 September,22 September,30 SeptemberHÉR ER 2025 Í TEXTA
I PUT ADVANCED HERE AND 5 NIGHTS