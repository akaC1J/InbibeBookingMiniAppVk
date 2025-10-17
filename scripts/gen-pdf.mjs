import fs from "fs";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

// список файлов для конвертации
const files = [
    { src: "legal/offer.md", dest: "public/offer.html" },
    { src: "legal/privacy.md", dest: "public/privacy.html" },
];

// создаём папку public если её нет
if (!fs.existsSync("public")) fs.mkdirSync("public");

for (const f of files) {
    const content = fs.readFileSync(f.src, "utf8");

    const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
  <title>${f.src}</title>
</head>
<body>
${md.render(content)}
</body>
</html>`;

    fs.writeFileSync(f.dest, html);
    console.log(`✅ Сохранено: ${f.dest}`);
}
