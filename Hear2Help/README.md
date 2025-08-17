# Hear2Help - Real-Time Sound Classification App

A React Native app that connects to your Backend_API WebSocket for real-time sound classification using YAMNet.

## Features

- **Real-time Sound Monitoring**: Continuously monitors microphone input
- **WebSocket Integration**: Connects to Backend_API for live sound classification
- **Smart GIF Mapping**: Automatically maps detected sounds to appropriate GIFs
- **Emergency Alerts**: Special notifications for emergency sounds (sirens, alarms, etc.)
- **Sound History**: Tracks recent sound detections with timestamps

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend_API Server
In your Backend_API directory:
```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Start React Native App
```bash
npm start
```

## How It Works

### Audio Processing Pipeline
1. **Microphone Input**: Captures audio at 16kHz mono (YAMNet requirement)
2. **5-Second Chunks**: Buffers audio in 5-second intervals
3. **WebSocket Streaming**: Sends audio data to Backend_API
4. **Real-time Classification**: Receives sound classifications from YAMNet
5. **GIF Mapping**: Maps sounds to appropriate visual representations

### Sound Categories
- **Emergency**: Sirens, alarms, gunshots, explosions
- **Household**: Doorbells, tools, appliances
- **Nature**: Water, wind, animals, traffic
- **Music**: Instruments, singing, music
- **Speech**: Human voices, laughter, crying
- **Vehicles**: Cars, trains, aircraft, boats

### WebSocket Communication
- **Endpoint**: `ws://localhost:8000/ws/audio`
- **Protocol**: Native WebSocket (not Socket.IO)
- **Data Format**: 16-bit PCM audio chunks
- **Response Format**: `"Detected: {sound_class}"`

## Components

### MonitoringToggle
- Controls start/stop of audio monitoring
- Shows connection and recording status
- Handles microphone permissions

### HomeScreen
- Displays current sound detection
- Shows recent sound alerts
- Emergency sound notifications

### SoundItem
- Individual sound alert display
- GIF animation for visual feedback
- Timestamp and category information

## Technical Details

### Audio Requirements
- **Sample Rate**: 16kHz (YAMNet requirement)
- **Channels**: Mono
- **Format**: 16-bit PCM
- **Chunk Size**: 5 seconds (80,000 samples)

### Platform Support
- **Web**: Uses Web Audio API
- **Mobile**: Uses Expo Audio API
- **Cross-platform**: Unified interface

### Error Handling
- Microphone permission requests
- WebSocket connection management
- Audio recording fallbacks
- Graceful disconnection

## Troubleshooting

### Common Issues
1. **Microphone Permission Denied**: Grant microphone access in device settings
2. **WebSocket Connection Failed**: Ensure Backend_API server is running on port 8000
3. **Audio Not Recording**: Check device microphone functionality
4. **No Sound Classifications**: Verify YAMNet model is loaded in Backend_API

### Debug Information
- Check console logs for WebSocket connection status
- Monitor audio recording state in MonitoringToggle
- Verify sound data flow in HomeScreen

## Future Enhancements

- **Custom Sound Training**: Add user-specific sound recognition
- **Sound Recording**: Save audio clips for review
- **Notification System**: Push notifications for important sounds
- **Accessibility Features**: Haptic feedback, screen reader support
- **Offline Mode**: Local sound classification when server unavailable
