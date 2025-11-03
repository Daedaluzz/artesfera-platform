/**
 * Firestore Projects API
 * 
 * Typed helpers for project CRUD operations, applications, and related functionality.
 * Implements the LinkedIn-style projects system with proper security and data consistency.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  runTransaction,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  increment,
  type FieldValue,
} from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase";

const db = getClientFirestore();

// Collection names
export const COLLECTIONS = {
  PROJECTS: "projects",
  APPLICATIONS: "applications",
  NOTIFICATIONS: "notifications",
  PROJECT_CHATS: "projectChats",
  MESSAGES: "messages",
} as const;

// Types
export interface Project {
  id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  duration: string;
  applicationDeadline: Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: string; // uid
  tags: string[];
  type: "collaboration" | "hire" | "other";
  payment: {
    amount?: number;
    currency?: string;
    mode: "currency" | "a_combinar" | "other";
    raw?: string;
  };
  status: "open" | "closed";
  applicantsCount: number;
}

export interface CreateProjectData {
  title: string;
  description: string;
  city: string;
  state: string;
  duration: string;
  applicationDeadline: Date;
  tags: string[];
  type: "collaboration" | "hire" | "other";
  payment: {
    amount?: number;
    currency?: string;
    mode: "currency" | "a_combinar" | "other";
    raw?: string;
  };
}

export interface UpdateProjectData extends Partial<Omit<CreateProjectData, 'applicationDeadline'>> {
  applicationDeadline?: Date;
  status?: "open" | "closed";
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  applicantUid: string;
  coverLetter?: string;
  portfolioLink?: string;
  createdAt: Timestamp;
  status: "applied" | "accepted" | "rejected" | "withdrawn";
  decisionAt?: Timestamp;
  decisionBy?: string; // uid of who made the decision
}

export interface CreateApplicationData {
  coverLetter?: string;
  portfolioLink?: string;
}

export interface ProjectFilters {
  tags?: string[];
  city?: string;
  state?: string;
  status?: "open" | "closed";
  type?: "collaboration" | "hire" | "other";
  search?: string;
}

export interface ProjectsResponse {
  projects: Project[];
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
  hasMore: boolean;
  totalCount?: number;
}

export interface Notification {
  id: string;
  userUid: string;
  type: "application_accepted" | "application_rejected" | "new_application";
  payload: {
    projectId: string;
    projectTitle: string;
    applicantName?: string;
    ownerName?: string;
  };
  createdAt: Timestamp;
  read: boolean;
}

/**
 * Project CRUD Operations
 */

/**
 * Create a new project
 */
