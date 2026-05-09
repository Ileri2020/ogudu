// components/shared/VideoConference.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native';
import {
  RTCView,
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
} from 'react-native-webrtc';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  RotateCcw,
  MoreVertical,
} from 'lucide-react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Participant {
  id: string;
  name: string;
  isCameraEnabled: boolean;
  isMicEnabled: boolean;
  streamURL?: string;
  isLocal?: boolean;
}

interface VideoConferenceProps {
  roomName: string;
  token: string;
  userName: string;
  onDisconnect?: () => void;
}

export function VideoConference({
  roomName,
  token,
  userName,
  onDisconnect,
}: VideoConferenceProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    initializeStream();
    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const initializeStream = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: SCREEN_WIDTH > 500 ? 1280 : 640,
          height: SCREEN_WIDTH > 500 ? 720 : 480,
          frameRate: 30,
        },
      });

      setLocalStream(stream);
      setIsConnecting(false);

      // Add local participant
      setParticipants([
        {
          id: 'local',
          name: `${userName} (You)`,
          isCameraEnabled: true,
          isMicEnabled: true,
          streamURL: stream.toURL(),
          isLocal: true,
        },
      ]);

      // TODO: Connect to LiveKit using token and roomName
      // This requires @livekit/react-native SDK integration
    } catch (error) {
      Alert.alert('Error', 'Failed to access camera/microphone');
      setIsConnecting(false);
    }
  };

  const toggleMic = useCallback(() => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !isMicEnabled;
    });
    setIsMicEnabled(!isMicEnabled);
  }, [localStream, isMicEnabled]);

  const toggleCamera = useCallback(() => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !isCameraEnabled;
    });
    setIsCameraEnabled(!isCameraEnabled);
  }, [localStream, isCameraEnabled]);

  const switchCamera = useCallback(async () => {
    if (!localStream) return;

    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      // @ts-ignore - react-native-webrtc specific
      await videoTrack._switchCamera();
      setIsFrontCamera(!isFrontCamera);
    }
  }, [localStream, isFrontCamera]);

  const disconnect = useCallback(() => {
    localStream?.getTracks().forEach((track) => track.stop());
    onDisconnect?.();
  }, [localStream, onDisconnect]);

  const renderParticipant = ({ item }: { item: Participant }) => (
    <Animated.View
      entering={FadeIn}
      className={`${
        participants.length === 1
          ? 'w-full h-full'
          : participants.length === 2
          ? 'w-full h-1/2'
          : 'w-1/2 h-1/2'
      } p-1`}
    >
      <View className="flex-1 bg-gray-900 rounded-2xl overflow-hidden relative">
        {item.isCameraEnabled && item.streamURL ? (
          <RTCView
            streamURL={item.streamURL}
            className="w-full h-full"
            objectFit="cover"
            zOrder={item.isLocal ? 1 : 0}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <View className="w-20 h-20 rounded-full bg-gray-700 justify-center items-center">
              <Text className="text-2xl text-white font-bold">
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        {/* Participant Name */}
        <View className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded-lg">
          <Text className="text-white text-xs">{item.name}</Text>
          {!item.isMicEnabled && (
            <MicOff size={12} color="white" className="ml-1" />
          )}
        </View>
      </View>
    </Animated.View>
  );

  if (isConnecting) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-white mt-4">Connecting...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      {/* Participants Grid */}
      <FlatList
        data={participants}
        renderItem={renderParticipant}
        keyExtractor={(item) => item.id}
        numColumns={participants.length > 2 ? 2 : 1}
        className="flex-1"
      />

      {/* Controls */}
      <View className="flex-row justify-center items-center gap-6 py-6 px-4 bg-gray-900/90">
        <Pressable
          onPress={toggleMic}
          className={`w-12 h-12 rounded-full justify-center items-center ${
            isMicEnabled ? 'bg-gray-700' : 'bg-red-500'
          }`}
        >
          {isMicEnabled ? (
            <Mic size={24} color="white" />
          ) : (
            <MicOff size={24} color="white" />
          )}
        </Pressable>

        <Pressable
          onPress={toggleCamera}
          className={`w-12 h-12 rounded-full justify-center items-center ${
            isCameraEnabled ? 'bg-gray-700' : 'bg-red-500'
          }`}
        >
          {isCameraEnabled ? (
            <Video size={24} color="white" />
          ) : (
            <VideoOff size={24} color="white" />
          )}
        </Pressable>

        <Pressable
          onPress={switchCamera}
          className="w-12 h-12 rounded-full bg-gray-700 justify-center items-center"
        >
          <RotateCcw size={24} color="white" />
        </Pressable>

        <Pressable
          onPress={disconnect}
          className="w-14 h-14 rounded-full bg-red-600 justify-center items-center"
        >
          <PhoneOff size={28} color="white" />
        </Pressable>

        <Pressable className="w-12 h-12 rounded-full bg-gray-700 justify-center items-center">
          <MoreVertical size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
}