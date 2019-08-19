import {resPath} from '../../utils/config';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(resPath+'/databases/history/history.json');
const historyDb = low(adapter);
const History = () => {
    let instance = null;
    let getInstance = () => {
      instance = {
        add:()=>{

        }
      };

      return instance;
    };
    return instance || getInstance();
  }
;
