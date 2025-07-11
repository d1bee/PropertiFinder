export type Property = {
  id: string;
  title: string;
  type: 'Rumah' | 'Apartemen' | 'Tanah';
  location: string;
  price: number;
  beds: number;
  baths: number;
  area: number; // in square meters
  images: string[];
  description: string;
  features: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
};

export const properties: Property[] = [
  {
    id: '1',
    title: 'Vila Modern di Canggu',
    type: 'Rumah',
    location: 'Canggu, Bali',
    price: 5500000000,
    beds: 4,
    baths: 4,
    area: 300,
    images: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    description: 'Vila modern menakjubkan dengan kolam renang pribadi dan pemandangan sawah. Terletak di jantung Canggu, dekat dengan pantai dan kafe trendi.',
    features: ['Kolam Renang Pribadi', 'Pemandangan Sawah', 'Dapur Lengkap', 'Parkir Pribadi'],
    coordinates: { lat: -8.6478, lng: 115.1385 },
  },
  {
    id: '2',
    title: 'Apartemen Mewah di SCBD',
    type: 'Apartemen',
    location: 'SCBD, Jakarta Selatan',
    price: 8000000000,
    beds: 3,
    baths: 2,
    area: 150,
    images: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    description: 'Apartemen mewah di lokasi utama dengan akses mudah ke pusat bisnis dan perbelanjaan. Nikmati fasilitas kelas dunia dan pemandangan kota yang spektakuler.',
    features: ['Pemandangan Kota', 'Gym & Kolam Renang', 'Akses Langsung ke Mall', 'Keamanan 24 Jam'],
    coordinates: { lat: -6.2249, lng: 106.8077 },
  },
  {
    id: '3',
    title: 'Rumah Keluarga Nyaman di BSD',
    type: 'Rumah',
    location: 'BSD City, Tangerang',
    price: 2800000000,
    beds: 3,
    baths: 3,
    area: 180,
    images: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    description: 'Rumah yang ideal untuk keluarga di lingkungan yang aman dan hijau. Dekat dengan sekolah internasional, rumah sakit, dan pusat perbelanjaan.',
    features: ['Taman Belakang', 'Komplek dengan Keamanan', 'Bebas Banjir', 'Dekat Fasilitas Umum'],
    coordinates: { lat: -6.3023, lng: 106.6528 },
  },
  {
    id: '4',
    title: 'Tanah Strategis di Tepi Pantai Lombok',
    type: 'Tanah',
    location: 'Kuta, Lombok',
    price: 15000000000,
    beds: 0,
    baths: 0,
    area: 5000,
    images: [
      'https://placehold.co/600x400.png',
    ],
    description: 'Sebidang tanah luas di tepi pantai yang indah di Kuta, Lombok. Sempurna untuk pembangunan resor atau vila pribadi. Potensi investasi yang luar biasa.',
    features: ['Lokasi Tepi Pantai', 'Akses Jalan Utama', 'Potensi Investasi Tinggi', 'Zona Pariwisata'],
    coordinates: { lat: -8.8911, lng: 116.2758 },
  },
  {
    id: '5',
    title: 'Apartemen Studio di Surabaya Pusat',
    type: 'Apartemen',
    location: 'Pusat Kota, Surabaya',
    price: 750000000,
    beds: 1,
    baths: 1,
    area: 35,
    images: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    description: 'Apartemen studio modern dan ringkas di jantung kota Surabaya. Dilengkapi perabotan lengkap, siap huni. Cocok untuk profesional muda atau investasi sewa.',
    features: ['Perabotan Lengkap', 'Lokasi Pusat', 'Fasilitas Gedung', 'Nilai Sewa Baik'],
    coordinates: { lat: -7.2575, lng: 112.7521 },
  },
  {
    id: '6',
    title: 'Rumah Klasik di Menteng',
    type: 'Rumah',
    location: 'Menteng, Jakarta Pusat',
    price: 25000000000,
    beds: 5,
    baths: 4,
    area: 600,
    images: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    description: 'Rumah klasik yang megah di kawasan elit Menteng. Arsitektur kolonial yang terawat baik dengan halaman yang luas. Properti langka dan bergengsi.',
    features: ['Arsitektur Kolonial', 'Halaman Luas', 'Lokasi Prestisius', 'Garasi 4 Mobil'],
    coordinates: { lat: -6.1953, lng: 106.8349 },
  },
];
