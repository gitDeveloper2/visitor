import { Article, Build, Code, Insights, Devices, Widgets } from "@mui/icons-material";
import { FC } from "react";

interface Feature {
  Title: string;
  Description: string;
  icon: JSX.Element;
}

interface StyledIconProps {
  Icon: React.ElementType; // React component type
}

export const StyledIcon: FC<StyledIconProps> = ({ Icon }) => {
  return <Icon fontSize="large" color="primary" />;
};

export const FeaturesData: Feature[] = [
  {
    Title: "Programming Articles",
    Description: "Explore unique programming insights, covering a range of concepts and techniques.",
    icon: <StyledIcon Icon={Article} />,  // Icon representing articles
  },
  {
    Title: "In-Depth Articles",
    Description: "Guides covering a wide range of programming concepts and techniques.",
    icon: <StyledIcon Icon={Build} />,  // Build icon for hands-on tutorials
  },
  {
    Title: "Interesting Concepts",
    Description: "Discover intresting programming concetps like Zod enums and more.",
    icon: <StyledIcon Icon={Insights} />,  // Insights icon for trending topics
  },
  {
    Title: "Productivity Tools",
    Description: "Enhance your workflow with free tools like Pic2Map,npmstars,geotagging tool, Image Compressor, Resizer, and Cropper.",
    icon: <StyledIcon Icon={Widgets} />,  // Widgets icon for tools
  },
  {
    Title: "Stay Updated",
    Description: "Consistently refreshed content to keep you informed on programming.",
    icon: <StyledIcon Icon={Code} />,  // Code icon for programming updates
  },
];


export default FeaturesData;
