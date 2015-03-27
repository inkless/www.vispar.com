<h1>
<a href="http://vispar.com"><img alt="Vispar logo" src="https://lh5.googleusercontent.com/-MbgrMdwFG_w/VRWoMl95fcI/AAAAAAAAAQU/G_T6vsZX1Ow/s288-no/ic_launcher.png" title="Vispar.com"/></a>
</h1>

### [Website](http://vispar.com/)  &nbsp;  [Wiki](https://github.com/inkless/www.vispar.com/wiki)  &nbsp; [Submit Issue](https://github.com/inkless/www.vispar.com/issues)



Vispar.com is a website for communicate without effort. You can have live video conference, education, meetup here!

## Dependency
**We have a bunch of dependencies, including:**

1. [node](http://nodejs.org)
2. [mongo](https://www.mongodb.org/)
3. [redis](http://redis.io/)

**How to install them on my Mac OX**

With [brew](http://brew.sh/) installed, you can simply install all of them using:

```sh
# install node, mongo, redis
$ brew update
$ brew install node
$ brew install mongodb 
$ brew install redis
```

**We also strongly recommend you to install some npm package globally:**

You may need to use `sudo` if necessary

```sh
# install grunt, we use it as our package manager
$ npm install -g grunt-cli
# install sails, we use sails as the whole framework
$ npm install -g sails
# install node inspector, it's the debugger for server
$ npm install -g node-inspector
```

## How to start your development

**Clone the codes:**
```sh
$ git clone git@github.com:inkless/www.vispar.com.git
```

**Install npm dependencies:**
```sh
$ cd www.vispar.com
$ npm install
```

**Start the project**
```sh
# use sails to start the project
$ sails lift
# use node to start the project
$ node app.js
# use debug mode
$ node --debug app.js
```

## Compatibility

Vispar is built on [Sails](http://sailsjs.org). Use mongo as the persistence layer, and redis as cache. In front end, it's using [React.js](http://facebook.github.io/react/), [browserify](http://browserify.org/), etc. It provides rich APIs which support multi-platforms.


## Feature Board
See the [Trello board](https://trello.com/vispar) to view/discuss our features.

## Team
<img width="144" height="144" src="https://media.licdn.com/media/p/2/000/1bd/3d2/27bc34b.jpg" /> | [![Guangda Zhang](https://s.gravatar.com/avatar/8d09a22f24632270d2cad212613f49a4?s=144)](http://zhangguangda.com) | <img width="144" height="144" src="https://media.licdn.com/media/p/2/000/0de/27b/3a5ce59.jpg" /> 
:---:|:---:|:---:
[Howard Wang](https://github.com/wminghao) | [Guangda Zhang](https://zhangguangda.com) | Xingze He

