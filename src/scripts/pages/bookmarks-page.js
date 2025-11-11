import { saveLocation, getAllLocations, deleteLocation } from '../db.js';

export default class BookmarksPage {

  async render() {
    return `
      <div class="bookmarks-container">
        <h1>Lokasi Favorit</h1>

        <!-- FORM TAMBAH DATA -->
        <h2>Tambah Lokasi Baru</h2>
        <form id="add-location-form" class="add-form">
          <label for="location-name">Nama Lokasi</label>
          <input 
            type="text" 
            id="location-name" 
            placeholder="Nama Lokasi" 
            required
          />
          <label for="location-lat">Latitude</label>
          <input 
            type="number" 
            id="location-lat" 
            placeholder="Latitude" 
            step="0.0001" 
            required
          />
          <label for="location-lon">Longitude</label>
          <input 
            type="number" 
            id="location-lon" 
            placeholder="Longitude" 
            step="0.0001" 
            required
          />
          <button type="submit">Simpan Lokasi</button>
        </form>

        <!-- LIST DATA -->
        <h2>Daftar Lokasi</h2>
        <div id="locations-list" class="locations-list"></div>
      </div>
    `;
  }

  async afterRender() {
    // Event listener untuk form
    const form = document.querySelector('#add-location-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleAddLocation(e));
    }

    // Load dan tampilkan data
    await this.displayLocations();
  }

  async sendPushNotification(locationName) {
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification('Lokasi Favorit Ditambahkan', {
        body: `Anda telah menambahkan lokasi baru: ${locationName}`
      });
      console.log('[Push] Local notification displayed');
    } catch (error) {
      console.error('[Push] Error showing local notification:', error);
    }
  }


  async handleAddLocation(e) {
    e.preventDefault();

    const locationName = document.getElementById('location-name').value;
    
    const locationData = {
      name: locationName,
      latitude: parseFloat(document.getElementById('location-lat').value),
      longitude: parseFloat(document.getElementById('location-lon').value),
      timestamp: new Date().toISOString()
    };

    try {
      await saveLocation(locationData);
      console.log('[Bookmarks] Location saved');
      
      // Clear form
      e.target.reset();
      
      // Reload list
      await this.displayLocations();
      
      // Send push notification to Dicoding API
      await this.sendPushNotification(locationName);
      
      alert('Lokasi berhasil disimpan!');
    } catch (error) {
      console.error('[Bookmarks] Error saving:', error);
      alert('Gagal menyimpan lokasi');
    }
  }

  async displayLocations() {
    try {
      const locations = await getAllLocations();
      const listContainer = document.querySelector('#locations-list');
      
      if (!listContainer) return;

      listContainer.innerHTML = '';

      if (locations.length === 0) {
        listContainer.innerHTML = '<p>Tidak ada lokasi favorit</p>';
        return;
      }

      locations.forEach(location => {
        const div = document.createElement('div');
        div.className = 'location-item';
        div.innerHTML = `
          <h3>${location.name}</h3>
          <p>Lat: ${location.latitude}</p>
          <p>Lon: ${location.longitude}</p>
          <p>Disimpan: ${new Date(location.timestamp).toLocaleString('id-ID')}</p>
          <button class="delete-btn" data-id="${location.id}">Hapus</button>
        `;
        
        // Event listener untuk delete button
        const deleteBtn = div.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
          if (confirm('Hapus lokasi ini?')) {
            try {
              await deleteLocation(location.id);
              console.log('[Bookmarks] Location deleted');
              await this.displayLocations();
            } catch (error) {
              console.error('[Bookmarks] Error deleting:', error);
              alert('Gagal menghapus lokasi');
            }
          }
        });
        
        listContainer.appendChild(div);
      });
    } catch (error) {
      console.error('[Bookmarks] Error displaying:', error);
    }
  }
}