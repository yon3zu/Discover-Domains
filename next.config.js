// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/fetch-domains',
          destination: 'https://api.xreverselabs.org/api/discover_domain?apiKey=FREE-TRIAL',
        },
      ];
    },

    output: 'export',
  };
  