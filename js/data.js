// ===== MOCK DATA FOR DROPSHIP PLATFORM =====

const NICHES = [
    'Health & Wellness', 'Home & Garden', 'Pet Supplies', 'Tech Gadgets',
    'Beauty & Skincare', 'Fitness', 'Kitchen', 'Baby & Kids',
    'Outdoor & Sports', 'Fashion', 'Automotive', 'Office'
];

const SUPPLIERS = ['AliExpress', 'CJ Dropshipping', 'Spocket', 'Zendrop', 'AutoDS'];

const PRODUCTS = [
    {
        id: 1, name: 'Posture Corrector Back Brace', niche: 'Health & Wellness',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        price: 12.50, sellPrice: 39.99, monthlySales: 4820, revenue: 192780,
        margin: 68, trend: [40, 55, 48, 70, 65, 80, 95, 88, 102, 115, 108, 130],
        badges: ['hot', 'trending'], supplier: 'AliExpress', rating: 4.7, reviews: 2341,
        description: 'Adjustable posture corrector that helps align spine and relieve back pain. Suitable for men and women.',
        tags: ['back pain', 'posture', 'health', 'office'],
        competition: 'Medium', saturation: 42
    },
    {
        id: 2, name: 'LED Smart Desk Lamp with Wireless Charging', niche: 'Tech Gadgets',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
        price: 18.00, sellPrice: 59.99, monthlySales: 3210, revenue: 192558,
        margin: 70, trend: [30, 35, 42, 50, 58, 65, 72, 80, 75, 88, 95, 110],
        badges: ['trending'], supplier: 'CJ Dropshipping', rating: 4.5, reviews: 1876,
        description: 'Multi-function LED desk lamp with built-in Qi wireless charging pad, adjustable brightness and color temperature.',
        tags: ['desk lamp', 'wireless charging', 'smart home', 'office'],
        competition: 'Low', saturation: 28
    },
    {
        id: 3, name: 'Silicone Pet Food Mat', niche: 'Pet Supplies',
        image: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=400&h=300&fit=crop',
        price: 4.20, sellPrice: 19.99, monthlySales: 7650, revenue: 152924,
        margin: 79, trend: [60, 65, 70, 75, 80, 85, 90, 88, 92, 95, 100, 105],
        badges: ['hot', 'winning'], supplier: 'AliExpress', rating: 4.8, reviews: 5432,
        description: 'Non-slip silicone mat for pet food and water bowls. Easy to clean, waterproof, and dishwasher safe.',
        tags: ['pet', 'dog', 'cat', 'feeding'],
        competition: 'Low', saturation: 35
    },
    {
        id: 4, name: 'Electric Scalp Massager', niche: 'Health & Wellness',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
        price: 8.50, sellPrice: 34.99, monthlySales: 5430, revenue: 189987,
        margin: 76, trend: [20, 30, 45, 55, 70, 85, 90, 95, 100, 110, 120, 135],
        badges: ['trending', 'new'], supplier: 'Spocket', rating: 4.6, reviews: 3210,
        description: 'Waterproof electric scalp massager for hair growth stimulation and stress relief. USB rechargeable.',
        tags: ['scalp', 'hair growth', 'massage', 'wellness'],
        competition: 'Medium', saturation: 38
    },
    {
        id: 5, name: 'Bamboo Cutting Board Set (3-piece)', niche: 'Kitchen',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        price: 11.00, sellPrice: 44.99, monthlySales: 3890, revenue: 174961,
        margin: 75, trend: [50, 52, 55, 58, 62, 65, 68, 70, 72, 75, 78, 82],
        badges: ['winning'], supplier: 'CJ Dropshipping', rating: 4.9, reviews: 4521,
        description: 'Premium bamboo cutting board set with juice groove, handle, and non-slip feet. Eco-friendly and durable.',
        tags: ['kitchen', 'bamboo', 'cooking', 'eco-friendly'],
        competition: 'Medium', saturation: 55
    },
    {
        id: 6, name: 'Resistance Bands Set (11-piece)', niche: 'Fitness',
        image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop',
        price: 9.00, sellPrice: 29.99, monthlySales: 8920, revenue: 267431,
        margin: 70, trend: [80, 85, 90, 95, 100, 105, 110, 108, 115, 120, 125, 130],
        badges: ['hot', 'trending', 'winning'], supplier: 'AliExpress', rating: 4.7, reviews: 8765,
        description: 'Complete resistance bands set for home workouts. Includes 5 bands, handles, ankle straps, door anchor, and carry bag.',
        tags: ['fitness', 'workout', 'home gym', 'resistance'],
        competition: 'High', saturation: 72
    },
    {
        id: 7, name: 'Portable Blender Bottle', niche: 'Fitness',
        image: 'https://images.unsplash.com/photo-1622597467836-f3e6e0f7e1f5?w=400&h=300&fit=crop',
        price: 14.00, sellPrice: 49.99, monthlySales: 4120, revenue: 205959,
        margin: 72, trend: [35, 40, 48, 55, 62, 70, 78, 85, 90, 95, 100, 108],
        badges: ['trending'], supplier: 'Zendrop', rating: 4.5, reviews: 2987,
        description: 'USB rechargeable portable blender for smoothies and protein shakes. BPA-free, 6 blades, 400ml capacity.',
        tags: ['blender', 'smoothie', 'protein', 'fitness'],
        competition: 'Medium', saturation: 48
    },
    {
        id: 8, name: 'Car Phone Mount Wireless Charger', niche: 'Automotive',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop',
        price: 16.00, sellPrice: 54.99, monthlySales: 5670, revenue: 311643,
        margin: 71, trend: [45, 50, 58, 65, 72, 80, 88, 92, 98, 105, 112, 120],
        badges: ['hot', 'winning'], supplier: 'CJ Dropshipping', rating: 4.6, reviews: 4321,
        description: 'Auto-clamping car phone mount with 15W fast wireless charging. Compatible with all Qi-enabled phones.',
        tags: ['car', 'phone mount', 'wireless charging', 'automotive'],
        competition: 'Medium', saturation: 52
    },
    {
        id: 9, name: 'Jade Roller & Gua Sha Set', niche: 'Beauty & Skincare',
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=300&fit=crop',
        price: 6.00, sellPrice: 24.99, monthlySales: 9340, revenue: 233407,
        margin: 76, trend: [70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125],
        badges: ['hot', 'trending'], supplier: 'AliExpress', rating: 4.8, reviews: 11234,
        description: 'Natural jade roller and gua sha facial massage set for reducing puffiness, improving circulation, and skincare.',
        tags: ['beauty', 'skincare', 'jade', 'facial massage'],
        competition: 'High', saturation: 68
    },
    {
        id: 10, name: 'Smart Plant Watering Sensor', niche: 'Home & Garden',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        price: 7.50, sellPrice: 27.99, monthlySales: 3450, revenue: 96556,
        margin: 73, trend: [20, 25, 30, 38, 45, 52, 60, 68, 75, 82, 90, 98],
        badges: ['new', 'trending'], supplier: 'Spocket', rating: 4.4, reviews: 1543,
        description: 'WiFi-connected soil moisture sensor that sends alerts to your phone when plants need watering.',
        tags: ['plants', 'smart home', 'garden', 'IoT'],
        competition: 'Low', saturation: 22
    },
    {
        id: 11, name: 'Toddler Foam Play Mat (Interlocking)', niche: 'Baby & Kids',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        price: 22.00, sellPrice: 69.99, monthlySales: 2890, revenue: 202271,
        margin: 69, trend: [40, 45, 50, 55, 60, 65, 70, 68, 72, 75, 80, 85],
        badges: ['winning'], supplier: 'AutoDS', rating: 4.7, reviews: 3456,
        description: 'Extra-thick interlocking foam play mat tiles for babies and toddlers. Non-toxic, waterproof, 36-piece set.',
        tags: ['baby', 'kids', 'play mat', 'foam'],
        competition: 'Medium', saturation: 45
    },
    {
        id: 12, name: 'Hiking Trekking Poles (Collapsible)', niche: 'Outdoor & Sports',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
        price: 19.00, sellPrice: 64.99, monthlySales: 2340, revenue: 152077,
        margin: 71, trend: [30, 35, 40, 45, 52, 60, 68, 75, 80, 85, 90, 95],
        badges: ['new'], supplier: 'CJ Dropshipping', rating: 4.6, reviews: 2109,
        description: 'Lightweight aluminum collapsible trekking poles with ergonomic cork handles and wrist straps. Pair included.',
        tags: ['hiking', 'trekking', 'outdoor', 'camping'],
        competition: 'Low', saturation: 30
    },
    {
        id: 13, name: 'Magnetic Phone Case Wallet', niche: 'Fashion',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop',
        price: 8.00, sellPrice: 29.99, monthlySales: 6780, revenue: 203322,
        margin: 73, trend: [55, 60, 65, 70, 75, 80, 85, 88, 90, 95, 100, 105],
        badges: ['hot', 'trending'], supplier: 'AliExpress', rating: 4.5, reviews: 5678,
        description: 'Leather magnetic phone case with card slots and kickstand. Available for iPhone and Samsung models.',
        tags: ['phone case', 'wallet', 'leather', 'fashion'],
        competition: 'High', saturation: 65
    },
    {
        id: 14, name: 'Ergonomic Lumbar Support Pillow', niche: 'Office',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        price: 13.00, sellPrice: 44.99, monthlySales: 4560, revenue: 205154,
        margin: 71, trend: [40, 45, 52, 58, 65, 72, 78, 82, 88, 92, 98, 105],
        badges: ['trending', 'winning'], supplier: 'Spocket', rating: 4.7, reviews: 3892,
        description: 'Memory foam lumbar support pillow for office chairs and car seats. Reduces back pain during long sitting sessions.',
        tags: ['office', 'back pain', 'ergonomic', 'work from home'],
        competition: 'Medium', saturation: 50
    },
    {
        id: 15, name: 'Reusable Beeswax Food Wraps (6-pack)', niche: 'Kitchen',
        image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop',
        price: 9.50, sellPrice: 34.99, monthlySales: 3120, revenue: 109169,
        margin: 73, trend: [25, 30, 35, 42, 50, 58, 65, 72, 78, 85, 90, 95],
        badges: ['new', 'trending'], supplier: 'Zendrop', rating: 4.6, reviews: 2345,
        description: 'Eco-friendly reusable beeswax food wraps as plastic wrap alternative. Washable and compostable.',
        tags: ['eco-friendly', 'kitchen', 'sustainable', 'food storage'],
        competition: 'Low', saturation: 25
    },
    {
        id: 16, name: 'Mini Projector for Bedroom', niche: 'Tech Gadgets',
        image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
        price: 45.00, sellPrice: 129.99, monthlySales: 1890, revenue: 245681,
        margin: 65, trend: [30, 38, 45, 52, 60, 68, 75, 82, 88, 95, 102, 110],
        badges: ['hot', 'winning'], supplier: 'AutoDS', rating: 4.4, reviews: 1678,
        description: 'Portable mini projector with 1080p support, built-in speaker, and WiFi screen mirroring. Perfect for movie nights.',
        tags: ['projector', 'movie', 'tech', 'entertainment'],
        competition: 'Medium', saturation: 42
    }
];

