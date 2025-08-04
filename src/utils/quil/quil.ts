import Quill from "quill";
import icons from "@components/blots/icons";
import { ContextCardBlot } from "@components/blots/ContextCardBlot";
import { ImageBlot } from "@components/blots/ImageBlot";
import { ReferenceBlot } from "@components/blots/ReferenceBlot";
import { CustomLink } from "@components/blots/Link";

export const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    // [{ font: [] }],
    // [{ size: ["small", false, "large", "huge"] }],
    // [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    // [{ direction: "rtl" }],
    [{ align: [] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["link", 
      // "image", "video"
    ],
    ["context-card"], // Add custom button to toolbar
    ["clean"],
    ["generate-toc"], // Add the custom checkbox here
    ["switch-to-html", "save-content", "custom-image","reference"], // New custom buttons
    [{ custom: "word-count" }], // Custom placeholder for word count
    ["table"],
    
   

  
  ];



export const registerQuillIcons = () => {
  const QuillIcons = Quill.import("ui/icons");
  Object.keys(icons).forEach((key) => {
    QuillIcons[key] = icons[key];
  });
  Quill.register("formats/imageBlot", ImageBlot);

  Quill.register(ContextCardBlot, true);
  Quill.register(ReferenceBlot, true);

  const Parchment = Quill.import("parchment");
  const IdAttributor = new Parchment.Attributor("id", "id", {
    scope: Parchment.Scope.ANY,
  });
  const ClassAttributor = new Parchment.Attributor("class", "ql-class", {
    scope: Parchment.Scope.ANY,
  });

  Quill.register(IdAttributor, true);
  Quill.register(ClassAttributor, true);
  Quill.register(CustomLink, true);

};
