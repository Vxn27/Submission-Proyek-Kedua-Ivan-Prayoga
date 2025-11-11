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
        console.log('[IndexedDB] Object store "locations" created');
      }

      // Buat object store untuk data cerita (stories)
      if (!db.objectStoreNames.contains('stories')) {
        const storyStore = db.createObjectStore('stories', { keyPath: 'id' });
        storyStore.createIndex('name', 'name', { unique: false });
        console.log('[IndexedDB] Object store "stories" created');
      }
    };
  });
}

// ==========================
// LOCATION FUNCTIONS
// ==========================
export function saveLocation(locationData) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['locations'], 'readwrite');
    const store = transaction.objectStore('locations');

    const request = store.add(locationData);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function getAllLocations() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['locations'], 'readonly');
    const store = transaction.objectStore('locations');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function deleteLocation(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['locations'], 'readwrite');
    const store = transaction.objectStore('locations');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ==========================
// STORY FUNCTIONS
// ==========================
export function saveStory(storyData) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stories'], 'readwrite');
    const store = transaction.objectStore('stories');

    const request = store.put(storyData); // pakai put agar update jika id sama
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function getStory(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stories'], 'readonly');
    const store = transaction.objectStore('stories');
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function getAllStoriesFromDB() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stories'], 'readonly');
    const store = transaction.objectStore('stories');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function deleteStory(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['stories'], 'readwrite');
    const store = transaction.objectStore('stories');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
