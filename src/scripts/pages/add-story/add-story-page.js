import L from 'leaflet';
import { addNewStory } from '../../data/api';
import { showLoading, hideLoading } from '../../utils/common'; 

export default class AddStoryPage {
  async render() {
    return `
      <section class="container">
        <h1>Add New Story</h1>
        <form id="add-story-form" class="add-story-form">
          <div class="form-group">
            <label for="photo">Photo</label>
            <input type="file" id="photo" name="photo" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" rows="4" required></textarea>
          </div>
          <p>Click on the map to select a location</p>
          <div id="map-picker" style="height: 300px; width: 100%; margin-bottom: 15px;"></div>
          <input type="hidden" id="latitude" name="lat">
          <input type="hidden" id="longitude" name="lon">
          <button type="submit" class="button-submit">Submit Story</button>
        </form>
        <div id="error-message" class="error-message"></div>
      </section>
    `;
  }

  async afterRender() {
    const mapPicker = L.map('map-picker').setView([-6.2088, 106.8456], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapPicker);

    let marker;
    mapPicker.on('click', (e) => {
      const { lat, lng } = e.latlng;
      document.querySelector('#latitude').value = lat;
      document.querySelector('#longitude').value = lng;

      if (marker) {
        mapPicker.removeLayer(marker);
      }
      marker = L.marker([lat, lng]).addTo(mapPicker);
      marker.bindPopup('Story Location').openPopup();
    });

    const form = document.querySelector('#add-story-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const errorMessageContainer = document.querySelector('#error-message');
      errorMessageContainer.textContent = '';

      showLoading();
      try {
        await addNewStory(formData);
        hideLoading();

        // === Push Notification ===
        const storyName = formData.get('description')?.slice(0, 30) || 'Story baru';
        await this.sendPushNotification(`Story berhasil ditambahkan: ${storyName}`);

        alert('Story added successfully!');
        window.location.hash = '#/';
      } catch (error) {
        hideLoading();
        errorMessageContainer.textContent = `Error: ${error.message}`;
      }
    });
  }

  // ======================
  // Notifikasi Web Push
  // ======================
  async sendPushNotification(message) {
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification('Story Update', {
        body: message,
      });
    } catch (error) {
      console.error('[Push] Error showing notification:', error);
    }
  }
}
