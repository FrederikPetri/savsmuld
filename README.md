# Building Projects - DIY Construction Plans Website

A modern web application for showcasing building projects with detailed instructions, 3D models, and Danish store material lists.

## Features

- 🏠 **Project Showcase**: Browse building projects with detailed descriptions
- 📄 **PDF Instructions**: Step-by-step building instructions with photos
- 🎯 **3D Model Viewer**: Interactive 3D models using Three.js
- 📐 **SketchUp Files**: Downloadable SketchUp files with all measurements
- 🛒 **Danish Store Integration**: Complete material lists with prices from Danish hardware stores
- 👤 **User Authentication**: Secure login and user profiles
- 💳 **Payment Processing**: Stripe integration for project purchases
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **3D Graphics**: Three.js with React Three Fiber
- **Payments**: Stripe
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd building-projects
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. **Set up Supabase**

   Create a new Supabase project and run the following SQL to create the database tables:

   ```sql
   -- Create projects table
   CREATE TABLE projects (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
     pdf_url TEXT NOT NULL,
     model_url TEXT NOT NULL,
     sketchup_url TEXT NOT NULL,
     materials_list JSONB NOT NULL,
     tools_required TEXT[] NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create purchases table
   CREATE TABLE purchases (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
     stripe_payment_intent_id TEXT NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create stores table
   CREATE TABLE stores (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     location TEXT NOT NULL,
     website TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
   ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
   ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
   CREATE POLICY "Purchases are viewable by owner" ON purchases FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Stores are viewable by everyone" ON stores FOR SELECT USING (true);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── projects/          # Project listing and detail pages
│   ├── profile/           # User profile page
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── AuthProvider.tsx   # Authentication context
│   ├── ModelViewer.tsx    # 3D model viewer
│   └── Navbar.tsx         # Navigation component
└── lib/                   # Utility libraries
    └── supabase.ts        # Supabase client configuration
```

## Key Features Implementation

### Authentication
- Uses Supabase Auth for user management
- Protected routes and user-specific content
- Session management with React context

### 3D Model Viewer
- Built with Three.js and React Three Fiber
- Interactive camera controls
- Fallback geometry for projects without 3D models

### Material Lists
- Structured data for materials with Danish store information
- Price calculations and store links
- Organized by store for easy shopping

### Payment Integration
- Stripe integration for secure payments
- Payment intent creation and webhook handling
- Purchase history tracking

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables** in the Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@buildingprojects.com or create an issue in this repository.

## Roadmap

- [ ] Admin dashboard for project management
- [ ] User reviews and ratings system
- [ ] Advanced 3D model loading (GLB/GLTF support)
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Video tutorials integration
- [ ] Community forum
- [ ] Project sharing and social features
