// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add addional webpack configurations.
// For more information refer the docs: https://goo.gl/qPbSyX

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
var genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js')

module.exports = function(config, env) {
    var config = genDefaultConfig(config, env);

    config.module.rules.push({
        test: /\.md$/,
        exclude: /node_modules/,
        loader: "raw-loader"
    })

    return config
}