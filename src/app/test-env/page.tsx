import React from "react";
import { isDevelopment, isProduction } from "@/lib/config/environment";

export default function TestEnvPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Environment Detection Test</h1>
      
      {/* Environment Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Environment Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-2">Raw NODE_ENV</h3>
            <div className="text-lg font-mono bg-gray-100 p-2 rounded">
              {process.env.NODE_ENV || 'undefined'}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-2">Environment Type</h3>
            <div className="text-lg">
              {process.env.NODE_ENV === 'development' ? (
                <span className="text-green-600 font-semibold">🟢 Development</span>
              ) : process.env.NODE_ENV === 'production' ? (
                <span className="text-red-600 font-semibold">🔴 Production</span>
              ) : (
                <span className="text-yellow-600 font-semibold">🟡 Unknown</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-2">isDevelopment()</h3>
            <div className="text-lg">
              {isDevelopment() ? (
                <span className="text-green-600 font-semibold">✅ True</span>
              ) : (
                <span className="text-red-600 font-semibold">❌ False</span>
              )}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-2">isProduction()</h3>
            <div className="text-lg">
              {isProduction() ? (
                <span className="text-green-600 font-semibold">✅ True</span>
              ) : (
                <span className="text-red-600 font-semibold">❌ False</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* What This Means */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">What This Means for AdSense</h2>
        
        {isDevelopment() ? (
          <div>
            <p className="text-green-700 mb-4">
              <strong>🎯 You're in Development Mode!</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-700">
              <li>✅ You'll see <strong>Ad Placeholders</strong> instead of real ads</li>
              <li>✅ No external AdSense scripts will load</li>
              <li>✅ Faster page loads</li>
              <li>✅ No tracking requests</li>
              <li>✅ Perfect for development and testing</li>
            </ul>
          </div>
        ) : (
          <div>
            <p className="text-red-700 mb-4">
              <strong>🚀 You're in Production Mode!</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-red-700">
              <li>✅ You'll see <strong>Real AdSense Ads</strong></li>
              <li>✅ Full tracking and revenue generation</li>
              <li>✅ GDPR compliance with consent</li>
              <li>✅ Optimized for performance</li>
            </ul>
          </div>
        )}
      </div>

      {/* How to Switch */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How to Switch Environments</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Development Mode</h3>
            <div className="bg-white p-3 rounded border font-mono text-sm">
              npm run dev
            </div>
            <p className="text-sm text-gray-600 mt-2">
              This sets NODE_ENV=development automatically
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Production Mode</h3>
            <div className="bg-white p-3 rounded border font-mono text-sm">
              npm run build<br/>
              npm start
            </div>
            <p className="text-sm text-gray-600 mt-2">
              This sets NODE_ENV=production automatically
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-white rounded border">
          <h3 className="font-semibold mb-2">No Manual Configuration Needed!</h3>
          <p className="text-sm text-gray-600">
            Next.js automatically sets NODE_ENV based on the command you run. 
            You don't need to create any .env files or set environment variables manually.
          </p>
        </div>
      </div>
    </div>
  );
} 