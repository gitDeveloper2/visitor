import { Box, Typography, Avatar, Card, CardContent } from "@mui/material";

interface AuthorProfileProps {
  name: string;
  profilePicture: string;
  bio: string;
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({ name, profilePicture, bio }) => {
  return (
    <Card sx={{ maxWidth: 500, margin: "0 auto", padding: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar src={profilePicture} alt={name} sx={{ width: 120, height: 120, marginBottom: 2 }} />
          <Typography component={'h1'} variant="h4" gutterBottom>
           Author: {name}
          </Typography>
          <Typography component={'h2'} variant="h4" gutterBottom>
           Biography
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {bio}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AuthorProfile;
