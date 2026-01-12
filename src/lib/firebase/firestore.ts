import { db } from './config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp, doc, getDoc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { LearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';

export const saveRoadmapToFirestore = async (userId: string, roadmap: LearningRoadmapOutput & { docId?: string }): Promise<string> => {
  if (!userId) throw new Error("User is not authenticated.");
  
  const { docId, ...roadmapData } = roadmap;

  if (docId) {
      // Update existing document
      const roadmapRef = doc(db, 'roadmaps', docId);
      await setDoc(roadmapRef, {
        userId,
        ...roadmapData,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      return docId;
  } else {
      // Create new document
      const docRef = await addDoc(collection(db, 'roadmaps'), {
        userId,
        ...roadmapData,
        public: false,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
  }
};

export type SavedRoadmap = LearningRoadmapOutput & { docId: string; createdAt: Timestamp, public?: boolean };

export const getSavedRoadmapsFromFirestore = async (userId: string): Promise<SavedRoadmap[]> => {
  if (!userId) throw new Error("User is not authenticated.");
  
  const q = query(collection(db, 'roadmaps'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  const roadmaps: SavedRoadmap[] = [];
  querySnapshot.forEach((doc) => {
    roadmaps.push({ docId: doc.id, ...doc.data() } as SavedRoadmap);
  });

  // Sort by createdAt timestamp in descending order (newest first)
  roadmaps.sort((a, b) => {
    const aTime = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;
    const bTime = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;
    return bTime - aTime;
  });
  
  return roadmaps;
};

export const getRoadmapFromFirestore = async (docId: string): Promise<SavedRoadmap | null> => {
    const docRef = doc(db, 'roadmaps', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { docId: docSnap.id, ...docSnap.data() } as SavedRoadmap;
    } else {
        return null;
    }
}

export const deleteRoadmapFromFirestore = async (docId: string): Promise<void> => {
    const docRef = doc(db, 'roadmaps', docId);
    await deleteDoc(docRef);
}

export const setRoadmapPublicStatus = async (docId: string, isPublic: boolean): Promise<void> => {
    const docRef = doc(db, 'roadmaps', docId);
    await updateDoc(docRef, {
        public: isPublic,
    });
};
