import parse, {  DOMNode, Element } from "html-react-parser";
import { stripContentEditable, stripStyles } from "./stripAttributes";
import { addAds, addH1Ads, replaceCodeTags, replaceContextCard, replaceImgTags, replaceReferenceSpan } from "./tagReplacements";
import { insertAdMarkers, removeRelFromTOCLinks, wrapH2InSections } from "../HtmlStrings";
import { Dates, Metadata } from "../../../app/components/blog/BloogComponentContainer";
import MuiTable from "../../../app/components/blog/Table";
import { processTableNode } from "./processTableNode";
import MyAdComponent from "../../../app/components/adds/google/MyAdComponent";
export const replaceTags = (OGhtml: string,type?:"news"|"blog",metadata?:Metadata,author?:string,url?:string,dates?:Dates) => {
  
    let h2Count = 0;
    // const html=OGhtml
    const cleanHTML=removeRelFromTOCLinks(OGhtml)
    const markedHTML= wrapH2InSections(cleanHTML);
    let html=markedHTML;
    if(type=="blog"){
      html = insertAdMarkers(markedHTML, {
        skipFirst: 2,
        interval: 3,
        maxAds: 4,
        tagName: "h2", // optional if you stick with h2
      });
    }else{
      html = insertAdMarkers(markedHTML, {
        skipFirst: 0,
        interval: 3,
        maxAds: 2,
        tagName: "h2", // optional if you stick with h2
      });
    }
   
    

    return parse(html, {
      replace: (domNode) => {
        // If the node is relevant for `replaceQuilCodeTags`, preserve `class`
        const preserveClasses = domNode instanceof Element && 
          (domNode.name === "pre" ||domNode.name === "code" || domNode.name === "div");
  
        // Strip styles but preserve classes where needed
        domNode = stripStyles(domNode, preserveClasses);
        domNode = stripContentEditable(domNode);
        
  
        if (domNode instanceof Element) {

 
          const processedTable = processTableNode(domNode);
        if (processedTable) {
          return processedTable;
        }
         
          if (
            domNode.name === 'div' &&
            domNode.attribs &&
            typeof domNode.attribs["class"] === 'string' &&
            domNode.attribs["class"].includes("context-card")
          ) {
            return replaceContextCard(domNode); // Replace with MUI card
          }
          if (domNode.name === "code" || domNode.name === "div" || domNode.name === "pre") {
            // console.log("replaincg..",domNode.name)
            return replaceCodeTags(domNode);
          }
          if (domNode.name === "img") {
            return replaceImgTags(domNode);
          }
          if (type=="blog"&&domNode.name === "h1") {
            return addH1Ads(domNode, h2Count,metadata,author,url);
          }
          // if (domNode.name === "h2") {
          //   h2Count++;                                                  
          //   return addAds(domNode, h2Count);
          // }
         // Check for context-card div and replace it
         if(domNode.attribs["class"] === "context-card"){
        
         }
         
       
       
          return replaceReferenceSpan(domNode);
        }
           // Handle ad unit insertion for marker
           if (domNode.type === "comment" && domNode.data?.startsWith("AD_UNIT_")) {
            const adIndex = parseInt(domNode.data.replace("AD_UNIT_", ""), 10);
            return <MyAdComponent index={adIndex} />;
          }
        return domNode;
      },
    });
  };