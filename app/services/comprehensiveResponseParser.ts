import { MVPWizardData } from '@/types/ideaforge';

/**
 * Comprehensive Response Parser Service
 * Parses the Universal Prompt Template AI responses to extract structured data
 * Handles screens, flows, roles, data models, modals, states, and integrations
 */

export interface ParsedAppBlueprint {
  screens: ParsedScreen[];
  userRoles: ParsedUserRole[];
  dataModels: ParsedDataModel[];
  modals: ParsedModal[];
  states: ParsedAppState[];
  integrations: ParsedIntegration[];
  architecture: ParsedArchitecture;
  navigation: ParsedNavigation;
  metadata: {
    totalScreens: number;
    complexity: string;
    estimatedDevTime: string;
    confidence: number;
  };
}

export interface ParsedScreen {
  name: string;
  type: 'main' | 'sub' | 'onboarding' | 'auth' | 'admin' | 'error' | 'loading' | 'empty';
  description: string;
  userRoles: string[];
  components: string[];
  dataRequired: string[];
  parentScreen?: string;
  childScreens: string[];
  priority: number;
}

export interface ParsedUserRole {
  name: string;
  description: string;
  permissions: string[];
  accessibleScreens: string[];
  restrictions: string[];
}

export interface ParsedDataModel {
  name: string;
  description: string;
  fields: ModelField[];
  relationships: ModelRelationship[];
  usedInScreens: string[];
}

export interface ModelField {
  name: string;
  type: string;
  required: boolean;
  description: string;
  validation?: string;
}

export interface ModelRelationship {
  type: 'oneToOne' | 'oneToMany' | 'manyToMany';
  relatedModel: string;
  description: string;
  foreignKey?: string;
}

export interface ParsedModal {
  name: string;
  type: 'dialog' | 'overlay' | 'confirmation' | 'form' | 'media';
  triggerScreens: string[];
  purpose: string;
  components: string[];
}

export interface ParsedAppState {
  name: string;
  type: 'empty' | 'loading' | 'error' | 'success' | 'offline' | 'maintenance';
  affectedScreens: string[];
  userExperience: string;
  fallbackAction: string;
}

export interface ParsedIntegration {
  name: string;
  type: 'auth' | 'storage' | 'payment' | 'notification' | 'analytics' | 'social' | 'ai';
  purpose: string;
  affectedScreens: string[];
  implementation: string;
}

export interface ParsedArchitecture {
  pattern: string;
  reasoning: string;
  folderStructure: string[];
  scalabilityNotes: string[];
}

export interface ParsedNavigation {
  structure: string;
  routes: NavigationRoute[];
  flowChart: string[];
}

export interface NavigationRoute {
  path: string;
  screen: string;
  requiresAuth: boolean;
  allowedRoles: string[];
  parentRoute?: string;
}

export class ComprehensiveResponseParser {
  /**
   * Parse the complete AI response from Universal Prompt Template
   */
  static parseResponse(aiResponse: string, wizardData: MVPWizardData): ParsedAppBlueprint {
    try {
      const screens = this.extractScreens(aiResponse);
      const userRoles = this.extractUserRoles(aiResponse);
      const dataModels = this.extractDataModels(aiResponse);
      const modals = this.extractModals(aiResponse);
      const states = this.extractStates(aiResponse);
      const integrations = this.extractIntegrations(aiResponse);
      const architecture = this.extractArchitecture(aiResponse);
      const navigation = this.extractNavigation(aiResponse, screens);

      return {
        screens,
        userRoles,
        dataModels,
        modals,
        states,
        integrations,
        architecture,
        navigation,
        metadata: {
          totalScreens: screens.length,
          complexity: this.determineComplexity(screens.length, userRoles.length, dataModels.length),
          estimatedDevTime: this.estimateDevTime(screens.length, dataModels.length),
          confidence: this.calculateConfidence(aiResponse, screens.length)
        }
      };
    } catch (error) {
      console.error('Failed to parse comprehensive response:', error);
      return this.createFallbackBlueprint(aiResponse, wizardData);
    }
  }

