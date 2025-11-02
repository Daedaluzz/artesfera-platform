# Firebase Deployment Instructions

## Deploy Security Rules

To deploy the updated security rules that enable public profile viewing and comprehensive file security:

### Option 1: Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not installed):

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```bash
   firebase login
   ```

3. **Deploy All Rules**:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

   Or deploy individually:
   ```bash
   # Deploy Firestore rules
   firebase deploy --only firestore:rules
   
   # Deploy Storage rules  
   firebase deploy --only storage:rules
   ```

### Option 2: Firebase Console (Manual)

#### Firestore Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your ArtEsfera project
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with the content from `firestore.rules` file
5. Click **Publish**

#### Storage Rules
1. In the same Firebase Console project
2. Navigate to **Storage** → **Rules**
3. Replace the existing rules with the content from `storage.rules` file
4. Click **Publish**

## Current Rules Updates

### Firestore Rules (`firestore.rules`)

The updated rules include a new collection for public profiles:

```javascript
// Public user profile information - Allow public read access to specific fields
// This enables viewing other users' profiles with public information only
// Contains: name, artisticName, bio, location, tags, socials, photoURL
match /publicProfiles/{userId} {
  allow read: if isAuthenticated();
  allow write: if isOwner(userId);
}
```

### Storage Rules (`storage.rules`)

The updated rules provide comprehensive file security with:

- **Helper Functions**: Authentication, ownership, file type, and size validation
- **Private User Data**: Secure access to personal files and AI history  
- **Public Assets**: Firestore-validated access to artworks, projects, galleries
- **Legacy Support**: Backward compatibility with existing file structures
- **File Size Limits**: Appropriate limits for different content types
- **Content Type Validation**: Image and document type checking

## Testing the Deployment

After deploying the rules:

1. **Test Logout**:

   - Log in to the platform
   - Navigate to `/profile`
   - Click "Sair" (logout button)
   - Verify you're redirected to home page without errors

2. **Test Public Profile Creation**:

   - Log in and edit your profile
   - Save changes
   - Check if public profile is created in Firestore Console

3. **Test Public Profile Viewing**:
   - Get another user's ID from Firestore Console
   - Navigate to `/profile/[userId]`
   - Verify you can see public information only

## Security Verification

Confirm these security behaviors:

✅ **Private Data Protected**: Email and phone not visible in public profiles
✅ **Authentication Required**: Unauthenticated users cannot view profiles
✅ **Ownership Enforced**: Users can only edit their own profiles
✅ **Logout Safe**: No permission errors when logging out from profile page

## Troubleshooting

### Permission Denied Errors

- Ensure Firestore rules are deployed correctly
- Check authentication state in browser dev tools
- Verify user has proper permissions

### Profile Not Found

- Check if public profile was created (requires profile edit after deployment)
- Verify user ID is correct in URL
- Check Firestore Console for public profile document

### Infinite Loading

- Clear browser cache and cookies
- Check for JavaScript errors in browser console
- Verify authentication context is working properly
