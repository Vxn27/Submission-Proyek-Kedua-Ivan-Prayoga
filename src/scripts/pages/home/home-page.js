import L from 'leaflet';
import { getAllStories } from '../../data/api';
import { showFormattedDate } from '../../utils/common';
import { saveStory, deleteStory, getStory } from '../../db.js';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Story Locations</h1>
        <div id="map" style="height: 400px; width: 100%; margin-bottom: 20px;"></div>
        <h2>Stories List</h2>
        <div id="story-list" class="story-list">
          <p>Loading stories...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const map = L.map('map').setView([-2.5489, 118.0149], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markers = {};
    const storyListContainer = document.querySelector('#story-list');
    storyListContainer.innerHTML = '';

    try {
      const stories = await getAllStories();

      for (const story of stories) {
        // Tampilkan marker di peta
        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          marker.bindPopup(`
            <img src="${story.photoUrl}" alt="Story by ${story.name}" style="width:100%;">
            <b>${story.name}</b>
            <p>${story.description}</p>
            <small>${showFormattedDate(story.createdAt)}</small>
          `);
          markers[story.id] = marker;
        }

        // Elemen card
        const storyElement = document.createElement('div');
        storyElement.classList.add('story-item');
        storyElement.dataset.id = story.id;
        storyElement.innerHTML = `
          <img src="${story.photoUrl}" alt="Story by ${story.name}">
          <div class="story-item__content">
            <h3>${story.name}</h3>
            <small class="story-item__date">${showFormattedDate(story.createdAt)}</small>
            <p>${story.description}</p>
            <div class="story-item__buttons">
              <button class="save-btn" id="save-${story.id}">Simpan</button>
              <button class="delete-btn" id="delete-${story.id}">Hapus</button>
            </div>
          </div>
        `;

        // 🔸 Cek apakah sudah tersimpan di IndexedDB
        const existing = await getStory(story.id);
        if (existing) {
          storyElement.querySelector(`#save-${story.id}`).style.display = 'none';
          storyElement.querySelector(`#delete-${story.id}`).style.display = 'inline-block';
        }

        // 🔸 Klik kartu → fokus ke marker
        storyElement.addEventListener('click', (event) => {
          if (event.target.classList.contains('save-btn') || event.target.classList.contains('delete-btn')) return;
          const clickedMarker = markers[story.id];
          if (clickedMarker) {
            map.flyTo(clickedMarker.getLatLng(), 12);
            clickedMarker.openPopup();
          }
        });

        // 🔸 Tombol SIMPAN
        storyElement.querySelector(`#save-${story.id}`).addEventListener('click', async (e) => {
          e.stopPropagation();
          await saveStory(story);
          alert('Cerita disimpan ke IndexedDB!');
          storyElement.querySelector(`#save-${story.id}`).style.display = 'none';
          storyElement.querySelector(`#delete-${story.id}`).style.display = 'inline-block';
        });

        // 🔸 Tombol HAPUS
        storyElement.querySelector(`#delete-${story.id}`).addEventListener('click', async (e) => {
          e.stopPropagation();
          await deleteStory(story.id);
          alert('Cerita dihapus dari IndexedDB!');
          storyElement.querySelector(`#save-${story.id}`).style.display = 'inline-block';
          storyElement.querySelector(`#delete-${story.id}`).style.display = 'none';
        });

        storyListContainer.appendChild(storyElement);
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      storyListContainer.innerHTML = '<p>Failed to load stories. Please login or check your network.</p>';
    }
  }
}