  /**
   * Extract screens from AI response
   */
  private static extractScreens(response: string): ParsedScreen[] {
    const screens: ParsedScreen[] = [];
    
    // Look for the screens section
    const screenSection = this.extractSection(response, 'SCREENS LIST', 'DETAILED PAGE FLOW');
    
    if (screenSection) {
      // Extract different categories of screens
      const coreScreens = this.extractScreenCategory(screenSection, 'Core Screens', 'main');
      const authScreens = this.extractScreenCategory(screenSection, 'Authentication Flow', 'auth');
      const onboardingScreens = this.extractScreenCategory(screenSection, 'Onboarding', 'onboarding');
      const adminScreens = this.extractScreenCategory(screenSection, 'Administrative', 'admin');
      const errorScreens = this.extractScreenCategory(screenSection, 'Edge Cases', 'error');
      const emptyScreens = this.extractScreenCategory(screenSection, 'Empty States', 'empty');
      const loadingScreens = this.extractScreenCategory(screenSection, 'Loading States', 'loading');

      screens.push(...coreScreens, ...authScreens, ...onboardingScreens, ...adminScreens, ...errorScreens, ...emptyScreens, ...loadingScreens);
    }

    // If no screens found, create comprehensive default set
    if (screens.length === 0) {
      screens.push(...this.createDefaultScreenSet());
    }

    return screens;
  }

  /**
   * Extract screens from a specific category
   */
  private static extractScreenCategory(text: string, categoryName: string, type: ParsedScreen['type']): ParsedScreen[] {
    const screens: ParsedScreen[] = [];
    const categoryRegex = new RegExp(`\\*\\*${categoryName}\\*\\*:?([\\s\\S]*?)(?=\\*\\*[^*]+\\*\\*|$)`, 'i');
    const categoryMatch = text.match(categoryRegex);

    if (categoryMatch && categoryMatch[1]) {
      const categoryText = categoryMatch[1];
      const screenMatches = categoryText.match(/[-*•]\s*\*\*(.*?)\*\*:?\s*(.*?)(?=\n[-*•]|\n\n|$)/g);

      if (screenMatches) {
        screenMatches.forEach((match, index) => {
          const nameMatch = match.match(/\*\*(.*?)\*\*/);
          const descMatch = match.replace(/\*\*(.*?)\*\*:?\s*/, '').trim();

          if (nameMatch && nameMatch[1]) {
            screens.push({
              name: nameMatch[1].trim(),
              type,
              description: descMatch || `${type} screen`,
              userRoles: this.inferUserRoles(nameMatch[1], type),
              components: this.inferComponents(nameMatch[1], descMatch),
              dataRequired: this.inferDataRequirements(nameMatch[1], descMatch),
              childScreens: [],
              priority: this.calculateScreenPriority(type, index)
            });
          }
        });
      }
    }

    return screens;
  }

  /**
   * Extract user roles from AI response
   */
  private static extractUserRoles(response: string): ParsedUserRole[] {
    const roles: ParsedUserRole[] = [];
    const roleSection = this.extractSection(response, 'USER ROLES', 'COMPREHENSIVE DATA MODELS');

    if (roleSection) {
      const roleMatches = roleSection.match(/[-*•]\s*\*\*(.*?)\*\*:?\s*(.*?)(?=\n[-*•]|\n\n|$)/g);

      if (roleMatches) {
        roleMatches.forEach(match => {
          const nameMatch = match.match(/\*\*(.*?)\*\*/);
          const descMatch = match.replace(/\*\*(.*?)\*\*:?\s*/, '').trim();

          if (nameMatch && nameMatch[1]) {
            roles.push({
              name: nameMatch[1].trim(),
              description: descMatch || 'User role',
              permissions: this.inferPermissions(nameMatch[1]),
              accessibleScreens: this.inferAccessibleScreens(nameMatch[1]),
              restrictions: this.inferRestrictions(nameMatch[1])
            });
          }
        });
      }
    }

    // Ensure we have at least basic roles
    if (roles.length === 0) {
      roles.push(
        {
          name: 'Guest',
          description: 'Unauthenticated user',
          permissions: ['view_public'],
          accessibleScreens: ['Landing Page', 'Login', 'Register'],
          restrictions: ['no_data_access']
        },
        {
          name: 'User',
          description: 'Authenticated user',
          permissions: ['view_own_data', 'edit_own_data'],
          accessibleScreens: ['Dashboard', 'Profile', 'Settings'],
          restrictions: ['no_admin_access']
        },
        {
          name: 'Admin',
          description: 'Administrator',
          permissions: ['view_all_data', 'edit_all_data', 'manage_users'],
          accessibleScreens: ['Admin Dashboard', 'User Management'],
          restrictions: []
        }
      );
    }

    return roles;
  }

