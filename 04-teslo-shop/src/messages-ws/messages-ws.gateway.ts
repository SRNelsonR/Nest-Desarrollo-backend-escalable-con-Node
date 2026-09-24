import { 
  OnGatewayConnection, OnGatewayDisconnect, 
  SubscribeMessage, 
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss!: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}
  
  handleConnection( client: Socket ) {
    // console.log('Cliente conectado: ', client.id);
    this.messagesWsService.registerClient( client );
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }
  
  handleDisconnect( client: Socket ) {
    // console.log('Cliente desconectado: ', client.id);
    this.messagesWsService.removeClient( client.id );
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
    
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  // message-from-client
  // Se podria pensar en hacerlo asi
  //  this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  // Pero Nest ofrece otra forma sencilla de estar escuchando
  @SubscribeMessage('message-from-client')
  // Este nnombre es indiferente, se puede poner otro
  // handleMessageFromClient(){
  onMessageFromClient( client: Socket, payload: NewMessageDto ){
    console.log( client.id, payload );
  }

}