const NICHES_DATA = [
    {
        id: 1, name: 'Health & Wellness', icon: '💊', color: '#10b981',
        competition: 'Medium', avgMargin: 72, trendScore: 94, monthlySearches: 2400000,
        topProducts: 3, description: 'Supplements, posture aids, massagers, and wellness devices.',
        growth: '+34%', products: [1, 4]
    },
    {
        id: 2, name: 'Tech Gadgets', icon: '⚡', color: '#06b6d4',
        competition: 'Medium', avgMargin: 68, trendScore: 88, monthlySearches: 1800000,
        topProducts: 5, description: 'Smart home devices, phone accessories, and innovative electronics.',
        growth: '+28%', products: [2, 16]
    },
    {
        id: 3, name: 'Pet Supplies', icon: '🐾', color: '#f59e0b',
        competition: 'Low', avgMargin: 76, trendScore: 91, monthlySearches: 1200000,
        topProducts: 4, description: 'Pet food accessories, toys, grooming tools, and pet care.',
        growth: '+41%', products: [3]
    },
    {
        id: 4, name: 'Fitness', icon: '💪', color: '#7c3aed',
        competition: 'High', avgMargin: 71, trendScore: 96, monthlySearches: 3200000,
        topProducts: 8, description: 'Home gym equipment, workout accessories, and fitness trackers.',
        growth: '+22%', products: [6, 7]
    },
    {
        id: 5, name: 'Kitchen', icon: '🍳', color: '#ec4899',
        competition: 'Medium', avgMargin: 74, trendScore: 82, monthlySearches: 980000,
        topProducts: 6, description: 'Cooking tools, storage solutions, and kitchen gadgets.',
        growth: '+18%', products: [5, 15]
    },
    {
        id: 6, name: 'Beauty & Skincare', icon: '✨', color: '#f472b6',
        competition: 'High', avgMargin: 78, trendScore: 97, monthlySearches: 4100000,
        topProducts: 10, description: 'Skincare tools, makeup accessories, and beauty devices.',
        growth: '+52%', products: [9]
    },
    {
        id: 7, name: 'Home & Garden', icon: '🏡', color: '#34d399',
        competition: 'Low', avgMargin: 70, trendScore: 79, monthlySearches: 760000,
        topProducts: 4, description: 'Home decor, garden tools, smart home devices, and organization.',
        growth: '+15%', products: [10]
    },
    {
        id: 8, name: 'Baby & Kids', icon: '👶', color: '#60a5fa',
        competition: 'Medium', avgMargin: 67, trendScore: 85, monthlySearches: 890000,
        topProducts: 5, description: 'Baby gear, educational toys, safety products, and kids accessories.',
        growth: '+25%', products: [11]
    },
    {
        id: 9, name: 'Outdoor & Sports', icon: '🏕️', color: '#a3e635',
        competition: 'Low', avgMargin: 69, trendScore: 83, monthlySearches: 650000,
        topProducts: 3, description: 'Camping gear, hiking equipment, sports accessories, and outdoor tools.',
        growth: '+31%', products: [12]
    },
    {
        id: 10, name: 'Automotive', icon: '🚗', color: '#fb923c',
        competition: 'Medium', avgMargin: 72, trendScore: 87, monthlySearches: 1100000,
        topProducts: 4, description: 'Car accessories, phone mounts, organizers, and auto care products.',
        growth: '+19%', products: [8]
    },
    {
        id: 11, name: 'Office', icon: '💼', color: '#818cf8',
        competition: 'Medium', avgMargin: 70, trendScore: 80, monthlySearches: 720000,
        topProducts: 3, description: 'Ergonomic accessories, desk organizers, and work-from-home essentials.',
        growth: '+38%', products: [14]
    },
    {
        id: 12, name: 'Fashion', icon: '👗', color: '#f87171',
        competition: 'High', avgMargin: 65, trendScore: 89, monthlySearches: 5200000,
        topProducts: 12, description: 'Accessories, jewelry, bags, phone cases, and trendy clothing items.',
        growth: '+12%', products: [13]
    }
];

