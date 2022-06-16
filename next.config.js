module.exports = {
    exportPathMap: function () {
      return {
        '/': { page: '/' },
        // '/blog/nextjs': { page: '/blog/[post]/comment/[id]' },        // wrong
        '/posts/preview/slug': { page: '/posts/preview/[slug]' }, // correct
      }
    },
  }