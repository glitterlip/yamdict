import Parser from '../../utils/MdictParser';
import { configDb } from '../../utils/config';
import { dialog } from 'electron';
// import {resPath} from '../../main.dev';
const fs = require('fs');
const path = require('path');


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

  ipcMain.on('add-dict-dialog', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: '词典文件', extensions: ['mdx'] }
      ]
    }, (files) => {
      if (files) {
        addDict(files);
      }
    });
  });


};

const findWord = (word) => {

  let result = {};
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
const addDict = (dictPath) => {

  let pathArr = dictPath[0].split('/');
  let dictName = pathArr[pathArr.length - 1];
  let newPath = path.join(__dirname, '../../../resources/dicts/' + dictName);

  fs.copyFileSync(dictPath[0], newPath);
  let newParser = new Parser('/resources/dicts/' + dictName);
  parsers.set(dictName, { dict: newParser, path: '/resources/dicts/' + dictName });

  configDb.get('dicts').push({
    name: dictName,
    path: '/resources/dicts/' + dictName,
    enabled: 1,
    info: newParser.info
  }).write();

};
let a = 0;

const DictService = {

  updateSort: (dicts) => {
    a++;
    console.log(a);
    console.log(dicts);
    configDb.get('dicts').remove().write();
    configDb.set('dicts', [...dicts]).write();

  },

  getAllDicts: () => {
    return configDb.get('dicts').value();

  },

  rename: (newName, oldName) => {

    configDb.get('dicts').find({ name: oldName }).assign({ name: newName }).write();
  },

  findWord: (word) => {
    return findWord(word);
  },

  addDict: (dictPath) => {
    addDict(dictPath);
  }


};

export { parsers, registerDictService, findWord, loadParsers, DictService };
