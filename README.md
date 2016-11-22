# LDS (Louy's Dev Server)

Let's you have a folder `~/.lds` with a few files each containing a number. 
Each file name is a host name and its content is the target port number. 
The server will proxy all requests to port 80 to the respective port number on localhost.

## Setup
```bash
yarn --pure-lockfile
npm run build
```

And to run it:

```bash
sudo node .
```
