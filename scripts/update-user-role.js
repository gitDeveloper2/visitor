const { MongoClient } = require('mongodb');

// MongoDB connection string - using the same connection as the app
const MONGODB_URI = process.env.NEXT_PUBLIC_MONGO_URI_DEV || 
                   process.env.NEXT_PUBLIC_MONGO_URI || 
                   "mongodb+srv://2iamjustin:Z4aFXyaraOXkjUDB@cluster0.10dpslm.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = process.env.NEXT_PUBLIC_MONGO_DATABASE || "basicutils";

async function updateUserRole(userEmail, newRole = 'admin') {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DATABASE_NAME);
    const usersCollection = db.collection('user');
    
    // Find and update the user
    const result = await usersCollection.updateOne(
      { email: userEmail },
      { $set: { role: newRole } }
    );
    
    if (result.matchedCount === 0) {
      console.log(`No user found with email: ${userEmail}`);
    } else if (result.modifiedCount === 0) {
      console.log(`User found but role was already ${newRole}`);
    } else {
      console.log(`Successfully updated user ${userEmail} role to ${newRole}`);
    }
    
    // Verify the update
    const updatedUser = await usersCollection.findOne({ email: userEmail });
    console.log('Updated user:', {
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
    
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await client.close();
  }
}

// Get email from command line argument
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('Usage: node update-user-role.js <user-email>');
  console.log('Example: node update-user-role.js horace.karatu@gmail.com');
  process.exit(1);
}

updateUserRole(userEmail); 