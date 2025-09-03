import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignUpData {
  name: string;
  email: string;
  company: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Sign up with email and password
export const signUpWithEmail = async (userData: SignUpData): Promise<User> => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password,
    );

    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, {
      displayName: userData.name,
    });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      name: userData.name,
      email: userData.email,
      company: userData.company,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "users", user.uid), userProfile);

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (userData: SignInData): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password,
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (
  uid: string,
): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>,
): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(
      userRef,
      {
        ...updates,
        updatedAt: new Date(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
