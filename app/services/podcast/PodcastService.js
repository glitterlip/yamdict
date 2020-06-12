import { resPath } from '../../utils/config';
import axios from 'axios';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const subscribeAdapter = new FileSync(resPath + '/databases/podcasts/subscribe.json');
const subscribeDb = low(subscribeAdapter);
const fs = require('fs');
const xml2js = require('xml2js');

class PodcastService {
  parser = null;
  subscribe = (podcast) => {
    const { collectionId } = podcast;
    let exist = subscribeDb.get('podcasts').find({ collectionId }).value();
    if (!exist) {
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
        'accept': 'application/xml'
      }
    }).then((response) => {

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

  episodeToAudio = (episode) => {
    return {
      src: episode.enclosure[0].$.url,
      artist: episode['itunes:author'][0],
      name: episode.title[0],
      img: episode.img,
      id: episode.guid[0]._
    };
  };

  radioToAudio = (radio) => {
    return {
      src: radio.url_resolved,
      artist: radio.name,
      name: radio.name,
      img: radio.favicon,
      id: radio.changeuuid
    };
  };

  searchPodcast = (value) => {
    const searchPodcast = `https://itunes.apple.com/search?term=${value}&limit=30&media=podcast&country=US`;
    return axios.get(searchPodcast).then((response) => {
      const { results } = response.data;
      return results;
    });
  };

  searchRadio = (value) => {
    const searchRadio = `https://de1.api.radio-browser.info/json/stations/search?name=${value}&limit=100`;
    return axios.get(searchRadio).then((response) => {
      return response.data;
    });
  };


}

const PodService = new PodcastService();

export { PodService } ;
