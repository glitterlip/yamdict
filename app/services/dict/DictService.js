import Parser from '../../utils/MdictParser';
import { configDb } from '../../utils/config';


let parsers = new Map();

const registerDictService = (ipcMain, mainWindow) => {
  if (!configDb.has('dicts').value()) {
    configDb.set('dicts', [
      { id: 1, name: '柯林斯双解', path: '/resources/dicts/柯林斯双解.mdx', enabled: 1 },
      { id: 2, name: '牛津', path: '/resources/dicts/nnnn牛津双解.mdx', enabled: 1 }
    ]).write();
  } else {
    configDb.get('dicts').filter({ enabled: 1 }).value().map((dict) => {
      parsers.set(dict.name, { dict: new Parser(dict.path), path: dict.path });
    });
  }

  ipcMain.on('search-word', (event, arg) => {

    let res = findWord(arg);
    mainWindow.show();
    mainWindow.webContents.send('search-results', res);
  });

  ipcMain.on('get-dicts', (event, arg) => {

    event.sender.send('parsers', parsers);

  });


};

const findWord = (word) => {

  let result = {};
  console.log('receive:', word);
  parsers.forEach((parser, index) => {
    // console.log(parser.parser);
    result[index] = parser.dict.findWord(word, parser.path);
    // resultMap.set(index, parser.dict.findWord(word, parser.Path));
    //???? electron ipc cant accept Map param?
  });

  console.log(result);
  console.log('return :', result);
  return result;
};
const loadParsers = () => {
  parsers.clear();
  console.log('reload');
  configDb.get('dicts').filter({ enabled: 1 }).value().map((dict) => {
    console.log(dict);
    parsers.set(dict.name, { dict: new Parser(dict.path), path: dict.path });
  });
};
export { parsers, registerDictService, findWord, loadParsers };
