/**
 * Menghitung dan menampilkan kalkulasi statistik otomatis dari data produk
 * @param {Array} data - Array data produk dari API
 */
export function calculateStatistics(data) {
  if (!data || data.length === 0) return;

  // 1. Mencari Produk Termahal dengan reduce()
  const termahal = data.reduce((prev, current) => {
    return (prev.price > current.price) ? prev : current;
  });

  // 2. Menghitung Rata-Rata Harga dengan reduce()
  const totalHarga = data.reduce((acc, curr) => acc + curr.price, 0);
  const avgHarga = Math.round(totalHarga / data.length);

  // 3. Menghitung Jumlah Kategori Unik dengan Set & map()
  const categories = new Set(data.map(item => item.category));

  // Tampilkan hasil pengolahan data ke DOM
  const elTermahal = document.getElementById('statTermahal');
  const elRataRata = document.getElementById('statRataRata');
  const elKategori = document.getElementById('statKategori');

  if (elTermahal) elTermahal.textContent = `Rp ${termahal.price.toLocaleString('id-ID')}`;
  if (elRataRata) elRataRata.textContent = `Rp ${avgHarga.toLocaleString('id-ID')}`;
  if (elKategori) elKategori.textContent = `${categories.size} Kategori`;
}