  /**
   * Extract data models from AI response
   */
  private static extractDataModels(response: string): ParsedDataModel[] {
    const models: ParsedDataModel[] = [];
    const modelSection = this.extractSection(response, 'COMPREHENSIVE DATA MODELS', 'MODALS');

    if (modelSection) {
      const modelMatches = modelSection.match(/[-*•]\s*\*\*(.*?)\*\*:?\s*(.*?)(?=\n[-*•]|\n\n|$)/g);

      if (modelMatches) {
        modelMatches.forEach(match => {
          const nameMatch = match.match(/\*\*(.*?)\*\*/);
          const descMatch = match.replace(/\*\*(.*?)\*\*:?\s*/, '').trim();

          if (nameMatch && nameMatch[1]) {
            models.push({
              name: nameMatch[1].trim(),
              description: descMatch || 'Data model',
              fields: this.inferModelFields(nameMatch[1]),
              relationships: this.inferModelRelationships(nameMatch[1]),
              usedInScreens: this.inferModelUsage(nameMatch[1])
            });
          }
        });
      }
    }

    // Ensure we have basic models
    if (models.length === 0) {
      models.push(
        {
          name: 'User',
          description: 'User account information',
          fields: [
            { name: 'id', type: 'string', required: true, description: 'Unique identifier' },
            { name: 'email', type: 'string', required: true, description: 'User email address' },
            { name: 'name', type: 'string', required: true, description: 'User display name' },
            { name: 'createdAt', type: 'datetime', required: true, description: 'Account creation date' }
          ],
          relationships: [],
          usedInScreens: ['Profile', 'Settings', 'Dashboard']
        }
      );
    }

    return models;
  }

  /**
   * Extract modals from AI response
   */
  private static extractModals(response: string): ParsedModal[] {
    const modals: ParsedModal[] = [];
    const modalSection = this.extractSection(response, 'MODALS', 'STATES');

    if (modalSection) {
      const modalMatches = modalSection.match(/[-*•]\s*\*\*(.*?)\*\*:?\s*(.*?)(?=\n[-*•]|\n\n|$)/g);

      if (modalMatches) {
        modalMatches.forEach(match => {
          const nameMatch = match.match(/\*\*(.*?)\*\*/);
          const descMatch = match.replace(/\*\*(.*?)\*\*:?\s*/, '').trim();

          if (nameMatch && nameMatch[1]) {
            modals.push({
              name: nameMatch[1].trim(),
              type: this.inferModalType(nameMatch[1]),
              triggerScreens: this.inferModalTriggers(nameMatch[1]),
              purpose: descMatch || 'Modal dialog',
              components: this.inferModalComponents(nameMatch[1])
            });
          }
        });
      }
    }

    return modals;
  }

  /**
   * Extract app states from AI response
   */
  private static extractStates(response: string): ParsedAppState[] {
    const states: ParsedAppState[] = [];
    const stateSection = this.extractSection(response, 'STATES', 'THIRD-PARTY INTEGRATIONS');

    if (stateSection) {
      const stateMatches = stateSection.match(/[-*•]\s*\*\*(.*?)\*\*:?\s*(.*?)(?=\n[-*•]|\n\n|$)/g);

      if (stateMatches) {
        stateMatches.forEach(match => {
          const nameMatch = match.match(/\*\*(.*?)\*\*/);
          const descMatch = match.replace(/\*\*(.*?)\*\*:?\s*/, '').trim();

          if (nameMatch && nameMatch[1]) {
            states.push({
              name: nameMatch[1].trim(),
              type: this.inferStateType(nameMatch[1]),
              affectedScreens: this.inferStateScreens(nameMatch[1]),
              userExperience: descMatch || 'State description',
              fallbackAction: this.inferFallbackAction(nameMatch[1])
            });
          }
        });
      }
    }

    return states;
  }

