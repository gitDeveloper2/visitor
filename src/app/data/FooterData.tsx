import { Facebook, Instagram, LinkedIn, Twitter } from "@mui/icons-material";

interface Link {
  text: string;
  link: string;
  id: string;
}
export interface SocialMedia {
  text: string;
  path: string;
  icon: JSX.Element;
};

interface FooterDataSection {
  name: string;
  links?: Link[];
  socialMedia?: SocialMedia[];
}

interface FooterDataType {
  smallLogo: { path: string; alt: string };
  sections: FooterDataSection[];
}

const FooterData: FooterDataType = {
  smallLogo: { path: "logo.png", alt: "footer image" },
  sections: [
    {
      name: "Useful Links",
      links :[
        { text: "contact us", link: "/contactus", id: "contactus" },
        { text: "about us", link: "/aboutus", id: "aboutus" },
        { text: "privacy policy", link: "/policy", id: "policy" },
        { text: "Terms of Use", link: "/terms", id: "terms" },
        { text: "FAQs", link: "/faqs", id: "faqs" },
        { text: "Disclaimer", link: "/disclaimer", id: "disclaimer" },
        { text: "DMCA Policy", link: "/dcma-policy", id: "dcma" }
      ]
      
    },
    { name: "External Links" },
    { name: "More Info" },
    {
      name: "Social Media",
      socialMedia: [
        {
          text: "Facebook",
          path: "https://web.facebook.com/profile.php?id=61570388701322",
          icon: <Facebook  sx={{ color: 'text.primary' }}  />,
        },
        // {
        //   text: "Instagram",
        //   path: "https://www.instagram.com",
        //   icon: <Instagram color="primary" />,
        // },
        // {
        //   text: "LinkedIn",
        //   path: "https://www.linkedin.com/in/basicutilsofficial/",
        //   icon: <LinkedIn color="primary" />,
        // },
        {
          text: "Twitter",
          path: "https://x.com/BasicUtils",
          icon: <Twitter  sx={{ color: 'text.primary' }}  />,
        },
      ],
    },
  ],
};

export default FooterData;
