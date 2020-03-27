const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    // 开发环境
    development: {
      publicPath: '/',
      extraBabelPlugins: ['dva-hmr'],
    },
    // build 时的生产环境
    production: {
      publicPath: '/damai-admin-web/',
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  hash: true,
};