  /**
   * Extract integrations from AI response
   */
  private static extractIntegrations(response: string): ParsedIntegration[] {
    const integrations: ParsedIntegration[] = [];
    const integrationSection = this.extractSection(response, 'THIRD-PARTY INTEGRATIONS', 'ARCHITECTURE PATTERN');

    if (integrationSection) {
      const integrationMatches = integrationSection.match(/[-*•]\s*\*\*(.*?)\*\*:?\s*(.*?)(?=\n[-*•]|\n\n|$)/g);

      if (integrationMatches) {
        integrationMatches.forEach(match => {
          const nameMatch = match.match(/\*\*(.*?)\*\*/);
          const descMatch = match.replace(/\*\*(.*?)\*\*:?\s*/, '').trim();

          if (nameMatch && nameMatch[1]) {
            integrations.push({
              name: nameMatch[1].trim(),
              type: this.inferIntegrationType(nameMatch[1]),
              purpose: descMatch || 'Integration service',
              affectedScreens: this.inferIntegrationScreens(nameMatch[1]),
              implementation: this.inferImplementationDetails(nameMatch[1])
            });
          }
        });
      }
    }

    return integrations;
  }

  /**
   * Extract architecture information from AI response
   */
  private static extractArchitecture(response: string): ParsedArchitecture {
    const archSection = this.extractSection(response, 'ARCHITECTURE PATTERN', '');
    
    let pattern = 'MVC';
    let reasoning = 'Standard web application architecture';
    const folderStructure: string[] = [];
    const scalabilityNotes: string[] = [];

    if (archSection) {
      const patternMatch = archSection.match(/\*\*Pattern Choice\*\*:?\s*(.*?)(?=\n|$)/i);
      if (patternMatch) pattern = patternMatch[1].trim();

      const reasoningMatch = archSection.match(/\*\*Reasoning\*\*:?\s*(.*?)(?=\n\*\*|$)/i);
      if (reasoningMatch) reasoning = reasoningMatch[1].trim();
    }

    return {
      pattern,
      reasoning,
      folderStructure: folderStructure.length > 0 ? folderStructure : [
        'src/',
        'src/components/',
        'src/pages/',
        'src/services/',
        'src/types/',
        'src/utils/'
      ],
      scalabilityNotes: scalabilityNotes.length > 0 ? scalabilityNotes : [
        'Modular component structure',
        'Separation of concerns',
        'Scalable service layer'
      ]
    };
  }

  /**
   * Extract navigation structure from AI response
   */
  private static extractNavigation(response: string, screens: ParsedScreen[]): ParsedNavigation {
    const navSection = this.extractSection(response, 'DETAILED PAGE FLOW', 'USER ROLES');
    
    let structure = 'hierarchical';
    const routes: NavigationRoute[] = [];
    const flowChart: string[] = [];

    // Create routes from screens
    screens.forEach(screen => {
      routes.push({
        path: `/${screen.name.toLowerCase().replace(/\s+/g, '-')}`,
        screen: screen.name,
        requiresAuth: !screen.userRoles.includes('Guest'),
        allowedRoles: screen.userRoles,
        parentRoute: screen.parentScreen ? `/${screen.parentScreen.toLowerCase().replace(/\s+/g, '-')}` : undefined
      });
    });

    return {
      structure,
      routes,
      flowChart: flowChart.length > 0 ? flowChart : [
        'Landing → Login/Register',
        'Login → Dashboard',
        'Dashboard → Feature Pages',
        'Feature Pages → Detail Views'
      ]
    };
  }

  // Helper Methods

  /**
   * Extract a section from the response between two headers
   */
  private static extractSection(response: string, startHeader: string, endHeader: string): string | null {
    const startRegex = new RegExp(`##?\\s*\\d*\\.?\\s*🖥️?\\s*\\*\\*?${startHeader}`, 'i');
    const startMatch = response.search(startRegex);

    if (startMatch === -1) return null;

    let endMatch = response.length;
    if (endHeader) {
      const endRegex = new RegExp(`##?\\s*\\d*\\.?\\s*🧭?\\s*\\*\\*?${endHeader}`, 'i');
      const endSearch = response.search(endRegex);
      if (endSearch > startMatch) {
        endMatch = endSearch;
      }
    }

    return response.substring(startMatch, endMatch);
  }

