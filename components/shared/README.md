# Shared Components

This directory contains React Native components that mirror the functionality of your Next.js components, adapted for mobile with NativeWind styling.

## Components

### Post
A comprehensive post component that handles images, videos, audio, and documents with interactive features like liking, commenting, and sharing.

```tsx
import { Post } from '@/components/shared/Post';

<Post
  post={postData}
  onLike={(postId) => console.log('Liked:', postId)}
  onComment={(postId) => console.log('Comment on:', postId)}
  onShare={(post) => console.log('Share:', post)}
  onUserPress={(userId) => console.log('User:', userId)}
  onMediaPress={(post) => console.log('Media:', post)}
  variant="feed"
/>
```

### PostsList
An infinite-scrolling list component for displaying posts with filtering and sorting capabilities.

```tsx
import { PostsList } from '@/components/shared/PostsList';

<PostsList
  page="praisevideo"
  sortOrder="desc"
  postTypes={{ video: true, audio: true }}
  onPostPress={(post) => console.log('Post pressed:', post)}
  onUserPress={(userId) => console.log('User:', userId)}
/>
```

### Carousel
A flexible image carousel with pagination and navigation controls.

```tsx
import { Carousel } from '@/components/shared/Carousel';

<Carousel
  items={[
    { id: '1', url: 'https://example.com/image1.jpg', title: 'Title 1' },
    { id: '2', url: 'https://example.com/image2.jpg', title: 'Title 2' },
  ]}
  showPagination={true}
  showNavigation={true}
  onItemPress={(item, index) => console.log('Item:', item, 'Index:', index)}
  variant="cards"
/>
```

### VideoPlayer
A full-featured video player with controls, progress tracking, and fullscreen support.

```tsx
import { VideoPlayer } from '@/components/shared/VideoPlayer';

<VideoPlayer
  uri="https://example.com/video.mp4"
  poster="https://example.com/poster.jpg"
  title="Video Title"
  autoPlay={false}
  onFullscreenChange={(isFullscreen) => console.log('Fullscreen:', isFullscreen)}
  onProgress={(progress) => console.log('Progress:', progress)}
  onComplete={() => console.log('Video completed')}
/>
```

### AudioPlayer
A comprehensive audio player supporting playlists, shuffle, repeat, and progress tracking.

```tsx
import { AudioPlayer } from '@/components/shared/AudioPlayer';

<AudioPlayer
  tracks={[
    { id: '1', url: 'https://example.com/audio1.mp3', title: 'Track 1', artist: 'Artist 1' },
    { id: '2', url: 'https://example.com/audio2.mp3', title: 'Track 2', artist: 'Artist 2' },
  ]}
  initialTrackIndex={0}
  variant="full"
  onTrackChange={(index) => console.log('Track changed to:', index)}
  onExpand={() => console.log('Expand player')}
/>
```

### FileUpload
A multi-purpose file upload component supporting images, videos, audio, and documents.

```tsx
import { FileUpload } from '@/components/shared/FileUpload';

<FileUpload
  allowedTypes={['image', 'video', 'audio']}
  maxSizeMB={50}
  onUpload={(file) => console.log('File uploaded:', file)}
  onClear={() => console.log('Upload cleared')}
/>
```

### VideoConference
A video conferencing component using WebRTC for real-time communication.

```tsx
import { VideoConference } from '@/components/shared/VideoConference';

<VideoConference
  roomName="meeting-room"
  token="livekit-token"
  userName="John Doe"
  onDisconnect={() => console.log('Disconnected from conference')}
/>
```

## UI Primitives

The `ui/nativewind-primitives.tsx` file contains NativeWind-adapted versions of common UI components:

- `Button` - Styled button with variants
- `Input` - Text input field
- `Card` - Container component
- `Badge` - Status indicator
- `Avatar` - User avatar component
- `Separator` - Visual divider

## Dependencies

Make sure these packages are installed:

```bash
npm install @tanstack/react-query @miblanchard/react-native-slider lucide-react-native react-native-webrtc
```

## Notes

- All components use NativeWind for styling
- Components are optimized for React Native performance
- WebRTC functionality requires additional setup for production use
- File upload components handle permissions automatically
- Audio/Video components use Expo AV for cross-platform compatibility