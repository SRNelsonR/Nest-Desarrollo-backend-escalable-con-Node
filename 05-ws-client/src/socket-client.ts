import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connectToServer = ( token: string ) => {
    // localhost:3000/socket.io/socket.io.js
    const manager = new Manager('localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            hola: 'mundo',
            authentication: token,
        }
    });

    // manager.socket(<namespace>);
    socket?.removeAllListeners();
    socket = manager.socket('/');
    // console.log({ socket });

    addListeners();
}

const addListeners = ( ) => {
    
    const serverStatusLabel = document.querySelector('#server-status')!;
    // TODO: #clients-ul -- Hecho
    const clientsUl = document.querySelector('#clients-ul')!;

    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;

    const messagesUl = document.querySelector<HTMLUListElement>('#message-ul')!;

    // Escuchar lo que viene del servidor
    // socket.on()
    // Emitir al servidor, hablar al servidor
    // socket.emit()
    socket.on('connect', () => {
        // console.log('connected');
        serverStatusLabel.innerHTML = 'connected';
    });

    socket.on('disconnect', () => {
        // console.log('disconnect');
        serverStatusLabel.innerHTML = 'disconnected';
    });

    socket.on('clients-updated', ( clients: string[] ) => {
        // console.log({ clients });
        let clientHtml = '';
        clients.forEach( clientId => {
            clientHtml += `
                <li>${clientId}</li>
            `
        });
        clientsUl.innerHTML = clientHtml;
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if( messageInput.value.trim().length <= 0 ) return;

        socket.emit('message-from-client', { 
            id: 'YO!',
            message: messageInput.value
        });
        // console.log({ id: 'YO!', message: messageInput.value });
        messageInput.value = '';
    });

    // socket.on('se le puede poner cualquier nombre')
    socket.on('message-from-server', ( payload: { fullName: string, message: string } ) => {
        // console.log(payload);
        const newMessage = `
        <li>
            <strong>${ payload.fullName }</strong>
            <span>${ payload.message }</span>
        </li>
        `;

        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl.append( li );
    });

}