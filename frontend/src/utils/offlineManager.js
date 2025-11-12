// IndexedDB Manager for offline persistence
class OfflineManager {
  constructor() {
    this.dbName = 'EscapeRoomDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('quizProgress')) {
          db.createObjectStore('quizProgress', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('pendingSync')) {
          db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async saveProgress(data) {
    const tx = this.db.transaction(['quizProgress'], 'readwrite');
    const store = tx.objectStore('quizProgress');
    await store.put({ id: 'current', ...data, timestamp: Date.now() });
  }

  async getProgress() {
    const tx = this.db.transaction(['quizProgress'], 'readonly');
    const store = tx.objectStore('quizProgress');
    return new Promise((resolve) => {
      const request = store.get('current');
      request.onsuccess = () => resolve(request.result);
    });
  }

  async addPendingSync(data) {
    const tx = this.db.transaction(['pendingSync'], 'readwrite');
    const store = tx.objectStore('pendingSync');
    await store.add({ ...data, timestamp: Date.now() });
  }

  async getPendingSync() {
    const tx = this.db.transaction(['pendingSync'], 'readonly');
    const store = tx.objectStore('pendingSync');
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });
  }

  async clearPendingSync() {
    const tx = this.db.transaction(['pendingSync'], 'readwrite');
    const store = tx.objectStore('pendingSync');
    await store.clear();
  }
}

export default new OfflineManager();
