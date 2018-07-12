# Docker Inspector

## About

This tool aims to bring you more useful commands to help you to manage a docker-compose based server.


## Installation

### Docker 

Run
```bash
docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock dockrcrazy/docker-inspector
```

Create an alias
```bash
alias docker-inspector='docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock dockrcrazy/docker-inspector'
docker-inspector ps
```

### Docker compose

docker-compose.yml
```yaml
version: '2.1'
services:
  docker-inspector:
    image: dockrcrazy/docker-inspector
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

Run
```bash
docker-compose run --rm docker-inspector
```

Create an alias
```bash
alias docker-inspector='docker-compose run --rm docker-inspector'
docker-inspector ps
```


## Configuration

There is several environment variable available :

- `DI_HEALTHCHECK_BASE_LABEL` : Set a label to every containers you want to check health.  
  For example, set `com.yourcompany.healthcheck` in `DI_HEALTHCHECK_BASE_LABEL` then affect label `com.yourcompany.healthcheck.enabled` on a container.

- `DI_SLACK_WEBHOOK` 
   Add Slack integration for some commands
- `DI_SLACK_CHANNEL`
- `DI_SLACK_USERNAME`

## Commands

Available commands :

- `docker-inspector ps`  
   List every compose projects are running 
- `docker-inspector healthcheck`  
   Put the label `com.docker-inspector.healthcheck` on the container you want to check.  
   If one container is not running, it will display it.  
   *options :*  
   - `--slack`  
     Send a message to slack if a container "healthchecked" is not running.