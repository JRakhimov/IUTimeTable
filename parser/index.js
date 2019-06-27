const EdupageParser = require("./parser");
const fs = require("fs");

fs.readFile("timeTableExample.svg", "utf8", (err, svg) => {
  if (err) throw err;

  const edupageParser = new EdupageParser(svg);

  console.log(JSON.stringify(edupageParser.parseTimeTable(), undefined, 2));
});

fs.readFile('teacherExample.svg', 'utf8', (err, svg) => {
  if (err) throw err;

  const edupageParser = new EdupageParser(svg);

  console.log(edupageParser.parseTeacher().timeTable[0]);
});
