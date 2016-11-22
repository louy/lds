import * as chokidar from 'chokidar';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
const httpProxy = require('http-proxy');

const debug = require('debug')('lds');

const apiProxy = httpProxy.createProxyServer();

const SITES_DIR = '/Users/louy/.lds';
const PORT = 80;
const PORT_SECURE = 443;

let sites = {} as {
  /* cache of domain -> port number mapping */
  [domain: string]: number;
};

function loadSites() {
  debug('Loading sites');
  sites = {
  };

  const files = fs.readdirSync(SITES_DIR);
  files.forEach(file => {
    try {
      const contents = fs.readFileSync(`${SITES_DIR}/${file}`, 'utf8');
      const port = parseInt(contents, 10);
      if (isNaN(port)) {
        console.warn(`Invalid file contents: ${SITES_DIR}/${file}`);
      } else {
        sites[file] = port;
      }
    } catch(error) {
      console.error(`Error reading file: ${SITES_DIR}/${file}\n${error}`);
    }
  });

  debug('Loaded sites');
}

chokidar.watch('.', {ignored: /[\/\\]\./}).on('all', (event, path) => {
  loadSites();
});

const app = express();

app.use((req, res, next) => {
  const port = sites[req.hostname];
  if (!port) {
    console.warn(`Unknown host ${req.hostname}`);
    next();
  }
  debug(`${req.hostname} -> locahost:${port}`);
  apiProxy.web(req, res, {target: `http://localhost:${port}`});
});

app.listen(PORT);
// TODO - https
