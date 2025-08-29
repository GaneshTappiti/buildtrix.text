import { RAGTool, MVPWizardData, AppType, Platform } from '@/types/ideaforge';
import { getRAGToolProfile } from './ragToolProfiles';

/**
 * Universal Prompt Template Service
 * Generates comprehensive app blueprints with 15+ screens, user roles, data models, and edge cases
 * Based on the improved template to fix limited screen generation
 */

export interface UniversalPromptConfig {
  includeErrorStates: boolean;
  includeBackendModels: boolean;
  includeUIComponents: boolean;
  includeModalsPopups: boolean;
  appDepth: 'mvp' | 'advanced' | 'production';
  appType: 'web' | 'mobile' | 'hybrid';
}

export interface ComprehensiveAppBlueprint {
  screens: AppScreen[];
  pageFlow: NavigationFlow;
  userRoles: UserRole[];
  dataModels: DataModel[];
  modalsPopups: Modal[];
  statesEdgeCases: AppState[];
  integrations: Integration[];
  architecture: ArchitecturePattern;
  metadata: {
    totalScreens: number;
    complexity: string;
    estimatedDevTime: string;
  };
}

export interface AppScreen {
  name: string;
  type: 'main' | 'sub' | 'onboarding' | 'error' | 'loading' | 'empty';
  description: string;
  userRoles: string[];
  components: string[];
  dataRequired: string[];
  parentScreen?: string;
  childScreens?: string[];
}

export interface NavigationFlow {
  structure: 'tabs' | 'drawer' | 'stack' | 'nested';
  routes: RouteDefinition[];
  flowChart: string[];
}

export interface RouteDefinition {
  path: string;
  screen: string;
  requiresAuth: boolean;
  allowedRoles: string[];
  parentRoute?: string;
}

export interface UserRole {
  name: string;
  permissions: string[];
  accessibleScreens: string[];
  restrictions: string[];
}

export interface DataModel {
  name: string;
  fields: ModelField[];
  relationships: Relationship[];
  usedInScreens: string[];
}

export interface ModelField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface Relationship {
  type: 'oneToOne' | 'oneToMany' | 'manyToMany';
  relatedModel: string;
  description: string;
}

export interface Modal {
  name: string;
  type: 'dialog' | 'overlay' | 'confirmation' | 'form';
  triggerScreens: string[];
  purpose: string;
}

export interface AppState {
  name: string;
  type: 'empty' | 'loading' | 'error' | 'success' | 'offline';
  affectedScreens: string[];
  userExperience: string;
}

export interface Integration {
  name: string;
  type: 'auth' | 'storage' | 'payment' | 'notification' | 'analytics' | 'social';
  purpose: string;
  affectedScreens: string[];
}

export interface ArchitecturePattern {
  pattern: 'MVC' | 'MVVM' | 'Clean Architecture' | 'Feature-based' | 'Modular';
  reasoning: string;
  folderStructure: string[];
}

