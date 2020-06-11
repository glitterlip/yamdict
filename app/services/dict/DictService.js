import Parser from '../../utils/MdictParser';
import { configDb } from '../../utils/config';
import { app, dialog } from 'electron';
import { History } from '../history/history';

const fs = require('fs');
const path = require('path');

let parsers = new Map();

const registerDictService = (ipcMain, mainWindow) => {
  loadParsers();

  ipcMain.on('search-word', (event, arg) => {

    let history = History();
    let res = findWord(arg);
    let record = history.find(arg);
    if (record) {
      res.history = record;
    }
    history.add(arg);
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

  ipcMain.on('predict', (event, arg) => {
    let predictions = [];
    if (arg) {
      predictions = predict(arg);
      event.sender.send('predictions', predictions);
    }
  });


};

const findWord = (word) => {

  let result = { word };
  parsers.forEach((parser, index) => {
    result[index] = parser.dict.findWord(word, parser.path);
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
  const resPath = path.resolve(app.getPath('userData'));
  const dictsPath = resPath + '/dicts';
  let pathArr = dictPath[0].split('/');
  let dictName = pathArr[pathArr.length - 1];
  let newPath = path.join(dictsPath, dictName);

  fs.copyFileSync(dictPath[0], newPath);
  let newParser = new Parser(dictName);
  parsers.set(dictName, { dict: newParser, path: dictName });

  configDb.get('dicts').push({
    name: dictName,
    path: dictName,
    enabled: 1,
    info: newParser.info,
    items: newParser.keyWordSummary.num_entries
  }).write();

};
const predict = (word) => {
  let arr = [];
  parsers.forEach((v, k) => {
    if (v.path.indexOf('柯林斯') > -1) {
      let kdx = reduce(v.dict.keywordIndex, word);
      let { last_word } = kdx;

      let wordSite = v.dict.indexMap.get(last_word);
      if (!wordSite) {
        return [];
      }
      let count = wordSite.count;
      let current = v.dict.flipMap.get(count);
      while (current.word.toLowerCase().replace('-', '') > word) {
        count -= 1;
        current = v.dict.flipMap.get(count);
      }

      for (let i = count; arr.length < 10; i++) {
        let { word } = v.dict.flipMap.get(i);
        if (word.indexOf(' ') === -1) {
          arr.push(v.dict.flipMap.get(i));
        }
      }

    }
  });
  return arr;
};

//二分法
const reduce = (arr, phrase) => {
  let len = arr.length;
  if (len > 1) {
    len = len >> 1;
    return phrase > arr[len - 1].last_word
      ? reduce(arr.slice(len), phrase)
      : reduce(arr.slice(0, len), phrase);
  } else {
    return arr[0];
  }
};
const DictService = {

  updateSort: (dicts) => {
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
  },

  predict: (word) => {
    return predict(word);
  }


};

export { parsers, registerDictService, findWord, loadParsers, DictService };
