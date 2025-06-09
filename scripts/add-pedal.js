#!/usr/bin/env node

import { readdir, writeFile } from 'fs/promises';
import { createInterface } from 'readline';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pedalsDir = join(__dirname, '../pedals');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generatePedalFilename(name, manufacturer) {
  const slug = createSlug(`${manufacturer} ${name}`);
  return `${slug}.json`;
}

// Mock pedal search function - in a real implementation, this would search actual pedal databases
async function searchPedals(query) {
  console.log(`🔍 Searching for "${query}"...`);
  
  // Simulate search results
  const mockResults = [
    {
      name: "Big Muff Pi",
      manufacturer: "Electro-Harmonix",
      type: "fuzz",
      description: "The legendary fuzz pedal used by countless guitarists",
      imageUrl: "https://images.reverb.com/image/upload/s--aG7LcN8u--/a_exif,c_lpad,f_auto,fl_progressive,g_center,h_570,q_85,w_570/v1598986334/gqm5bsqc0xkqkvczhlmc.jpg",
      price: 99.99,
      milliAmps: 5,
      voltage: 9
    },
    {
      name: "Blues Driver BD-2",
      manufacturer: "Boss",
      type: "overdrive", 
      description: "Classic blues overdrive with warm, tube-like saturation",
      imageUrl: "https://images.reverb.com/image/upload/s--CsTrFFyE--/a_exif,c_lpad,f_auto,fl_progressive,g_center,h_570,q_85,w_570/v1581699745/zfn8lrh9o6h6spxlkr44.jpg",
      price: 79.99,
      milliAmps: 20,
      voltage: 9
    }
  ];

  // Filter results based on query
  return mockResults.filter(pedal => 
    pedal.name.toLowerCase().includes(query.toLowerCase()) ||
    pedal.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
    pedal.type.toLowerCase().includes(query.toLowerCase())
  );
}

async function main() {
  console.log('🎸 Welcome to Stompboard Pedal Manager!');
  console.log('=====================================');
  
  try {
    const query = await question('Enter pedal name, manufacturer, or type to search: ');
    
    if (!query.trim()) {
      console.log('❌ Please enter a search term');
      rl.close();
      return;
    }

    const results = await searchPedals(query.trim());
    
    if (results.length === 0) {
      console.log('❌ No pedals found matching your search');
      rl.close();
      return;
    }

    console.log(`\n✅ Found ${results.length} pedal(s):`);
    results.forEach((pedal, index) => {
      console.log(`${index + 1}. ${pedal.manufacturer} ${pedal.name} (${pedal.type})`);
      console.log(`   ${pedal.description}`);
      console.log(`   Price: $${pedal.price}`);
      console.log('');
    });

    const selection = await question('Select a pedal by number (or 0 to cancel): ');
    const selectedIndex = parseInt(selection) - 1;
    
    if (selectedIndex < 0 || selectedIndex >= results.length) {
      console.log('❌ Invalid selection');
      rl.close();
      return;
    }

    const selectedPedal = results[selectedIndex];
    
    // Get additional details
    const milliAmps = await question(`Power consumption (mA) [${selectedPedal.milliAmps}]: `) || selectedPedal.milliAmps;
    const voltage = await question(`Voltage (V) [${selectedPedal.voltage}]: `) || selectedPedal.voltage;
    const controls = await question('Controls (comma-separated): ');
    const dimensions = await question('Dimensions (optional): ');
    const weight = await question('Weight (optional): ');
    const bypass = await question('Bypass type [True Bypass]: ') || 'True Bypass';
    const year = await question('Year (optional): ');

    // Create pedal object
    const pedal = {
      name: selectedPedal.name,
      manufacturer: selectedPedal.manufacturer,
      type: selectedPedal.type,
      milliAmps: parseInt(milliAmps) || selectedPedal.milliAmps,
      voltage: parseInt(voltage) || selectedPedal.voltage,
      imageUrl: selectedPedal.imageUrl,
      price: selectedPedal.price,
      description: selectedPedal.description,
      controls: controls ? controls.split(',').map(c => c.trim()) : [],
      dimensions: dimensions || undefined,
      weight: weight || undefined,
      bypass: bypass,
      year: year ? parseInt(year) : undefined,
      slug: createSlug(`${selectedPedal.manufacturer} ${selectedPedal.name}`)
    };

    // Clean up undefined values
    Object.keys(pedal).forEach(key => {
      if (pedal[key] === undefined) {
        delete pedal[key];
      }
    });

    const filename = generatePedalFilename(pedal.name, pedal.manufacturer);
    const filepath = join(pedalsDir, filename);
    
    await writeFile(filepath, JSON.stringify(pedal, null, 2));
    
    console.log(`\n✅ Pedal added successfully!`);
    console.log(`📁 File: pedals/${filename}`);
    console.log(`🌐 URL: /${pedal.slug}`);
    console.log('\n🚀 Run "npm run dev" to see your pedal!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main(); 