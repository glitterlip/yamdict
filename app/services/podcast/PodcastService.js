import { resPath } from '../../utils/config';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const subscribeAdapter = new FileSync(resPath + '/databases/podcasts/subscribe.json');
const subscribeDb = low(subscribeAdapter);


class PodcastService {
  subscribe = (podcast) => {
    const { collectionId } = podcast;
    let exist = subscribeDb.get('podcasts').find({ collectionId }).value();
    if (exist) {
    } else {
      subscribeDb.get('podcasts').push(this.getDefault(podcast)).write();

    }

  };

  unsubscribe = (podcast) => {
    const { collectionId } = podcast;

    subscribeDb.get('podcasts')
      .remove({ collectionId })
      .write();
  };

  getDefault = (podcast) => {
    return { ...podcast, played: [], subscribed: true };
  };

}

const PodService = new PodcastService();

// const registerNoteService = () => {
//   // noteDb._.mixin(lodashId);
// };


export { PodService } ;
