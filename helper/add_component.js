var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var component_type = process.argv[2];
var component_name = process.argv[3];

fs.readFile(path.join(__dirname, './component_list.json'), 'utf8', function(err, data){
  var error = chalk.bgRed(chalk.white('fileupdate')) + ' ' + chalk.red(err);
  if(err) throw error
  var data = JSON.parse(data);
  data.components.push({
    type: component_type,
    component: component_name
  })
  fs.writeFile(path.join(__dirname, './component_list.json'), JSON.stringify(data), 'utf8', function(err){
    console.log(chalk.bgGreen(chalk.white('fileupdate')) + ' update components list')
  })
})
