// src/scripts/index.js

import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
    navigationList: document.querySelector('#nav-list'), // Kirim elemen nav list ke App
  });

  // Panggil updateUI untuk render awal
  await app.updateUI();

  // Panggil updateUI setiap kali hash berubah
  window.addEventListener('hashchange', async () => {
    await app.updateUI();
  });
});