import React, { createContext, useContext, useState } from 'react';
import { 
  realtimeDB,
  firestore
} from '../firebase';
import { 
  ref, 
  push, 
  onValue, 
  update, 
  remove, 
  get,
  set
} from 'firebase/database';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';

// Create database context
const DatabaseContext = createContext();

// Hook to use database context
export const useDatabase = () => {
  return useContext(DatabaseContext);
};

// Database provider component
export const DatabaseProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ---- Realtime Database Operations ----

  /**
   * Add a new record to a Realtime DB collection
   * @param {string} path Collection path
   * @param {object} data Record data
   * @returns {Promise<string>} Record ID
   */
  const addRecord = async (path, data) => {
    setLoading(true);
    setError('');
    try {
      const recordRef = ref(realtimeDB, path);
      const result = await push(recordRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setLoading(false);
      return result.key;
    } catch (err) {
      setError(err.message || 'Failed to add record');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Update a record in Realtime DB
   * @param {string} path Record path
   * @param {object} data Updated data
   */
  const updateRecord = async (path, data) => {
    setLoading(true);
    setError('');
    try {
      const recordRef = ref(realtimeDB, path);
      await update(recordRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to update record');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Delete a record from Realtime DB
   * @param {string} path Record path
   */
  const deleteRecord = async (path) => {
    setLoading(true);
    setError('');
    try {
      const recordRef = ref(realtimeDB, path);
      await remove(recordRef);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to delete record');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Get a single record from Realtime DB
   * @param {string} path Record path
   * @returns {Promise<object>} Record data
   */
  const getRecord = async (path) => {
    setLoading(true);
    setError('');
    try {
      const recordRef = ref(realtimeDB, path);
      const snapshot = await get(recordRef);
      setLoading(false);
      
      if (snapshot.exists()) {
        return { id: snapshot.key, ...snapshot.val() };
      }
      return null;
    } catch (err) {
      setError(err.message || 'Failed to get record');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Subscribe to a collection in Realtime DB
   * @param {string} path Collection path
   * @param {Function} callback Function to call with updated data
   * @returns {Function} Unsubscribe function
   */
  const subscribeToCollection = (path, callback) => {
    const collectionRef = ref(realtimeDB, path);
    
    const unsubscribe = onValue(collectionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        callback(items);
      } else {
        callback([]);
      }
    }, (err) => {
      setError(err.message || 'Failed to subscribe to collection');
    });
    
    return unsubscribe;
  };

  // ---- Firestore Operations ----

  /**
   * Add a document to Firestore
   * @param {string} collection Collection name
   * @param {object} data Document data
   * @returns {Promise<string>} Document ID
   */
  const addDocument = async (collectionName, data) => {
    setLoading(true);
    setError('');
    try {
      const collectionRef = collection(firestore, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setLoading(false);
      return docRef.id;
    } catch (err) {
      setError(err.message || 'Failed to add document');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Update a document in Firestore
   * @param {string} collection Collection name
   * @param {string} id Document ID
   * @param {object} data Updated data
   */
  const updateDocument = async (collectionName, id, data) => {
    setLoading(true);
    setError('');
    try {
      const docRef = doc(firestore, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to update document');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Get a document from Firestore
   * @param {string} collection Collection name
   * @param {string} id Document ID
   * @returns {Promise<object>} Document data
   */
  const getDocument = async (collectionName, id) => {
    setLoading(true);
    setError('');
    try {
      const docRef = doc(firestore, collectionName, id);
      const docSnap = await getDoc(docRef);
      setLoading(false);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (err) {
      setError(err.message || 'Failed to get document');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Query documents from Firestore
   * @param {string} collectionName Collection name
   * @param {string} field Field to query
   * @param {string} operator Comparison operator
   * @param {any} value Value to compare
   * @returns {Promise<Array>} Matching documents
   */
  const queryDocuments = async (collectionName, field, operator, value) => {
    setLoading(true);
    setError('');
    try {
      const collectionRef = collection(firestore, collectionName);
      const q = query(collectionRef, where(field, operator, value));
      const querySnapshot = await getDocs(q);
      
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      setLoading(false);
      return documents;
    } catch (err) {
      setError(err.message || 'Failed to query documents');
      setLoading(false);
      throw err;
    }
  };

  // Context value
  const value = {
    loading,
    error,
    // Realtime Database methods
    addRecord,
    updateRecord,
    deleteRecord,
    getRecord,
    subscribeToCollection,
    // Firestore methods
    addDocument,
    updateDocument,
    getDocument,
    queryDocuments
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};