const MOCK_STORES = {
    'gymshark': {
        name: 'GymShark Clone Store', url: 'gymshark-clone.myshopify.com',
        theme: 'Dawn', platform: 'Shopify', monthlyRevenue: 124500,
        monthlyVisitors: 89000, conversionRate: 3.2, avgOrderValue: 68,
        topProducts: [
            { name: 'Seamless Leggings', sales: 1240, revenue: 62000 },
            { name: 'Sports Bra Set', sales: 980, revenue: 39200 },
            { name: 'Gym Shorts', sales: 760, revenue: 22800 }
        ],
        apps: ['Klaviyo', 'Loox Reviews', 'ReConvert', 'Vitals', 'Judge.me'],
        trafficSources: { organic: 35, paid: 40, social: 18, direct: 7 },
        founded: '2022', country: 'United States'
    },
    'petparadise': {
        name: 'Pet Paradise Store', url: 'petparadise-shop.myshopify.com',
        theme: 'Prestige', platform: 'Shopify', monthlyRevenue: 87300,
        monthlyVisitors: 54000, conversionRate: 4.1, avgOrderValue: 42,
        topProducts: [
            { name: 'Dog Harness Set', sales: 890, revenue: 31150 },
            { name: 'Cat Scratcher Tower', sales: 650, revenue: 26000 },
            { name: 'Pet GPS Tracker', sales: 420, revenue: 21000 }
        ],
        apps: ['Oberlo', 'Klaviyo', 'Smile.io', 'Yotpo', 'Tidio'],
        trafficSources: { organic: 28, paid: 45, social: 22, direct: 5 },
        founded: '2021', country: 'United Kingdom'
    },
    'techzone': {
        name: 'TechZone Gadgets', url: 'techzone-gadgets.myshopify.com',
        theme: 'Impulse', platform: 'Shopify', monthlyRevenue: 203400,
        monthlyVisitors: 142000, conversionRate: 2.8, avgOrderValue: 89,
        topProducts: [
            { name: 'Smart Watch Pro', sales: 1560, revenue: 109200 },
            { name: 'Wireless Earbuds', sales: 1230, revenue: 61500 },
            { name: 'Phone Gimbal', sales: 540, revenue: 32400 }
        ],
        apps: ['DSers', 'PageFly', 'Klaviyo', 'Gorgias', 'Aftership'],
        trafficSources: { organic: 22, paid: 55, social: 15, direct: 8 },
        founded: '2020', country: 'Australia'
    },
    'glowskin': {
        name: 'GlowSkin Beauty', url: 'glowskin-beauty.myshopify.com',
        theme: 'Narrative', platform: 'Shopify', monthlyRevenue: 156700,
        monthlyVisitors: 98000, conversionRate: 3.8, avgOrderValue: 52,
        topProducts: [
            { name: 'LED Face Mask', sales: 1890, revenue: 75600 },
            { name: 'Jade Roller Set', sales: 2340, revenue: 46800 },
            { name: 'Vitamin C Serum', sales: 1120, revenue: 33600 }
        ],
        apps: ['Klaviyo', 'Loox', 'Upsell Kit', 'Privy', 'Smile.io'],
        trafficSources: { organic: 30, paid: 35, social: 30, direct: 5 },
        founded: '2021', country: 'Canada'
    }
};