export class UniversalPromptTemplateService {
  /**
   * Generate the Universal Prompt Template
   */
  static generateUniversalPrompt(
    userIdea: string,
    wizardData: MVPWizardData,
    config: UniversalPromptConfig,
    selectedTool?: RAGTool
  ): string {
    const toolContext = selectedTool ? this.getToolSpecificContext(selectedTool) : '';
    const depthInstructions = this.getDepthInstructions(config.appDepth);
    const optionalSections = this.getOptionalSections(config);

    return `You are an expert ${config.appType} app architect with 10+ years of experience designing scalable, production-ready applications. Given a user's app idea, generate a comprehensive, professional app structure that goes beyond basic MVP limitations.

**User App Idea:** ${userIdea}

**Project Context:**
- App Name: ${wizardData.step1.appName}
- App Type: ${wizardData.step1.appType}
- Platforms: ${wizardData.step3.platforms.join(', ')}
- Design Style: ${wizardData.step2.designStyle}
- Theme: ${wizardData.step2.theme}
- Complexity Level: ${config.appDepth}

${toolContext}

**Generate a complete, professional app blueprint with the following sections:**

## 1. 🖥️ **COMPREHENSIVE SCREENS LIST** (Minimum 15+ screens)
Generate ALL user-facing screens including:
- **Core Screens**: Main functionality screens
- **Authentication Flow**: Login, register, forgot password, email verification
- **Onboarding**: Welcome, tutorial, setup screens
- **User Management**: Profile, settings, preferences, account management
- **Sub-pages**: Detail views, edit forms, nested content
- **Administrative**: Admin dashboard, user management, analytics
- **Edge Cases**: Error pages (404, 500), maintenance, offline mode
- **Empty States**: No data, first-time user, search no results
- **Loading States**: Splash screen, data loading, processing states

For each screen provide:
- Screen name and purpose
- User roles who can access it
- Key components/sections
- Data requirements

## 2. 🧭 **DETAILED PAGE FLOW & NAVIGATION**
- **Navigation Structure**: ${config.appType === 'mobile' ? 'Tab bar, drawer, or stack navigation' : 'Header nav, sidebar, breadcrumbs'}
- **Route Hierarchy**: Parent-child relationships
- **User Journey Mapping**: Step-by-step flows for key actions
- **Deep Linking**: URL structure and routing patterns
- **Navigation States**: Active, disabled, conditional navigation

## 3. 🧑‍🤝‍🧑 **USER ROLES & PERMISSIONS**
Define all user types with:
- Role name and description
- Specific permissions and capabilities
- Accessible screens and features
- Restrictions and limitations
- Role-based UI variations

## 4. 🗃️ **COMPREHENSIVE DATA MODELS**
For each entity, define:
- Model name and purpose
- All fields with types and constraints
- Relationships between models
- Which screens use this data
- CRUD operations required

## 5. 💬 **MODALS & INTERACTIVE ELEMENTS**
${config.includeModalsPopups ? `- **Dialog Boxes**: Confirmations, alerts, info modals
- **Form Overlays**: Quick actions, inline editing
- **Media Viewers**: Image galleries, video players
- **Contextual Menus**: Right-click, long-press actions
- **Tooltips & Hints**: User guidance elements` : '(Modals section disabled)'}

## 6. 🧪 **STATES & EDGE CASES**
${config.includeErrorStates ? `- **Empty States**: No content, first-time experience
- **Loading States**: Data fetching, processing, uploading
- **Error Handling**: Network errors, validation errors, system errors
- **Offline Mode**: Cached content, sync when online
- **Success States**: Confirmations, completed actions` : '(States section disabled)'}

## 7. 🧩 **THIRD-PARTY INTEGRATIONS**
Suggest relevant integrations:
- **Authentication**: OAuth providers, SSO
- **Storage**: Cloud storage, CDN
- **Payments**: Stripe, PayPal (if applicable)
- **Notifications**: Push, email, SMS
- **Analytics**: User behavior, performance tracking
- **Social**: Sharing, social login

## 8. 🏗️ **ARCHITECTURE PATTERN**
Recommend the best architecture for this app:
- **Pattern Choice**: MVC, MVVM, Clean Architecture, etc.
- **Reasoning**: Why this pattern fits the app
- **Folder Structure**: Organized code structure
- **Scalability Considerations**: How to grow the app

${depthInstructions}

${optionalSections}

**IMPORTANT REQUIREMENTS:**
- Generate AT LEAST 15 screens (aim for 20-25 for complex apps)
- Include ALL user flows, not just happy paths
- Consider different user roles and their unique needs
- Think beyond MVP - design for production scalability
- Be specific and actionable in all recommendations
- Use clear, professional formatting with emojis for sections

**OUTPUT FORMAT:**
Structure your response with clear section headers and bullet points. Be comprehensive but concise. Focus on actionable, implementable recommendations.`;
  }

