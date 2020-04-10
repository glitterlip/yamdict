import { resPath } from '../../utils/config';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const subscribeAdapter = new FileSync(resPath + '/databases/podcasts/subscribe.json');
const subscribeDb = low(subscribeAdapter);

import axios from 'axios';

const fs = require('fs');

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
    return { ...podcast, subscribed: true, episodes: [] };
  };

  sync = (podcast) => {
    axios.get(podcast.feedUrl, {
      headers: {
        'accept': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {

      console.log(response);
      fs.writeFileSync(`${resPath}/podcasts/subscribes/${podcast.collectionId}.xml`, response.data);
    });
  };

  allSubscribes = () => {

    return subscribeDb.get('podcasts').value();
  };

}

const PodService = new PodcastService();

// const registerNoteService = () => {
//   // noteDb._.mixin(lodashId);
// };


export { PodService } ;