  /**
   * Create default comprehensive screen set
   */
  private static createDefaultScreenSet(): ParsedScreen[] {
    return [
      // Core Screens
      { name: 'Landing Page', type: 'main', description: 'Main entry point and marketing page', userRoles: ['Guest'], components: ['Hero', 'Features', 'CTA'], dataRequired: [], childScreens: [], priority: 1 },
      { name: 'Dashboard', type: 'main', description: 'Main user interface after login', userRoles: ['User', 'Admin'], components: ['Navigation', 'Overview', 'QuickActions'], dataRequired: ['User'], childScreens: [], priority: 1 },
      { name: 'Profile', type: 'main', description: 'User profile management', userRoles: ['User', 'Admin'], components: ['ProfileForm', 'Avatar', 'Settings'], dataRequired: ['User'], childScreens: [], priority: 2 },

      // Authentication Flow
      { name: 'Login', type: 'auth', description: 'User authentication', userRoles: ['Guest'], components: ['LoginForm', 'SocialLogin'], dataRequired: [], childScreens: [], priority: 1 },
      { name: 'Register', type: 'auth', description: 'User registration', userRoles: ['Guest'], components: ['RegisterForm', 'Terms'], dataRequired: [], childScreens: [], priority: 1 },
      { name: 'Forgot Password', type: 'auth', description: 'Password recovery', userRoles: ['Guest'], components: ['EmailForm'], dataRequired: [], childScreens: [], priority: 3 },
      { name: 'Reset Password', type: 'auth', description: 'Password reset', userRoles: ['Guest'], components: ['PasswordForm'], dataRequired: [], childScreens: [], priority: 3 },

      // Onboarding
      { name: 'Welcome', type: 'onboarding', description: 'First-time user welcome', userRoles: ['User'], components: ['WelcomeMessage', 'NextSteps'], dataRequired: ['User'], childScreens: [], priority: 2 },
      { name: 'Setup', type: 'onboarding', description: 'Initial app configuration', userRoles: ['User'], components: ['SetupWizard', 'Preferences'], dataRequired: ['User'], childScreens: [], priority: 2 },

      // Administrative
      { name: 'Admin Dashboard', type: 'admin', description: 'Administrator control panel', userRoles: ['Admin'], components: ['AdminNav', 'Analytics', 'UserStats'], dataRequired: ['User', 'Analytics'], childScreens: [], priority: 3 },
      { name: 'User Management', type: 'admin', description: 'Manage user accounts', userRoles: ['Admin'], components: ['UserTable', 'UserActions'], dataRequired: ['User'], childScreens: [], priority: 3 },

      // Settings & Support
      { name: 'Settings', type: 'sub', description: 'App configuration and preferences', userRoles: ['User', 'Admin'], components: ['SettingsForm', 'Preferences'], dataRequired: ['User'], childScreens: [], priority: 2 },
      { name: 'Help', type: 'sub', description: 'User support and documentation', userRoles: ['User', 'Admin'], components: ['FAQ', 'ContactForm'], dataRequired: [], childScreens: [], priority: 3 },
      { name: 'About', type: 'sub', description: 'App information and credits', userRoles: ['Guest', 'User', 'Admin'], components: ['AppInfo', 'Credits'], dataRequired: [], childScreens: [], priority: 4 },

      // Error States
      { name: '404 Not Found', type: 'error', description: 'Page not found error', userRoles: ['Guest', 'User', 'Admin'], components: ['ErrorMessage', 'Navigation'], dataRequired: [], childScreens: [], priority: 4 },
      { name: '500 Server Error', type: 'error', description: 'Server error page', userRoles: ['Guest', 'User', 'Admin'], components: ['ErrorMessage', 'RetryButton'], dataRequired: [], childScreens: [], priority: 4 },
      { name: 'Maintenance', type: 'error', description: 'Maintenance mode page', userRoles: ['Guest', 'User', 'Admin'], components: ['MaintenanceMessage'], dataRequired: [], childScreens: [], priority: 4 },

      // Loading & Empty States
      { name: 'Loading', type: 'loading', description: 'Data loading state', userRoles: ['User', 'Admin'], components: ['LoadingSpinner', 'ProgressBar'], dataRequired: [], childScreens: [], priority: 4 },
      { name: 'No Data', type: 'empty', description: 'Empty state when no data available', userRoles: ['User', 'Admin'], components: ['EmptyMessage', 'ActionButton'], dataRequired: [], childScreens: [], priority: 4 }
    ];
  }

  /**
   * Infer user roles for a screen
   */
  private static inferUserRoles(screenName: string, type: ParsedScreen['type']): string[] {
    const name = screenName.toLowerCase();

    if (type === 'auth' || name.includes('landing') || name.includes('home')) {
      return ['Guest'];
    }
    if (name.includes('admin') || name.includes('manage')) {
      return ['Admin'];
    }
    if (type === 'error' || type === 'loading') {
      return ['Guest', 'User', 'Admin'];
    }

    return ['User', 'Admin'];
  }

