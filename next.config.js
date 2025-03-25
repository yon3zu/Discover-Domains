// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/fetch-domains',
          destination: 'https://api.xreverselabs.org/api/discover_domain?apiKey=b2c442f36a149dde9a1542c2e4d1a3ea',
        },
      ];
    },

    output: 'export',
  };
  