export async function createProject(
  data: CreateProjectData,
  uid: string
): Promise<string> {
  try {
    const projectDoc = {
      title: data.title.trim(),
      description: data.description.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      duration: data.duration.trim(),
      applicationDeadline: Timestamp.fromDate(data.applicationDeadline),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: uid,
      tags: data.tags.map(tag => tag.trim().toLowerCase()),
      type: data.type,
      payment: data.payment,
      status: "open" as const,
      applicantsCount: 0,
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), projectDoc);
    console.log(`✅ Created project: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

/**
 * Update project (owner only)
 */
export async function updateProject(
  projectId: string,
  updates: UpdateProjectData,
  uid: string
): Promise<void> {
  try {
    // First verify ownership
    const project = await getProject(projectId);
    if (!project || project.createdBy !== uid) {
      throw new Error("Unauthorized: You can only update your own projects");
    }

    const updateData: Record<string, unknown> = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    // Handle date conversion
    if (updates.applicationDeadline) {
      updateData.applicationDeadline = Timestamp.fromDate(updates.applicationDeadline);
    }

    // Clean up data
    if (updateData.title && typeof updateData.title === 'string') updateData.title = updateData.title.trim();
    if (updateData.description && typeof updateData.description === 'string') updateData.description = updateData.description.trim();
    if (updateData.city && typeof updateData.city === 'string') updateData.city = updateData.city.trim();
    if (updateData.state && typeof updateData.state === 'string') updateData.state = updateData.state.trim();
    if (updateData.duration && typeof updateData.duration === 'string') updateData.duration = updateData.duration.trim();
    if (updateData.tags && Array.isArray(updateData.tags)) {
      updateData.tags = updateData.tags.map((tag: string) => tag.trim().toLowerCase());
    }

    const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
    await updateDoc(projectRef, updateData as { [x: string]: FieldValue | Partial<unknown> | undefined });
    
    console.log(`✅ Updated project: ${projectId}`);
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

/**
 * Delete project (owner only)
 */
export async function deleteProject(projectId: string, uid: string): Promise<void> {
  try {
    // First verify ownership
    const project = await getProject(projectId);
    if (!project || project.createdBy !== uid) {
      throw new Error("Unauthorized: You can only delete your own projects");
    }

    // Use transaction to delete project and all applications
    await runTransaction(db, async (transaction) => {
      // Delete all applications
      const applicationsQuery = query(
        collection(db, COLLECTIONS.PROJECTS, projectId, COLLECTIONS.APPLICATIONS)
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);
      
      applicationsSnapshot.docs.forEach((appDoc) => {
        transaction.delete(appDoc.ref);
      });

      // Delete the project
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      transaction.delete(projectRef);
    });

    console.log(`✅ Deleted project and all applications: ${projectId}`);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

/**
 * Get single project by ID
 */
export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      const data = projectSnap.data();
      return {
        id: projectSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        applicationDeadline: data.applicationDeadline?.toDate?.() || data.applicationDeadline,
      } as Project;
    }

    return null;
  } catch (error) {
    console.error("Error getting project:", error);
    throw error;
  }
}

/**
 * List public projects with filters and pagination
 */
export async function listPublicProjects({
  filters = {},
  limit: pageLimit = 12,
  cursor,
}: {
  filters?: ProjectFilters;
  limit?: number;
  cursor?: QueryDocumentSnapshot<DocumentData>;
} = {}): Promise<ProjectsResponse> {
  try {
    let q = query(
      collection(db, COLLECTIONS.PROJECTS),
      orderBy("createdAt", "desc")
    );

    // Apply filters
    if (filters.status) {
      q = query(q, where("status", "==", filters.status));
    }
    if (filters.type) {
      q = query(q, where("type", "==", filters.type));
    }
    if (filters.city) {
      q = query(q, where("city", "==", filters.city));
    }
    if (filters.state) {
      q = query(q, where("state", "==", filters.state));
    }
    if (filters.tags && filters.tags.length > 0) {
      // For tags, we'll use array-contains for now (limited to one tag)
      // In production, you might want to use array-contains-any or separate tag queries
      q = query(q, where("tags", "array-contains", filters.tags[0].toLowerCase()));
    }

    // Add pagination
    q = query(q, limit(pageLimit + 1)); // Get one extra to check if there are more
    
    if (cursor) {
      q = query(q, startAfter(cursor));
    }

    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    const docs = querySnapshot.docs;

    // Process results
    const hasMore = docs.length > pageLimit;
    const docsToProcess = hasMore ? docs.slice(0, pageLimit) : docs;

    docsToProcess.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        applicationDeadline: data.applicationDeadline?.toDate?.() || data.applicationDeadline,
      } as Project);
    });

    // Apply client-side search filter if provided
    let filteredProjects = projects;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.tags.some(tag => tag.includes(searchTerm))
      );
    }

    const lastDoc = hasMore ? docsToProcess[docsToProcess.length - 1] : undefined;

    return {
      projects: filteredProjects,
      lastDoc,
      hasMore: hasMore && filteredProjects.length === pageLimit,
    };
  } catch (error) {
    console.error("Error listing projects:", error);
    throw error;
  }
}

/**
 * Get projects created by a specific user
 */
export async function getUserProjects(uid: string): Promise<Project[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROJECTS),
      where("createdBy", "==", uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        applicationDeadline: data.applicationDeadline?.toDate?.() || data.applicationDeadline,
      } as Project);
    });

    return projects;
  } catch (error) {
    console.error("Error getting user projects:", error);
    throw error;
  }
}

/**
 * Application Operations
 */

/**
 * Apply to a project
 */
export async function applyToProject(
  projectId: string,
  applicantUid: string,
  applicationData: CreateApplicationData
): Promise<string> {
  try {
    return await runTransaction(db, async (transaction) => {
      // Check if project exists and is open
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      const projectSnap = await transaction.get(projectRef);

      if (!projectSnap.exists()) {
        throw new Error("Project not found");
      }

      const project = projectSnap.data() as Project;
      
      // Prevent owner from applying to their own project
      if (project.createdBy === applicantUid) {
        throw new Error("You cannot apply to your own project");
      }

      // Check if project is still open
      if (project.status !== "open") {
        throw new Error("This project is no longer accepting applications");
      }

      // Check if deadline has passed
      const now = new Date();
      const deadline = project.applicationDeadline?.toDate?.() || project.applicationDeadline;
      if (deadline instanceof Date && deadline < now) {
        throw new Error("Application deadline has passed");
      }

      // Check for existing application
      const existingAppQuery = query(
        collection(db, COLLECTIONS.PROJECTS, projectId, COLLECTIONS.APPLICATIONS),
        where("applicantUid", "==", applicantUid)
      );
      const existingApps = await getDocs(existingAppQuery);

      if (!existingApps.empty) {
        throw new Error("You have already applied to this project");
      }

      // Create application
      const applicationDoc = {
        projectId,
        applicantUid,
        coverLetter: applicationData.coverLetter?.trim() || "",
        portfolioLink: applicationData.portfolioLink?.trim() || "",
        createdAt: serverTimestamp(),
        status: "applied" as const,
      };

      const applicationRef = await addDoc(
        collection(db, COLLECTIONS.PROJECTS, projectId, COLLECTIONS.APPLICATIONS),
        applicationDoc
      );

      // Increment applicants count
      transaction.update(projectRef, {
        applicantsCount: increment(1),
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ Applied to project: ${projectId}, application: ${applicationRef.id}`);
      return applicationRef.id;
    });
  } catch (error) {
    console.error("Error applying to project:", error);
    throw error;
  }
}

