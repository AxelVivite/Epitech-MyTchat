// eslint-disable-next-line import/extensions
import config from './src/config.js';

export default {
  mongodb: {
    url: config.mongodbUrl,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};
