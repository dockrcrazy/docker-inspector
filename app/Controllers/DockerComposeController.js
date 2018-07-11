const Utils = require("../Services/Utils.js")
const colors = require('colors');

function dockerErrorHandler(error){
    console.error(`An error occured with docker daemon : ${error.code}`);
    process.exit(1);
}

module.exports = {
    listContainers: function () {
        Utils.getComposeProjects().then((projects) => {
            console.log(colors.bold('Docker compose projects :'));
            Utils.printProjects(projects);
        }, dockerErrorHandler);
    },
    healthCheck: function () {
        Utils.getComposeProjects().then((projects) => {

            let filteredProjects = {};

            for (let projectIndex of Object.keys(projects)) {
                let project = projects[projectIndex];
                for(let container of project.containers){
                    if(container.hasHealthCheckMark() && !container.isRunning()){
                        if(!filteredProjects[project.getComposeProjectName()]){
                            filteredProjects[project.getComposeProjectName()] = project;
                            filteredProjects[project.getComposeProjectName()].containers = [];
                        }
                        filteredProjects[project.getComposeProjectName()].containers.push(container);
                    }
                }
            }

            if(Object.keys(filteredProjects).length > 0){
                console.log(colors.bold('These containers aren\'t running :'));
                Utils.printProjects(filteredProjects);
                process.exit(1);
            }else{
                console.log('All containers are running');
                process.exit(0);
            }

        }, dockerErrorHandler);
    }
};