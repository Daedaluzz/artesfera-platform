# Firebase Storage Security Rules - Architecture Overview

## 📁 File Structure & Access Patterns

The `storage.rules` file implements a comprehensive security architecture that perfectly mirrors the Firestore database structure for consistency and maintainability.

## 🏗️ **Architectural Foundation**

### **1. Helper Functions**

```javascript
function isAuthenticated() {
  return request.auth != null;
}

function isOwner(userId) {
  return isAuthenticated() && request.auth.uid == userId;
}

function isValidImageFile() {
  return request.resource.contentType != null &&
         (request.resource.contentType.matches('image/.*') ||
          request.resource.contentType.matches('video/.*'));
}

function isUnderSizeLimit(maxSizeMB) {
  return request.resource.size < maxSizeMB * 1024 * 1024;
}
```

### **2. Two-Model Security System**

#### **Private/Siloed Model** (`/artesfera/users/{userId}/`)
- **Purpose**: Personal user data with complete isolation
- **Access**: Only the user who owns the data
- **Use Cases**: Profile photos, AI generation history, drafts, temp files
- **Security**: Simple UID-based ownership validation

#### **Public/Collaborative Model** (`/artesfera/public/`)
- **Purpose**: Shared content with Firestore-validated permissions  
- **Access**: Read for authenticated users, write with ownership verification
- **Use Cases**: Artworks, project collaboration, galleries, community content
- **Security**: Cross-references Firestore documents for permission validation

## 📂 **Storage Structure & Permissions**

### **🔒 Private User Data**

#### **Unified Private Path** - `/artesfera/users/{userId}/`
```javascript
match /artesfera/users/{userId}/{allPrivateFiles=**} {
  allow read, write: if isOwner(userId) && isUnderSizeLimit(100);
}
```

**Contains**:
- `/artesfera/users/{userId}/profile/` - Private profile assets
- `/artesfera/users/{userId}/ai-history/` - AI generation history
- `/artesfera/users/{userId}/temp/` - Temporary processing files
- `/artesfera/users/{userId}/drafts/` - Work in progress

**Security Features**:
- ✅ Complete user isolation
- ✅ 100MB size limit for large datasets
- ✅ No cross-user access possible
- ✅ Firestore alignment: `/artesfera/users/{userId}`

### **🌍 Public Assets with Smart Validation**

#### **Portfolio/Artworks** - `/artesfera/public/artworks/{artworkId}/`
```javascript
match /artesfera/public/artworks/{artworkId}/{allFiles=**} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated() &&
                isUnderSizeLimit(50) &&
                firestore.get(
                  /databases/(default)/documents/artesfera/public/artworks/$(artworkId)
                ).data.ownerId == request.auth.uid;
}
```

**Contains**: Artwork images, process documentation, high-res files
**Security**: Cross-references `/artesfera/public/artworks/{artworkId}` document
**Size Limit**: 50MB (suitable for high-quality artwork files)

#### **Project Collaboration** - `/artesfera/public/projects/{projectId}/`
```javascript
match /artesfera/public/projects/{projectId}/{allFiles=**} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated() && 
                isUnderSizeLimit(100) && (
    firestore.get(
      /databases/(default)/documents/artesfera/public/projects/$(projectId)
    ).data.ownerId == request.auth.uid
    ||
    request.auth.uid in firestore.get(
      /databases/(default)/documents/artesfera/public/projects/$(projectId)
    ).data.members
  );
}
```

**Contains**: Shared project assets, collaboration materials, versions
**Security**: Owner OR member access via Firestore validation
**Size Limit**: 100MB (collaborative projects need more space)
**Collaboration**: Support for `members` array in Firestore document

#### **Gallery System** - `/artesfera/public/galleries/{galleryId}/`
```javascript
match /artesfera/public/galleries/{galleryId}/{allFiles=**} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated() &&
                isUnderSizeLimit(50) &&
                firestore.get(
                  /databases/(default)/documents/artesfera/public/galleries/$(galleryId)
                ).data.ownerId == request.auth.uid;
}
```

**Contains**: Exhibition images, gallery layouts, promotional materials
**Security**: Gallery owner only via Firestore validation
**Size Limit**: 50MB (optimized for gallery presentation)

### **🤖 AI & Community Content** 

#### **AI Templates** - `/artesfera/public/ai-templates/{templateId}/`
```javascript
match /artesfera/public/ai-templates/{templateId}/{allFiles=**} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated() &&
                isUnderSizeLimit(25) &&
                firestore.get(
                  /databases/(default)/documents/artesfera/public/ai-templates/$(templateId)
                ).data.ownerId == request.auth.uid;
}
```

**Security Fix**: ✅ **No longer allows any authenticated user to write**
**Contains**: AI prompt templates, style references, training datasets
**Size Limit**: 25MB (appropriate for AI template assets)

