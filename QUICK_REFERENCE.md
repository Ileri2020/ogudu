# Component Reference Guide - Quick Lookup

## Import All Business Components

### From `@/components/shared/`
```typescript
import {
  // Posts & Comments
  Post,
  Posts,
  PostButton,
  Comments,
  CommentCard,
  Likes,
  Similar,

  // Profiles
  ProfileCard,
  ProfileCardVariant,
  ProfileCardTransparentBG,
  Logobg,

  // Gallery & Media
  Gallery,
  Audio,
  AudioPlayer,
  VideoPlayer,
  VideoConference,
  FileUpload,
  MediaUploader,

  // Social & Navigation
  Social,
  Footer,
  Footer1,
  Footer2,

  // Text & Animations (11 components)
  AnimatedText,
  ZoomInText,
  FlyInText,
  SlideUpText,
  SlideInText,
  ScaleInText,
  FlipInText,
  BounceInText,
  RotateInText,
  TypewriterText,
  TextAnimations,
  TextAnimationsGroup,
  AnimatedHeroTitle,

  // Forms
  ContactForm,

  // Carousels
  CoverCarousel,
  Carousel,
  TextCarousel,
  TestimonialsCarousel,
  Testimonials,
  TestimonialProp,
  TestimonialsSection,

  // Modals
  BookDrawer,
  PayDrawer,

  // Other
  EventFeed,
  PostsList,
} from '@/components/shared';
```

### From `@/components/account/`
```typescript
import {
  Login,
  Signup,
  EditUser,
  ProfileImg,
  ProfileHeader,
  InfoItem,
} from '@/components/account';
```

---

## Component Features Matrix

| Component | Type | Props | Async | Modal | Export |
|-----------|------|-------|-------|-------|--------|
| Post | Display | post, onUpdate | ✅ | ❌ | shared |
| Posts | Container | category, limit | ✅ | ❌ | shared |
| PostButton | Modal | visible, onClose | ✅ | ✅ | shared |
| Comments | Container | videoId, reload | ✅ | ❌ | shared |
| CommentCard | Display | id, username | ✅ | ❌ | shared |
| Likes | Interactive | postId, onUpdate | ✅ | ❌ | shared |
| Similar | Container | postId, category | ✅ | ❌ | shared |
| ProfileCard | Display | name, title, image | ❌ | ❌ | shared |
| ProfileCardTransparent | Display | name, title, image | ❌ | ❌ | shared |
| Logobg | Display | size, variant | ❌ | ❌ | shared |
| Gallery | Container | limit, onAddToCart | ✅ | ❌ | shared |
| Audio | Container | category, limit | ✅ | ❌ | shared |
| AudioPlayer | Interactive | tracks, variant | ✅ | ❌ | shared |
| VideoPlayer | Interactive | url, title | ✅ | ❌ | shared |
| ContactForm | Form | onSuccess, onError | ✅ | ❌ | shared |
| CoverCarousel | Display | items, title | ❌ | ❌ | shared |
| TextAnimations | Display | text, type | ❌ | ❌ | shared |
| TypewriterText | Display | text, speed | ❌ | ❌ | shared |
| Social | Navigation | size, color | ❌ | ❌ | shared |
| Footer | Display | variant | ❌ | ❌ | shared |
| BookDrawer | Modal | visible, onClose | ✅ | ✅ | shared |
| PayDrawer | Modal | visible, onClose | ✅ | ✅ | shared |
| Login | Form | onSuccess, onSwitch | ✅ | ❌ | account |
| Signup | Form | onSuccess, onSwitch | ✅ | ❌ | account |
| EditUser | Form | onSuccess | ✅ | ❌ | account |
| ProfileImg | Interactive | onImageSelected | ✅ | ❌ | account |

---

## Animation Components Cheat Sheet

### Basic Animation
```tsx
<TextAnimations 
  text="Hello" 
  type="zoom"
  className="text-2xl font-bold"
/>
```

### Animation Types
- `'fade'` - Fade in
- `'zoom'` - Zoom in
- `'fly'` - Fly from left
- `'slide'` - Slide from bottom
- `'scale'` - Scale effect
- `'flip'` - Flip rotation
- `'bounce'` - Bounce effect
- `'rotate'` - Rotate animation
- `'typewriter'` - Typewriter typing

### Group Animation
```tsx
<TextAnimationsGroup 
  texts={['Line 1', 'Line 2']} 
  type="fade"
/>
```

### Hero Title
```tsx
<AnimatedHeroTitle 
  mainText="Welcome!"
  subtitle="Subtitle here"
  animationType="zoom"
/>
```

### Typewriter
```tsx
<TypewriterText 
  text="Typing effect..."
  speed={100}
  onComplete={() => console.log('done')}
/>
```

---

## Form Components Usage

### Login
```tsx
<Login 
  onSuccess={handleLoginSuccess}
  onSwitchToSignup={() => setMode('signup')}
/>
```

### Signup
```tsx
<Signup 
  onSuccess={handleSignupSuccess}
  onSwitchToLogin={() => setMode('login')}
/>
```

### EditUser
```tsx
<EditUser onSuccess={handleProfileUpdate} />
```

