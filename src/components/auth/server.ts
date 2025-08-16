// Server-side authentication utilities
// This file should only be imported in server components

export { 
  getServerSession, 
  isAuthenticated, 
  hasRole, 
  isAdmin 
} from '@/lib/auth'; 