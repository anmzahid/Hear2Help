import { useEffect, useState, useRef } from "react";
import { getWebSocketUrl, WEBSOCKET_CONFIG } from "../config/websocket";

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [soundData, setSoundData] = useState<{ label: string; confidence: number } | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = () => {
    try {
      // Clear any existing connection
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Clear any existing reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Reset error state
      setConnectionError(null);
      
      // Connect to the Backend_API WebSocket endpoint
      const ws = new WebSocket(getWebSocketUrl());
      
      ws.onopen = () => {
        console.log("WebSocket connected to Backend_API");
        setIsConnected(true);
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
      };

      ws.onmessage = (event) => {
        console.log("Received message:", event.data);
        // Parse the "Detected: {sound_class}" message from main.py
        if (event.data.startsWith("Detected: ")) {
          const soundClass = event.data.replace("Detected: ", "");
          setSoundData({
            label: soundClass,
            confidence: 1.0 // YAMNet doesn't provide confidence scores in current implementation
          });
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket disconnected from Backend_API", event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < WEBSOCKET_CONFIG.RECONNECTION_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${WEBSOCKET_CONFIG.RECONNECTION_ATTEMPTS})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, WEBSOCKET_CONFIG.RECONNECTION_DELAY);
        } else if (reconnectAttemptsRef.current >= WEBSOCKET_CONFIG.RECONNECTION_ATTEMPTS) {
          setConnectionError("Failed to connect after multiple attempts. Please check if the Backend_API server is running.");
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionError("WebSocket connection error. Please check your network connection.");
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      setConnectionError("Failed to establish WebSocket connection.");
    }
  };

  const disconnect = () => {
    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Reset reconnect attempts
    reconnectAttemptsRef.current = 0;
    
    if (wsRef.current) {
      wsRef.current.close(1000, "User initiated disconnect");
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionError(null);
  };

  const sendAudioData = (audioData: ArrayBuffer) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(audioData);
      } catch (error) {
        console.error("Failed to send audio data:", error);
        setConnectionError("Failed to send audio data to server.");
      }
    } else {
      console.warn("WebSocket not connected, cannot send audio data");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    soundData,
    connectionError,
    connect,
    disconnect,
    sendAudioData
  };
}