  /**
   * Get tool-specific context for the prompt
   */
  private static getToolSpecificContext(toolId: RAGTool): string {
    const toolProfile = getRAGToolProfile(toolId);
    
    return `
**Selected Development Tool:** ${toolProfile.name}
- **Category**: ${toolProfile.category}
- **Complexity**: ${toolProfile.complexity}
- **Best For**: ${toolProfile.bestFor.join(', ')}
- **Platforms**: ${toolProfile.platforms.join(', ')}

**Tool-Specific Considerations:**
- Optimize recommendations for ${toolProfile.name}'s strengths
- Consider ${toolProfile.category} tool limitations and capabilities
- Align architecture suggestions with ${toolProfile.name} best practices
- Include ${toolProfile.name}-specific implementation notes where relevant
`;
  }

  /**
   * Get depth-specific instructions
   */
  private static getDepthInstructions(depth: 'mvp' | 'advanced' | 'production'): string {
    switch (depth) {
      case 'mvp':
        return `
**MVP FOCUS:**
- Prioritize core functionality screens
- Include essential user flows
- Basic error handling and states
- Minimum viable feature set
- Focus on user validation and feedback`;

      case 'advanced':
        return `
**ADVANCED FOCUS:**
- Comprehensive feature set
- Advanced user roles and permissions
- Detailed state management
- Performance optimization considerations
- Integration with multiple services
- Advanced UI/UX patterns`;

      case 'production':
        return `
**PRODUCTION-READY FOCUS:**
- Enterprise-level scalability
- Comprehensive security considerations
- Advanced monitoring and analytics
- Multi-tenant architecture (if applicable)
- Disaster recovery and backup strategies
- Performance optimization at scale
- Compliance and regulatory considerations`;

      default:
        return '';
    }
  }

  /**
   * Get optional sections based on configuration
   */
  private static getOptionalSections(config: UniversalPromptConfig): string {
    const sections = [];

    if (config.includeUIComponents) {
      sections.push(`
## 9. 🎨 **UI COMPONENT LIBRARY**
- **Reusable Components**: Buttons, forms, cards, lists
- **Layout Components**: Headers, footers, sidebars
- **Interactive Elements**: Dropdowns, toggles, sliders
- **Data Display**: Tables, charts, graphs
- **Feedback Components**: Toasts, alerts, progress bars`);
    }

    if (config.includeBackendModels) {
      sections.push(`
## 10. 🔧 **BACKEND ARCHITECTURE**
- **API Design**: RESTful endpoints or GraphQL schema
- **Database Schema**: Tables, indexes, relationships
- **Authentication System**: JWT, sessions, OAuth
- **File Storage**: Upload handling, CDN integration
- **Caching Strategy**: Redis, in-memory caching
- **Background Jobs**: Queue processing, scheduled tasks`);
    }

    return sections.join('\n');
  }
}

/**
 * Default configuration for different app types
 */
export const DEFAULT_CONFIGS: Record<AppType, UniversalPromptConfig> = {
  'web-app': {
    includeErrorStates: true,
    includeBackendModels: true,
    includeUIComponents: true,
    includeModalsPopups: true,
    appDepth: 'advanced',
    appType: 'web'
  },
  'mobile-app': {
    includeErrorStates: true,
    includeBackendModels: true,
    includeUIComponents: true,
    includeModalsPopups: true,
    appDepth: 'advanced',
    appType: 'mobile'
  },
  'saas-tool': {
    includeErrorStates: true,
    includeBackendModels: true,
    includeUIComponents: true,
    includeModalsPopups: true,
    appDepth: 'production',
    appType: 'web'
  },
  'chrome-extension': {
    includeErrorStates: true,
    includeBackendModels: false,
    includeUIComponents: true,
    includeModalsPopups: true,
    appDepth: 'advanced',
    appType: 'web'
  },
  'ai-app': {
    includeErrorStates: true,
    includeBackendModels: true,
    includeUIComponents: true,
    includeModalsPopups: true,
    appDepth: 'production',
    appType: 'web'
  }
};
