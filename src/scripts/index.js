import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';
import App from './pages/app';
import { initIndexedDB } from './db.js';

function requestNotificationPermission() {
  if ('Notification' in window) {
    console.log('[Notification] Permission status:', Notification.permission);
    
    if (Notification.permission === 'granted') {
      console.log('[Notification] Already permitted');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission()
        .then(permission => {
          console.log('[Notification] User gave permission:', permission);
        });
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[App] Starting...');

  // Initialize IndexedDB
  try {
    await initIndexedDB();
    console.log('[App] IndexedDB initialized');
  } catch (error) {
    console.error('[App] IndexedDB init failed:', error);
  }

  // Request notification permission saat app load
  requestNotificationPermission();

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
    navigationList: document.querySelector('#nav-list'),
  });

  // Render awal
  await app.updateUI();

  // Handle perubahan halaman
  window.addEventListener('hashchange', async () => {
    await app.updateUI();
  });

  console.log('[App] Ready');
});