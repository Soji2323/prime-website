/* Round five (November 20, 2026): every way to reach us, in one file. The closing block of the home page draws its
   tiles from this list, and nothing else on the page holds these addresses for the tiles.

   FOR THE PERSON WHO FILLS IT (Adarsh's team). Open each new account, copy its public address, and type it between the
   quotes of its line, starting with https://. Leave a line empty ("") until its account is ready: an empty line is never
   shown on the public page, so nobody meets a dead link. Do not change the names on the left.
   PREVIEW: false on the public page. Set it to true only in a preview copy: every tile is then shown, and an empty one
   reads "being set up" with no link, so the owner can see the whole block on his phone.

   What it does: sets window.PRIME_CHANNELS and window.PRIME_CHANNELS_PREVIEW. What it reads: nothing.
   What calls it: index.html, before js/closing.js, which reads it and draws the tiles. */
window.PRIME_CHANNELS_PREVIEW = false;
window.PRIME_CHANNELS = [
  { key: "call",      name: "Call",      detail: "780-209-1000",           href: "tel:+17802091000",               mark: "phone" },
  { key: "whatsapp",  name: "WhatsApp",  detail: "780-209-1000",           href: "https://wa.me/17802091000",      mark: "whatsapp" },
  { key: "website",   name: "Website",   detail: "theprimecompliance.com", href: "https://theprimecompliance.com", mark: "globe" },
  { key: "facebook",  name: "Facebook",  href: "", mark: "facebook" },
  { key: "x",         name: "X",         href: "", mark: "x" },
  { key: "tiktok",    name: "TikTok",    href: "", mark: "tiktok" },
  { key: "instagram", name: "Instagram", href: "", mark: "instagram" },
  { key: "youtube",   name: "YouTube",   href: "", mark: "youtube" },
  { key: "linkedin",  name: "LinkedIn",  href: "", mark: "" }
];
