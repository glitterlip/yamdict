// import { app } from 'electron';
import is from 'electron-is';

const { app } = process.type === 'browser' ? require('electron') : require('electron').remote;
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const appPath = is.dev() ? path.join(__dirname,'../') : path.resolve(app.getAppPath(), '../../');
const resPath = app.getPath('userData');
const adapter = new FileSync(resPath + '/databases/config.json');
const configDb = low(adapter);

const registerConfig = () => {

  if (!configDb.has('dicts').value()) {
    configDb.set('dicts', [
      { name: '柯林斯双解', path: '柯林斯双解.mdx', enabled: 1 },
      { name: '牛津', path: '牛津双解.mdx', enabled: 1 }
    ]).write();
  }


};

const parserNames = () => {
  return configDb.get('dicts')
    .map('name')
    .value();

};
export { registerConfig, configDb, parserNames, appPath, resPath } ;
