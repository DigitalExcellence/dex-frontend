module.exports = {
    ci: {
     // Static site example
        collect: {
            startServerCommand: 'npm run npm start',
            url: ['http://localhost:4200'],
            numberOfRuns: 9
        },
        upload: {
            target: 'temporary-public-storage'
        /* Add configuration here */
      },
    },
  };