  /**
   * Infer components for a screen
   */
  private static inferComponents(screenName: string, description: string): string[] {
    const name = screenName.toLowerCase();
    const desc = description.toLowerCase();
    const components: string[] = [];

    // Common components based on screen type
    if (name.includes('dashboard')) {
      components.push('Navigation', 'Overview', 'QuickActions', 'Stats');
    } else if (name.includes('profile')) {
      components.push('ProfileForm', 'Avatar', 'PersonalInfo');
    } else if (name.includes('login')) {
      components.push('LoginForm', 'SocialLogin', 'ForgotPassword');
    } else if (name.includes('register')) {
      components.push('RegisterForm', 'TermsCheckbox', 'EmailVerification');
    } else if (name.includes('settings')) {
      components.push('SettingsForm', 'Preferences', 'SecuritySettings');
    } else if (name.includes('admin')) {
      components.push('AdminNav', 'DataTable', 'Analytics');
    } else {
      components.push('Header', 'Content', 'Footer');
    }

    // Add components based on description
    if (desc.includes('form')) components.push('Form');
    if (desc.includes('table') || desc.includes('list')) components.push('DataTable');
    if (desc.includes('chart') || desc.includes('analytics')) components.push('Charts');
    if (desc.includes('search')) components.push('SearchBar');

    return components;
  }

  /**
   * Infer data requirements for a screen
   */
  private static inferDataRequirements(screenName: string, description: string): string[] {
    const name = screenName.toLowerCase();
    const desc = description.toLowerCase();
    const data: string[] = [];

    if (name.includes('profile') || name.includes('dashboard') || name.includes('settings')) {
      data.push('User');
    }
    if (name.includes('admin') || name.includes('manage')) {
      data.push('User', 'Analytics');
    }
    if (desc.includes('analytics') || desc.includes('stats')) {
      data.push('Analytics');
    }

    return data;
  }

  /**
   * Calculate screen priority
   */
  private static calculateScreenPriority(type: ParsedScreen['type'], index: number): number {
    const typePriority = {
      'main': 1,
      'auth': 1,
      'sub': 2,
      'onboarding': 2,
      'admin': 3,
      'error': 4,
      'loading': 4,
      'empty': 4
    };

    return typePriority[type] + Math.floor(index / 3);
  }

  /**
   * Infer permissions for a user role
   */
  private static inferPermissions(roleName: string): string[] {
    const name = roleName.toLowerCase();

    if (name.includes('admin')) {
      return ['view_all_data', 'edit_all_data', 'delete_data', 'manage_users', 'system_config'];
    }
    if (name.includes('moderator')) {
      return ['view_all_data', 'edit_content', 'moderate_users'];
    }
    if (name.includes('user')) {
      return ['view_own_data', 'edit_own_data', 'create_content'];
    }
    if (name.includes('guest')) {
      return ['view_public_data'];
    }

    return ['view_own_data'];
  }

  /**
   * Infer accessible screens for a user role
   */
  private static inferAccessibleScreens(roleName: string): string[] {
    const name = roleName.toLowerCase();

    if (name.includes('admin')) {
      return ['Dashboard', 'Admin Dashboard', 'User Management', 'Settings', 'Profile'];
    }
    if (name.includes('user')) {
      return ['Dashboard', 'Profile', 'Settings', 'Help'];
    }
    if (name.includes('guest')) {
      return ['Landing Page', 'Login', 'Register', 'About'];
    }

    return ['Dashboard'];
  }

  /**
   * Infer restrictions for a user role
   */
  private static inferRestrictions(roleName: string): string[] {
    const name = roleName.toLowerCase();

    if (name.includes('guest')) {
      return ['no_data_access', 'no_user_content', 'limited_features'];
    }
    if (name.includes('user')) {
      return ['no_admin_access', 'no_user_management'];
    }

    return [];
  }