/**
 * Withdraw application
 */
export async function withdrawApplication(
  projectId: string,
  applicationId: string,
  applicantUid: string
): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      const applicationRef = doc(
        db,
        COLLECTIONS.PROJECTS,
        projectId,
        COLLECTIONS.APPLICATIONS,
        applicationId
      );
      const appSnap = await transaction.get(applicationRef);

      if (!appSnap.exists()) {
        throw new Error("Application not found");
      }

      const application = appSnap.data() as ProjectApplication;

      // Verify ownership
      if (application.applicantUid !== applicantUid) {
        throw new Error("Unauthorized: You can only withdraw your own applications");
      }

      // Update application status
      transaction.update(applicationRef, {
        status: "withdrawn",
        decisionAt: serverTimestamp(),
      });

      // Decrement applicants count
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      transaction.update(projectRef, {
        applicantsCount: increment(-1),
        updatedAt: serverTimestamp(),
      });
    });

    console.log(`✅ Withdrew application: ${applicationId}`);
  } catch (error) {
    console.error("Error withdrawing application:", error);
    throw error;
  }
}

/**
 * Get applications for a project (owner only)
 */
export async function listApplications(
  projectId: string,
  uid: string
): Promise<ProjectApplication[]> {
  try {
    // First verify ownership
    const project = await getProject(projectId);
    if (!project || project.createdBy !== uid) {
      throw new Error("Unauthorized: You can only view applications for your own projects");
    }

    const q = query(
      collection(db, COLLECTIONS.PROJECTS, projectId, COLLECTIONS.APPLICATIONS),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const applications: ProjectApplication[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      applications.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        decisionAt: data.decisionAt?.toDate?.() || data.decisionAt,
      } as ProjectApplication);
    });

    return applications;
  } catch (error) {
    console.error("Error listing applications:", error);
    throw error;
  }
}

/**
 * Get single application
 */
export async function getApplication(
  projectId: string,
  applicationId: string
): Promise<ProjectApplication | null> {
  try {
    const applicationRef = doc(
      db,
      COLLECTIONS.PROJECTS,
      projectId,
      COLLECTIONS.APPLICATIONS,
      applicationId
    );
    const appSnap = await getDoc(applicationRef);

    if (appSnap.exists()) {
      const data = appSnap.data();
      return {
        id: appSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        decisionAt: data.decisionAt?.toDate?.() || data.decisionAt,
      } as ProjectApplication;
    }

    return null;
  } catch (error) {
    console.error("Error getting application:", error);
    throw error;
  }
}

/**
 * Accept application (owner only)
 */
