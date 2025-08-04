import { useState } from "react";
import ReferenceModal from "./ReferenceModal";
import { Button, Typography, Box, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Reference } from "../../../types/Bibliography";
import { formatAPAReference, formatMLAReference } from "../../../utils/generators/citation";



// Reference item component
const ReferenceItem: React.FC<{ reference: Reference; isBackground: boolean; onEdit: (reference: Reference) => void; onDelete: (id: string) => void; formatReference: (ref: Reference) => string }> = ({
  reference,
  isBackground,
  onEdit,
  onDelete,
  formatReference,
}) => {
  return (
    <Paper
      sx={{
        marginBottom: "10px",
        padding: "10px",
        position: "relative", // Position for absolute buttons
        "&:hover .reference-actions": {
          display: "block", // Show buttons on hover
        },
      }}
    >
      <Typography variant="body1">
        <strong>{formatReference(reference)}</strong>
      </Typography>
      {isBackground && (
        <Box
          className="reference-actions"
          sx={{
            display: "none", // Hide buttons by default
            position: "absolute",
            right: "10px",
            bottom: "10px",
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onEdit(reference)}
            sx={{ marginRight: "10px" }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onDelete(reference.id)}
          >
            Delete
          </Button>
        </Box>
      )}
    </Paper>
  );
};


// Bibliography List component
const BibliographyList: React.FC<{ references: Reference[]; isBackground: boolean; onEdit: (reference: Reference) => void; onDelete: (id: string) => void; formatReference: (ref: Reference) => string }> = ({
  references,
  isBackground,
  onEdit,
  onDelete,
  formatReference,
}) => {
  return (
    <div>
      {references.map((reference) => (
        <ReferenceItem
          key={reference.id}
          reference={reference} // Renamed prop
          isBackground={isBackground}
          onEdit={onEdit}
          onDelete={onDelete}
          formatReference={formatReference}
        />
      ))}
    </div>
  );
};


// Bibliography component with citation style toggle
export const Bibliography: React.FC<{
  inlineReferences: Reference[];
  backgroundReferences: Reference[];
  onEdit: (id: string, reference: Reference) => void;
  onDelete: (id: string) => void;
}> = ({ inlineReferences, backgroundReferences, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [referenceToEdit, setReferenceToEdit] = useState<Reference | null>(null); // Reference to edit
  const [citationStyle, setCitationStyle] = useState("APA"); // Track citation style (APA or MLA)

  // Open modal and set the reference to edit
  const handleEdit = (reference: Reference) => {
    setReferenceToEdit(reference);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReferenceToEdit(null);
  };
                                        
  // Switch between APA and MLA styles
  const handleCitationStyleChange = (
    event: React.MouseEvent<HTMLElement>,
    newStyle: string
  ) => {
    if (newStyle) {
      setCitationStyle(newStyle);
    }
  };

  // Choose the correct reference format function based on citation style
  const formatReference = citationStyle === "APA" ? formatAPAReference : formatMLAReference                                                                                                                                                             ;

  return (
    <div>
      {/* Citation Style Toggle */}
      <ToggleButtonGroup
        value={citationStyle}
        exclusive
        onChange={handleCitationStyleChange}
        aria-label="citation style"
        sx={{ marginBottom: "20px" }}
      >
        <ToggleButton value="APA" aria-label="APA">
          APA
        </ToggleButton>
        <ToggleButton value="MLA" aria-label="MLA">
          MLA
        </ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="h5" gutterBottom>
        Inline References
      </Typography>
      <BibliographyList
        references={inlineReferences}
        isBackground={false}
        onEdit={handleEdit}
        onDelete={onDelete}
        formatReference={formatReference}
      />

      <Typography variant="h5" gutterBottom>
        Background References
      </Typography>
      <BibliographyList
        references={backgroundReferences}
        isBackground={true}
        onEdit={handleEdit}
        onDelete={onDelete}
        formatReference={formatReference}
      />

      {/* Reference Modal */}
      {isModalOpen && (
        <ReferenceModal
          onClose={handleCloseModal}
          onSubmit={() => {}} // Not used for editing
          referenceToEdit={referenceToEdit}
          onUpdate={(updatedReference: Reference) => {
            onEdit(updatedReference.id, updatedReference); // Pass updated reference to parent
            handleCloseModal(); // Close modal after update
          }}
        />
      )}
    </div>
  );
};
