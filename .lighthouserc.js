module.exports = {
    ci: {
     // Static site example
        collect: {
            startServerCommand: 'ng serve',
            url: ['http://localhost:4200']
        },
        upload: {
            target: 'temporary-public-storage'
        /* Add configuration here */
      },
    },
  };