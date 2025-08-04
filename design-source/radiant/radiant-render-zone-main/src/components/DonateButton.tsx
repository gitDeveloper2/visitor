import { Button } from "@mui/material";
import { Heart } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { commonStyles } from "@/utils/themeUtils";

const DonateButton = () => {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      size="small"
      startIcon={<Heart size={16} />}
      sx={{
        ...commonStyles.gradientButton(theme),
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        animation: theme.custom.animations.glow,
      }}
    >
      Donate
    </Button>
  );
};

export default DonateButton;