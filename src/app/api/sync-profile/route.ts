/**
 * API Route: Sync User Profile to Public Profiles
 *
 * This endpoint synchronizes user data from the 'users' collection
 * to the 'publicProfiles' collection whenever a user profile is updated.
 *
 * Security: Only authenticated users can sync their own profile.
 * The function extracts only public-safe fields and never exposes private data.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getAdminAuth,
  syncUserToPublicProfile,
  UserData,
} from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const adminAuth = getAdminAuth();

    if (!adminAuth) {
      return NextResponse.json(
        { error: "Admin auth not available" },
        { status: 500 }
      );
    }

    // Verify the Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const authenticatedUid = decodedToken.uid;

    // Get the user data from request body
    const userData: UserData = await request.json();

    // Security check: Users can only sync their own profile
    if (userData.uid !== authenticatedUid) {
      return NextResponse.json(
        { error: "Unauthorized: Can only sync own profile" },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!userData.uid || !userData.name) {
      return NextResponse.json(
        { error: "Missing required fields: uid and name" },
        { status: 400 }
      );
    }

    // Perform the synchronization
    const success = await syncUserToPublicProfile(userData);

    if (success) {
      return NextResponse.json({
        message: "Profile synchronized successfully",
        uid: userData.uid,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to synchronize profile" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("❌ Sync profile API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Handle specific Firebase Auth errors
    if (errorMessage.includes("auth/id-token-expired")) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    if (errorMessage.includes("auth/invalid-id-token")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