### ProfileImg
```tsx
<ProfileImg onImageSelected={(uri) => handleImageUpload(uri)} />
```

### ContactForm
```tsx
<ContactForm 
  onSuccess={() => handleSuccess()}
  onError={(error) => handleError(error)}
/>
```

---

## Modal Components Usage

### PostButton
```tsx
const [showPostModal, setShowPostModal] = useState(false);

<PostButton 
  visible={showPostModal}
  onClose={() => setShowPostModal(false)}
  onPostCreated={handlePostCreated}
/>

<Button onPress={() => setShowPostModal(true)}>
  Create Post
</Button>
```

### BookDrawer
```tsx
const [showBookDrawer, setShowBookDrawer] = useState(false);

<BookDrawer 
  visible={showBookDrawer}
  title="Add Book"
  onClose={() => setShowBookDrawer(false)}
  onSubmit={(bookData) => handleBookSubmit(bookData)}
/>
```

### PayDrawer
```tsx
const [showPayDrawer, setShowPayDrawer] = useState(false);

<PayDrawer 
  visible={showPayDrawer}
  title="Make Payment"
  onClose={() => setShowPayDrawer(false)}
  onSubmit={(paymentData) => handlePayment(paymentData)}
/>
```

---

## Display Components Usage

### ProfileCard
```tsx
<ProfileCard 
  name="John Doe"
  title="Pastor"
  profileImage="https://..."
/>
```

### Logobg
```tsx
// Sizes: 'small' | 'medium' | 'large'
// Variants: 'light' | 'dark' | 'gradient'

<Logobg size="large" variant="gradient" showText={true} />
```

### Social
```tsx
<Social 
  size={24}
  color="#3b82f6"
  includeIcons={['facebook', 'instagram', 'twitter', 'youtube', 'whatsapp']}
/>
```

### Testimonials
```tsx
<TestimonialsSection 
  testimonials={testimonialData}
  title="What People Say"
/>
```

### CoverCarousel
```tsx
<CoverCarousel 
  items={coverItems}
  title="Featured"
/>
```

---

## Container Components Usage

### Posts
```tsx
<Posts 
  category="worship"
  limit={10}
  onPostUpdate={handleUpdate}
/>
```

### Gallery
```tsx
<Gallery 
  limit={10}
  onAddToCart={(item) => handleAddToCart(item)}
/>
```

### Audio
```tsx
<Audio 
  category="worship"
  limit={10}
/>
```

### Similar
```tsx
<Similar 
  postId={currentPost.id}
  category="worship"
  limit={5}
/>
```

---

## Common Props Patterns

### All Forms
```typescript
onSuccess?: () => void;
onError?: (error: string) => void;
```

### All Modals
```typescript
visible: boolean;
onClose: () => void;
onSubmit?: (data: any) => void;
```

### All Containers
```typescript
limit?: number;
onUpdate?: () => void;
category?: string;
```

### All Display Components
```typescript
className?: string;
```

### All Animation Components
```typescript
text: string;
className?: string;
type?: AnimationType;
```

---

## Error Handling Pattern

All async components use:
```typescript
try {
  // API call
  Alert.alert('Success', 'Message');
} catch (error) {
  Alert.alert('Error', 'Error message');
} finally {
  setLoading(false);
}
```

---

## Loading States

All async operations show:
```tsx
{loading ? (
  <ActivityIndicator size="large" />
) : (
  <Text>Content</Text>
)}
```

---

## File Organization

**New Components (10 files):**
- PostButton.tsx (2 KB)
- Likes.tsx (1.5 KB)
- Logobg.tsx (1.2 KB)
- TypewriterText.tsx (1 KB)
- TextAnimations.tsx (2 KB)
- AnimatedText.tsx - Enhanced (2.5 KB)
- Login.tsx (3 KB)
- Signup.tsx (3.5 KB)
- EditUser.tsx (3 KB)
- ProfileImg.tsx (2.5 KB)

**Updated Files (2 files):**
- index.ts - Shared exports
- index.ts - Account exports

---

## Quick Integration Checklist

- [ ] Import components from shared or account
- [ ] Wrap with AppContext provider
- [ ] Handle auth state
- [ ] Set up API endpoints
- [ ] Configure navigation
- [ ] Test on device
- [ ] Verify all alerts/errors
- [ ] Check animations performance
- [ ] Verify dark mode
- [ ] Test responsiveness

---

## Performance Tips

1. Use `scrollEnabled={false}` on FlatList in ScrollView
2. Memoize expensive calculations
3. Clean up useEffect intervals
4. Optimize image sizes
5. Lazy load heavy modals
6. Throttle rapid updates
7. Use Platform-specific code when needed

---

## Dark Mode Support

All components automatically support dark mode:
```tsx
className="bg-white dark:bg-slate-800"
className="text-slate-900 dark:text-white"
```

---

## Accessibility

- Semantic structure
- Icon + text labels
- Proper focus management
- Touch target sizes (min 44x44)
- Color contrast compliance

---

## Need Help?

Refer to:
1. Component JSDoc comments
2. Type definitions at file top
3. Usage examples above
4. COMPONENTS_README.md
5. FINAL_COMPONENTS_SUMMARY.md
