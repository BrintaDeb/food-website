import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CurryCraft - Authentic Indian Gourmet Dining',
    short_name: 'CurryCraft',
    description:
      'Experience the culinary heritage of India: Fragrant Kolkata Dum Biryani, Dal Sambar, and artisan tandoori breads.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFDF9',
    theme_color: '#FF5E00',
    orientation: 'portrait-primary',
    scope: '/',
    categories: ['food', 'shopping', 'lifestyle'],
    icons: [
      {
        src: '/images/kolkata-biryani.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any'
      },
      {
        src: '/images/kolkata-biryani.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'maskable'
      }
    ]
  };
}
