const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
      '@enums': path.resolve(__dirname, 'src/enums/'),
    },
  },
};
