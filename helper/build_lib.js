var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

fs.readFile(path.join(__dirname, './component_list.json'), 'utf8', function(err, data){
  var error = chalk.bgRed(chalk.white('fileupdate')) + ' ' + chalk.red(err);
  if(err) throw error
  var data = JSON.parse(data), libs = "'use strict';\n";
  libs += "var MidfyComponent = {\n";
  data.components.map(function(c){
    libs += "  " + c.component + ": require('./lib/" + c.type + "." + c.component + "'),\n";
  })
  libs += "}\n";
  libs += "module.exports = MidfyComponent\n";
  fs.writeFile(path.join(__dirname, '../index.js'), libs, 'utf8', function(err){
    console.log(chalk.bgGreen(chalk.white('fileupdate')) + ' build libs')
  })
})
