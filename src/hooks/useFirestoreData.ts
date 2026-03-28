import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, QueryConstraint } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';

export function useFirestoreData<T>(collectionName: string, additionalConstraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, collectionName),
      where('user_id', '==', user.uid),
      ...additionalConstraints
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(results);
        setLoading(false);
      },
      (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, collectionName, JSON.stringify(additionalConstraints)]);

  return { data, loading };
}
