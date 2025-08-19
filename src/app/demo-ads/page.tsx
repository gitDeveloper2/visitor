import React from "react";
import AdSlot from "@/app/components/adds/google/AdSlot";
import { isDevelopment, isProduction } from "@/lib/config/environment";

export default function DemoAdsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ad Placeholder Demo</h1>
      
      {/* Environment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold mb-2">Current Environment</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</div>
          <div><strong>isDevelopment():</strong> {isDevelopment().toString()}</div>
          <div><strong>isProduction():</strong> {isProduction().toString()}</div>
          <div><strong>Showing:</strong> {isDevelopment() ? "Placeholders" : "Real Ads"}</div>
        </div>
      </div>

      {/* Simulate Dashboard Layout */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Dashboard Layout Simulation</h2>
        
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Dashboard Header Ad (Slot 10)</h3>
              <div className="border-2 border-dashed border-blue-300 p-2 rounded">
                <AdSlot slot={10} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Main Content Area</h3>
              <p>This is where your dashboard content would go...</p>
            </div>
          </div>
          
          {/* Sidebar - Removed for one ad per page policy */}
          <div className="w-80 bg-white p-4 rounded-lg h-fit">
            <h3 className="font-semibold mb-2">Sidebar (No Ad)</h3>
            <div className="border-2 border-dashed border-gray-300 p-2 rounded text-gray-500 text-center">
              Sidebar ad removed - one ad per page policy
            </div>
          </div>
        </div>
      </div>

      {/* Simulate Blog Layout */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Blog List Layout Simulation</h2>
        
        <div className="bg-white p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Blog List Header Ad (Slot 20)</h3>
          <div className="border-2 border-dashed border-purple-300 p-2 rounded">
            <AdSlot slot={20} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Blog List Content</h3>
          <p>This is where your blog list would go...</p>
        </div>
        

      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How This Works</h2>
        <div className="space-y-2 text-sm">
          <p><strong>✅ Same Location:</strong> Placeholders appear in exactly the same spots as real ads</p>
          <p><strong>✅ Same Styling:</strong> They inherit the same CSS styles and positioning</p>
          <p><strong>✅ Auto Updates:</strong> Change slot IDs in AdRegistry.tsx and placeholders update automatically</p>
          <p><strong>✅ Environment Aware:</strong> Development shows placeholders, production shows real ads</p>
        </div>
        
        <div className="mt-4 p-4 bg-white rounded border">
          <h3 className="font-semibold mb-2">To Test:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Development: <code>npm run dev</code> → See placeholders</li>
            <li>Production: <code>npm run build && npm start</code> → See real ads</li>
            <li>Change slot ID in AdRegistry.tsx → Placeholder updates automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 