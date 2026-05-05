import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Products.js';

dotenv.config();

const products = [
  {
    name: 'Aero-Glass Mechanical Keyboard',
    description: 'A transparent polycarbonate housing with gasked-mounted switches.',
    price: 210.00,
    category: 'Hardware',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Lumina', model: 'AG-75', weight: '1.1kg', dimensions: '320x130mm', warranty: '2 Years' },
    reviews: [
      { user: 'Joseph', rating: 5, comment: 'The lighting diffusion is insane.' },
      { user: 'Arjun', rating: 4, comment: 'Sounds a bit hollow but looks amazing.' }
    ]
  },
  {
    name: 'Horizon Ultra-Wide Monitor',
    description: '49-inch QD-OLED panel with a 1800R curve for maximum immersion.',
    price: 1299.00,
    category: 'Hardware',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Zenith', model: 'H-49', weight: '12kg', dimensions: '1100x450mm', warranty: '3 Years' },
    reviews: [{ user: 'Sarah', rating: 5, comment: 'Productivity tripled.' }]
  },
  {
    name: 'Void Noise-Cancelling Headphones',
    description: 'Studio-grade audio with active hybrid noise cancellation.',
    price: 349.00,
    category: 'Audio',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Sonic', model: 'V-1', weight: '250g', dimensions: 'N/A', warranty: '1 Year' },
    reviews: []
  },
  {
    name: 'Neural Link Smart Mouse',
    description: 'Zero-latency sensor with custom magnesium alloy exoskeleton.',
    price: 145.00,
    category: 'Hardware',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Swift', model: 'M-Pro', weight: '49g', dimensions: '120x60mm', warranty: '2 Years' },
    reviews: [{ user: 'TechGuru', rating: 5, comment: 'Lightest mouse I have ever used.' }]
  },
  {
    name: 'Atmospheric Desk Mat',
    description: 'Liquid-resistant micro-weave cloth with a minimal gradient design.',
    price: 45.00,
    category: 'Lifestyle',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1616627561950-9f746e3301e1?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Lumina', model: 'Mat-01', weight: '400g', dimensions: '900x400mm', warranty: '6 Months' },
    reviews: [{ user: 'Minimalist', rating: 5, comment: 'Perfect for my setup.' }]
  },
  {
    name: 'Prism LED Strip',
    description: 'Individually addressable LEDs with AI-sync technology.',
    price: 65.00,
    category: 'Lifestyle',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Glow', model: 'P-100', weight: '150g', dimensions: '5m', warranty: '1 Year' },
    reviews: []
  },
  {
    name: 'Titan CPU Cooler',
    description: 'Dual-tower heatsink with whisper-quiet 140mm fans.',
    price: 89.00,
    category: 'Hardware',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Frost', model: 'T-800', weight: '1.4kg', dimensions: '160x150mm', warranty: '5 Years' },
    reviews: [{ user: 'Overclocker', rating: 4, comment: 'Huge, but keeps it cool.' }]
  },
  {
    name: 'Vector Graphics Tablet',
    description: '8192 levels of pressure sensitivity with a paper-feel surface.',
    price: 299.00,
    category: 'Creative',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Draw', model: 'V-12', weight: '600g', dimensions: '300x200mm', warranty: '2 Years' },
    reviews: []
  },
  {
    name: 'Onyx External SSD',
    description: '2TB NVMe performance in a rugged, pocket-sized enclosure.',
    price: 180.00,
    category: 'Storage',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1597333583271-8664ec9f0101?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Swift', model: 'S-2TB', weight: '80g', dimensions: '100x30mm', warranty: '3 Years' },
    reviews: [{ user: 'Admin', rating: 5, comment: 'Insane transfer speeds.' }]
  },
  {
    name: 'Pulse Smart Watch',
    description: 'Minimalist health tracker with a 14-day battery life.',
    price: 199.00,
    category: 'Lifestyle',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1508685096489-77a46807c0f8?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Glow', model: 'W-01', weight: '45g', dimensions: '42mm', warranty: '1 Year' },
    reviews: [{ user: 'Runner', rating: 4, comment: 'Simple and effective.' }]
  },
  {
    name: 'Stealth-Touch Trackpad',
    description: 'Haptic feedback glass surface with multi-finger gesture support.',
    price: 129.00,
    category: 'Hardware',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d715b909?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Swift', model: 'T-X', weight: '300g', dimensions: '160x115mm', warranty: '1 Year' },
    reviews: [{ user: 'Designer', rating: 5, comment: 'Silky smooth movement.' }]
  },
  {
    name: 'Apex Pro Desk Lamp',
    description: 'CRI 95+ lighting with auto-brightness and color temperature sensors.',
    price: 110.00,
    category: 'Lifestyle',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Lumina', model: 'L-Pro', weight: '1.5kg', dimensions: '400mm height', warranty: '2 Years' },
    reviews: []
  },
  {
    name: 'Cyber-Case Mid Tower',
    description: 'Tool-less tempered glass chassis with optimized airflow paths.',
    price: 185.00,
    category: 'Hardware',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Frost', model: 'C-7', weight: '8.5kg', dimensions: '450x210x480mm', warranty: '3 Years' },
    reviews: [{ user: 'BuilderX', rating: 4, comment: 'Cable management is a dream.' }]
  },

  // --- MOBILE TECH ---
  {
    name: 'Slate Tablet Pro',
    description: '12.9-inch Liquid Retina display with ProMotion technology.',
    price: 999.00,
    category: 'Mobile',
    stock: 14,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Zenith', model: 'S-12', weight: '680g', dimensions: '280x214mm', warranty: '1 Year' },
    reviews: [{ user: 'Artist', rating: 5, comment: 'The stylus latency is non-existent.' }]
  },
  {
    name: 'Carbon Fiber Phone Case',
    description: 'Military-grade protection in a 0.5mm ultra-thin profile.',
    price: 55.00,
    category: 'Mobile',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Swift', model: 'CF-15', weight: '12g', dimensions: 'N/A', warranty: 'Lifetime' },
    reviews: []
  },

  // --- AUDIO ---
  {
    name: 'Echo Pods Mini',
    description: 'Spatial audio in a compact, pocketable charging case.',
    price: 99.00,
    category: 'Audio',
    stock: 65,
    image: 'https://images.unsplash.com/photo-1572569511254-18f98d30327e?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Sonic', model: 'E-Mini', weight: '40g', dimensions: 'N/A', warranty: '1 Year' },
    reviews: [{ user: 'Runner', rating: 4, comment: 'They never fall out.' }]
  },
  {
    name: 'Beam Soundbar',
    description: 'Dolby Atmos support with built-in voice assistant.',
    price: 399.00,
    category: 'Audio',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Sonic', model: 'B-1', weight: '2.8kg', dimensions: '650mm length', warranty: '2 Years' },
    reviews: []
  },

  // --- SMART HOME ---
  {
    name: 'Aura Smart Mirror',
    description: 'Backlit LED mirror with weather, time, and health data overlay.',
    price: 450.00,
    category: 'Smart Home',
    stock: 4,
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Glow', model: 'M-Reflect', weight: '5kg', dimensions: '600x800mm', warranty: '2 Years' },
    reviews: [{ user: 'Joseph', rating: 5, comment: 'Feels like the future.' }]
  },
  {
    name: 'Nexus Home Hub',
    description: 'Centralized touchscreen controller for all IoT devices.',
    price: 199.00,
    category: 'Smart Home',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Glow', model: 'Hub-01', weight: '450g', dimensions: '7-inch screen', warranty: '1 Year' },
    reviews: []
  },

  // --- STORAGE & COMPONENTS ---
  {
    name: 'Nitro RAM Kit',
    description: '32GB DDR5 6000MHz memory with customized heat spreaders.',
    price: 160.00,
    category: 'Hardware',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Frost', model: 'N-32', weight: '100g', dimensions: 'N/A', warranty: 'Lifetime' },
    reviews: [{ user: 'Gamer', rating: 5, comment: 'Rock solid stability.' }]
  },
  {
    name: 'Cloud-Drive 4TB',
    description: 'External NAS-optimized hard drive with auto-backup software.',
    price: 140.00,
    category: 'Storage',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1531062991700-403477af2b51?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Swift', model: 'C-4TB', weight: '600g', dimensions: '3.5 inch', warranty: '3 Years' },
    reviews: []
  },

  // --- LIFESTYLE ---
  {
    name: 'Zenith Desk Chair',
    description: 'Ergonomic mesh chair with 4D armrests and lumbar support.',
    price: 599.00,
    category: 'Lifestyle',
    stock: 7,
    image: 'https://images.unsplash.com/photo-1505843490701-5be5d0b19d58?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Zenith', model: 'Z-Chair', weight: '18kg', dimensions: 'Adjustable', warranty: '5 Years' },
    reviews: [{ user: 'DevLife', rating: 5, comment: 'Goodbye back pain.' }]
  },
  {
    name: 'Orbit Wireless Charger',
    description: 'Magnetic 3-in-1 station for phone, watch, and earbuds.',
    price: 85.00,
    category: 'Lifestyle',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Lumina', model: 'O-3', weight: '200g', dimensions: '120mm circle', warranty: '1 Year' },
    reviews: []
  },
  {
    name: 'Vortex Desktop Fan',
    description: 'Bladeless cooling technology with ultra-quiet operation.',
    price: 75.00,
    category: 'Lifestyle',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Frost', model: 'V-Fan', weight: '800g', dimensions: '250mm height', warranty: '1 Year' },
    reviews: [{ user: 'CozyDesk', rating: 4, comment: 'Moves a lot of air for its size.' }]
  },
  {
    name: 'Prism Smart Glasses',
    description: 'Heads-up display for notifications and navigation.',
    price: 499.00,
    category: 'Mobile',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Zenith', model: 'P-Glass', weight: '45g', dimensions: 'Standard', warranty: '1 Year' },
    reviews: []
  },
  {
    name: 'Titan Power Bank',
    description: '25000mAh capacity with 100W PD output for laptops.',
    price: 120.00,
    category: 'Mobile',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1609091839697-eb27999b9403?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Swift', model: 'T-25k', weight: '500g', dimensions: '180x80mm', warranty: '18 Months' },
    reviews: [{ user: 'Traveler', rating: 5, comment: 'Charges my MacBook Pro twice.' }]
  },
  {
    name: 'Studio Boom Arm',
    description: 'Internal spring design with hidden cable management.',
    price: 95.00,
    category: 'Audio',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Sonic', model: 'S-Arm', weight: '1.2kg', dimensions: '1000mm reach', warranty: '2 Years' },
    reviews: []
  },
  {
    name: 'Neon LED Clock',
    description: 'Large digital display with temperature and humidity sensors.',
    price: 35.00,
    category: 'Lifestyle',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1585115664576-19bc377e647e?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Glow', model: 'C-Digital', weight: '300g', dimensions: '250x100mm', warranty: '6 Months' },
    reviews: []
  },
  {
    name: 'Hyper-Light Drone',
    description: '4K camera with 3-axis gimbal in a sub-250g weight class.',
    price: 549.00,
    category: 'Hardware',
    stock: 6,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Zenith', model: 'D-Mini', weight: '249g', dimensions: '140x80mm folded', warranty: '1 Year' },
    reviews: [{ user: 'Vlogger', rating: 5, comment: 'Best drone for traveling.' }]
  },
  {
    name: 'Bio-Metric Door Lock',
    description: 'Fingerprint and keypad access with remote app unlocking.',
    price: 220.00,
    category: 'Smart Home',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Glow', model: 'L-Secure', weight: '1.2kg', dimensions: 'Standard deadbolt', warranty: '2 Years' },
    reviews: []
  },
  {
    name: 'Pro-Stream Deck',
    description: '15 customizable LCD keys for controlling apps and tools.',
    price: 149.00,
    category: 'Creative',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1626771339179-713c699d0290?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Swift', model: 'SD-15', weight: '145g', dimensions: '118 x 84 mm', warranty: '2 Years' },
    reviews: [{ user: 'Joseph', rating: 5, comment: 'Essential for my workflow.' }]
  },
  {
    name: '4K Mirrorless Camera',
    description: 'Compact body with a 24.2MP sensor and uncropped 4K video.',
    price: 799.00,
    category: 'Creative',
    stock: 4,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Zenith', model: 'Cam-V1', weight: '450g', dimensions: '115 x 68 mm', warranty: '1 Year' },
    reviews: []
  },
  {
    name: 'Portable LED Panel',
    description: 'CRI 96+ lighting with adjustable hue and saturation.',
    price: 85.00,
    category: 'Creative',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1616423685376-e918579b7696?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Lumina', model: 'RGB-Mini', weight: '120g', dimensions: 'Pocket size', warranty: '1 Year' },
    reviews: [{ user: 'Vlogger', rating: 4, comment: 'Perfect for on-the-go lighting.' }]
  },

  // --- NETWORKING ---
  {
    name: 'Mesh Wi-Fi 7 Router',
    description: 'Tri-band system covering up to 6000 sq. ft with 10Gbps speeds.',
    price: 599.00,
    category: 'Hardware',
    stock: 9,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Glow', model: 'Net-7', weight: '1.2kg', dimensions: 'Tower design', warranty: '3 Years' },
    reviews: [{ user: 'PowerUser', rating: 5, comment: 'Finally, no dead zones.' }]
  },
  {
    name: 'Thunderbolt 4 Dock',
    description: '12-in-1 workstation expansion with dual 4K support.',
    price: 280.00,
    category: 'Hardware',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Swift', model: 'Dock-T4', weight: '400g', dimensions: 'Horizontal', warranty: '2 Years' },
    reviews: []
  },

  // --- COMPONENTS ---
  {
    name: 'Titanium PSU 1000W',
    description: 'Fully modular 80 Plus Titanium efficiency power supply.',
    price: 240.00,
    category: 'Hardware',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Frost', model: 'P-1000', weight: '2.5kg', dimensions: 'ATX', warranty: '10 Years' },
    reviews: []
  },
  {
    name: 'Gen5 NVMe SSD',
    description: '12,000MB/s sequential read speeds with built-in heatsink.',
    price: 210.00,
    category: 'Storage',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1597333583271-8664ec9f0101?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Swift', model: 'G5-1TB', weight: '50g', dimensions: 'M.2 2280', warranty: '5 Years' },
    reviews: [{ user: 'Gamer', rating: 5, comment: 'Loading screens are gone.' }]
  },

  // --- LIFESTYLE & ERGONOMICS ---
  {
    name: 'Electric Standing Desk',
    description: 'Dual-motor frame with 4 programmable memory presets.',
    price: 499.00,
    category: 'Lifestyle',
    stock: 6,
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Zenith', model: 'E-Desk', weight: '35kg', dimensions: '140x70 cm', warranty: '5 Years' },
    reviews: []
  },
  {
    name: 'Monitor Light Bar',
    description: 'Asymmetric optical design that eliminates screen glare.',
    price: 95.00,
    category: 'Lifestyle',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1616627561950-9f746e3301e1?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Lumina', model: 'Bar-Pro', weight: '500g', dimensions: '450mm', warranty: '1 Year' },
    reviews: [{ user: 'NightOwl', rating: 5, comment: 'Best purchase for eye strain.' }]
  },
  {
    name: 'Smart Essential Oil Diffuser',
    description: 'App-controlled mist intensity and integrated ambient lighting.',
    price: 65.00,
    category: 'Smart Home',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Glow', model: 'Aura-01', weight: '300g', dimensions: '150mm round', warranty: '1 Year' },
    reviews: []
  },

  // --- MOBILE & WEARABLES ---
  {
    name: 'Titanium Smart Ring',
    description: 'Discrete health tracking for sleep, activity, and temperature.',
    price: 299.00,
    category: 'Mobile',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1599408162162-6b0af444004b?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Glow', model: 'Ring-V1', weight: '4g', dimensions: 'Sizes 6-13', warranty: '1 Year' },
    reviews: [{ user: 'Joseph', rating: 5, comment: 'Easier than wearing a watch.' }]
  },
  {
    name: 'Folding Phone Pro',
    description: 'Inner 7.6-inch dynamic AMOLED display with stylus support.',
    price: 1799.00,
    category: 'Mobile',
    stock: 3,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Zenith', model: 'Fold-5', weight: '240g', dimensions: '7.6-inch open', warranty: '1 Year' },
    reviews: []
  },

  // --- PERIPHERALS ---
  {
    name: 'Magnesium Alloy Mouse',
    description: 'Perforated shell design for ultra-light competitive gaming.',
    price: 189.00,
    category: 'Hardware',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Swift', model: 'Mag-X', weight: '38g', dimensions: '115x60 mm', warranty: '2 Years' },
    reviews: [{ user: 'ProGamer', rating: 5, comment: 'Literally feels like air.' }]
  },
  {
    name: 'Vertical Ergonomic Mouse',
    description: 'Natural handshake position to reduce forearm strain.',
    price: 89.00,
    category: 'Hardware',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Zenith', model: 'V-Ergo', weight: '130g', dimensions: 'Handshake grip', warranty: '2 Years' },
    reviews: []
  },

  // --- AUDIO ---
  {
    name: 'Open-Back Planar Headphones',
    description: 'Audiophile-grade drivers for an expansive soundstage.',
    price: 499.00,
    category: 'Audio',
    stock: 7,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426da473b?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Sonic', model: 'P-Studio', weight: '450g', dimensions: 'N/A', warranty: '3 Years' },
    reviews: [{ user: 'Audiophile', rating: 5, comment: 'Detail retrieval is unmatched.' }]
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'IP67 waterproof with 20-hour battery and deep bass.',
    price: 120.00,
    category: 'Audio',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1608156639585-34a0a5d737e3?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Sonic', model: 'Go-3', weight: '500g', dimensions: '180mm height', warranty: '1 Year' },
    reviews: []
  },

  // --- SMART HOME & MISC ---
  {
    name: 'Smart Sprinkler Controller',
    description: 'Weather-aware watering schedules managed from your phone.',
    price: 150.00,
    category: 'Smart Home',
    stock: 14,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Glow', model: 'Aqua-8', weight: '400g', dimensions: '8-zone', warranty: '2 Years' },
    reviews: []
  },
  {
    name: 'Carbon Fiber Laptop Stand',
    description: 'Ultra-lightweight folding stand for optimal viewing angles.',
    price: 45.00,
    category: 'Lifestyle',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Swift', model: 'Stand-CF', weight: '150g', dimensions: 'Folding', warranty: 'Lifetime' },
    reviews: [{ user: 'Nomad', rating: 4, comment: 'Fits in my pocket.' }]
  },
  {
    name: 'Modular Wall Light Panels',
    description: 'Hexagonal lighting tiles that snap together in custom shapes.',
    price: 199.00,
    category: 'Smart Home',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Lumina', model: 'Hex-9', weight: '800g', dimensions: '9 panels', warranty: '2 Years' },
    reviews: []
  },
  {
    name: 'Precision Screwdriver Set',
    description: '64-bit kit for repairing electronics and mobile devices.',
    price: 35.00,
    category: 'Hardware',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1581244276891-64f331f4a974?q=80&w=1000&auto=format&fit=crop',
    specs: { brand: 'Frost', model: 'Fix-64', weight: '500g', dimensions: 'Portable case', warranty: 'Lifetime' },
    reviews: [{ user: 'Builder', rating: 5, comment: 'Has every bit I ever needed.' }]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('🔥 Database Seeded with Products!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();