import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';
import App from './pages/app';
import { initIndexedDB } from './db.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[App] Starting...');

  // Initialize IndexedDB
  try {
    await initIndexedDB();
    console.log('[App] IndexedDB initialized');
  } catch (error) {
    console.error('[App] IndexedDB init failed:', error);
  }

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
    console.log('[HashChange] Triggered at:', new Date().toLocaleTimeString(), 'Current hash:', window.location.hash);
    await app.updateUI();
  });

  console.log('[App] Ready');

  // =========================
  // REGISTER SERVICE WORKER
  // =========================
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('sw.js');
        console.log('[SW] Registered:', registration);

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'
          ),
        });

        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(subscription),
        });

        console.log('[Push] Subscribed successfully:', await response.json());
      } catch (err) {
        console.error('[Push] Subscription failed:', err);
      }
    });
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

}); 