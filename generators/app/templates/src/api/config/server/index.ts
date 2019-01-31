import * as debug from 'debug';
import * as http from 'http';
import Server from './server';
import * as serverHandlers from './serverHandlers';

debug('ts-express:server');

const port: string | number | boolean = serverHandlers.normalizePort(process.env.PORT || 3000);

Server.set('port', port);

console.log(`Server listening on port ${port}`);

const server: http.Server = http.createServer(Server);

// server listen
server.listen(port);

// server handlers
server.on(
    'error',
    (error: Error) => serverHandlers.onError(error, port));
server.on(
    'listening',
    serverHandlers.onListening.bind(server));
