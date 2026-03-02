export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: 'app';
  image: string;
  status: 'coming-soon';
  accent: 'primary' | 'secondary' | 'amber';
}

export const products: Product[] = [
  {
    id: 'prod-001',
    slug: 'rhythm-forge',
    name: 'Rhythm Forge',
    tagline: 'Beat creation reimagined',
    description: 'A new approach to drum sequencing and sound design.',
    category: 'app',
    image: '/images/products/rhythm-forge.svg',
    status: 'coming-soon',
    accent: 'primary'
  },
  {
    id: 'prod-002',
    slug: 'wave-editor',
    name: 'Wave Editor',
    tagline: 'Shape your sound',
    description: 'Waveform editor and audio processing tool for precise sound design.',
    category: 'app',
    image: '/images/products/wave-editor.svg',
    status: 'coming-soon',
    accent: 'amber'
  }
];
