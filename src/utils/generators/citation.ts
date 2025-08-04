import { Reference } from "../../types/Bibliography";

export const formatAPAReference = (ref: Reference): string => {
    // Format author's name
    const authorFormatted =
      ref.authorLastName && ref.authorFirstName
        ? `${ref.authorLastName.charAt(0).toUpperCase() + ref.authorLastName.slice(1)}, ${ref.authorFirstName.charAt(0).toUpperCase()}`
        : "";
  
    // Extract and format the date
    const [year, month, day] = ref.date.split("-");
    const monthName = new Date(`${year}-${month}-01`).toLocaleString("default", {
      month: "long",
    });
    const dateFormatted = day
      ? `${monthName} ${parseInt(day, 10)}, ${year}`
      : year;
  
    // Initialize formatted reference
    let formattedReference = "";
  
    switch (ref.type) {
      case "book":
        formattedReference = [
          authorFormatted,
          `(${year})`,
          `${capitalize(ref.title)}`,
          ref.publisher,
        ]
          .filter(Boolean)
          .join(". ");
        break;
  
      case "article":
        formattedReference = [
          authorFormatted,
          `(${dateFormatted})`,
          `${capitalize(ref.title)}`,
          ref.journalName ? `*${ref.journalName}*` : "",
          [ref.volume, ref.issue ? `(${ref.issue})` : ""].filter(Boolean).join(""),
          ref.pageRange,
          ref.doi ? `https://doi.org/${ref.doi}` : ref.url ? `Retrieved from ${ref.url}` : "",
        ]
          .filter(Boolean)
          .join(". ");
        break;
  
      case "journal":
        formattedReference = [
          authorFormatted,
          `(${year})`,
          `${capitalize(ref.title)}`,
          ref.journalName ? `*${ref.journalName}*` : "",
          [ref.volume, ref.issue ? `(${ref.issue})` : ""].filter(Boolean).join(""),
          ref.pageRange,
          ref.doi ? `https://doi.org/${ref.doi}` : ref.url ? `Retrieved from ${ref.url}` : "",
        ]
          .filter(Boolean)
          .join(". ");
        break;
  
      case "thesis":
        formattedReference = [
          authorFormatted,
          `(${year})`,
          `${capitalize(ref.title)}`,
          ref.publisher ? `(Unpublished doctoral dissertation). ${ref.publisher}` : "(Unpublished doctoral dissertation)",
        ]
          .filter(Boolean)
          .join(". ");
        break;
  
      case "website":
        formattedReference = [
          authorFormatted,
          `(${dateFormatted})`,
          `${capitalize(ref.title)}`,
          ref.websiteName ? `*${ref.websiteName}*` : "",
          ref.url ? `Retrieved ${dateFormatted} from ${ref.url}` : "",
        ]
          .filter(Boolean)
          .join(". ");
        break;
  
      default:
        throw new Error(`Unsupported reference type: ${ref.type}`);
    }
  
    return formattedReference.trim();
  };

  // Helper function to capitalize the first letter of a string
const capitalize = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : "");


export const formatMLAReference = (ref: Reference): string => {
  // Format author's name as "First Name Last Name"
  const authorFormatted =
    ref.authorFirstName && ref.authorLastName
      ? `${ref.authorFirstName} ${ref.authorLastName}`
      : "";

  // Extract and format the date (e.g., "2025-01-25" -> "25 Jan. 2025")
  const [year, month, day] = ref.date.split("-");
  const monthName = new Date(`${year}-${month}-01`).toLocaleString("default", {
    month: "short",
  });
  const dateFormatted = day
    ? `${parseInt(day, 10)} ${monthName}. ${year}`
    : year;

  // Initialize formatted reference
  let formattedReference = "";

  switch (ref.type) {
    case "book":
      formattedReference = [
        authorFormatted,
        `"${capitalize(ref.title)}."`,
        ref.publisher,
        dateFormatted,
      ]
        .filter(Boolean)
        .join(" ");
      break;

    case "article":
      formattedReference = [
        authorFormatted,
        `"${capitalize(ref.title)}."`,
        ref.journalName ? `*${ref.journalName}*` : "",
        [ref.volume, ref.issue ? `no. ${ref.issue}` : ""].filter(Boolean).join(", "),
        ref.pageRange ? `pp. ${ref.pageRange}` : "",
        dateFormatted,
        ref.doi ? `https://doi.org/${ref.doi}` : ref.url ? ref.url : "",
      ]
        .filter(Boolean)
        .join(" ");
      break;

    case "journal":
      formattedReference = [
        authorFormatted,
        `"${capitalize(ref.title)}."`,
        ref.journalName ? `*${ref.journalName}*` : "",
        [ref.volume, ref.issue ? `no. ${ref.issue}` : ""].filter(Boolean).join(", "),
        ref.pageRange ? `pp. ${ref.pageRange}` : "",
        dateFormatted,
        ref.doi ? `https://doi.org/${ref.doi}` : ref.url ? ref.url : "",
      ]
        .filter(Boolean)
        .join(" ");
      break;

    case "thesis":
      formattedReference = [
        authorFormatted,
        `"${capitalize(ref.title)}."`,
        ref.publisher ? `${ref.publisher},` : "",
        dateFormatted,
      ]
        .filter(Boolean)
        .join(" ");
      break;

    case "website":
      formattedReference = [
        authorFormatted,
        `"${capitalize(ref.title)}."`,
        ref.websiteName ? `${ref.websiteName},` : "",
        dateFormatted,
        ref.url ? `Accessed ${dateFormatted}, ${ref.url}` : "",
      ]
        .filter(Boolean)
        .join(" ");
      break;

    default:
      throw new Error(`Unsupported reference type: ${ref.type}`);
  }

  return formattedReference.trim();
};


