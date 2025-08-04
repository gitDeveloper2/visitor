// components/CookieConsent.tsx
"use client"; // Ensures this component is client-side only

import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';

const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="user-consent"
      style={{
        background: "#333",
        color: "white",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px",
      }}
      buttonStyle={{
        backgroundColor: "#4CAF50",
        color: "white",
        fontSize: "14px",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
      }}
      declineButtonStyle={{
        backgroundColor: "#f44336", // Red color for the decline button
        color: "white",
        fontSize: "14px",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        marginLeft: "10px", // Add some space between the accept and decline buttons
      }}
      expires={365}
      onAccept={() => {
        // This will fire when the user accepts the cookies
        console.log("User has accepted cookies");
      }}
      onDecline={() => {
        // Add functionality when the user declines cookies
        console.log("Cookies declined");
      }}
    >
      This website uses cookies to enhance your experience. By using our website, you consent to the use of cookies.
      You can read more in our       <Link href="/policy" style={{ color: "#4CAF50" }}>
        privacy policy
      </Link>.
    </CookieConsent>
  );
};

export default CookieConsentBanner;
