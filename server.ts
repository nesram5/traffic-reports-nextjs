import '@/envConfig'
import {createServer} from 'https';
import http from 'http';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { parse } from 'url';
import next from 'next';
import { connectDB } from './modules/handlerDB/connect';
import { fetchTrafficDataFromDB } from './modules/handlerDB/fetch';
import { scheduleExecution } from './modules/schedule/task';
 
const snmp_list_devices = path.join(process.cwd(), 'data/snmp_list_devices.json');
const zabbix_list_devices = path.join(process.cwd(), 'data/zabbix_list_devices.json');

console.log(snmp_list_devices);
const port: number = Number(process.env.PORT) || 443;
const httpPort: number = 80;
const address: string = process.env.SERVER || '192.168.0.1';

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const options = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};

app.prepare().then(() => {
    let httpsServer = createServer(options, (req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port, address)
  
    connectDB();
    fetchTrafficDataFromDB();
    scheduleExecution();

    const wss = new WebSocketServer({ server: httpsServer, path: '/api/traffic-updates' });
    wss.on('connection', (ws) => {
        console.log('New WebSocket connection established');

        // Send initial data on new connection
        ws.send(JSON.stringify(getTrafficData()));

        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });
    });

    // Broadcast updates to all clients every 1 minute
    setInterval(() => {
        //fetchTrafficDataFromDB()
        const updatedData = getTrafficData();
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(updatedData));
            }
        });
    }, 60000);
    // Start HTTP server to redirect to HTTPS
    const httpServer = http.createServer((req, res) => {
        res.writeHead(301, { Location: `https://${address}:${port}${req.url}` });
        res.end();
    });

    httpServer.listen(httpPort, () => {
        console.log(`HTTP server is running on http://${address}:${httpPort} and redirecting to HTTPS`);
    });
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})


// WebSocket server associated with HTTPS server


function getTrafficData() {
    const data = fs.readFileSync(path.join(process.cwd(), 'cache/trafficDataCache.json'), 'utf-8');
    return JSON.parse(data);
}