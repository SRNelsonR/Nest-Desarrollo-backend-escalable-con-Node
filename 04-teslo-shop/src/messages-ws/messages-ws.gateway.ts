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
    // console.log(client);
    const token = client.handshake.headers.authentication as string;
    console.log({token});
    // console.log('Cliente conectado: ', client.id);
    this.messagesWsService.registerClient( client );
    
    // Adicionar al usuario a una sala especifica
    // client.join('ventas');
    // Emitir a esa sala especifica con sus usurios
    // this.wss.to('ventas').emit('');

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
  // Pueder ser asincrono
  onMessageFromClient( client: Socket, payload: NewMessageDto ){
    // console.log( client.id, payload );
    // message-from-server

    //! Emite únicamente al cliente aqui (client) no a todos.
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no-message!!',
    // });

    //! Emitir a todos los clientes, MENOS al cliente inicial (el que emite el mensaje inicialmente)
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no-message!!',
    // });

    // A todos incluido el que lo envia
    this.wss.emit('message-from-server', {
      fullName: 'Soy yo!',
      message: payload.message || 'no-message!!',
    });
  }

}
