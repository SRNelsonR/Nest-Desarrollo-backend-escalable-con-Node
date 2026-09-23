import { Manager, Socket } from 'socket.io-client';

export const connectToServer = () => {
    // localhost:3000/socket.io/socket.io.js
    const manager = new Manager('localhost:3000/socket.io/socket.io.js');

    // manager.socket(<namespace>);
    const socket = manager.socket('/');
    // console.log({ socket });

    addListeners( socket );
}

const addListeners = ( socket: Socket ) => {
    
    const serverStatusLabel = document.querySelector('#server-status')!;
    // TODO: #clients-ul -- Hecho
    const clientsUl = document.querySelector('#clients-ul')!;

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

}