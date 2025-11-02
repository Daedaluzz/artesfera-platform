# Firebase Deployment Instructions

## Deploy Firestore Security Rules

To deploy the updated Firestore security rules that enable public profile viewing:

### Option 1: Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Deploy Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Firebase Console (Manual)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your ArtEsfera project
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with the content from `firestore.rules` file
5. Click **Publish**

## Current Rules Update

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