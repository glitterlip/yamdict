const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const lodashId = require('lodash-id');
const adapter = new FileSync('app/database/config.json');
const configDb = low(adapter);


const registerConfig = () => {
  configDb._.mixin(lodashId);

  if (!configDb.has('dicts').value()) {
    configDb.set('dicts', [{ id: 1, name: '柯林斯双解', path: '/resources/dicts/柯林斯双解.mdx' }]).write();
  }
  // configDb.defaults({ dicts: [], user: {} })
  //   .write();

};

export { registerConfig, configDb } ;
