'use client';
    
import { useState, useEffect } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * It will not fetch data if the reference is disabled via the `enabled` option.
 *
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedDocRef or BAD THINGS WILL HAPPEN.
 * Use useMemoFirebase to memoize it per React guidance.
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {DocumentReference<DocumentData>} docRef - The Firestore DocumentReference.
 * @param {{ enabled?: boolean }} [options] - Options object. `enabled: false` will disable fetching.
 * @returns {UseDocResult<T>} Object with data, isLoading, error.
 */
export function useDoc<T = any>(
  docRef: DocumentReference<DocumentData>,
  options?: { enabled?: boolean }
): UseDocResult<T> {
  const { enabled = true } = options || {};
  type StateDataType = WithId<T> | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    // If not enabled, reset state and do nothing.
    if (!enabled) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // This check is now inside the effect, which is safe.
    if (!docRef) {
        setIsLoading(false);
        setData(null);
        return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          setData(null);
        }
        setError(null);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: docRef.path,
        })

        setError(contextualError);
        setData(null);
        setIsLoading(false);
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
    // The dependency array now includes `enabled` to re-trigger the effect when it changes.
  }, [docRef, enabled]);

  return { data, isLoading, error };
}
