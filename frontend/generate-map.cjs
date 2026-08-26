const fs = require('fs');
const data = JSON.parse(fs.readFileSync('node_modules/@react-jvectormap/indonesia/dist/idnMerc.json', 'utf8'));
const out = `import jsVectorMap from 'jsvectormap';\n\njsVectorMap.addMap('indonesia', ${JSON.stringify(data.content)});\n`;
fs.writeFileSync('src/components/admin/indonesia-map.js', out);
