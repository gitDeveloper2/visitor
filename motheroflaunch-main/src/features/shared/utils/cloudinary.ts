  export async function uploadToCloudinary(
      file: File
    ): Promise<{ url: string; public_id: string } | null> {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned_preset");
      formData.append("folder", "tools/logos");
    
      const res = await fetch("https://api.cloudinary.com/v1_1/ddmsmepg6/image/upload", {
        method: "POST",
        body: formData,
      });
    
      if (!res.ok) {
        console.error("Failed to upload to Cloudinary");
        return null;
      }
    
      const data = await res.json();
      return {
        url: data.secure_url,
        public_id: data.public_id, // e.g. "tools/logos/abc123"
      };
    }
    