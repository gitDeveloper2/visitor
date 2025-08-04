import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { Reference, ReferenceTypes } from "../../../types/Bibliography";

interface ReferenceModalProps {
  onClose: () => void;
  onSubmit: (reference: Reference, addToBibliography: boolean) => void;
  referenceToEdit: Reference | null; // New prop for editing
  onUpdate: (updatedReference: Reference) => void; // Function to update an existing reference
}

const ReferenceModal: React.FC<ReferenceModalProps> = ({
  onClose,
  onSubmit,
  referenceToEdit,
  onUpdate,
}) => {
  const [linkText, setLinkText] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [publisher, setPublisher] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [type, setType] = useState<ReferenceTypes>("book");
  const [addToBibliography, setAddToBibliography] = useState(false);
  const [journalName, setJournalName] = useState<string>("");
  const [volume, setVolume] = useState<string>("");
  const [issue, setIssue] = useState<string>("");
  const [pageRange, setPageRange] = useState<string>("");
  const [doi, setDoi] = useState<string>("");
  const [websiteName, setWebsiteName] = useState<string>("");
  const [kind, setKind] = useState<string>("nofollow");
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKind(event.target.checked ? "dofollow" : "nofollow");
  };
  // Pre-fill the form if editing an existing reference
  useEffect(() => {
    if (referenceToEdit) {
      setLinkText(referenceToEdit.linkText)
      setFirstName(referenceToEdit.authorFirstName || "");
      setLastName(referenceToEdit.authorLastName || "");
      setTitle(referenceToEdit.title);
      setPublisher(referenceToEdit.publisher || "");
      setDate(referenceToEdit.date);
      setUrl(referenceToEdit.url || "");
      setType(referenceToEdit.type);
      setJournalName(referenceToEdit.journalName || "");
      setVolume(referenceToEdit.volume || "");
      setIssue(referenceToEdit.issue || "");
      setPageRange(referenceToEdit.pageRange || "");
      setDoi(referenceToEdit.doi || "");
      setWebsiteName(referenceToEdit.websiteName || "");
      setKind(referenceToEdit.kind || "");
    }
  }, [referenceToEdit]);
  

  const handleSubmit = () => {
    if (!title || !date || !type || !linkText) {
      alert("Please fill in all required fields.");
      return;
    }

    if (type === "book" && (!firstName || !lastName || !publisher)) {
      alert("Please provide the author's name and publisher for a book.");
      return;
    }

    if (type === "website" && (!url || !websiteName)) {
      alert("Please provide the URL and website name for a website.");
      return;
    }

    if (type === "journal" && (!journalName || !volume || !issue)) {
      alert("Please provide journal details (name, volume, issue).");
      return;
    }

    const referenceData: Reference = {
      linkText,
      id: referenceToEdit ? referenceToEdit.id : Date.now().toString(),
      authorFirstName: firstName || "",
      authorLastName: lastName || "",
      title,
      publisher: publisher || "",
      date,
      url: url || "",
      type,
      journalName: journalName || "",
      volume: volume || "",
      issue: issue || "",
      pageRange: pageRange || "",
      doi: doi || "",
      websiteName: websiteName || "",
      kind: kind || "",
    };

    if (referenceToEdit) {
      onUpdate(referenceData);
    } else {
      onSubmit(referenceData, addToBibliography);
    }
    onClose();
  };

  const renderUrlField = () => {
    if (type === "website" || type === "article") {
      return (
        <>
         
        <TextField
          label="URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          margin="normal"
          required={type === "website"}
        />


</>
        
      );
    }
    return null;
  };
  

  const renderJournalFields = () => {
    if (type === "article" || type === "journal") {
      return (
        <>
        
          <TextField
            label="Journal Name"
            value={journalName}
            onChange={(e) => setJournalName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Volume"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Issue"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Page Range"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="DOI"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            fullWidth
            margin="normal"
          />
        </>
      );
    }
    return null;
  };

  const renderWebsiteFields = () => {
    if (type === "website") {
      return (
        <TextField
          label="Website Name"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
          fullWidth
          margin="normal"
        />
      );
    }
    return null;
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        {referenceToEdit ? "Edit Reference" : "Insert Reference"}
      </DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={addToBibliography}
              onChange={() => setAddToBibliography(!addToBibliography)}
            />
          }
          label="Add to Bibliography"
        />
         <FormControlLabel
        control={
          <Checkbox
            checked={kind === "dofollow"}
            onChange={handleCheckboxChange}
          />
          }
          label={kind}
        />
        <TextField
          label="Link Text"
          type="text"
          value={linkText}
          onChange={(e) => setLinkText(e.target.value)}
          fullWidth
          margin="normal"
          required={true}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
          
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              required={type === "book" || type === "article"}
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
        </Grid>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Publisher"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          fullWidth
          required={type === "book" || type === "thesis"}
          margin="normal"
        />
        <TextField
          label="Date"                                                                               
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}                           
          fullWidth
          required
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <FormControl fullWidth margin="normal">
        <InputLabel>{type === "website" ? "Website Name" : "Publisher Name"}</InputLabel>

          <Select
            value={type}
            onChange={(e) => setType(e.target.value as ReferenceTypes)}
            label="Reference Type"
          >
            <MenuItem value="book">Book</MenuItem>
            <MenuItem value="article">Article</MenuItem>
            <MenuItem value="website">Website</MenuItem>
            <MenuItem value="journal">Journal</MenuItem>
            <MenuItem value="thesis">Thesis</MenuItem>
          </Select>
        </FormControl>
        {renderUrlField()}
        {renderJournalFields()}
        {renderWebsiteFields()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          {referenceToEdit ? "Update" : "Insert"}
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReferenceModal;
