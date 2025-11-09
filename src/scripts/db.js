let db;

export function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PetaDuniaDB', 1);

    request.onerror = () => {
      console.error('[IndexedDB] Error opening database');
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('[IndexedDB] Database opened successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      // Buat object store untuk data lokasi
      if (!db.objectStoreNames.contains('locations')) {
        const objectStore = db.createObjectStore('locations', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        objectStore.createIndex('name', 'name', { unique: false });
        console.log('[IndexedDB] Object store created');
      }
    };
  });
}

export function saveLocation(locationData) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['locations'], 'readwrite');
    const store = transaction.objectStore('locations');

    const request = store.add(locationData);

    request.onsuccess = () => {
      console.log('[IndexedDB] Data saved with ID:', request.result);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('[IndexedDB] Error saving data');
      reject(request.error);
    };
  });
}

export function getAllLocations() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['locations'], 'readonly');
    const store = transaction.objectStore('locations');
    const request = store.getAll();

    request.onsuccess = () => {
      console.log('[IndexedDB] Data loaded:', request.result);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('[IndexedDB] Error loading data');
      reject(request.error);
    };
  });
}

export function deleteLocation(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['locations'], 'readwrite');
    const store = transaction.objectStore('locations');
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log('[IndexedDB] Data deleted with ID:', id);
      resolve();
    };

    request.onerror = () => {
      console.error('[IndexedDB] Error deleting data');
      reject(request.error);
    };
  });
}