const ADS = [
    {
        id: 1, platform: 'facebook', niche: 'Health & Wellness',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        headline: 'Stop Slouching! Fix Your Posture in 30 Days',
        copy: 'Millions of people suffer from back pain caused by poor posture. Our posture corrector helps you sit straight naturally...',
        likes: 4521, comments: 892, shares: 1234, spend: '$2,400/mo',
        engagement: 'High', runningDays: 45, cta: 'Shop Now'
    },
    {
        id: 2, platform: 'tiktok', niche: 'Beauty & Skincare',
        thumbnail: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=300&fit=crop',
        headline: 'My skin transformation using this jade roller 😍',
        copy: 'I\'ve been using this jade roller for 30 days and the results are INSANE. Reduced puffiness, better circulation...',
        likes: 89400, comments: 3210, shares: 12400, spend: 'N/A',
        engagement: 'Very High', runningDays: 12, cta: 'Link in Bio'
    },
    {
        id: 3, platform: 'facebook', niche: 'Tech Gadgets',
        thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
        headline: 'The Last Desk Lamp You\'ll Ever Buy',
        copy: 'Wireless charging + LED lighting + adjustable brightness. Everything you need on your desk in one elegant device...',
        likes: 2341, comments: 456, shares: 678, spend: '$1,800/mo',
        engagement: 'Medium', runningDays: 28, cta: 'Learn More'
    },
    {
        id: 4, platform: 'tiktok', niche: 'Fitness',
        thumbnail: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop',
        headline: 'Home gym setup for under $30 💪',
        copy: 'You don\'t need an expensive gym membership. This resistance band set gives you a full body workout at home...',
        likes: 124000, comments: 8900, shares: 34500, spend: 'N/A',
        engagement: 'Very High', runningDays: 8, cta: 'Link in Bio'
    },
    {
        id: 5, platform: 'facebook', niche: 'Pet Supplies',
        thumbnail: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=400&h=300&fit=crop',
        headline: 'Pet Parents Are Obsessed With This Mat',
        copy: 'Say goodbye to messy floors! This silicone pet mat catches all spills and is dishwasher safe. Your dog will love it...',
        likes: 5678, comments: 1234, shares: 2345, spend: '$3,200/mo',
        engagement: 'High', runningDays: 62, cta: 'Shop Now'
    },
    {
        id: 6, platform: 'facebook', niche: 'Kitchen',
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        headline: 'Ditch Plastic Wrap Forever',
        copy: 'These beeswax wraps are the eco-friendly alternative your kitchen needs. Reusable, washable, and compostable...',
        likes: 3456, comments: 789, shares: 1567, spend: '$1,200/mo',
        engagement: 'Medium', runningDays: 35, cta: 'Shop Now'
    },
    {
        id: 7, platform: 'tiktok', niche: 'Tech Gadgets',
        thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
        headline: 'Movie night just got an upgrade 🎬',
        copy: 'This mini projector turns any wall into a cinema screen. Perfect for dorm rooms, bedrooms, and backyard movie nights...',
        likes: 67800, comments: 4500, shares: 18900, spend: 'N/A',
        engagement: 'Very High', runningDays: 15, cta: 'Link in Bio'
    },
    {
        id: 8, platform: 'facebook', niche: 'Automotive',
        thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop',
        headline: 'Never Touch Your Phone While Driving Again',
        copy: 'Auto-clamping mount + 15W wireless charging. Just place your phone and it grips automatically. Works with any car...',
        likes: 7890, comments: 1456, shares: 3210, spend: '$4,100/mo',
        engagement: 'High', runningDays: 78, cta: 'Buy Now'
    }
];