export async function acceptApplication(
  projectId: string,
  applicationId: string,
  ownerUid: string
): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      // Verify project ownership
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      const projectSnap = await transaction.get(projectRef);

      if (!projectSnap.exists()) {
        throw new Error("Project not found");
      }

      const project = projectSnap.data() as Project;
      if (project.createdBy !== ownerUid) {
        throw new Error("Unauthorized: You can only manage applications for your own projects");
      }

      // Update application
      const applicationRef = doc(
        db,
        COLLECTIONS.PROJECTS,
        projectId,
        COLLECTIONS.APPLICATIONS,
        applicationId
      );
      
      transaction.update(applicationRef, {
        status: "accepted",
        decisionAt: serverTimestamp(),
        decisionBy: ownerUid,
      });

      // Create notification for applicant
      const appSnap = await transaction.get(applicationRef);
      if (appSnap.exists()) {
        const application = appSnap.data() as ProjectApplication;
        
        const notificationDoc = {
          userUid: application.applicantUid,
          type: "application_accepted",
          payload: {
            projectId,
            projectTitle: project.title,
          },
          createdAt: serverTimestamp(),
          read: false,
        };

        const notificationRef = doc(collection(db, COLLECTIONS.NOTIFICATIONS));
        transaction.set(notificationRef, notificationDoc);
      }
    });

    console.log(`✅ Accepted application: ${applicationId}`);
  } catch (error) {
    console.error("Error accepting application:", error);
    throw error;
  }
}

/**
 * Reject application (owner only)
 */
export async function rejectApplication(
  projectId: string,
  applicationId: string,
  ownerUid: string
): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      // Verify project ownership
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      const projectSnap = await transaction.get(projectRef);

      if (!projectSnap.exists()) {
        throw new Error("Project not found");
      }

      const project = projectSnap.data() as Project;
      if (project.createdBy !== ownerUid) {
        throw new Error("Unauthorized: You can only manage applications for your own projects");
      }

      // Update application
      const applicationRef = doc(
        db,
        COLLECTIONS.PROJECTS,
        projectId,
        COLLECTIONS.APPLICATIONS,
        applicationId
      );
      
      transaction.update(applicationRef, {
        status: "rejected",
        decisionAt: serverTimestamp(),
        decisionBy: ownerUid,
      });

      // Create notification for applicant
      const appSnap = await transaction.get(applicationRef);
      if (appSnap.exists()) {
        const application = appSnap.data() as ProjectApplication;
        
        const notificationDoc = {
          userUid: application.applicantUid,
          type: "application_rejected",
          payload: {
            projectId,
            projectTitle: project.title,
          },
          createdAt: serverTimestamp(),
          read: false,
        };

        const notificationRef = doc(collection(db, COLLECTIONS.NOTIFICATIONS));
        transaction.set(notificationRef, notificationDoc);
      }
    });

    console.log(`✅ Rejected application: ${applicationId}`);
  } catch (error) {
    console.error("Error rejecting application:", error);
    throw error;
  }
}

/**
 * Check if user has applied to a project
 */
export async function hasUserApplied(
  projectId: string,
  applicantUid: string
): Promise<ProjectApplication | null> {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROJECTS, projectId, COLLECTIONS.APPLICATIONS),
      where("applicantUid", "==", applicantUid)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        decisionAt: data.decisionAt?.toDate?.() || data.decisionAt,
      } as ProjectApplication;
    }

    return null;
  } catch (error) {
    console.error("Error checking user application:", error);
    throw error;
  }
}

/**
 * Utility functions
 */

/**
 * Check if application deadline has passed
 */
export function isApplicationDeadlinePassed(deadline: Date | Timestamp): boolean {
  const now = new Date();
  const deadlineDate = deadline instanceof Date ? deadline : deadline.toDate();
  return deadlineDate < now;
}

/**
 * Format payment display
 */
export function formatPayment(payment: Project['payment']): string {
  if (payment.mode === "a_combinar") {
    return "A combinar";
  }
  
  if (payment.mode === "currency" && payment.amount && payment.currency) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: payment.currency,
    }).format(payment.amount);
  }

  return payment.raw || "A combinar";
}

/**
 * Generate project slug for SEO-friendly URLs
 */
export function generateProjectSlug(title: string, id: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove multiple hyphens
    .trim();

  return `${id}-${slug}`;
}

/**
 * Parse project slug to extract ID
 */
export function parseProjectSlug(slug: string): { id: string; title?: string } {
  const parts = slug.split("-");
  const id = parts[0];
  const title = parts.slice(1).join("-");
  
  return { id, title: title || undefined };
}

const firestoreProjects = {
  createProject,
  updateProject,
  deleteProject,
  getProject,
  listPublicProjects,
  getUserProjects,
  applyToProject,
  withdrawApplication,
  listApplications,
  getApplication,
  acceptApplication,
  rejectApplication,
  hasUserApplied,
  isApplicationDeadlinePassed,
  formatPayment,
  generateProjectSlug,
  parseProjectSlug,
};

export default firestoreProjects;