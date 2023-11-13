import { io } from 'socket.io-client'

const SERVER = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

if (!SERVER) throw new Error('Missing env vars for socket.io');

export const socket = io(SERVER, { transports: ['websocket'] })
