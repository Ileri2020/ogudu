# Mobile App Components Documentation

This document provides a comprehensive guide to all business components implemented from the web app to the mobile app.

## Component Structure

### Location: `components/shared/`

All major business components are located in the shared folder for reusability across the app.

---

## Component Categories & Usage

### 1. **Posts & Comments Components**

#### `Posts.tsx` - `<Posts />`
Container component that fetches and displays multiple posts.

**Props:**
```typescript
interface PostsProps {
  category?: string;        // Filter posts by category
  limit?: number;          // Number of posts to load (default: 10)
  onPostUpdate?: () => void; // Callback when posts are updated
}
```

**Usage:**
```jsx
<Posts category="worship" limit={10} onPostUpdate={handleUpdate} />
```

#### `Post.tsx` - `<Post />`
Individual post component with like, comment, and media playback functionality.

**Features:**
- Like/unlike functionality
- Comment display and management
- Media playback (video/audio)
- Share functionality

#### `CommentCard.tsx` - `<CommentCard />`
Displays individual comments with delete capability for admins.

**Props:**
```typescript
interface CommentCardProps {
  id: string;
  username: string;
  comment: string;
  createdAt: string;
  onDelete?: () => void;
}
```

#### `Comments.tsx` - `<Comments />`
Container that fetches and displays all comments for a post.

---

### 2. **Profile Components**

#### `ProfileCardVariants.tsx`
Two profile card component variants.

**`<ProfileCard />`** - Full profile card with header background
```typescript
interface ProfileCardProps {
  name: string;
  title: string;
  profileImage: string;
  className?: string;
}
```

**`<ProfileCardTransparentBG />`** - Minimal profile card without background

**Usage:**
```jsx
<ProfileCard 
  name="John Doe" 
  title="Lead Pastor" 
  profileImage="https://..." 
/>
```

#### `ProfileImg.tsx` - `<ProfileImg />`
Profile image picker with gallery and camera options.

**Features:**
- Select from gallery
- Take photo with camera
- Auto-upload to server
- Display current profile image

**Usage:**
```jsx
<ProfileImg onImageSelected={(uri) => console.log(uri)} />
```

---

### 3. **Authentication Components**

Located in `components/account/`

#### `Login.tsx` - `<Login />`
Login form component.

**Props:**
```typescript
interface LoginProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}
```

**Features:**
- Email and password validation
- Show/hide password toggle
- Error handling with alerts
- Link to signup

#### `Signup.tsx` - `<Signup />`
Registration form component.

**Features:**
- Username, email, password inputs
- Password confirmation
- Form validation
- Link to login

#### `EditUser.tsx` - `<EditUser />`
User profile edit form.

**Features:**
- Edit username, email, department, contact
- Pre-filled with current user data
- Profile update with server sync

---

### 4. **Gallery & Media Components**

#### `Gallery.tsx` - `<Gallery />`
Displays product gallery with add-to-cart functionality.

**Props:**
```typescript
interface GalleryProps {
  limit?: number;
  onAddToCart?: (item: GalleryItem) => void;
}
```

**Features:**
- Fetch items from API
- Display in scrollable list
- Add to cart button
- Price display

#### `Audio.tsx` - `<Audio />`
Audio content listing component.

**Props:**
```typescript
interface AudioProps {
  category?: string;  // 'worship', 'praise', etc.
  limit?: number;
}
```

#### `Video.tsx` - `<VideoPlayer />`
Video playback component (already exists in shared).

---

### 5. **Social & Footer Components**

#### `Social.tsx` - `<Social />`
Social media links component.

**Props:**
```typescript
interface SocialProps {
  size?: number;      // Icon size (default: 24)
  gap?: number;       // Gap between icons
  color?: string;     // Icon color
  includeIcons?: ('facebook' | 'instagram' | 'twitter' | 'youtube' | 'whatsapp')[];
}
```

**Usage:**
```jsx
<Social 
  size={24} 
  color="#3b82f6" 
  includeIcons={['facebook', 'instagram', 'twitter']} 
/>
```

#### `Footer.tsx` - Footer Components

**`<Footer />`** - Main footer with categories and social links
```typescript
interface FooterProps {
  variant?: 'default' | 'minimal' | 'extended';
}
```

**`<Footer1 />`** - Social media focused footer

**`<Footer2 />`** - Dark footer with quick links

---

### 6. **Form Components**

#### `ContactForm.tsx` - `<ContactForm />`
Contact form for user inquiries.

**Features:**
- Name, email, subject, message inputs
- Form validation
- Email validation
- Submit with loading state

**Usage:**
```jsx
<ContactForm 
  onSuccess={() => console.log('Message sent')} 
  onError={(error) => console.log(error)} 
/>
```

