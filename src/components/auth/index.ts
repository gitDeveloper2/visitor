// Server-side authentication components
// This file should only be imported in server components

export { ServerAuthGuard, withAuth } from './ServerAuthGuard';

// Re-export server-side auth utilities
export { 
  getServerSession, 
  isAuthenticated, 
  hasRole, 
  isAdmin 
} from './server'; 