  /**
   * Infer model fields for a data model
   */
  private static inferModelFields(modelName: string): ModelField[] {
    const name = modelName.toLowerCase();
    const baseFields: ModelField[] = [
      { name: 'id', type: 'string', required: true, description: 'Unique identifier' },
      { name: 'createdAt', type: 'datetime', required: true, description: 'Creation timestamp' },
      { name: 'updatedAt', type: 'datetime', required: true, description: 'Last update timestamp' }
    ];

    if (name.includes('user')) {
      return [
        ...baseFields,
        { name: 'email', type: 'string', required: true, description: 'User email address', validation: 'email' },
        { name: 'name', type: 'string', required: true, description: 'User display name' },
        { name: 'avatar', type: 'string', required: false, description: 'Profile picture URL' },
        { name: 'role', type: 'string', required: true, description: 'User role' }
      ];
    }

    if (name.includes('project') || name.includes('task')) {
      return [
        ...baseFields,
        { name: 'title', type: 'string', required: true, description: 'Title' },
        { name: 'description', type: 'text', required: false, description: 'Description' },
        { name: 'status', type: 'string', required: true, description: 'Current status' },
        { name: 'priority', type: 'string', required: false, description: 'Priority level' }
      ];
    }

    return baseFields;
  }

  /**
   * Infer model relationships
   */
  private static inferModelRelationships(modelName: string): ModelRelationship[] {
    const name = modelName.toLowerCase();
    const relationships: ModelRelationship[] = [];

    if (name.includes('user')) {
      relationships.push({
        type: 'oneToMany',
        relatedModel: 'Project',
        description: 'User can have multiple projects'
      });
    }

    if (name.includes('project')) {
      relationships.push(
        {
          type: 'oneToMany',
          relatedModel: 'User',
          description: 'Project belongs to a user'
        },
        {
          type: 'oneToMany',
          relatedModel: 'Task',
          description: 'Project can have multiple tasks'
        }
      );
    }

    return relationships;
  }

  /**
   * Infer model usage in screens
   */
  private static inferModelUsage(modelName: string): string[] {
    const name = modelName.toLowerCase();

    if (name.includes('user')) {
      return ['Profile', 'Settings', 'Dashboard', 'Admin Dashboard'];
    }
    if (name.includes('project')) {
      return ['Dashboard', 'Project List', 'Project Detail'];
    }
    if (name.includes('task')) {
      return ['Dashboard', 'Task List', 'Task Detail'];
    }

    return ['Dashboard'];
  }

  /**
   * Infer modal type
   */
  private static inferModalType(modalName: string): ParsedModal['type'] {
    const name = modalName.toLowerCase();

    if (name.includes('confirm') || name.includes('delete')) return 'confirmation';
    if (name.includes('form') || name.includes('edit') || name.includes('create')) return 'form';
    if (name.includes('image') || name.includes('video') || name.includes('media')) return 'media';
    if (name.includes('overlay')) return 'overlay';

    return 'dialog';
  }

  /**
   * Infer modal trigger screens
   */
  private static inferModalTriggers(modalName: string): string[] {
    const name = modalName.toLowerCase();

    if (name.includes('delete')) return ['Dashboard', 'Admin Dashboard'];
    if (name.includes('edit')) return ['Profile', 'Settings'];
    if (name.includes('create')) return ['Dashboard'];

    return ['Dashboard'];
  }

  /**
   * Infer modal components
   */
  private static inferModalComponents(modalName: string): string[] {
    const name = modalName.toLowerCase();

    if (name.includes('form')) return ['Form', 'SubmitButton', 'CancelButton'];
    if (name.includes('confirm')) return ['Message', 'ConfirmButton', 'CancelButton'];
    if (name.includes('media')) return ['MediaViewer', 'Controls', 'CloseButton'];

    return ['Content', 'CloseButton'];
  }

  /**
   * Infer state type
   */
  private static inferStateType(stateName: string): ParsedAppState['type'] {
    const name = stateName.toLowerCase();

    if (name.includes('empty') || name.includes('no data')) return 'empty';
    if (name.includes('loading') || name.includes('processing')) return 'loading';
    if (name.includes('error') || name.includes('failed')) return 'error';
    if (name.includes('success') || name.includes('complete')) return 'success';
    if (name.includes('offline')) return 'offline';
    if (name.includes('maintenance')) return 'maintenance';

    return 'loading';
  }

  /**
   * Infer state affected screens
   */
  private static inferStateScreens(stateName: string): string[] {
    const name = stateName.toLowerCase();

    if (name.includes('loading')) return ['Dashboard', 'Profile', 'Settings'];
    if (name.includes('error')) return ['Dashboard', 'Profile', 'Settings'];
    if (name.includes('empty')) return ['Dashboard', 'Project List', 'Task List'];

    return ['Dashboard'];
  }