---

### 7. **Carousel & Display Components**

#### `CoverCarousel.tsx` - `<CoverCarousel />`
Featured items carousel with indicators.

**Props:**
```typescript
interface CoverItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  onPress?: () => void;
}

interface CoverCarouselProps {
  items: CoverItem[];
  title?: string;
}
```

#### `TextCarousel.tsx` - `<TextCarousel />`
Animated text carousel (already exists).

#### `Carousel.tsx` - `<Carousel />`
Generic carousel component (already exists).

---

### 8. **Testimonials Components**

#### `Testimonials.tsx` - Testimonial Components

**`<TestimonialProp />`** - Individual testimonial card
```typescript
interface TestimonialPropType {
  id: string;
  name: string;
  title: string;
  quote: string;
  profileImage: string;
  rating?: number;
}
```

**`<TestimonialsSection />`** - Horizontal scrolling testimonials
```typescript
interface TestimonialsSectionProps {
  testimonials: TestimonialPropType[];
  title?: string;
}
```

**Usage:**
```jsx
<TestimonialsSection 
  testimonials={testimonialData} 
  title="What People Say" 
/>
```

---

### 9. **Content Components**

#### `Similar.tsx` - `<Similar />`
Similar/related posts component.

**Props:**
```typescript
interface SimilarProps {
  postId: string;
  category: string;
  limit?: number;
  onPostUpdate?: () => void;
}
```

**Features:**
- Fetches similar posts based on category
- Excludes current post
- Displays using Post component

---

### 10. **Drawer Components**

Located in `Drawers.tsx`

#### `BookDrawer` - `<BookDrawer />`
Modal drawer for book management.

**Features:**
- Add/edit book information
- Title, author, description, price inputs
- File upload integration

#### `PayDrawer` - `<PayDrawer />`
Modal drawer for payment processing.

**Features:**
- Amount and email inputs
- Payment method selection (card, transfer, wallet)
- Payment processing

**Usage:**
```jsx
<PayDrawer 
  visible={isOpen}
  title="Make Payment"
  onClose={handleClose}
  onSubmit={(data) => handlePayment(data)}
/>
```

---

## Importing Components

### From Shared Components:
```typescript
import { 
  Post, 
  Posts, 
  CommentCard, 
  ProfileCard,
  Gallery,
  Footer,
  ContactForm,
  CoverCarousel,
  Testimonials,
  Social
} from '@/components/shared';
```

### From Account Components:
```typescript
import { 
  Login, 
  Signup, 
  EditUser, 
  ProfileImg 
} from '@/components/account';
```

---

## Common Patterns

### 1. **API Integration**
All components use `axios` for API calls with `API_URL` from config:
```typescript
import { API_URL } from '@/constants/Config';
import axios from 'axios';

const response = await axios.get(`${API_URL}/api/endpoint`);
```

### 2. **Context Usage**
Components use app context for user data:
```typescript
import { useAppContext } from '@/context/AppContext';

const { user, setUser } = useAppContext();
```

### 3. **Styling**
All components use NativeWind (Tailwind for React Native):
```jsx
<View className="bg-white dark:bg-slate-800 rounded-lg p-4">
  <Text className="text-slate-900 dark:text-white">Content</Text>
</View>
```

### 4. **Icons**
Components use `@expo/vector-icons`:
```typescript
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
```

---

## Responsive Behavior

All components are optimized for mobile screens using:
- Flexible layouts with `flex` and `flex-row`
- Responsive spacing with NativeWind classes
- ScrollView for overflow content
- FlatList for efficient large lists

---

## Error Handling

Components include consistent error handling:
- Alert dialogs for user feedback
- Try-catch blocks for API calls
- Loading states during async operations
- Null checks for optional data

---

## Testing Components

To test individual components, you can create a screen like:

```tsx
import { View } from 'react-native';
import { Gallery } from '@/components/shared';

export default function TestGallery() {
  return (
    <View className="flex-1">
      <Gallery limit={5} />
    </View>
  );
}
```

---

## Migration Notes

- All components are **React Native compatible** using Expo
- Components use the same **API endpoints** as the web app
- **User context** is consistent across both platforms
- **Styling** uses NativeWind (identical to web Tailwind patterns)
- **Icons** use Expo vector icons (FontAwesome, MaterialIcons, Ionicons)

---

## Future Enhancements

- [ ] Add animations to components
- [ ] Implement offline caching
- [ ] Add accessibility features
- [ ] Expand media player controls
- [ ] Add real-time notifications
- [ ] Implement push notifications

---

## Support

For component issues or questions, refer to:
1. Component JSDoc comments
2. Component interfaces and types
3. Usage examples in this documentation
