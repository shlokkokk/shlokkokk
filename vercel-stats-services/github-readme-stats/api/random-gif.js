export default async (req, res) => {
  try {
    const gifs = [
      // Brooklyn Nine-Nine
      "https://media1.tenor.com/m/iPRTgyLU3vYAAAAC/jake-perralta-brooklyn99.gif", // Jake Chills
      "https://media1.tenor.com/m/UC_y6M2MG1oAAAAC/brooklyn-nine-nine-b99.gif",      // Captain Holt
      "https://media1.tenor.com/m/EQn9ugqWARsAAAAC/brooklyn-nine.gif",             // Jake Dancing
      "https://media1.tenor.com/m/fb4HC_jRBQUAAAAC/b99gif-b99.gif",                 // Jake smile

      // The Office
      "https://media1.tenor.com/m/Z15l68h1Z5YAAAAC/the-office-handshake.gif",      // Michael Scott Handshake
      "https://media1.tenor.com/m/Lwz_1N2e400AAAAC/the-office-blinds.gif",          // Jim looking through blinds
      "https://media1.tenor.com/m/74qb-GZMXzkAAAAd/the-office-charm.gif",          // Michael Scott charm

      // The Mentalist
      "https://media1.tenor.com/m/5S8UeFfVRuYAAAAC/the-mentalist-simon-baker.gif", // Patrick Jane
      "https://media1.tenor.com/m/IbcJZZPrTqEAAAAd/pops-head-up-surprise.gif",      // Patrick Jane pops up

      // Reactions
      "https://media1.tenor.com/m/nC4k9qCO4s4AAAAC/embarrassed.gif"                 // Jim embarrassed
    ];

    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

    // Set headers to prevent caching
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Redirect using Vercel's helper
    res.redirect(302, randomGif);
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
