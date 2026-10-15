// URL Endpoint DummyJSON sesuai ketentuan PTS (X=0 -> Products)
const API_URL = 'https://dummyjson.com/products';

// Kurs konversi simulasi (1 USD = Rp 15.000)
const USD_TO_IDR = 15000;

/**
 * Memanggil REST API DummyJSON
 * @returns {Promise<Array>} Array produk hasil fetch
 */
export async function fetchProducts() {
  try {
    const response = await fetch(API_URL);

    // Memeriksa status HTTP response
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const data = await response.json();

    // Pemetaan data dari DummyJSON ke format aplikasi
    return data.products.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price * USD_TO_IDR,
      description: item.description,
      image: item.thumbnail
    }));
  } catch (error) {
    console.error('Error saat Fetch Data API:', error);
    throw error;
  }
}