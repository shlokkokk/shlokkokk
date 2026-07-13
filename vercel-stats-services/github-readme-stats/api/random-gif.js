export default async (req, res) => {
  const gifs = [
    // Brooklyn Nine-Nine
    "https://media1.tenor.com/m/iPRTgyLU3vYAAAAC/jake-perralta-brooklyn99.gif", // Jake Chills
    "https://media1.tenor.com/m/UC_y6M2MG1oAAAAC/brooklyn-nine-nine-b99.gif",      // Captain Holt
    "https://media1.tenor.com/m/EQn9ugqWARsAAAAC/brooklyn-nine.gif",             // Jake Dancing

    // The Office
    "https://media1.tenor.com/m/Z15l68h1Z5YAAAAC/the-office-handshake.gif",      // Michael Scott Handshake
    "https://media1.tenor.com/m/Lwz_1N2e400AAAAC/the-office-blinds.gif"          // Jim looking through blinds
  ];

  const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

  // Set headers to prevent caching
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // Redirect to the chosen GIF
  res.writeHead(302, { Location: randomGif });
  res.end();
};
