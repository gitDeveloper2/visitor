import { AddLocationAlt, Compress, Crop, Home, PersonPinCircle, ShapeLine, TrendingUp } from "@mui/icons-material";
import React from "react";
interface Links {
  home: LinkType;
  apps: LinkType[];
  tutorials:LinkType[]
}
interface LinkType {
  name: string;
  path: string;
  icon: JSX.Element;
  description?:string;
  stars?:number;
  starGazers?:number;
}

const iconStyles={
  width:'32px',
  height:'32px',
  color:"primary.main"
}

export const links: Links = {
  
  home: {
    name: "Home",
    path: "/",
    icon: <Home />,
    
  },
  apps: [
    {
      name: "NpmStars",
      path: "/npmstars",
      description: "View Package npm downloads and github stars sideby side",
      icon: <TrendingUp  sx={iconStyles}  />,
      stars:4.9,
      starGazers:600
    },
    {
      name: "Pic2Map",
      path: "/pic2map",
      description: "Convert images into location-rich maps.",
      icon: <PersonPinCircle  sx={iconStyles}  />,
      stars:4.9,
      starGazers:200
    },
    {
      name: "GeoTagger",
      path: "/geotagphotos",
      icon: <AddLocationAlt  sx={iconStyles}  />,
      description: "Optimize images without losing quality.",
      stars:4.9,
      starGazers:223
    },
    {
      name: "Image Compressor",
      path: "/imagecompressor",
      icon: <Compress   sx={{...iconStyles}}  />,
      description: "Optimize images without losing quality.",
      stars:4.5,
      starGazers:400
    },
    {
      name: "Image Resizer",
      path: "/imageresizer",
      icon: <ShapeLine  sx={iconStyles} />,
      description: "Easily adjust image dimensions.",
      stars:4.9,
      starGazers:209
    },
    {
      name: "Image Crop",
      path: "/imagecropper",
      icon: <Crop sx={iconStyles}  />,
      description: "Quickly trim your images.",
      stars:4.8,
      starGazers:192
    },
  ],
  tutorials:[ {
    name: "Prisma Self Relations",
    path: "/blog/prisma-self-relations",
    icon: <></>,
  },
  {
    name: "Github Workflow Dispatch",
    path: "/blog/Understanding_GitHub_Actions_Workflow_Dispatch",
    icon: <></>,
  },]
};
