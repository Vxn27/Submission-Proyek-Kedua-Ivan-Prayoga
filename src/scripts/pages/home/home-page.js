import L from 'leaflet';
import { getAllStories } from '../../data/api';
import { showFormattedDate } from '../../utils/common'; 

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
    storyListContainer.innerHTML = ''; // Kosongkan placeholder

    try {
      const stories = await getAllStories();
      stories.forEach(story => {
        // Tampilkan 3 data teks di popup: nama, deskripsi, dan tanggal
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
        
        // Tampilkan 3 data teks di kartu: nama, deskripsi, dan tanggal
        const storyElement = document.createElement('div');
        storyElement.classList.add('story-item');
        storyElement.dataset.id = story.id;
        storyElement.innerHTML = `
          <img src="${story.photoUrl}" alt="Story by ${story.name}">
          <div class="story-item__content">
            <h3>${story.name}</h3>
            <small class="story-item__date">${showFormattedDate(story.createdAt)}</small>
            <p>${story.description}</p>
          </div>
        `;

        storyElement.addEventListener('click', () => {
          const clickedMarker = markers[story.id];
          if (clickedMarker) {
            map.flyTo(clickedMarker.getLatLng(), 12);
            clickedMarker.openPopup();
          }
        });

        storyListContainer.appendChild(storyElement);
      });
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      storyListContainer.innerHTML = '<p>Failed to load stories. Please login or check your network.</p>';
    }
  }
}