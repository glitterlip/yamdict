const fs = require('fs');
const path = require('path');
const copyFolder = (source, destiny) => {
  if (fs.existsSync(source)) {
    if (!fs.existsSync(destiny)) {
      fs.mkdirSync(destiny);
    }
    let files = fs.readdirSync(source);

    files.map((file) => {
      const newSource = path.join(source, file);
      const newDestiny = path.join(destiny, file);
      if (fs.statSync(newSource).isFile()) {
        fs.copyFileSync(newSource, newDestiny);
      } else if (fs.statSync(newSource).isDirectory()) {
        copyFolder(newSource, newDestiny);
      }

    });
  }
};

export { copyFolder };
