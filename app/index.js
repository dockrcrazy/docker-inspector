const CommandRouter = require('command-router');
const DockerComposeController = require('./Controllers/DockerComposeController.js');

let cli = CommandRouter();

cli.command('ps', function(){
    DockerComposeController.listContainers();
});

cli.command('healthcheck', function(){
    DockerComposeController.healthCheck();
});


cli.on('notfound', function(action){
    console.log(`Unknown command ${action}. Type help to get the list of available commands`);
    process.exit(1);
});

cli.parse(process.argv);