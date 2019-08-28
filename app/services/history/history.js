import { resPath } from '../../utils/config';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(resPath + '/databases/history.json');
let historyDb;
const History = () => {
  let instance = null;
  historyDb = low(adapter);
  let getInstance = () => {
    instance = {
      add: (word) => {
        let exist = historyDb.get('words').find({ word }).value();

        if (exist) {
          exist.records.unshift((new Date()).getTime());
          historyDb.get('words').remove({ word }).write();
          historyDb.get('words').unshift({ word, records:exist.records }).write();

        } else {
          historyDb.get('words').unshift({
            word,
            records: [
              (new Date()).getTime()
            ]
          }).write();

        }

      }
    };

    return instance;
  };
  return instance || getInstance();
};

export { History };
