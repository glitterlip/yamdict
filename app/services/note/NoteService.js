import {resPath} from '../../utils/config';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(resPath+'/databases/notes/note.json');
const noteDb = low(adapter);


class NoteService {
  add = (info) => {

    const { word, score } = info;
    let exist = noteDb.get('words').find({ word }).value();
    if (exist) {
      noteDb.get('words').find({ word }).assign({ score, count: exist.count + 1 }).write();
    } else {
      noteDb.get('words').push(this.getDefault({
        word,
        score
      })).write();

    }

  };
  find = (word) => {
    return noteDb.get('words').find({ word }).value();
  };
  remove = (info) => {
    noteDb.get('words')
      .remove({ word: info })
      .write();
  };
  all = () => {
    return noteDb.get('words').value();
  };
  getDefault = (word = null) => {
    const _now = (new Date()).getTime();

    return {
      time: _now,
      note: '',
      score: 1,
      count: 1,
      last_time: _now,
      next_time: _now,
      ...word
    };
  };
  update = (word, score) => {
    noteDb.get('words').find({word}).assign({ score }).write();
  };
}

const note = new NoteService();

const registerNoteService = () => {
  // noteDb._.mixin(lodashId);
};


export { registerNoteService, note } ;
