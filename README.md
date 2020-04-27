<p align="center">
  <a href="https://www.cibic.app/" target="blank"><img src="https://www.cibic.app/assets/logo.png" width="320" alt="Cibic Logo" /></a>
</p>

## Description

[Cibic's](https://www.cibic.app) backend server. [Docker Compose](https://github.com/docker/compose), [MongoDB](https://github.com/mongodb/mongo) with [Mongoose](https://github.com/nestjs/mongoose), [Nest](https://github.com/nestjs/nest) with [Typescript](https://github.com/Microsoft/TypeScript) on [Node.js](https://nodejs.org), being served up by [Nginx](https://nginx.org/) currently if [this](https://www.cibic.app/api/) is working.

## Installation

### Production

We currently use [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) in production.
For a first time install, edit ./init-letsencrypt.sh to contain your machine's public url and your own email, and edit ./data/nginx/app.conf in the same manner, then run the following command:

```bash
$ sudo ./init-letsencrypt.sh
```

This will create a dummy certificate, spin up nginx, complete an acme-challenge, and give you a real Lets Encrypt certificate.

```bash
# to turn everything on
$ ./docker-start prod
# and after a few seconds
$ curl https://your-chosen-domain/api/
```
You should get a Hello World! response once it's running.

### Development

We are fully dockerized, use the docker-start script to launch the app in your mode of choice.
We run development without https, with the container ports exposed directly on the host machine.

```bash
# to spin up the server
$ ./docker-start dev
# and after a few seconds
$ curl localhost:3000
```

You should get a Hello World! response once it's running.

### Testing

```bash
# unit tests
$ ./docker-start test

# e2e test
$ ./docker-start e2e
```

## Contact

We take email is [cibic.media@gmail.com](mailto:cibic.media@gmail.com), and our site is [here](https://www.cibic.app) if our server is working.

## Nest.js Things

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

Nest is [MIT licensed](LICENSE).
