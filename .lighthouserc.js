module.exports = {
    ci: {
     // Static site example
        collect: {
            startServerCommand: 'npm start',
            url: ['http://localhost:4200'],
            numberOfRuns: 9
        },
        upload: {
            target: 'temporary-public-storage'
        /* Add configuration here */
      },
    },
  };