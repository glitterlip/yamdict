import { resPath } from '../../utils/config';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const subscribeAdapter = new FileSync(resPath + '/databases/podcasts/subscribe.json');
const subscribeDb = low(subscribeAdapter);
const fs = require('fs');
const xml2js = require('xml2js');
import axios from 'axios';

class PodcastService {
  parser = null;
  subscribe = (podcast) => {
    const { collectionId } = podcast;
    let exist = subscribeDb.get('podcasts').find({ collectionId }).value();
    if (exist) {
    } else {
      subscribeDb.get('podcasts').push(this.getDefault(podcast)).write();
      this.sync(podcast);

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

  parseXML = (collectionId) => {

    let parser = new xml2js.Parser();
    let res = {};
    let xmlStr = fs.readFileSync(`${resPath}/podcasts/subscribes/${collectionId}.xml`);


    parser.parseString(xmlStr, function(err, result) {
      res = result;
    });
    return res;
  };

  play = (item) => {

  };


}

const PodService = new PodcastService();

// const registerNoteService = () => {
//   // noteDb._.mixin(lodashId);
// };


export { PodService } ;