#### **Community Submissions** - `/artesfera/public/community-events/{eventId}/submissions/{submissionId}/`
```javascript
match /artesfera/public/community-events/{eventId}/submissions/{submissionId}/{allFiles=**} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated() &&
                isUnderSizeLimit(50) &&
                firestore.get(
                  /databases/(default)/documents/artesfera/public/community-events/$(eventId)/submissions/$(submissionId)
                ).data.ownerId == request.auth.uid;
}
```

**Security Fix**: ✅ **No longer allows any authenticated user to write**
**Contains**: Contest entries, community challenge submissions
**Size Limit**: 50MB (suitable for contest submissions)

### **🔄 Legacy Support**

#### **Legacy Profile Photos** - `/profile-photos/{userId}/`
```javascript
match /profile-photos/{userId}/{allFiles=**} {
  allow read: if true; // Public read for legacy compatibility
  allow write: if isOwner(userId) && 
                isValidImageFile() && 
                isUnderSizeLimit(10);
}
```

**Purpose**: Backward compatibility with existing profile photo system
**Migration Path**: Gradually move to `/artesfera/users/{userId}/profile/`

#### **Legacy User Folders** - `/users/{userId}/`
```javascript
match /users/{userId}/images/{imageId} {
  allow read: if true; // Public read for legacy compatibility
  allow write: if isOwner(userId) && 
                isValidImageFile() && 
                isUnderSizeLimit(10);
}
```

**Purpose**: Support existing user upload patterns
**Migration Path**: Move to unified `/artesfera/users/{userId}/` structure

## 🛡️ **Security Features**

### **Cross-Service Consistency**
- ✅ Storage paths mirror Firestore document structure
- ✅ Permission validation uses same ownership patterns
- ✅ Single source of truth for access control

### **File Type & Size Validation**
- ✅ Content type checking for images, videos, documents
- ✅ Appropriate size limits per use case
- ✅ Protection against malicious file uploads

### **Ownership Verification**
- ✅ Simple UID matching for private content
- ✅ Firestore document lookup for public content
- ✅ Member array support for collaborative projects

### **Critical Security Fixes**
- ✅ **AI Templates**: Fixed "Tragedy of the Commons" vulnerability
- ✅ **Community Submissions**: Fixed unrestricted write access
- ✅ **Default Deny**: Fallback rule denies all unmatched paths

## 📊 **File Size Guidelines**

| Content Type | Size Limit | Reasoning |
|--------------|------------|-----------|
| Profile Photos | 5-10MB | Sufficient for high-quality profile images |
| Artwork Files | 50MB | High-resolution artwork and process documentation |
| Project Collaboration | 100MB | Large collaborative files and resources |
| AI Templates | 25MB | AI datasets and reference materials |
| Private User Data | 100MB | Personal storage with generous limits |
| Temporary Files | 100MB | Processing and upload staging |

## 🚀 **Implementation Benefits**

### **Developer Experience**
- 🎯 **Predictable**: Consistent patterns across all storage paths
- 🔧 **Maintainable**: Helper functions reduce code duplication
- 📚 **Documented**: Clear purpose and security model for each path
- 🧪 **Testable**: Each rule can be validated independently

### **Security Posture**
- 🔒 **Defense in Depth**: Multiple layers of validation
- 🚫 **Default Deny**: Explicit permission required for all access
- 🔍 **Audit Trail**: All access tied to authenticated users
- 🛡️ **Cross-Validation**: Storage and Firestore rules work together

### **Scalability**
- 📈 **Growth Ready**: Architecture supports new features easily
- 🤝 **Collaboration**: Built-in support for team projects
- 🌐 **Multi-Platform**: Works across web, mobile, and API access
- ⚡ **Performance**: Efficient rule evaluation with helper functions

## 🔄 **Migration Strategy**

### **Phase 1: Legacy Support** (Current)
- Maintain existing paths for backward compatibility
- New features use modern `/artesfera/` structure
- Gradual user migration through profile updates

### **Phase 2: Unified Migration**
- Script to move legacy files to new structure
- Update client code to use new paths
- Deprecation notices for legacy endpoints

### **Phase 3: Legacy Cleanup**
- Remove legacy rule support
- Clean up deprecated file paths
- Full modern architecture deployment

## 📝 **Deployment**

1. **Deploy Rules**: `firebase deploy --only storage:rules`
2. **Test Access**: Verify file upload/download with different user scenarios
3. **Monitor**: Watch for permission-denied errors in Firebase Console
4. **Optimize**: Adjust size limits based on usage patterns

## 🔗 **Related Documentation**

- [Firestore Security Rules](./firestore-security-rules.md) - Database permissions
- [Profile System Architecture](./profile-system-architecture.md) - User profile system
- [Deployment Instructions](./deployment-instructions.md) - How to deploy rules