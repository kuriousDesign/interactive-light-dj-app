import { Server, Socket } from 'socket.io';
import * as rclnodejs from 'rclnodejs';
import express from 'express';

import { createServer } from 'http';

//import { QoS } from 'rclnodejs';
// import config from 'config';
// import { Namespace, TopicId, RosMsgTypes } from '@robotic-workcell/sdk';

interface ClientConnection {
    id: string;
    socketConnection: Socket;
    namespace: string;
    //opcuaClient: OPCUAClient;
  }
  
  interface HeartBeatConnection {
    //opcuaSession: ClientSession;
    //opcuaClient: OPCUAClient;
    timer: NodeJS.Timer;
  }

class RosManager {
  private socketio: Server;
  private connections: Map<string, ClientConnection>;
  private node: rclnodejs.Node;
  // private publishers = {};
  private subscriptions = {};

  constructor(socketio: Server) {
    this.connections = new Map<string, ClientConnection>();
    this.socketio = socketio;
    //this.node = new rclnodejs.Node('interactive_light_dj_ui_node');
    this.startRosNode();
  }
  
  private async startRosNode() {
    rclnodejs.init().then(() => {
      this.node = rclnodejs.createNode('interactive_light_dj_ui_node');
      this.initialize();
      // const namespace = ''
      // this.createSubscriptions(namespace);
      this.node.spin();
      console.log('node is running');
    });
  }

  private async initialize() {
    this.node.createSubscription('std_msgs/msg/String', 'topic', (msg:string) => {
        console.log(`Received message: ${typeof msg}`, msg);
    });
  }
//   private async createSubscriptions(namespace: string) {
//     // Subscribe to a topic that sends the byte array
//     const topicPath = namespace + TopicId.ByteArrayData;
//     this.subscriptions[topicPath] = { lastUpdate: 0.0 };

//     this.node.createSubscription(
//       RosMsgTypes.ByteArray, // Use the appropriate ROS message type
//       topicPath,
//       { qos: QoS.profileSensorData },
//       (msg: Buffer) => { // Handle the incoming byte array message
//         const time = Date.now();
//         if (time - 100 > this.subscriptions[topicPath].lastUpdate) {
//           this.subscriptions[topicPath].lastUpdate = time;
          
//           // Convert the byte array to fixture data
//           const fixtureData = this.convertByteArrayToFixtureData(msg);

//           // Emit the fixture data to connected clients
//           this.checkConnectionNamespaceMatchAndEmit('newFixtureData', fixtureData);
//         }
//       }
//     );
//   }

  // Method to convert the byte array into fixture data
  private convertByteArrayToFixtureData(byteArray: Buffer): any {
    // Convert the byte array to a suitable data structure
    // This logic will depend on the format of the byte array and how you want to convert it
    const fixtureData = {
      // Example conversion (you will need to customize based on your requirements)
      timestamp: Date.now(),
      data: byteArray.toString('hex'), // Example: convert byte array to hex string
    };

    return fixtureData;
  }

  private async checkConnectionNamespaceMatchAndEmit(emitTopic: string, topicData: any) {
    this.connections.forEach(connection => {
      if (connection.namespace === topicData.namespace) {
        // Send data to this client
        connection.socketConnection.emit(emitTopic, topicData);
      }
    });
  }

  // Handle connection logic, etc...
}



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

export { RosManager };
