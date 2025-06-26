import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, GameState } from '@magicschool/shared';

export function useSocket(url?: string) {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = url || import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl, {
      forceNew: true,
      transports: ['websocket']
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, [url]);

  return { socket, isConnected };
}

export function useGameRoom(roomId: string, username: string) {
  const { socket, isConnected } = useSocket();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    if (socket && isConnected && roomId) {
      socket.emit('joinRoom', roomId, username);

      socket.on('gameStateUpdate', (newGameState) => {
        setGameState(newGameState);
      });

      socket.on('playerJoined', (playerId: string, _playerUsername: string) => {
        setPlayers(prev => [...prev.filter(p => p !== playerId), playerId]);
      });

      socket.on('playerLeft', (playerId) => {
        setPlayers(prev => prev.filter(p => p !== playerId));
      });

      return () => {
        socket.off('gameStateUpdate');
        socket.off('playerJoined');
        socket.off('playerLeft');
      };
    }
  }, [socket, isConnected, roomId, username]);

  const actions = {
    playCard: (cardId: string, targetId?: string) => {
      socket?.emit('playCard', cardId, targetId);
    },
    attack: (attackerId: string, defenderId?: string) => {
      socket?.emit('attack', attackerId, defenderId);
    },
    passPhase: () => {
      socket?.emit('passPhase');
    },
    activateAbility: (cardId: string, abilityId: string, targets?: string[]) => {
      socket?.emit('activateAbility', cardId, abilityId, targets);
    },
    surrender: () => {
      socket?.emit('surrender');
    }
  };

  return {
    socket,
    isConnected,
    gameState,
    players,
    actions
  };
}
