/**
 * API Route: Republish Profile
 * 
 * This endpoint allows users to manually republish their profile to the publicProfiles collection.
 * Useful for recovering from sync failures or when users want to ensure their public profile is up-to-date.
 * 
 * Security: Only authenticated users can republish their own profile.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore, syncUserToPublicProfile } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const adminAuth = getAdminAuth();
    const adminDb = getAdminFirestore();
    
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: "Admin services not available" }, 
        { status: 500 }
      );
    }

    // Verify the Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Get the latest user data from Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User document not found" }, 
        { status: 404 }
      );
    }

    const userData = userDoc.data()!;

    // Perform the synchronization
    const success = await syncUserToPublicProfile({
      uid: userData.uid,
      name: userData.name || "",
      email: userData.email || "",
      photoURL: userData.photoURL,
      bio: userData.bio,
      tags: userData.tags,
      website: userData.socials?.website,
      location: userData.location,
      username: userData.username,
      artisticName: userData.artisticName,
      profileCompleted: userData.profileCompleted,
    });

    if (success) {
      return NextResponse.json({ 
        message: "Profile republished successfully",
        uid: uid,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { error: "Failed to republish profile" }, 
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error("❌ Republish profile API error:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle specific Firebase Auth errors
    if (errorMessage.includes('auth/id-token-expired')) {
      return NextResponse.json(
        { error: "Token expired" }, 
        { status: 401 }
      );
    }
    
    if (errorMessage.includes('auth/invalid-id-token')) {
      return NextResponse.json(
        { error: "Invalid token" }, 
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}