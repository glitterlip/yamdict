import { resPath } from '../../utils/config';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const favoriteAdapter = new FileSync(resPath + '/databases/podcasts/favorites.json');
const favoriteDb = low(favoriteAdapter);
const fs = require('fs');

class FavoriteService {
  static TYPE_POCAST = 1;
  static TYPE_EPISODE = 1;
  static TYPE_RADIO = 1;
  favorite = (item, type) => {

    if (type === FavoriteService.TYPE_POCAST) {
      favoriteDb.get('podcasts').push(this.getDefault(item)).write();
    } else {
      favoriteDb.get('radios').push(this.getDefault(item)).write();

    }
  };

  getDefault = (item) => {
    return { ...item, favoritedAt: Date.now };
  };

  getFavorites = (type, page = 0) => {

    let table;
    if (type === FavoriteService.TYPE_POCAST) {
      table = favoriteDb.get('podcasts');
    } else if (type === FavoriteService.TYPE_RADIO) {
      table = favoriteDb.get('radios');
    } else {
      table = favoriteDb.get('episodes');
    }

    return table.slice(page * 10, (page + 1) * 10);
  };

}


export { FavoriteService } ;
