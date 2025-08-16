"use client"
import React from 'react';
import { authClient } from '../app/auth-client';

// Use the better-auth provider
const AuthProvider = ({children}:{children:React.ReactNode}) => {
    return (
        <authClient.Provider>
            {children}
        </authClient.Provider>
    );
}

export default AuthProvider;
