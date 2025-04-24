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
