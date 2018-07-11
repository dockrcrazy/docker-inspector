const Docker = require('dockerode');
const colors = require('colors');

const healthCheckBaseLabel = process.env.DI_HEALTHCHECK_BASE_LABEL || 'com.docker-inspector.healthcheck';
let docker = new Docker();


function enhanceContainer(container) {
    container.isStartedWithDockerCompose = function () {
        return typeof this.Labels['com.docker.compose.config-hash'] !== 'undefined';
    };

    container.getComposeProjectName = function () {
        return this.Labels['com.docker.compose.project']
    };

    container.getPrettyNames = function () {
        let names = [];
        for (let name of this.Names) {
            names.push(name.substring(1).replace(this.getComposeProjectName() + '_', ''))
        }
        return names;
    };

    container.isRunning = function () {
        return this.State === 'running';
    };

    container.hasHealthCheckMark = function () {
        return typeof this.Labels[healthCheckBaseLabel+'.enabled'] !== 'undefined' && this.Labels['net.trsb.healthcheck.enabled'] !== '';
    };

    return container;
}


function getColoredState(state) {
    switch (state) {
        case 'created':
            return state;
        case 'restarting':
            return colors.yellow(state);
        case 'running':
            return colors.green(state);
        case 'paused':
            return colors.yellow(state);
        case 'exited':
            return colors.red(state);
        case 'dead':
            return colors.red(state);
        default:
            return state
    }
}


module.exports = {
    getComposeProjects: function () {
        return new Promise((resolve, reject) => {
            docker.listContainers({all: true}, function (err, containers) {
                if (err) {
                    reject(err);
                    return;
                }
                let projects = {};
                for (let container of containers) {
                    enhanceContainer(container);

                    if (container.isStartedWithDockerCompose()) {
                        if (!projects[container.getComposeProjectName()]) {
                            projects[container.getComposeProjectName()] = {
                                name: container.getComposeProjectName(),
                                containers: [],
                                getRunningContainers: function () {
                                    return this.containers.filter(function (container) {
                                        return container.isRunning()
                                    }).length;
                                }
                            }
                        }
                        container.project = projects[container.getComposeProjectName()];
                        projects[container.getComposeProjectName()].containers.push(container);

                    }
                }
                resolve(projects);
            });
        });

    },
    printProject: function (project) {
        console.log(`${colors.blue(project.name)} [${project.getRunningContainers()}/${project.containers.length}]`);
        for (let container of project.containers) {
            console.log(` * [${getColoredState(container.State)}] ${container.getPrettyNames().join(', ')}`)
        }
    },
    printProjects: function (projects) {
        for (let projectIndex of Object.keys(projects)) {
            this.printProject(projects[projectIndex])
        }
    }
};