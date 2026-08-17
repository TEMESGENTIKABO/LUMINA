const fs = require("fs");
const path = require("path");

const placeholders = [
  { name: "politics", color: "#8C2F2F", label: "Politics" },
  { name: "world", color: "#1E3A45", label: "World" },
  { name: "analysis", color: "#2B2926", label: "Analysis" },
  { name: "africa", color: "#8C2F2F", label: "Africa" },
  { name: "film", color: "#B5623A", label: "Film" },
  { name: "arts", color: "#C79A45", label: "Arts" },
  { name: "markets", color: "#1E3A45", label: "Markets" },
  { name: "diaspora", color: "#1E3A45", label: "Diaspora" },
  { name: "opinion", color: "#2B2926", label: "Opinion" },
];

const dir = path.join(__dirname, "public", "images");
fs.mkdirSync(dir, { recursive: true });

for (const { name, color, label } of placeholders) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <rect width="1200" height="800" fill="${color}"/>
    <text x="600" y="400" font-family="Georgia, serif" font-size="48"
      fill="#F8F5EF" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`;
  fs.writeFileSync(path.join(dir, `${name}.svg`), svg);
}

console.log("Done - additional placeholder SVGs created.");
