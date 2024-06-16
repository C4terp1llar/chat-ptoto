import io from 'socket.io-client';

export function useSocket() {
  return io('http://localhost:3001');
}
