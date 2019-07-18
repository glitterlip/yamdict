import Parser from '../../utils/MdictParser';
import { configDb } from '../../utils/config';


let parsers = new Map();

const registerDictService = (ipcMain, mainWindow) => {
  loadParsers();

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

  return result;
};
const loadParsers = () => {
  parsers.clear();
  if (!configDb.has('dicts').value()) {
    configDb.set('dicts', [
      { name: '柯林斯双解', path: '/resources/dicts/柯林斯双解.mdx', enabled: 1 },
      { name: '牛津', path: '/resources/dicts/nnnn牛津双解.mdx', enabled: 1 }
    ]).write();
  } else {
    configDb.get('dicts').filter({ enabled: 1 }).value().map((dict) => {

      let newParser = new Parser(dict.path);
      parsers.set(dict.name, { dict: newParser, path: dict.path });
      if (!dict.hasOwnProperty('info')) {
        configDb.get('dicts').find({ name: dict.name }).assign({ info: newParser.headerStr }).write();
      }

    });
  }

};
export { parsers, registerDictService, findWord, loadParsers };
