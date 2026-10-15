// URL Endpoint DummyJSON sesuai ketentuan PDF Soal PTS (X=0 -> Products)
const API_URL = 'https://dummyjson.com/products?limit=12';

// Kurs konversi simulasi (1 USD = Rp 15.000) agar angka harga relevan dalam Rupiah
const USD_TO_IDR = 15000;

/**
 * Memanggil REST API DummyJSON dan mengembalikan array produk yang disesuaikan
 * @returns {Promise<Array>} Array produk yang siap digunakan
 */
export async function fetchProducts() {
  try {
    const response = await fetch(API_URL);

    // Memeriksa status HTTP response (syarat verifikasi penjelasan kode PTS)
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const data = await response.json();

    // Pemetaan data dari DummyJSON ke format aplikasi lokal
    return data.products.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      // Mengubah harga USD menjadi IDR
      price: item.price * USD_TO_IDR,
      description: item.description,
      image: item.thumbnail
    }));
  } catch (error) {
    console.error('Error saat melakukan Fetch Data API:', error);
    throw error;
  }
}