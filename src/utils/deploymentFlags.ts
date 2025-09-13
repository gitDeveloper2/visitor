/**
 * Deployment Flags System
 * Controls deployment order and feature availability during different deployment phases
 */

export interface DeploymentFlags {
  // Blog deployment phase
  blogDeploymentComplete: boolean;
  blogContentEnabled: boolean;
  
  // App launch phase
  appLaunchEnabled: boolean;
  votingSystemEnabled: boolean;
  launchPageEnabled: boolean;
  
  // Feature flags
  premiumFeaturesEnabled: boolean;
  adminPanelEnabled: boolean;
  
  // Maintenance mode
  maintenanceMode: boolean;
  maintenanceBanner: string | null;
}

export class DeploymentFlagService {
  private static flags: DeploymentFlags | null = null;

  /**
   * Get current deployment flags from environment variables
   */
  static getFlags(): DeploymentFlags {
    if (this.flags) {
      return this.flags;
    }

    this.flags = {
      // Blog deployment flags
      blogDeploymentComplete: process.env.BLOG_DEPLOYMENT_COMPLETE === 'true',
      blogContentEnabled: process.env.BLOG_CONTENT_ENABLED !== 'false', // Default true
      
      // App launch flags - dependent on blog deployment
      appLaunchEnabled: process.env.APP_LAUNCH_ENABLED === 'true' && 
                       process.env.BLOG_DEPLOYMENT_COMPLETE === 'true',
      votingSystemEnabled: process.env.VOTING_SYSTEM_ENABLED === 'true' && 
                          process.env.BLOG_DEPLOYMENT_COMPLETE === 'true',
      launchPageEnabled: process.env.LAUNCH_PAGE_ENABLED === 'true' && 
                        process.env.BLOG_DEPLOYMENT_COMPLETE === 'true',
      
      // Feature flags
      premiumFeaturesEnabled: process.env.PREMIUM_FEATURES_ENABLED !== 'false', // Default true
      adminPanelEnabled: process.env.ADMIN_PANEL_ENABLED !== 'false', // Default true
      
      // Maintenance
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
      maintenanceBanner: process.env.MAINTENANCE_BANNER || null,
    };

    return this.flags;
  }

  /**
   * Check if blog deployment is complete
   */
  static isBlogDeploymentComplete(): boolean {
    return this.getFlags().blogDeploymentComplete;
  }

  /**
   * Check if app launch is enabled (requires blog deployment complete)
   */
  static isAppLaunchEnabled(): boolean {
    return this.getFlags().appLaunchEnabled;
  }

  /**
   * Check if voting system is enabled
   */
  static isVotingSystemEnabled(): boolean {
    return this.getFlags().votingSystemEnabled;
  }

  /**
   * Check if launch page should be accessible
   */
  static isLaunchPageEnabled(): boolean {
    return this.getFlags().launchPageEnabled;
  }

  /**
   * Check if we're in maintenance mode
   */
  static isMaintenanceMode(): boolean {
    return this.getFlags().maintenanceMode;
  }

  /**
   * Get maintenance banner message
   */
  static getMaintenanceBanner(): string | null {
    return this.getFlags().maintenanceBanner;
  }

  /**
   * Reset cached flags (useful for testing or when env changes)
   */
  static resetFlags(): void {
    this.flags = null;
  }

  /**
   * Get deployment phase description
   */
  static getDeploymentPhase(): string {
    const flags = this.getFlags();
    
    if (flags.maintenanceMode) {
      return 'maintenance';
    }
    
    if (!flags.blogDeploymentComplete) {
      return 'blog-deployment';
    }
    
    if (flags.blogDeploymentComplete && !flags.appLaunchEnabled) {
      return 'blog-ready';
    }
    
    if (flags.appLaunchEnabled && !flags.votingSystemEnabled) {
      return 'app-launch-pending';
    }
    
    if (flags.appLaunchEnabled && flags.votingSystemEnabled) {
      return 'fully-operational';
    }
    
    return 'unknown';
  }

  /**
   * Get status message for current deployment phase
   */
  static getStatusMessage(): string {
    const phase = this.getDeploymentPhase();
    
    switch (phase) {
      case 'maintenance':
        return 'System is currently under maintenance. Please check back later.';
      case 'blog-deployment':
        return 'Blog content is being deployed. App launch features are temporarily unavailable.';
      case 'blog-ready':
        return 'Blog is ready. App launch system is preparing to come online.';
      case 'app-launch-pending':
        return 'App launch system is initializing. Voting will be available shortly.';
      case 'fully-operational':
        return 'All systems operational.';
      default:
        return 'System status unknown.';
    }
  }
}

/**
 * Deployment flag middleware for API routes
 */
export function withDeploymentFlags<T extends any[]>(
  handler: (...args: T) => Promise<Response>,
  requiredFlags: (keyof DeploymentFlags)[] = []
) {
  return async (...args: T): Promise<Response> => {
    const flags = DeploymentFlagService.getFlags();
    
    // Check maintenance mode first
    if (flags.maintenanceMode) {
      return new Response(
        JSON.stringify({
          error: 'System maintenance in progress',
          message: DeploymentFlagService.getMaintenanceBanner() || 'System is under maintenance',
          phase: 'maintenance'
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Check required flags
    for (const flagName of requiredFlags) {
      if (!flags[flagName]) {
        return new Response(
          JSON.stringify({
            error: 'Feature not available',
            message: `${flagName} is currently disabled`,
            phase: DeploymentFlagService.getDeploymentPhase(),
            statusMessage: DeploymentFlagService.getStatusMessage()
          }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    

    return handler(...args);
  };
}
