const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const lodashId = require('lodash-id');
const adapter = new FileSync('app/database/notes/note.json');
const noteDb = low(adapter);

const note = {

  add: (info) => {

    const { word, score } = info;
    let exist = noteDb.get('words').find({ word }).value();
    if (exist) {
      noteDb.get('words').find({ word }).assign({ score, count: exist.count + 1 }).write();
    } else {
      const _now = (new Date()).getTime();
      noteDb.get('words').push({
        word,
        time: _now,
        note: '',
        score,
        count: 1,
        last_time: _now
      }).write();

    }

  }
  ,
  find: (word) => {
    return noteDb.get('words').find({ word }).value();
  },
  remove: (info) => {
    noteDb.get('words')
      .remove({ word: info })
      .write();
  },
  all: () => {
    return noteDb.get('words').value();
  },
  getDefault: (word = null) => {
    const _now = (new Date()).getTime();

    return {
      time: _now,
      note: '',
      score: 1,
      count: 1,
      last_time: _now,
      ...word
    };
  }
};

const registerNoteService = () => {
  // noteDb._.mixin(lodashId);
};


export { registerNoteService, note } ;
