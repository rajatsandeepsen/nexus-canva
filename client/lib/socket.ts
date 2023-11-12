import { io } from 'socket.io-client'

const SERVER =
  process.env.NODE_ENV === 'production'
    ? process.env?.SOCKET_URL
    : 'http://localhost:3001'

if (!SERVER) throw new Error('Missing env vars for socket.io');

export const socket = io(SERVER, { transports: ['websocket'] })
