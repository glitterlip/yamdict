const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const lodashId = require('lodash-id');
const adapter = new FileSync('app/database/notes/note.json');
const noteDb = low(adapter);

const note = {

  add: (info) => {

    const { word, score } = info;
    if (noteDb.get('words').find({ word }).value()) {
      noteDb.get('words').find({ word }).assign({ score }).write();
    } else {
      noteDb.get('words').push({
        word,
        time: (new Date()).getTime(),
        note: '',
        score
      }).write();

    }

  }
  ,
  find: (word) => {
    return noteDb.get('words').find({ word }).value()
  },
  remove: (info) => {

  }
};

const registerNoteService = () => {
  // noteDb._.mixin(lodashId);
};


export { registerNoteService, note } ;
