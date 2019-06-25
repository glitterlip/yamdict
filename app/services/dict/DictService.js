import Parser from '../../utils/MdictParser';
import { configDb } from '../../utils/config';


let parsers = new Map();

const registerDictService = (ipcMain) => {
  if (!configDb.has('dicts').value()) {
    configDb.set('dicts', [
      { id: 1, name: '柯林斯双解', path: '/resources/dicts/柯林斯双解.mdx' },
      { id: 2, name: '牛津', path: '/resources/dicts/nnnn牛津双解.mdx' }
    ]).write();
  } else {
    configDb.get('dicts').value().map((dict) => {
      parsers.set(dict.name, { dict: new Parser(dict.path), path: dict.path });
    });
  }

  ipcMain.on('search-word', (event, arg) => {

    let res = findWord(arg);
    console.log(res);
    event.sender.send('search-results', res);
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
export { parsers, registerDictService, findWord };
