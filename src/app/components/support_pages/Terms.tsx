"use client"
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { StyledSectionGrid } from '../layout/Spacing';

const TermsOfService: React.FC = () => {
  const theme = useTheme();

  return (
    <StyledSectionGrid theme={theme} y16 id='terms'>
      <div>
      <h1>Terms and Conditions</h1>

<h2>1. Acceptance of Terms</h2>
<p>
    By accessing or using Basicutils.com, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using our website.
</p>

<h2>2. Services Provided</h2>
<p>
    Basicutils.com provides two main types of resources:
</p>
<ul>
    <li><strong>Tools:</strong> Interactive tools for image processing, including:
        <ul>
            <li><strong>Pic2Map:</strong> Convert images into location-rich maps using GPS data from the image.</li>
            <li><strong>Image Compressor:</strong> Optimize images without losing quality.</li>
            <li><strong>Image Resizer:</strong> Adjust image dimensions to your preferences.</li>
            <li><strong>Image Cropper:</strong> Trim and crop images as needed.</li>
        </ul>
    </li>
    <li><strong>Articles:</strong> Informational content on programming topics aimed at helping developers and tech enthusiasts learn and grow.</li>
</ul>

<h2>3. User Responsibilities</h2>
<p>
    By using our services, you agree to:
</p>
<ul>
    <li>Provide accurate information where required, such as when submitting images or contacting us.</li>
    <li>Use the tools and content provided responsibly and in accordance with applicable laws.</li>
    <li>Refrain from redistributing or republishing articles or other content without prior permission.</li>
</ul>

<h2>4. Intellectual Property</h2>
<p>
    All content on Basicutils.com, including tools, articles, and designs, is the intellectual property of Basicutils unless otherwise stated. Unauthorized reproduction or distribution is prohibited.
</p>

<h2>5. Privacy Policy</h2>
<p>
    Please refer to our <a href="/privacypolicy">Privacy Policy</a> for information on how we collect, use, and protect your data.
</p>

<h2>6. User-Generated Content</h2>
<p>
    If you upload images or submit other content, you retain ownership but grant us the right to process the data as outlined in our Privacy Policy. You may optionally allow us to store uploaded images for public display as samples.
</p>

<h2>7. Termination of Use</h2>
<p>
    We reserve the right to terminate or suspend access to our services at any time, with or without notice, for violations of these Terms and Conditions or other reasons.
</p>

<h2>8. Liability Disclaimer</h2>
<p>
    Basicutils.com provides all services "as is" and does not guarantee uninterrupted or error-free operation. Specifically:
</p>
<ul>
    <li><strong>Tools:</strong> We are not responsible for any loss or damage resulting from the use of our tools, including data loss or technical failures.</li>
    <li><strong>Articles:</strong> The information provided in our articles is for informational purposes only and should not be considered professional advice. We are not liable for any consequences resulting from actions taken based on this information.</li>
</ul>

<h2>9. Governing Law</h2>
<p>
    These Terms and Conditions are governed by the laws of the applicable jurisdiction. Any disputes arising from the use of this website will be resolved in the courts of the same jurisdiction.
</p>

<h2>10. Changes to Terms</h2>
<p>
    We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page, and your continued use of Basicutils.com constitutes acceptance of the updated terms.
</p>

<h2>Contact Us</h2>
<p>
    If you have any questions or concerns about these Terms and Conditions, please <a href="/contactus">contact us</a> or email us at support@basicutils.com.
</p>
      </div>
    </StyledSectionGrid>
  );
}

export default TermsOfService;
