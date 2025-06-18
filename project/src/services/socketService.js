import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
  }

  connect() {
    if (this.socket && this.isConnected) return this.socket;
    // Replace with your backend socket.io server URL
    this.socket = io('https://meme-hustle-be.onrender.com/', {
      transports: ['websocket'],
      withCredentials: true
    });
    this.isConnected = true;
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }
}

export const socketService = new SocketService()