// hooks/useFacebookSDK.ts
export const loadFacebookSDK = (): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(); // SSR guard
  
      // Already loaded
      if ((window as any).FB) return resolve();
  
      // Check if script already exists
      if (document.getElementById("facebook-jssdk")) {
        const existingScript = document.getElementById("facebook-jssdk");
        existingScript?.addEventListener("load", () => resolve());
        return;
      }
  
      // Load script dynamically
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
  
      script.onload = () => {
        (window as any).FB.init({
          xfbml: true,
          version: "v18.0",
        });
        resolve();
      };
  
      document.body.appendChild(script);
    });
  };
  