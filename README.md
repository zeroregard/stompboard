# 🎸 Stompboard - Guitar Pedal Manager

A modern React application for managing and showcasing your guitar pedal collection.

## ✨ Features

- **Modern UI**: Built with React 18, TypeScript, and Tailwind CSS
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dynamic Routing**: Each pedal gets its own URL (e.g., `/boss-blues-driver-bd-2`)
- **Interactive Search**: Add pedals via command line with search functionality
- **Auto-deployment**: GitHub Actions workflow for continuous deployment to Vercel

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Add your first pedal**
   ```bash
   npm run add-pedal
   ```

## 📁 Project Structure

```
stompboard/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── types/         # TypeScript interfaces
│   └── utils/         # Utility functions
├── pedals/            # JSON files for each pedal
├── scripts/           # CLI tools
└── .github/workflows/ # CI/CD configuration
```

## 🎛️ Adding Pedals

Use the interactive CLI to search and add pedals:

```bash
npm run add-pedal
```

This will:
1. Search for pedals by name, manufacturer, or type
2. Let you select from search results
3. Prompt for additional details (power, controls, etc.)
4. Create a JSON file in the `pedals/` directory
5. Generate a URL-friendly slug for routing

## 📋 Pedal Data Structure

Each pedal is stored as a JSON file with this structure:

```json
{
  "name": "Blues Driver BD-2",
  "manufacturer": "Boss",
  "type": "overdrive",
  "milliAmps": 20,
  "voltage": 9,
  "imageUrl": "https://example.com/image.jpg",
  "price": 79.99,
  "description": "Classic blues overdrive...",
  "controls": ["Level", "Tone", "Gain"],
  "dimensions": "2.87\" x 5.13\" x 2.38\"",
  "weight": "0.9 lbs",
  "bypass": "True Bypass",
  "year": 1995,
  "slug": "boss-blues-driver-bd-2"
}
```

## 🚀 Deployment

The project includes a GitHub Actions workflow that automatically deploys to Vercel on every push to the main branch.

### Setup Vercel Deployment

1. Create a Vercel account and connect your GitHub repository
2. Add these secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Icons**: Heroicons
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run add-pedal` - Interactive pedal search and add

## 🎨 UI Components

The app uses a modern design system with:
- Responsive grid layouts
- Hover effects and transitions
- Color-coded pedal types
- Loading states and error handling
- Mobile-first responsive design

## 🔧 Development

The project uses modern React patterns:
- Functional components with hooks
- TypeScript for type safety
- Suspense for code splitting
- Modern CSS with Tailwind utilities

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 