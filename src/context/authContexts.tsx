"use client"
import React from 'react';

// Simple provider that just passes through children
// Better Auth handles the authentication state automatically
const AuthProvider = ({children}:{children:React.ReactNode}) => {
    return <>{children}</>;
}

export default AuthProvider;
