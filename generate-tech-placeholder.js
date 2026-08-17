const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "public", "images");
fs.mkdirSync(dir, { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
  <rect width="1200" height="800" fill="#1E3A45"/>
  <text x="600" y="400" font-family="Georgia, serif" font-size="48"
    fill="#F8F5EF" text-anchor="middle" dominant-baseline="middle">Technology</text>
</svg>`;

fs.writeFileSync(path.join(dir, "technology.svg"), svg);
console.log("Created public/images/technology.svg");
