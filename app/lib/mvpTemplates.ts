import { LayoutGrid, Palette, Brain, ShoppingCart } from "lucide-react";

export interface MVPTemplate {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  complexity: "Low" | "Medium" | "High";
  estimatedTime: string;
  recommendedTools: string[];
  features: string[];
  targetAudience: string;
  techStack: string[];
  prompts: {
    framework: string;
    uiPages: string[];
    navigation: string;
  };
}

export const mvpTemplates: MVPTemplate[] = [
  {
    id: 1,
    name: "SaaS Dashboard",
    description: "Complete SaaS application with user management, analytics, and billing",
    icon: LayoutGrid,
    tags: ["Dashboard", "Analytics", "User Management"],
    complexity: "Medium",
    estimatedTime: "2-3 weeks",
    recommendedTools: ["Framer", "FlutterFlow", "Supabase"],
    features: [
      "User Authentication & Authorization",
      "Analytics Dashboard with Charts",
      "Subscription Management",
      "Team Collaboration",
      "API Integration",
      "Notification System"
    ],
    targetAudience: "B2B SaaS companies, startups",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Stripe"],
    prompts: {
      framework: `Create a modern SaaS dashboard application with the following structure:

Landing Page:
- Hero section with value proposition
- Feature highlights with icons
- Pricing tiers (Free, Pro, Enterprise)
- Customer testimonials
- Call-to-action for free trial

Authentication:
- Sign up/login with email and social options
- Email verification flow
- Password reset functionality
- Two-factor authentication option

Main Dashboard:
- Overview with key metrics and KPIs
- Recent activity feed
- Quick action buttons
- Navigation sidebar with main sections

Core Features:
- Analytics dashboard with interactive charts
- User management and team settings
- Billing and subscription management
- API keys and integrations
- Notification preferences

Technical Requirements:
- Responsive design for all screen sizes
- Dark/light theme toggle
- Real-time data updates
- Export functionality for reports
- Search and filtering capabilities`,

      uiPages: [
        "Landing Page: Create a compelling SaaS landing page with hero section, feature grid, pricing table, and testimonials. Use modern gradients and clean typography.",
        
        "Dashboard Overview: Design a comprehensive dashboard with metric cards, charts, recent activity feed, and quick actions. Use a sidebar navigation layout.",
        
        "Analytics Page: Create detailed analytics with interactive charts, date range selectors, and export options. Include revenue, user growth, and engagement metrics.",
        
        "User Management: Design user list with search, filters, role management, and bulk actions. Include user profile modals and permission settings.",
        
        "Billing Settings: Create subscription management with plan comparison, payment methods, billing history, and usage tracking.",
        
        "Team Settings: Design team member management with invitations, role assignments, and collaboration tools."
      ],

      navigation: `SaaS Dashboard Navigation Flow:

Primary Navigation (Sidebar):
- Dashboard → Overview with key metrics
- Analytics → Detailed reports and charts
- Users → User management and permissions
- Billing → Subscription and payment settings
- Team → Team member management
- Settings → Account and app preferences
- API → API keys and documentation

User Journey:
1. Visitor explores landing page
2. Signs up for free trial
3. Completes onboarding wizard
4. Accesses main dashboard
5. Explores core features
6. Upgrades to paid plan
7. Invites team members

Key Interactions:
- Smooth transitions between sections
- Real-time notifications
- Contextual help tooltips
- Keyboard shortcuts for power users
- Breadcrumb navigation for deep pages`
    }
  },

  {
    id: 2,
    name: "E-commerce Store",
    description: "Online store with product catalog, cart, and payment integration",
    icon: ShoppingCart,
    tags: ["E-commerce", "Payments", "Inventory"],
    complexity: "High",
    estimatedTime: "3-4 weeks",
    recommendedTools: ["Webflow", "Shopify", "Stripe"],
    features: [
      "Product Catalog & Search",
      "Shopping Cart & Checkout",
      "Payment Processing",
      "Order Management",
      "Inventory Tracking",
      "Customer Reviews"
    ],
    targetAudience: "Retailers, online merchants",
    techStack: ["Next.js", "Stripe", "Shopify API", "Tailwind CSS"],
    prompts: {
      framework: `Create a modern e-commerce store with comprehensive shopping features:

Homepage:
- Hero banner with featured products
- Category navigation
- Best sellers and new arrivals
- Brand story section
- Newsletter signup

Product Catalog:
- Grid/list view toggle
- Advanced filtering and search
- Product quick view
- Wishlist functionality
- Recently viewed items

Shopping Experience:
- Detailed product pages with image gallery
- Size/color/variant selection
- Add to cart with quantity selector
- Shopping cart with item management
- Secure checkout process

Customer Features:
- User accounts and order history
- Product reviews and ratings
- Wishlist and favorites
- Customer support chat`,

      uiPages: [
        "Homepage: Design an attractive e-commerce homepage with hero banner, featured products, categories, and promotional sections.",
        
        "Product Listing: Create product grid with filters, sorting, search, and pagination. Include quick view and wishlist options.",
        
        "Product Detail: Design detailed product page with image gallery, variants, reviews, related products, and add to cart.",
        
        "Shopping Cart: Create cart page with item management, quantity updates, promo codes, and checkout button.",
        
        "Checkout: Design multi-step checkout with shipping, payment, and order confirmation.",
        
        "User Account: Create account dashboard with order history, wishlist, addresses, and preferences."
      ],

      navigation: `E-commerce Store Navigation:

Main Navigation:
- Home → Store homepage
- Shop → Product categories
- About → Brand story
- Contact → Customer support

Shop Categories:
- Men's → Men's products
- Women's → Women's products
- Accessories → Accessories
- Sale → Discounted items

User Account:
- Orders → Order history and tracking
- Wishlist → Saved products
- Addresses → Shipping addresses
- Settings → Account preferences

Shopping Flow:
1. Browse products by category
2. Use search and filters
3. View product details
4. Add to cart
5. Review cart items
6. Proceed to checkout
7. Complete payment
8. Receive order confirmation`
    }
  },

  {
    id: 3,
    name: "Mobile App",
    description: "Cross-platform mobile application with native features",
    icon: Palette,
    tags: ["Mobile", "Cross-platform", "Native"],
    complexity: "Medium",
    estimatedTime: "2-3 weeks",
    recommendedTools: ["FlutterFlow", "Draftbit", "Firebase"],
    features: [
      "Cross-platform Compatibility",
      "Push Notifications",
      "Offline Functionality",
      "Camera Integration",
      "Location Services",
      "Social Login"
    ],
    targetAudience: "Mobile-first businesses, startups",
    techStack: ["Flutter", "Firebase", "Native APIs"],
    prompts: {
      framework: `Create a cross-platform mobile application with native features:

Onboarding:
- Welcome screens with app introduction
- Feature highlights
- Permission requests
- Account creation/login

Core App Structure:
- Tab-based navigation
- Profile management
- Settings and preferences
- Notification center

Native Features:
- Camera and photo gallery access
- Location services
- Push notifications
- Offline data sync
- Biometric authentication`,

      uiPages: [
        "Onboarding: Design welcome screens with app introduction, feature highlights, and smooth transitions.",
        
        "Home Screen: Create main dashboard with key features, recent activity, and quick actions.",
        
        "Profile: Design user profile with avatar, personal info, settings, and preferences.",
        
        "Camera Feature: Create camera interface with capture, gallery, and editing options.",
        
        "Settings: Design comprehensive settings with notifications, privacy, and account options."
      ],

      navigation: `Mobile App Navigation:

Tab Navigation:
- Home → Main dashboard
- Explore → Content discovery
- Camera → Photo/video capture
- Profile → User account

User Flow:
1. App launch and onboarding
2. Account setup
3. Permission grants
4. Main feature usage
5. Profile customization`
    }
  },

  {
    id: 4,
    name: "AI-Powered Tool",
    description: "AI application with chat interface and intelligent features",
    icon: Brain,
    tags: ["AI", "Chatbot", "Machine Learning"],
    complexity: "High",
    estimatedTime: "3-5 weeks",
    recommendedTools: ["Replit", "Cursor", "OpenAI"],
    features: [
      "AI Chat Interface",
      "Natural Language Processing",
      "Document Analysis",
      "API Integration",
      "Usage Analytics",
      "Custom Training"
    ],
    targetAudience: "AI enthusiasts, developers, businesses",
    techStack: ["React", "OpenAI API", "Python", "Vector Database"],
    prompts: {
      framework: `Create an AI-powered application with intelligent features:

Chat Interface:
- Conversational UI with message history
- File upload and analysis
- Real-time typing indicators
- Message reactions and feedback

AI Features:
- Natural language processing
- Document summarization
- Code generation and review
- Image analysis and description
- Custom model training

User Management:
- Usage tracking and limits
- API key management
- Conversation history
- Export and sharing options`,

      uiPages: [
        "Chat Interface: Design modern chat UI with message bubbles, file uploads, and AI responses.",
        
        "Dashboard: Create analytics dashboard showing usage, conversation history, and AI insights.",
        
        "Document Analyzer: Design file upload interface with analysis results and insights.",
        
        "API Playground: Create interface for testing AI features with code examples.",
        
        "Settings: Design AI model configuration, API settings, and usage preferences."
      ],

      navigation: `AI Tool Navigation:

Main Sections:
- Chat → AI conversation interface
- Documents → File analysis tools
- API → Developer playground
- Analytics → Usage insights
- Settings → Configuration

AI Workflow:
1. Start new conversation
2. Upload documents or ask questions
3. Receive AI-generated responses
4. Refine and iterate
5. Export or share results`
    }
  }
];
