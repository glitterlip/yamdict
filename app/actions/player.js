export const PLAYER_STATUS = 'PLAYER_STATUS';
export const PLAYER_PLAY = 'PLAYER_PLAY';
export const PLAYER_LIST_ADD = 'PLAYER_LIST_ADD';


export const switchStatus = () => {
  return {
    type: PLAYER_STATUS
  };
};

export const play = (podcast) => {
  console.log(podcast);
  let item = {
    src: podcast.enclosure[0].$.url,
    artist: podcast['itunes:author'][0],
    name: podcast.title[0],
    img: podcast.img,
    id: podcast.guid[0]._
  };
  return {
    type: PLAYER_PLAY,
    podcast: item
  };
};

export const playlistAdd = (podcast) => {

  let item = {
    src: podcast.enclosure[0].$.url,
    artist: podcast['itunes:author'],
    name: podcast.title,
    img: 'http://audio-avatar-cdn/Señorita.jpg',
    id: podcast.guid[0]._
  };

  return {
    type: PLAYER_LIST_ADD,
    podcast: item
  };
};
