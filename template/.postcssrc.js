// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserlist" field in package.json
    "autoprefixer": {}{{#isMobile}},
    "postcss-px2rem" : {
      remUnit:100,
      remPrecision: 5
    }{{/isMobile}}
  }
}
