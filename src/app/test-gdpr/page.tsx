import React from "react";
import AdDemo from "@/app/components/adds/google/AdDemo";
import { useConsent } from "@/hooks/useConsent";
import { isDevelopment, isProduction } from "@/lib/config/environment";

export default function TestGDPRPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">GDPR Compliance Test - AdSense Placeholders</h1>
      
      {/* GDPR Information */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🇪🇺 European GDPR Compliance</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Assumption:</strong> You are a European user (as requested)</p>
          <p><strong>Requirement:</strong> Marketing consent is required to show ads</p>
          <p><strong>Behavior:</strong> Placeholders respect the same consent rules as real AdSense ads</p>
        </div>
      </div>

      {/* Consent Status */}
      <GDPRConsentStatus />

      {/* Test Different Consent States */}
      <div className="space-y-8">
        {/* Header Ads */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Header Ads - GDPR Test</h2>
          <div className="space-y-4">
            <AdDemo slotNumber={10} title="Dashboard Header Ad (Slot 10)" />
            <AdDemo slotNumber={20} title="Blog List Header Ad (Slot 20)" />
            <AdDemo slotNumber={30} title="Launch Header Ad (Slot 30)" />
          </div>
        </section>

        {/* Sidebar Ads */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Sidebar Ads - GDPR Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdDemo slotNumber={11} title="Dashboard Sidebar Ad (Slot 11)" />
            <AdDemo slotNumber={31} title="Launch Sidebar Ad (Slot 31)" />
            <AdDemo slotNumber={51} title="Submit App Sidebar Ad (Slot 51)" />
            <AdDemo slotNumber={53} title="Submit Blog Sidebar Ad (Slot 53)" />
          </div>
        </section>

        {/* Content Ads */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Content Ads - GDPR Test</h2>
          <div className="space-y-4">
            <AdDemo slotNumber={1} title="Blog Content Ad (Slot 1)" />
            <AdDemo slotNumber={2} title="Blog Content Ad (Slot 2)" />
            <AdDemo slotNumber={3} title="Blog Content Ad (Slot 3)" />
          </div>
        </section>
      </div>

      {/* Instructions */}
      <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How GDPR Compliance Works</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Development Mode:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>✅ <strong>With Consent:</strong> Shows styled placeholders</li>
            <li>❌ <strong>Without Consent:</strong> Shows "GDPR Consent Required" message</li>
            <li>🔒 <strong>European User:</strong> Assumed to be in Europe (GDPR applies)</li>
          </ul>
          
          <p className="mt-4"><strong>Production Mode:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>✅ <strong>With Consent:</strong> Shows real AdSense ads</li>
            <li>❌ <strong>Without Consent:</strong> Shows nothing (no tracking)</li>
            <li>🛡️ <strong>GDPR Compliant:</strong> No scripts load without consent</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Separate component for consent status
function GDPRConsentStatus() {
  const { hasConsent, hasConsented } = useConsent();
  const canShowAd = hasConsented && hasConsent('marketing');

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Current Consent Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">User Consent</h3>
          <div className="text-lg">
            {hasConsented ? (
              <span className="text-green-600 font-semibold">✅ Given</span>
            ) : (
              <span className="text-red-600 font-semibold">❌ Not Given</span>
            )}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">Marketing Consent</h3>
          <div className="text-lg">
            {hasConsent('marketing') ? (
              <span className="text-green-600 font-semibold">✅ Given</span>
            ) : (
              <span className="text-red-600 font-semibold">❌ Not Given</span>
            )}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-2">Can Show Ads</h3>
          <div className="text-lg">
            {canShowAd ? (
              <span className="text-green-600 font-semibold">✅ Yes</span>
            ) : (
              <span className="text-red-600 font-semibold">❌ No</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-white rounded border">
        <h3 className="font-semibold mb-2">Environment</h3>
        <div className="text-sm">
          <p><strong>Current Mode:</strong> {isDevelopment() ? "Development" : "Production"}</p>
          <p><strong>User Location:</strong> 🇪🇺 Europe (GDPR applies)</p>
          <p><strong>Behavior:</strong> {canShowAd ? 
            "Ads will display (consent given)" : 
            "Ads will not display (consent required)"
          }</p>
        </div>
      </div>
    </div>
  );
} 