const NewProductMonitor = require('./NewProductMonitor')
const config = require('./config.json');

let servers = [
  {
      id: config.id,
      token: config.token
  }
]

let npm = new NewProductMonitor(servers);

npm.start();