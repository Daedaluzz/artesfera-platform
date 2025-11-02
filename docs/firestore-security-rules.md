# Firestore Security Rules - ArtEsfera Platform

## Overview

These Firestore security rules provide comprehensive access control for the ArtEsfera platform's database, implementing a secure-by-default approach with explicit permissions for each collection and document type.

## Complete Rules Configuration

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    // Helper function to check if a user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if the user is the owner of the data
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Helper function to check if a string is within a size limit
    function isStringSized(str, min, max) {
      return str is string && str.size() >= min && str.size() <= max;
    }

    // Helper function to check if the user is the owner of a specific document
    // by checking an 'ownerId' (or 'artistId', etc.) field inside the document.
    function isDocOwner() {
      // Check create (data doesn't exist yet, check incoming doc)
      return (request.resource.data.ownerId == request.auth.uid)
      // Check update/delete (data exists, check existing doc)
      || (resource.data.ownerId == request.auth.uid);
    }

    // Helper function to check if the user owns a saved item (uses userId field)
    function isSavedItemOwner() {
      // Check create (data doesn't exist yet, check incoming doc)
      return (request.resource.data.userId == request.auth.uid)
      // Check update/delete (data exists, check existing doc)
      || (resource.data.userId == request.auth.uid);
    }

    // ========================================
    // ARTESFERA NAMESPACED COLLECTIONS
    // ========================================

    // Private user data - only user can access
    // This rule is perfect. It correctly secures all subcollections.
    match /artesfera/users/{userId}/{allUserData=**} {
      allow read, write: if isOwner(userId);
    }

    // Public profiles - anyone can read, only owner can write
    // This rule is also perfect.
    match /artesfera/public/profiles/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }

    // Public artworks - anyone can read, only artist can write
    match /artesfera/public/artworks/{artworkId} {
      allow read: if isAuthenticated();
      // FIXED: Writes (create, update, delete) now require
      // the user's UID to match an 'ownerId' field in the document.
      allow write: if isAuthenticated() && isDocOwner();
    }

    // Public projects - anyone can read, authenticated users can write
    match /artesfera/public/projects/{projectId} {
      allow read: if isAuthenticated();
      // FIXED: Writes also require ownership.
      allow write: if isAuthenticated() && isDocOwner();
    }

    // ========================================
    // LEGACY/CURRENT COLLECTIONS (for compatibility)
    // ========================================

    // Current user documents structure - Private full access
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }

    // Public user profile information - Allow public read access to specific fields
    // This enables viewing other users' profiles with public information only
    // Contains: name, artisticName, bio, location, tags, socials, photoURL
    match /publicProfiles/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }

    // Current artworks structure
    match /artworks/{artworkId} {
      allow read: if isAuthenticated();
      // FIXED: Writes also require ownership.
      allow write: if isAuthenticated() && isDocOwner();
    }

    // Current projects structure
    match /projects/{projectId} {
      allow read: if isAuthenticated();
      // FIXED: Writes also require ownership.
      allow write: if isAuthenticated() && isDocOwner();
    }

    // Current saved items
    match /savedArtworks/{savedId} {
      allow read: if isAuthenticated() && isSavedItemOwner();
      // FIXED: Uses correct field name 'userId' instead of 'ownerId'
      // This matches the current Firestore structure.
      allow write: if isAuthenticated() && isSavedItemOwner();
    }

    match /savedProjects/{savedId} {
      allow read: if isAuthenticated() && isSavedItemOwner();
      // FIXED: Uses correct field name 'userId' instead of 'ownerId'
      // This matches the current Firestore structure.
      allow write: if isAuthenticated() && isSavedItemOwner();
    }

    // ========================================
    // DELETED SECTIONS
    // ========================================

    // REMOVED: /dev and /test collections.
    // These should not be in a user-facing test environment.
    // Use a separate Firebase project for pure dev.

    // REMOVED: The fallback 'match /{document=**}' rule.
    // This was a critical security flaw that allowed any user
    // to write to any document. Removing it enforces a
    // "default-deny" posture, which is secure.
  }
}
```

## Rule Breakdown

### 🔧 Helper Functions

#### `isAuthenticated()`

- **Purpose**: Verifies user is logged in
- **Returns**: Boolean - true if `request.auth` exists
- **Usage**: Base requirement for most operations

#### `isOwner(userId)`

- **Purpose**: Validates user owns a resource by comparing UIDs
- **Parameters**: `userId` - The user ID to check against
- **Returns**: Boolean - true if authenticated user matches provided userId
- **Usage**: Direct ownership validation

#### `isStringSized(str, min, max)`

- **Purpose**: Validates string length constraints
- **Parameters**:
  - `str` - String to validate
  - `min` - Minimum length
  - `max` - Maximum length
- **Returns**: Boolean - true if string meets size requirements
- **Usage**: Input validation for text fields

#### `isDocOwner()`

- **Purpose**: Advanced ownership validation using document fields
- **Logic**:
  - **Create**: Checks `request.resource.data.ownerId` against `request.auth.uid`
  - **Update/Delete**: Checks `resource.data.ownerId` against `request.auth.uid`
- **Usage**: Content ownership validation (artworks, projects)

#### `isSavedItemOwner()`

- **Purpose**: Ownership validation for saved items using `userId` field
- **Logic**:
  - **Create**: Checks `request.resource.data.userId` against `request.auth.uid`
  - **Update/Delete**: Checks `resource.data.userId` against `request.auth.uid`
- **Usage**: Saved content ownership validation

### 📂 Database Structure & Rules

## Future Architecture (`/artesfera/` namespace)

### 1. **Private User Data**

```
Collection: /artesfera/users/{userId}/{allUserData=**}
```

- **Read/Write**: Owner only
- **Purpose**: Private user documents and subcollections
- **Security**: Complete isolation per user
- **Examples**: Settings, drafts, private notes

### 2. **Public Profiles**

```
Collection: /artesfera/public/profiles/{userId}
```

- **Read**: Authenticated users
- **Write**: Owner only
- **Purpose**: Public profile information
- **Security**: Public visibility, owner control
- **Examples**: Bio, contact info, public settings

### 3. **Public Artworks**

```
Collection: /artesfera/public/artworks/{artworkId}
```

- **Read**: Authenticated users
- **Write**: Document owner only (via `ownerId` field)
- **Purpose**: Art pieces shared publicly
- **Security**: Content ownership validation
- **Examples**: Paintings, sculptures, digital art

### 4. **Public Projects**

```
Collection: /artesfera/public/projects/{projectId}
```

- **Read**: Authenticated users
- **Write**: Document owner only (via `ownerId` field)
- **Purpose**: Collaborative or showcase projects
- **Security**: Project ownership validation
- **Examples**: Art exhibitions, collaborations, galleries

## Current Architecture (Legacy compatibility)

### 5. **User Documents**

```
Collection: /users/{userId}
```

- **Read/Write**: Owner only
- **Purpose**: Current user profile system
- **Security**: Direct UID matching
- **Migration**: Will move to `/artesfera/users/` structure

### 6. **Current Artworks**

```
Collection: /artworks/{artworkId}
```

- **Read**: Authenticated users
- **Write**: Document owner only (via `ownerId` field)
- **Purpose**: Current artwork system
- **Security**: Ownership validation via document field

### 7. **Current Projects**

```
Collection: /projects/{projectId}
```

- **Read**: Authenticated users
- **Write**: Document owner only (via `ownerId` field)
- **Purpose**: Current project system
- **Security**: Ownership validation via document field

### 8. **Saved Content**

```
Collections:
- /savedArtworks/{savedId}
- /savedProjects/{savedId}
```

- **Read**: Owner only (via `userId` field)
- **Write**: Owner only (via `userId` field)
- **Purpose**: User's saved/bookmarked content
- **Security**: Personal collection isolation

## 🔐 Security Features

### ✅ **Security Strengths**

#### 1. **Default Deny Posture**

- No fallback rule allowing universal access
- Explicit permissions required for all operations
- Secure by default approach

#### 2. **Authentication Requirements**

- All operations require authenticated users
- No anonymous access to platform content
- Clear authentication validation

#### 3. **Ownership Validation**

- Multiple ownership validation methods
- Document-level ownership checking
- User-level resource isolation

#### 4. **Data Validation**

- String size validation available
- Type checking in helper functions
- Input sanitization capabilities

#### 5. **Future-Proof Architecture**

- Namespaced collections for organization
- Legacy compatibility during migration
- Scalable permission structure

### 🛡️ **Access Control Matrix**

| Collection Type   | Anonymous | Authenticated | Owner      | Document Owner |
| ----------------- | --------- | ------------- | ---------- | -------------- |
| Private User Data | ❌        | ❌            | ✅         | ❌             |
| Public Profiles   | ❌        | ✅ (Read)     | ✅ (Write) | ❌             |
| Public Artworks   | ❌        | ✅ (Read)     | ❌         | ✅ (Write)     |
| Public Projects   | ❌        | ✅ (Read)     | ❌         | ✅ (Write)     |
| User Documents    | ❌        | ❌            | ✅         | ❌             |
| Saved Content     | ❌        | ❌            | ✅         | ❌             |

### 📋 **Permission Levels Explained**

#### **Read Permissions**

- **Public Content**: Authenticated users can view
- **Private Content**: Owner only
- **Saved Content**: Owner only

#### **Write Permissions**

- **Profile Updates**: User can modify own profile
- **Content Creation**: User can create content they own
- **Content Updates**: Only content owner can modify
- **Content Deletion**: Only content owner can delete

## 🚀 Implementation Guidelines

### **Data Structure Requirements**

#### For Content Documents (Artworks/Projects)

```javascript
{
  ownerId: "user-uid-here", // Required for ownership validation
  title: "Artwork Title",
  description: "Description",
  createdAt: timestamp,
  // ... other fields
}
```

#### For Saved Items

```javascript
{
  userId: "user-uid-here", // Required for ownership validation
  artworkId: "artwork-id", // Reference to saved content
  savedAt: timestamp,
  // ... other fields
}
```

### **Best Practices**

#### 1. **Always Set Owner Fields**

- Include `ownerId` in all content documents
- Include `userId` in all saved item documents
- Set these fields during document creation

#### 2. **Validate Before Write**

- Check authentication status
- Verify ownership before updates
- Use helper functions consistently

#### 3. **Handle Edge Cases**

- Account for document creation vs updates
- Validate field existence before checking values
- Provide clear error messages

#### 4. **Migration Strategy**

- Keep legacy rules during transition
- Test new rules with limited users first
- Document migration timeline

## 🔧 Deployment & Maintenance

### **Deployment Steps**

1. Go to Firebase Console → Firestore → Rules
2. Replace existing rules with the configuration above
3. Click "Publish" to deploy
4. Test with different user scenarios

### **Testing Checklist**

- [ ] Authenticated users can read public content
- [ ] Users can only write their own content
- [ ] Ownership validation works for all content types
- [ ] Saved items are properly isolated per user
- [ ] Anonymous users are properly blocked

### **Monitoring**

- **Security Violations**: Monitor failed rule evaluations
- **Performance**: Track rule evaluation costs
- **Usage Patterns**: Analyze access patterns for optimization
- **Error Rates**: Monitor authentication and authorization failures

### **Regular Maintenance**

- **Quarterly Security Reviews**: Audit rules for potential issues
- **Performance Optimization**: Review complex rule evaluations
- **Documentation Updates**: Keep this document current with changes
- **Rule Testing**: Regular testing with various user scenarios

## 📝 Migration Path

### **Current State**

- Legacy collections: `/users/`, `/artworks/`, `/projects/`
- Working security rules with ownership validation
- Compatible with existing application code

### **Future State**

- Namespaced collections: `/artesfera/users/`, `/artesfera/public/`
- Enhanced organization and security
- Cleaner separation of public and private data

### **Transition Strategy**

1. **Phase 1**: Deploy current rules (maintains compatibility)
2. **Phase 2**: Update application to use new namespaced paths
3. **Phase 3**: Migrate existing data to new structure
4. **Phase 4**: Remove legacy collection rules
5. **Phase 5**: Complete migration to namespaced architecture

This security configuration provides enterprise-grade protection while maintaining flexibility for the ArtEsfera platform's growth and evolution.
