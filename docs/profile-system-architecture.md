# Profile System Architecture - ArtEsfera Platform

## Overview

This document describes the updated profile system architecture that enables both private user data management and public profile viewing while maintaining security and privacy.

## 🏗️ Dual-Privacy Architecture

### **1. Private User Data** (`/users/{userId}`)

**Purpose**: Complete user information including sensitive data
**Access**: Only the user who owns the profile
**Security Rule**: `allow read, write: if isOwner(userId);`

**Contains**:

- Complete user profile including sensitive information
- Email address and phone number
- Private settings and preferences
- Full edit history and metadata

**Use Cases**:

- User viewing/editing their own profile
- System operations requiring full user data
- Private profile management

### **2. Public Profile Data** (`/publicProfiles/{userId}`)

**Purpose**: Curated subset of user information for public viewing
**Access**: All authenticated users can read, only owner can write
**Security Rule**:

```javascript
match /publicProfiles/{userId} {
  allow read: if isAuthenticated();
  allow write: if isOwner(userId);
}
```

**Contains**:

- `uid`: User identifier
- `name`: Display name
- `artisticName`: Artist handle/username
- `bio`: Biography/description
- `location`: City and state
- `tags`: Interests and specialties
- `socials`: Website, Instagram, YouTube links
- `photoURL`: Profile photo
- `updatedAt`: Last sync timestamp

**Use Cases**:

- Other users viewing public profiles
- Artist discovery and networking
- Profile sharing via direct links
- Community features and galleries

## 🔄 Data Synchronization

### Automatic Sync Process

When a user updates their private profile (`/users/{userId}`), the system automatically syncs selected public fields to their public profile (`/publicProfiles/{userId}`).

**Sync Trigger**: Profile edit save operation
**Implementation**: `syncPublicProfile()` function in AuthContext
**Fields Synced**: Only non-sensitive public information

```typescript
const syncPublicProfile = async (userId: string): Promise<void> => {
  // Extract public fields from private user document
  const publicProfileData = {
    uid: userData.uid,
    name: userData.name || "",
    photoURL: userData.photoURL || null,
    artisticName: userData.artisticName || "",
    bio: userData.bio || "",
    location: userData.location || "",
    tags: userData.tags || [],
    socials: userData.socials || {},
    updatedAt: new Date(),
  };

  // Store in public profiles collection
  await setDoc(publicProfileRef, publicProfileData, { merge: true });
};
```

## 🌐 Profile Viewing System

### **Own Profile** (`/profile`)

**Route**: `/profile`
**Component**: `ProfileExhibition.tsx`
**Data Source**: Private user document (`/users/{userId}`)
**Features**:

- Complete profile information display
- Edit button and profile management
- Private contact information (email, phone)
- Full profile settings access

### **Other Users' Profiles** (`/profile/[userId]`)

**Route**: `/profile/[userId]`
**Component**: `/profile/[userId]/page.tsx`
**Data Source**: Public profile document (`/publicProfiles/{userId}`)
**Features**:

- Public information only
- Social links and portfolio access
- No private contact information
- Clean, social media-style display

## 🔐 Security Features

### **Privacy Protection**

- ✅ Sensitive data (email, phone) never exposed in public profiles
- ✅ Users control what information becomes public
- ✅ Private profiles require ownership verification
- ✅ Public profiles only show curated, safe information

### **Access Control**

- ✅ Authentication required for all profile viewing
- ✅ Ownership verification for profile editing
- ✅ Automatic logout redirect prevents permission errors
- ✅ Cross-collection consistency between private and public data

### **Data Integrity**

- ✅ Public profiles auto-sync with private data changes
- ✅ Merge operations prevent data overwriting
- ✅ Timestamp tracking for sync operations
- ✅ Error handling and recovery mechanisms

## 🚀 Implementation Details

### **Logout Behavior Fix**

**Problem**: Users clicking "Sair" (logout) while on profile page experienced infinite loading due to permission-denied errors.

**Solution**: Enhanced `signOut()` function with automatic redirect:

```typescript
const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
  setUser(null);
  setUserDocument(null);

  // Redirect to home page after logout to prevent permission errors
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};
```

### **Profile Component Enhancement**

**Authentication Handling**:

- Proper loading states during authentication
- Automatic redirect to login for unauthenticated users
- Error handling for permission issues

**Route Structure**:

- `/profile` - Own profile (private data)
- `/profile/[userId]` - Public profile view (public data only)
- `/profile/edit` - Profile editing (private data + sync)

### **Firebase Rules Updates**

**Added Public Profile Collection**:

```javascript
// Public user profile information
match /publicProfiles/{userId} {
  allow read: if isAuthenticated();
  allow write: if isOwner(userId);
}
```

**Enhanced User Collection**:

```javascript
// Private user data - only owner access
match /users/{userId} {
  allow read, write: if isOwner(userId);
}
```

## 📱 User Experience

### **Public Profile Discovery**

1. Users can share profile links: `artesfera.com/profile/[userId]`
2. Other authenticated users can view public profiles
3. Profile displays artistic name, bio, location, interests, and social links
4. Clean, social media-style interface for easy browsing

### **Privacy-First Design**

1. Email and phone numbers never appear in public profiles
2. Users control public information through their private profile edits
3. Automatic sync ensures public profiles stay current
4. Clear visual distinction between own profile and public profile views

### **Seamless Navigation**

1. Logout from any profile page safely redirects to home
2. Edit buttons only appear on own profile
3. Back navigation for public profile viewing
4. Consistent styling and behavior across profile views

## 🔄 Migration Path

### **Existing Users**

- Private profiles in `/users/{userId}` remain unchanged
- Public profiles will be created on next profile edit
- No data loss or breaking changes
- Gradual rollout of public profile features

### **New Users**

- Both private and public profiles created on registration
- Automatic sync enabled from first profile completion
- Full feature access immediately available

## 🛠️ Maintenance

### **Monitoring**

- Track sync operation success rates
- Monitor public profile access patterns
- Watch for permission errors or security issues

### **Updates**

- Public profile fields can be adjusted by updating sync function
- Security rules can be refined based on usage patterns
- New social features can leverage existing public profile structure

## 📚 Related Documentation

- [Firebase Storage Security Rules](./firebase-storage-security-rules.md)
- [Firestore Security Rules](./firestore-security-rules.md)
- [Authentication System](../src/context/AuthContext.tsx)
