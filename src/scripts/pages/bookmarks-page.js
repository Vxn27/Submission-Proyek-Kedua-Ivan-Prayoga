import { 
  getAllLocations, deleteLocation, 
  getAllStoriesFromDB, deleteStory 
} from '../db.js';
import { showFormattedDate } from '../utils/common.js';

export default class BookmarksPage {
  async render() {
    return `
      <section class="container">
        <h2>Story Tersimpan</h2>
        <div id="saved-stories" class="story-list">
          <p>Memuat story tersimpan...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // === Lokasi ===
    await this.displayLocations();

    // === Story ===
    await this.displayStories();
  }

  // ======================
  // Lokasi
  // ======================
  async displayLocations() {
    try {
      const locations = await getAllLocations();
      const listContainer = document.querySelector('#locations-list');
      listContainer.innerHTML = '';

      if (!locations || locations.length === 0) {
        listContainer.innerHTML = '<p>Tidak ada lokasi favorit</p>';
        return;
      }

      locations.forEach(loc => {
        const div = document.createElement('div');
        div.className = 'location-item';
        div.innerHTML = `
          <h3>${loc.name}</h3>
          <p>Lat: ${loc.latitude}</p>
          <p>Lon: ${loc.longitude}</p>
          <p>Disimpan: ${new Date(loc.timestamp).toLocaleString('id-ID')}</p>
          <button class="delete-btn" data-id="${loc.id}">Hapus</button>
        `;

        div.querySelector('.delete-btn').addEventListener('click', async () => {
          if (confirm('Hapus lokasi ini?')) {
            try {
              await deleteLocation(loc.id);
              await this.displayLocations();
            } catch (error) {
              console.error('[Bookmarks] Error deleting location:', error);
            }
          }
        });

        listContainer.appendChild(div);
      });
    } catch (error) {
      console.error('[Bookmarks] Error displaying locations:', error);
    }
  }

  // ======================
  // Story
  // ======================
  async displayStories() {
    const container = document.querySelector('#saved-stories');
    container.innerHTML = '';

    try {
      const stories = await getAllStoriesFromDB();
      if (!stories || stories.length === 0) {
        container.innerHTML = '<p>Tidak ada story tersimpan.</p>';
        return;
      }

      stories.forEach(story => {
        const storyElement = document.createElement('div');
        storyElement.classList.add('story-item');
        storyElement.dataset.id = story.id;
        storyElement.innerHTML = `
          <h3>${story.name}</h3>
          <img src="${story.photoUrl}" alt="${story.name}" width="150"/>
          <p>${story.description}</p>
          <small>Disimpan: ${showFormattedDate(story.createdAt)}</small>
          <button class="delete-btn">Hapus</button>
        `;

        storyElement.querySelector('.delete-btn').addEventListener('click', async () => {
          if (confirm('Hapus story ini?')) {
            try {
              await deleteStory(story.id);
              storyElement.remove();
              if (!container.querySelector('.story-item')) {
                container.innerHTML = '<p>Tidak ada story tersimpan.</p>';
              }
            } catch (error) {
              console.error('[Bookmarks] Error deleting story:', error);
            }
          }
        });

        container.appendChild(storyElement);
      });
    } catch (error) {
      console.error('[Bookmarks] Error displaying stories:', error);
      container.innerHTML = '<p>Gagal memuat story tersimpan.</p>';
    }
  }

  // ======================
  // Notifikasi Lokal
  // ======================
  async sendPushNotification(message) {
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification('Bookmark Update', {
        body: message
      });
    } catch (error) {
      console.error('[Push] Error showing notification:', error);
    }
  }
}
