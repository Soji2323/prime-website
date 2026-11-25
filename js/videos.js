/* The films on the home page. To add or change a film, edit this list only.
   What it does: names each film, its file in the videos folder and its poster; home.js reads it (window.PRIME_VIDEOS).
   ready: false keeps a film off the page. Change it to true only after that film has passed its QA Gold Gate; the film
   then shows as a card in Films, the Films section and its menu link come back by themselves, and Watch first appears.
   Only ready films are drawn, so the page never shows a "Coming soon" card.
   card: false keeps a film off the Films cards and opens it only from Watch first on the first screen.
   place: "advisory" (round five, November 20, 2026) shows a film only in the Transformation Advisory teaser, never in
   Films and never from Watch first. Varun's film carries it; set it ready only after it passes its QA Gold Gate and says
   no price (round5/FILMS_HOME_TICKET.md).
   shape: "wide" (16 by 9) or "tall" (9 by 16) sizes the film window before the film loads; the film's own size wins.
   Round three, November 20, 2026: the films in the videos folder are the approved masters Soji sent that day
   (Prime/30_Products/TheAudit/films_approved, copied byte for byte under short names), each matched to its title, and
   each poster is a frame of that same film:
     The Letter   videos/the_letter.mp4  = Audit_FilmA_55s_v8_SpringRoadCount_English_Sia_9x16.mp4 (poster at 14 s)
     The Loop     videos/the_loop.mp4    = Prime_TheLoop_v12_SpringRoadCount_English_Sia_16x9.mp4 (poster at 6 s)
     Varun's film videos/varun.mp4       = Prime_V9_v3_StressWords_Varun_16x9.mp4 (poster at 1.5 s)
   The QA Gold Gate run on November 20 failed all four films checked, so every film stays ready: false until its fixes
   pass and the gate is run again. Over chai and The Reminder have no approved file here yet (the copies
   in site_home/web are older cuts); save each under the name in its line, with a poster from the same film, before
   setting it ready. The thin layer film failed its gate in round two (round2/QA_GOLD_GATE_film.md) and stays held back.
   After the fresh review of round three (November 20, 2026, note 2): no held film sits in this build. The four held files
   (the_layer.mp4, the_letter.mp4, the_loop.mp4, varun.mp4) were moved, whole, to the job folder
   00_Knowledge/Growth/work/jobs/site_today_layer_offers_Nov20/round3/held_films (SHA256.txt there), and the masters stay in
   TheAudit/films_approved. A film's file is copied into videos/ under the name in its line only when it passes its gate,
   and then its line is set ready: true. */
window.PRIME_VIDEOS = [
  { title: "The thin layer", sub: "Why a file in a folder is not compliance", file: "videos/the_layer.mp4", poster: "posters/the_layer.jpg", ready: false, card: false },
  { title: "The Letter", sub: "The Audit, the owner's choice", file: "videos/the_letter.mp4", poster: "posters/the_letter.jpg", shape: "tall", ready: false },
  { title: "Varun's film", sub: "From our founder", file: "videos/varun.mp4", poster: "posters/varun.jpg", shape: "wide", ready: false, card: false, place: "advisory" },
  { title: "The Loop", sub: "Who does what, every day", file: "videos/the_loop.mp4", poster: "posters/the_loop.jpg", shape: "wide", ready: false },
  { title: "Over chai", sub: "The Audit, told over chai", file: "videos/over_chai.mp4", poster: "posters/over_chai.jpg", ready: false },
  { title: "The Reminder", sub: "Never miss a date", file: "videos/reminder.mp4", poster: "", ready: false }
];
