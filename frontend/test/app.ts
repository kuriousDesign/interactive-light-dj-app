import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { RosManager } from './rosManager';
// import OpcuaManager from './opcuaManager';


class App {
  public app: express.Application;
  public port: string | number;
  public env: string;
  public httpServer;
  private socketio: Server;
  private rosManager: RosManager;
  //private opcuaManager: OpcuaManager;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.env = process.env.NODE_ENV || 'development';
    this.httpServer = createServer(this.app);
    this.socketio = new Server(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    this.rosManager = new RosManager(this.socketio);
  }

  public listen() {
    this.httpServer.listen(this.port, () => {
    //   logger.info(`=================================`);
    //   logger.info(`======= ENV: ${this.env} =======`);
    //   logger.info(`🚀 App listening on the port ${this.port}`);
    //   logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.httpServer;
  }
}
export default App;

const app = new App();
app.listen();