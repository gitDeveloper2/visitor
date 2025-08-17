const { MongoClient } = require('mongodb');

async function migrateUserProfiles() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('basicutils'); // Adjust database name if needed
    const usersCollection = db.collection('users');

    // Find users without profile fields
    const usersToUpdate = await usersCollection.find({
      $or: [
        { bio: { $exists: false } },
        { jobTitle: { $exists: false } },
        { websiteUrl: { $exists: false } },
        { twitterUsername: { $exists: false } },
        { linkedinUsername: { $exists: false } }
      ]
    }).toArray();

    console.log(`Found ${usersToUpdate.length} users to update`);

    if (usersToUpdate.length === 0) {
      console.log('All users already have profile fields');
      return;
    }

    // Update users with default profile values
    const result = await usersCollection.updateMany(
      {
        $or: [
          { bio: { $exists: false } },
          { jobTitle: { $exists: false } },
          { websiteUrl: { $exists: false } },
          { twitterUsername: { $exists: false } },
          { linkedinUsername: { $exists: false } }
        ]
      },
      {
        $set: {
          bio: "",
          jobTitle: "",
          websiteUrl: "",
          twitterUsername: "",
          linkedinUsername: ""
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} users`);
    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateUserProfiles()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateUserProfiles }; 