  /**
   * Infer fallback action for state
   */
  private static inferFallbackAction(stateName: string): string {
    const name = stateName.toLowerCase();

    if (name.includes('error')) return 'Show retry button';
    if (name.includes('empty')) return 'Show create new button';
    if (name.includes('loading')) return 'Show loading spinner';
    if (name.includes('offline')) return 'Show cached content';

    return 'Show default message';
  }

  /**
   * Infer integration type
   */
  private static inferIntegrationType(integrationName: string): ParsedIntegration['type'] {
    const name = integrationName.toLowerCase();

    if (name.includes('auth') || name.includes('login') || name.includes('oauth')) return 'auth';
    if (name.includes('storage') || name.includes('file') || name.includes('upload')) return 'storage';
    if (name.includes('payment') || name.includes('stripe') || name.includes('paypal')) return 'payment';
    if (name.includes('notification') || name.includes('email') || name.includes('sms')) return 'notification';
    if (name.includes('analytics') || name.includes('tracking')) return 'analytics';
    if (name.includes('social') || name.includes('share')) return 'social';
    if (name.includes('ai') || name.includes('ml')) return 'ai';

    return 'analytics';
  }

  /**
   * Infer integration affected screens
   */
  private static inferIntegrationScreens(integrationName: string): string[] {
    const name = integrationName.toLowerCase();

    if (name.includes('auth')) return ['Login', 'Register'];
    if (name.includes('payment')) return ['Checkout', 'Billing'];
    if (name.includes('analytics')) return ['Dashboard', 'Admin Dashboard'];
    if (name.includes('notification')) return ['Settings', 'Profile'];

    return ['Dashboard'];
  }

  /**
   * Infer implementation details
   */
  private static inferImplementationDetails(integrationName: string): string {
    const name = integrationName.toLowerCase();

    if (name.includes('auth')) return 'OAuth 2.0 integration with JWT tokens';
    if (name.includes('payment')) return 'Secure payment processing with webhooks';
    if (name.includes('analytics')) return 'Event tracking and user behavior analysis';
    if (name.includes('notification')) return 'Push notifications and email delivery';

    return 'Third-party service integration';
  }

  /**
   * Determine complexity based on metrics
   */
  private static determineComplexity(screenCount: number, roleCount: number, modelCount: number): string {
    const score = screenCount + (roleCount * 2) + (modelCount * 3);

    if (score < 20) return 'Simple';
    if (score < 40) return 'Moderate';
    if (score < 60) return 'Complex';
    return 'Enterprise';
  }

  /**
   * Estimate development time
   */
  private static estimateDevTime(screenCount: number, modelCount: number): string {
    const weeks = Math.ceil((screenCount * 0.5) + (modelCount * 1.5));

    if (weeks < 4) return '2-4 weeks';
    if (weeks < 8) return '1-2 months';
    if (weeks < 16) return '2-4 months';
    return '4+ months';
  }

  /**
   * Calculate confidence score
   */
  private static calculateConfidence(response: string, screenCount: number): number {
    let confidence = 0.5;

    // Increase confidence based on response quality
    if (response.includes('##') || response.includes('**')) confidence += 0.1;
    if (response.length > 2000) confidence += 0.1;
    if (screenCount > 10) confidence += 0.1;
    if (response.includes('User Roles') || response.includes('Data Models')) confidence += 0.1;
    if (response.includes('Architecture') || response.includes('Integration')) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  /**
   * Create fallback blueprint when parsing fails
   */
  private static createFallbackBlueprint(response: string, wizardData: MVPWizardData): ParsedAppBlueprint {
    const screens = this.createDefaultScreenSet();

    return {
      screens,
      userRoles: [
        { name: 'User', description: 'Standard user', permissions: ['view_own_data'], accessibleScreens: ['Dashboard'], restrictions: [] }
      ],
      dataModels: [
        { name: 'User', description: 'User model', fields: [], relationships: [], usedInScreens: ['Profile'] }
      ],
      modals: [],
      states: [],
      integrations: [],
      architecture: {
        pattern: 'MVC',
        reasoning: 'Standard architecture',
        folderStructure: ['src/', 'src/components/'],
        scalabilityNotes: ['Modular structure']
      },
      navigation: {
        structure: 'hierarchical',
        routes: [],
        flowChart: ['Landing → Dashboard']
      },
      metadata: {
        totalScreens: screens.length,
        complexity: 'Moderate',
        estimatedDevTime: '1-2 months',
        confidence: 0.6
      }
    };
  }
}
