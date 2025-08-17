import { useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';

export function useAudioRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const bufferRef = useRef<Int16Array>(new Int16Array(0));
  
  // Request microphone permission
  useEffect(() => {
    if (Platform.OS === 'web') {
      // For web, we'll request permission when starting recording
      setHasPermission(true);
    } else {
      // For mobile, we'll need to implement proper permission handling
      setHasPermission(false);
    }
  }, []);

  const startRecording = async (onAudioData: (data: ArrayBuffer) => void) => {
    if (!hasPermission) {
      console.log('No microphone permission');
      return;
    }

    try {
      if (Platform.OS === 'web') {
        startWebRecording(onAudioData);
      } else {
        // Mobile recording not implemented yet
        console.log('Mobile recording not implemented yet');
        return;
      }

      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const startWebRecording = (onAudioData: (data: ArrayBuffer) => void) => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream: any) => {
        const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext({ 
          sampleRate: 16000 
        });

        const source = audioContext.createMediaStreamSource(stream);
        
        // Use ScriptProcessor for compatibility
        const processor = (audioContext as any).createScriptProcessor(4096, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e: any) => {
          const input = e.inputBuffer.getChannelData(0);
          const int16Data = floatTo16BitPCM(input);
          
          // Add to buffer
          const newBuffer = new Int16Array(bufferRef.current.length + int16Data.length);
          newBuffer.set(bufferRef.current);
          newBuffer.set(int16Data, bufferRef.current.length);
          bufferRef.current = newBuffer;

          // Send every 5 seconds worth of data (16000 samples/sec * 5 = 80,000 samples)
          if (bufferRef.current.length >= 80000) {
            const chunk = bufferRef.current.slice(0, 80000);
            const remaining = bufferRef.current.slice(80000);
            bufferRef.current = remaining;
            
            // Convert to ArrayBuffer and send
            const arrayBuffer = new ArrayBuffer(chunk.length * 2);
            const view = new DataView(arrayBuffer);
            chunk.forEach((sample: number, index: number) => {
              view.setInt16(index * 2, sample, true); // little-endian
            });
            
            onAudioData(arrayBuffer);
          }
        };

        // Store references for cleanup
        (window as any).currentAudioContext = audioContext;
        (window as any).currentProcessor = processor;
        (window as any).currentStream = stream;
      }).catch((error: any) => {
        console.error('Failed to get user media:', error);
      });
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);

    if (Platform.OS === 'web') {
      // Clean up web audio
      if ((window as any).currentProcessor) {
        (window as any).currentProcessor.disconnect();
        (window as any).currentProcessor = null;
      }
      if ((window as any).currentAudioContext) {
        await (window as any).currentAudioContext.close();
        (window as any).currentAudioContext = null;
      }
      if ((window as any).currentStream) {
        (window as any).currentStream.getTracks().forEach((track: any) => track.stop());
        (window as any).currentStream = null;
      }
      bufferRef.current = new Int16Array(0);
    }
  };

  const floatTo16BitPCM = (input: Float32Array): Int16Array => {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      let s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  };

  return {
    isRecording,
    hasPermission,
    startRecording,
    stopRecording,
  };
}
