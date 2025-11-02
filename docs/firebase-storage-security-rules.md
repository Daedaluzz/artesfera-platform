# Firebase Storage Security Rules - ArtEsfera Platform

## Overview

These security rules provide comprehensive access control for the ArtEsfera platform's file storage, perfectly mirroring the Firestore database structure for consistency and clarity.

## Complete Rules Configuration

```javascript
rules_version = '2';

service firebase.storage {

  // This matches your default GCS bucket
  match /b/{bucket}/o {

    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // ========================================
    // ARTESFERA PLATFORM COMPREHENSIVE RULES
    // ========================================

    // ===========================================
    // USER PROFILE & PRIVATE DATA
    // ===========================================

    // User's private, siloed data.
    // This path is for drafts, AI history, and temp files.
    // ALIGNS WITH FIRESTORE: /artesfera/users/{userId}
    match /artesfera/users/{userId}/{allPrivateFiles=**} {
      // Only owner can read/write their private files.
      // This covers:
      // - /artesfera/users/{userId}/profile/* (NEW UNIFIED PATH)
      // - /artesfera/users/{userId}/ai-history/*
      // - /artesfera/users/{userId}/temp/*
      allow read, write: if isOwner(userId);
    }

    // COMPATIBILITY: Current profile system (Legacy)
    match /profile-photos/{userId}/{allFiles=**} {
      allow read: if true; // Public read for legacy compatibility
      allow write: if isOwner(userId);
    }

    // ===========================================
    // PUBLIC ASSETS (Artworks, Projects, Galleries)
    //
    // All public assets follow a "smart" rule:
    // They live in a public path, and their security
    // is governed by a corresponding Firestore document.
    // ===========================================

    // PORTFOLIO / ARTWORKS
    // ALIGNS WITH FIRESTORE: /artesfera/public/artworks/{artworkId}
    match /artesfera/public/artworks/{artworkId}/{allFiles=**} {
      allow read: if isAuthenticated();
      // Write allowed IF user is the owner in Firestore
      allow write: if isAuthenticated() &&
                    firestore.get(
                      /databases/(default)/documents/artesfera/public/artworks/$(artworkId)
                    ).data.ownerId == request.auth.uid;
    }

    // PROJECT COLLABORATION
    // ALIGNS WITH FIRESTORE: /artesfera/public/projects/{projectId}
    match /artesfera/public/projects/{projectId}/{allFiles=**} {
      allow read: if isAuthenticated();
      // Write allowed IF user is owner OR a member in Firestore
      allow write: if isAuthenticated() && (
        firestore.get(
          /databases/(default)/documents/artesfera/public/projects/$(projectId)
        ).data.ownerId == request.auth.uid
        ||
        request.auth.uid in firestore.get(
          /databases/(default)/documents/artesfera/public/projects/$(projectId)
        ).data.members
      );
    }

    // GALLERY AND EXHIBITION SYSTEM
    // ALIGNS WITH FIRESTORE: /artesfera/public/galleries/{galleryId}
    match /artesfera/public/galleries/{galleryId}/{allFiles=**} {
      allow read: if isAuthenticated();
      // Write allowed IF user is the owner in Firestore
      allow write: if isAuthenticated() &&
                    firestore.get(
                      /databases/(default)/documents/artesfera/public/galleries/$(galleryId)
                    ).data.ownerId == request.auth.uid;
    }

    // ===========================================
    // PUBLIC COMMUNITY & AI ASSETS
    // (FIXED VULNERABILITY)
    // ===========================================

    // SHARED AI TEMPLATES
    // ALIGNS WITH FIRESTORE: /artesfera/public/ai-templates/{templateId}
    match /artesfera/public/ai-templates/{templateId}/{allFiles=**} {
      allow read: if isAuthenticated();
      // FIXED: Write allowed IF user is owner in Firestore
      allow write: if isAuthenticated() &&
                    firestore.get(
                      /databases/(default)/documents/artesfera/public/ai-templates/$(templateId)
                    ).data.ownerId == request.auth.uid;
    }

    // COMMUNITY SUBMISSIONS (e.g., for an Event)
    // ALIGNS WITH FIRESTORE: /artesfera/public/community-events/{eventId}/submissions/{submissionId}
    match /artesfera/public/community-events/{eventId}/submissions/{submissionId}/{allFiles=**} {
      allow read: if isAuthenticated();
      // FIXED: Write allowed IF user is owner of the submission doc
      allow write: if isAuthenticated() &&
                    firestore.get(
                      /databases/(default)/documents/artesfera/public/community-events/$(eventId)/submissions/$(submissionId)
                    ).data.ownerId == request.auth.uid;
    }

    // ===========================================
    // SYSTEM AND LEGACY
    // ===========================================

    // Legacy projects support
    match /projects/{projectId}/{allFiles=**} {
      allow read: if isAuthenticated();
      // Write access checks legacy /projects collection in Firestore
      allow write: if isAuthenticated() &&
                    firestore.get(
                      /databases/(default)/documents/projects/$(projectId)
                    ).data.ownerId == request.auth.uid;
    }

    // Platform assets (logos, banners, system images)
    match /artesfera/system/assets/{allFiles=**} {
      allow read: if true;
      allow write: if false; // Managed by admin only
    }

    // ========================================
    // FALLBACK - DENY ALL
    // ========================================
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Rule Breakdown

### 🔧 Helper Functions

- **`isAuthenticated()`**: Checks if user is logged in
- **`isOwner(userId)`**: Validates user owns the resource

### 🏗️ **Architectural Foundation: The "Smart" Collaborative Model**

ArtEsfera uses a **consistent architectural pattern** for all public assets. Every public entity (artworks, projects, galleries, AI templates) follows the same security model:

1. **Public Storage Path**: `/artesfera/public/{entityType}/{entityId}/`
2. **Firestore Document**: `/artesfera/public/{entityType}/{entityId}`
3. **Security Validation**: Cross-references Firestore document for ownership
4. **Collaborative Ready**: Can support members, permissions, and sharing

This "smart" model enables:

- ✅ **Collaboration**: Multiple users can work on shared content
- ✅ **Scalability**: New features follow the same pattern
- ✅ **Security**: Ownership validated via Firestore lookups
- ✅ **Flexibility**: Permissions can evolve without rule changes

### 📂 ArtEsfera Platform Storage Structure

## 🔒 **Private User Data** (Siloed Model)

#### 1. **User Private Files**

- **Path**: `/artesfera/users/{userId}/{allPrivateFiles}`
- **Read/Write**: Owner only
- **Security**: Simple UID matching
- **Content**: Profile assets, AI history, temp files, drafts
- **Use Cases**: Personal workspace, private content, processing files

#### 2. **Legacy Profile Photos** (Compatibility)

- **Path**: `/profile-photos/{userId}/filename.jpg`
- **Read**: Public access (current system compatibility)
- **Write**: Owner only
- **Purpose**: Maintains compatibility during migration

## 🌍 **Public Assets** (Smart Collaborative Model)

#### 3. **Artworks** (Fixed Architecture)

- **Path**: `/artesfera/public/artworks/{artworkId}/{files}`
- **Read**: Authenticated users
- **Write**: Artwork owner only (validated via Firestore)
- **Security**: Cross-references `/artesfera/public/artworks/{artworkId}` document
- **Content**: Artwork images, process documentation, variations

#### 4. **Projects** (Collaborative)

- **Path**: `/artesfera/public/projects/{projectId}/{files}`
- **Read**: Authenticated users
- **Write**: Project owner OR members (validated via Firestore)
- **Security**: Cross-references project document with `ownerId` and `members` array
- **Content**: Shared project assets, collaboration materials

#### 5. **Galleries** (Exhibition System)

- **Path**: `/artesfera/public/galleries/{galleryId}/{files}`
- **Read**: Authenticated users
- **Write**: Gallery owner only (validated via Firestore)
- **Security**: Cross-references gallery document with `ownerId`
- **Content**: Exhibition images, gallery layouts, promotional materials

#### 6. **AI Templates** (Fixed Vulnerability)

- **Path**: `/artesfera/public/ai-templates/{templateId}/{files}`
- **Read**: Authenticated users
- **Write**: Template owner only (validated via Firestore)
- **Security**: ✅ **FIXED** - No longer allows any authenticated user to write
- **Content**: Shared AI prompts, style templates, community resources

#### 7. **Community Submissions** (Fixed Vulnerability)

- **Path**: `/artesfera/public/community-events/{eventId}/submissions/{submissionId}/{files}`
- **Read**: Authenticated users
- **Write**: Submission owner only (validated via Firestore)
- **Security**: ✅ **FIXED** - No longer allows any authenticated user to write
- **Content**: Contest entries, community challenges, event submissions

## ⚡ **System & Legacy**

#### 8. **Legacy Projects**

- **Path**: `/projects/{projectId}/{files}`
- **Read**: Authenticated users
- **Write**: Project owner only (validated via legacy Firestore path)
- **Purpose**: Backward compatibility during migration

#### 9. **System Assets**

- **Path**: `/artesfera/system/assets/{files}`
- **Read**: Public access (platform assets)
- **Write**: No access (admin managed)
- **Content**: Platform logos, UI assets, system images

## 🔐 Security Features

### ✅ **Critical Security Fixes Applied**

#### **🚨 Vulnerability #1 FIXED: "Tragedy of the Commons"**

- **Problem**: Previous rules allowed `allow write: if isAuthenticated();` for community resources
- **Risk**: Any authenticated user could delete/overwrite ALL community content
- **Solution**: All public assets now use Firestore ownership validation
- **Result**: ✅ Secure community content with proper ownership controls

#### **🏗️ Vulnerability #2 FIXED: Architectural Consistency**

- **Problem**: Mixed "siloed" vs "collaborative" models for similar content types
- **Risk**: Inconsistent security patterns and limited collaboration features
- **Solution**: All public assets now use the "smart collaborative model"
- **Result**: ✅ Consistent, scalable architecture across the platform

### 🛡️ **Access Control Matrix**

| Resource Type         | Public Read | Auth Read | Owner Write | Member Write | Private | Firestore Validation |
| --------------------- | ----------- | --------- | ----------- | ------------ | ------- | -------------------- |
| Private User Files    | ❌          | ❌        | ✅          | ❌           | ✅      | UID Match            |
| Legacy Profiles       | ✅          | ✅        | ✅          | ❌           | ❌      | UID Match            |
| Public Artworks       | ❌          | ✅        | ✅          | ❌           | ❌      | ✅ Document Lookup   |
| Public Projects       | ❌          | ✅        | ✅          | ✅           | ❌      | ✅ Document Lookup   |
| Public Galleries      | ❌          | ✅        | ✅          | ❌           | ❌      | ✅ Document Lookup   |
| AI Templates          | ❌          | ✅        | ✅          | ❌           | ❌      | ✅ Document Lookup   |
| Community Submissions | ❌          | ✅        | ✅          | ❌           | ❌      | ✅ Document Lookup   |
| Legacy Projects       | ❌          | ✅        | ✅          | ❌           | ❌      | ✅ Document Lookup   |
| System Assets         | ✅          | ✅        | ❌          | ❌           | ❌      | No Access            |

### 🎯 **Security Architecture Principles**

#### **1. Two-Model System**

- **Private/Siloed Model**: For personal user data (`/artesfera/users/{userId}/`)

  - Simple UID-based ownership
  - Complete user isolation
  - No collaboration features needed

- **Public/Collaborative Model**: For all public content (`/artesfera/public/`)
  - Firestore document validation
  - Ownership and membership support
  - Scalable collaboration features

#### **2. Default Deny Posture**

- All rules start with explicit deny
- Permissions granted only with proper validation
- No "catch-all" rules that could create vulnerabilities

#### **3. Ownership Validation**

- **Simple ownership**: Direct UID matching for private content
- **Document ownership**: Firestore lookup for public content
- **Collaborative ownership**: Member arrays for shared projects

#### **4. Cross-Service Consistency**

- Storage rules mirror Firestore document structure
- Consistent paths and validation logic
- Single source of truth for permissions

## 🚀 Implementation Notes

### **Platform Integration Points**

#### **Profile System Integration**

- **Profile Photos**: `/artesfera/users/{userId}/profile/avatar.jpg`
- **Portfolio Covers**: `/artesfera/users/{userId}/profile/cover.jpg`
- **Bio Images**: `/artesfera/users/{userId}/profile/bio-images/`

#### **Portfolio System Integration**

- **Artwork Collections**: `/artesfera/users/{userId}/portfolio/collections/`
- **Process Documentation**: `/artesfera/users/{userId}/artworks/{artworkId}/process/`
- **High-Resolution Files**: `/artesfera/users/{userId}/artworks/{artworkId}/hires/`

#### **Daeva AI Integration**

- **Personal AI Models**: `/artesfera/ai/users/{userId}/models/`
- **Generation History**: `/artesfera/ai/generated/{userId}/{sessionId}/`
- **Training Data**: `/artesfera/ai/users/{userId}/training/`

#### **Project Collaboration**

- **Shared Assets**: `/artesfera/public/projects/{projectId}/shared/`
- **Version Control**: `/artesfera/public/projects/{projectId}/versions/`
- **Member Contributions**: `/artesfera/public/projects/{projectId}/members/{userId}/`

### **Content Type Guidelines**

#### **Supported File Types by Section**

- **Profile**: `.jpg`, `.png`, `.webp` (images)
- **Portfolio**: `.jpg`, `.png`, `.tiff`, `.psd` (artwork files)
- **AI Content**: `.jpg`, `.png`, `.json` (generated content + metadata)
- **Projects**: `.jpg`, `.png`, `.pdf`, `.zip` (mixed content)
- **Gallery**: `.jpg`, `.png`, `.mp4` (exhibition media)

### **Best Practices**

1. **Organize by user**: Use user ID as primary organization unit
2. **Separate public/private**: Clear distinction between shared and personal content
3. **Use descriptive paths**: Include content type and purpose in path structure
4. **Implement file versioning**: Support for content updates and history
5. **Optimize for performance**: Consider CDN and caching strategies

## 📝 Deployment

1. Go to Firebase Console → Storage → Rules
2. Replace existing rules with the configuration above
3. Click "Publish" to deploy
4. Test with different user scenarios to verify access control

## 🔧 Maintenance

- **Regular Audits**: Review rules quarterly for security gaps
- **Permission Updates**: Modify rules when adding new resource types
- **Performance Monitoring**: Monitor Firestore reads from security rule evaluations
- **Documentation**: Keep this document updated with any rule changes
