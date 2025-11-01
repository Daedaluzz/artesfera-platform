# Firebase Integration Guide for ArtEsfera

## Overview

This guide explains how Firebase has been integrated into the ArtEsfera platform to provide authentication, database, storage, and analytics functionality.

## Services Configured

### 1. Firebase Authentication

- Email/password authentication
- Google OAuth integration
- User profile management
- Password reset functionality

### 2. Firestore Database

- User profiles collection
- Artworks collection
- Projects collection
- Saved items tracking
- Real-time data synchronization

### 3. Firebase Storage

- Artwork image uploads
- Project image uploads
- Profile picture uploads
- Document storage (PDFs, resumes)

### 4. Firebase Analytics

- User behavior tracking
- Performance monitoring
- Custom event tracking

## File Structure

```
src/
├── lib/
│   ├── firebase.ts          # Firebase configuration and initialization
│   ├── auth.ts              # Authentication utilities
│   ├── firestore.ts         # Database operations
│   └── storage.ts           # File upload utilities
├── contexts/
│   └── AuthContext.tsx      # React context for authentication state
└── app/
    └── layout.tsx           # Updated with AuthProvider
```

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Authentication Usage

### Basic Authentication

```tsx
import { useAuth } from "@/contexts/AuthContext";

function LoginComponent() {
  const { signIn, signUp, signInWithGoogle, user, loading } = useAuth();

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (user) return <div>Welcome {user.displayName}!</div>;

  return (
    <div>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      {/* Email/password form */}
    </div>
  );
}
```

### Protected Routes

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

## Database Operations

### Creating Artworks

```tsx
import { dbUtils } from "@/lib/firestore";
import { storageUtils } from "@/lib/storage";

const createArtwork = async (artworkData: ArtworkFormData) => {
  try {
    // Upload image first
    const imageUrl = await storageUtils.uploadArtworkImage(
      artworkData.imageFile,
      user.uid
    );

    // Create artwork record
    const artworkId = await dbUtils.artworks.create({
      title: artworkData.title,
      description: artworkData.description,
      imageUrl,
      artistId: user.uid,
      artistName: user.displayName,
      category: artworkData.category,
      medium: artworkData.medium,
      year: artworkData.year,
      tags: artworkData.tags,
    });

    console.log("Artwork created:", artworkId);
  } catch (error) {
    console.error("Error creating artwork:", error);
  }
};
```

### Fetching Data

```tsx
import { dbUtils } from "@/lib/firestore";

const GalleryPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const artworksData = await dbUtils.artworks.getAll([
          orderBy("createdAt", "desc"),
          limit(12),
        ]);
        setArtworks(artworksData);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
};
```

## File Upload Examples

### Artwork Image Upload

```tsx
import { storageUtils, FILE_TYPES, FILE_SIZE_LIMITS } from "@/lib/storage";

const ArtworkUploadForm = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (file: File) => {
    // Validate file
    const validation = storageUtils.validateFile(
      file,
      FILE_TYPES.IMAGES,
      FILE_SIZE_LIMITS.ARTWORK_IMAGE
    );

    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      setUploading(true);

      const imageUrl = await storageUtils.uploadArtworkImage(
        file,
        user.uid,
        undefined,
        (progress) => setUploadProgress(progress)
      );

      console.log("Upload completed:", imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />
      {uploading && <div>Uploading: {Math.round(uploadProgress)}%</div>}
    </div>
  );
};
```

## Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Anyone can read artworks, only owner can write
    match /artworks/{artworkId} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.uid == resource.data.artistId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.artistId;
    }

    // Anyone can read active projects, only creator can write
    match /projects/{projectId} {
      allow read: if resource.data.status == 'active';
      allow write: if request.auth != null &&
        request.auth.uid == resource.data.createdBy;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.createdBy;
    }

    // Users can manage their own saved items
    match /savedArtworks/{documentId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }

    match /savedProjects/{documentId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Artwork images - anyone can read, only owner can write
    match /artworks/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Project images - anyone can read, only owner can write
    match /projects/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Profile images - anyone can read, only owner can write
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Documents - only owner can read/write
    match /documents/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Next Steps

1. **Set up Firebase Console:**

   - Enable Authentication providers (Email/Password, Google)
   - Configure Firestore database
   - Set up Storage buckets
   - Apply security rules

2. **Test Authentication:**

   - Update login/register pages to use Firebase auth
   - Test Google OAuth integration
   - Verify user profile creation

3. **Migrate Gallery Data:**

   - Convert mock data to Firestore collections
   - Update Gallery component to use Firebase
   - Implement real-time updates

4. **Implement Projects Integration:**

   - Convert Projects page to use Firestore
   - Add project creation functionality
   - Implement save/apply features

5. **Add Admin Features:**
   - Admin dashboard for content moderation
   - Featured content management
   - User verification system

## Troubleshooting

### Common Issues

1. **Authentication not working:**

   - Check environment variables are set correctly
   - Verify Firebase console authentication providers are enabled
   - Ensure domain is added to authorized domains

2. **Firestore permission denied:**

   - Check security rules are configured
   - Verify user is authenticated
   - Ensure document ownership rules

3. **Storage upload fails:**

   - Check file size limits
   - Verify file type validation
   - Ensure storage rules allow uploads

4. **Build errors:**
   - Ensure all Firebase packages are installed
   - Check TypeScript types are correct
   - Verify import paths

### Performance Tips

1. **Use query limits:** Always limit Firestore queries to prevent large data downloads
2. **Index your queries:** Add composite indexes for complex queries
3. **Optimize images:** Use Firebase Storage image optimization
4. **Cache user profiles:** Store frequently accessed data in React state
5. **Lazy load collections:** Load data as needed, not all at once

## Security Best Practices

1. **Never expose admin keys:** Keep server-side keys secret
2. **Validate all inputs:** Sanitize data before storing
3. **Use security rules:** Implement proper access controls
4. **Monitor usage:** Set up alerts for unusual activity
5. **Regular audits:** Review permissions and access patterns
