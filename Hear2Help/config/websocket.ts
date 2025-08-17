// WebSocket configuration for Backend_API connection

export const WEBSOCKET_CONFIG = {
  // Backend_API WebSocket endpoint
  URL: 'ws://localhost:8010/ws/audio',
  
  // Connection settings
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000, // milliseconds
  
  // Audio processing settings (matching Backend_API requirements)
  SAMPLE_RATE: 16000, // Hz
  CHUNK_DURATION: 5, // seconds
  BYTES_PER_SAMPLE: 2, // int16
  
  // Calculate chunk size in bytes
  CHUNK_SIZE: 16000 * 5 * 2, // 160,000 bytes
};

// Environment-specific configurations
export const getWebSocketUrl = () => {
  // For development, use localhost
  if (__DEV__) {
    return WEBSOCKET_CONFIG.URL;
  }
  
  // For production, you would use your actual server URL
  // return 'wss://your-production-server.com/ws/audio';
  return WEBSOCKET_CONFIG.URL;
};
