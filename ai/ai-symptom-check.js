const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://petcareUserDb:nOiLnukCiFlsa13n@cluster0.jpvot78.mongodb.net/?appName=Cluster0";

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  const db = client.db("petsDB");
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symptoms, petType, petAge, petName, petBreed, petWeight } = req.body;
    
    console.log("Received request:", { symptoms, petType, petAge, petName });

    // Mock response for now (since OpenAI API key might be restricted)
    const mockResponse = {
      condition: "Seasonal Allergies",
      severity: "Mild",
      specialty: "Dermatology",
      description: "Your pet appears to have seasonal allergies causing itching and discomfort.",
      immediateCare: "Keep your pet in a clean environment, wipe paws after walks, consider antihistamines after consulting vet.",
      recommendation: "Visit vet within 3 days"
    };
    
    // Find matching doctors based on specialty
    const { db } = await connectToDatabase();
    const doctorsCollection = db.collection("doctors");
    
    const matchedDoctors = await doctorsCollection.find({
      specialties: { $regex: mockResponse.specialty, $options: 'i' }
    }).limit(5).toArray();
    
    res.status(200).json({
      aiResult: mockResponse,
      recommendedDoctors: matchedDoctors
    });
    
  } catch (error) {
    console.error('AI Symptom Check Error:', error);
    res.status(500).json({ error: error.message });
  }
};