import Swal from 'sweetalert2';

// Fungsi untuk memformat tanggal ISO menjadi lebih mudah dibaca
export function showFormattedDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('id-ID', options); 
}

// Fungsi untuk menampilkan loading indicator
export function showLoading() {
  Swal.fire({
    title: 'Memproses...',
    text: 'Mohon tunggu sebentar.',
    allowOutsideClick: false,
    showConfirmButton: false, 
    willOpen: () => {
      Swal.showLoading();
    },
  });
}

// Fungsi untuk menyembunyikan loading indicator
export function hideLoading() {
  Swal.close();
}