import React from "react";
import AdDemo from "@/app/components/adds/google/AdDemo";
import { getAdBySlot } from "@/app/components/adds/google/AdUtils";
import { isDevelopment, isProduction } from "@/lib/config/environment";

export default function TestAdsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AdSense Development System Test</h1>
      
      {/* Environment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold mb-2">Environment Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
          </div>
          <div>
            <strong>isDevelopment():</strong> {isDevelopment().toString()}
          </div>
          <div>
            <strong>isProduction():</strong> {isProduction().toString()}
          </div>
          <div>
            <strong>Will Show:</strong> {isDevelopment() ? "Placeholders" : "Real Ads"}
          </div>
        </div>
      </div>

      {/* Test different ad types */}
      <div className="space-y-8">
        {/* Header Ads */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Header Ads</h2>
          <div className="space-y-4">
            <AdDemo slotNumber={10} title="Dashboard Header Ad" />
            <AdDemo slotNumber={20} title="Blog List Header Ad" />
            <AdDemo slotNumber={30} title="Launch Header Ad" />
          </div>
        </section>

        {/* Sidebar Ads */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Sidebar Ads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdDemo slotNumber={11} title="Dashboard Sidebar Ad" />
            <AdDemo slotNumber={31} title="Launch Sidebar Ad" />
            <AdDemo slotNumber={51} title="Submit App Sidebar Ad" />
            <AdDemo slotNumber={53} title="Submit Blog Sidebar Ad" />
          </div>
        </section>

        {/* Content Ads */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Content Ads</h2>
          <div className="space-y-4">
            <AdDemo slotNumber={1} title="Blog Content Ad (1st H2)" />
            <AdDemo slotNumber={2} title="Blog Content Ad (3rd H2)" />
            <AdDemo slotNumber={3} title="Blog Content Ad (3rd H2)" />
          </div>
        </section>



        {/* Submit Page Ads */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Submit Page Ads</h2>
          <div className="space-y-4">
            <AdDemo slotNumber={50} title="Submit App Header Ad" />
            <AdDemo slotNumber={52} title="Submit Blog Header Ad" />
          </div>
        </section>
      </div>

      {/* Instructions */}
      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How to Test</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Development Mode:</strong> You should see styled placeholders with slot information.</p>
          <p><strong>Production Mode:</strong> You should see real AdSense ads (after consent).</p>
          <p><strong>To switch environments:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Development: <code>npm run dev</code></li>
            <li>Production: <code>npm run build && npm start</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
} 