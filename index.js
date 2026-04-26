// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion } = require("mongodb");
// const app = express();
// const port = process.env.PORT || 3000;
// const dns = require('node:dns');
// dns.setServers(['1.1.1.1', '8.8.8.8']);

// // middleware
// app.use(cors());
// app.use(express.json());
// const uri =
//   "mongodb+srv://petcareUserDb:nOiLnukCiFlsa13n@cluster0.jpvot78.mongodb.net/?appName=Cluster0";
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });
// app.get("/", (req, res) => {
//   res.send("Pet care server running");
// });

// async function run() {
//   try {
//     await client.connect();
//     const petsDB = client.db("petsDB");
//     const petsCollection = petsDB.collection("pets");
//     // adding database related apis here
//     app.post("/pets", async (req, res) => {
//       const newPet = req.body;
//       console.log("hitting the pets api", newPet);
//       const result = await petsCollection.insertOne(newPet);
//       const savedPet = await petsCollection.findOne({ _id: result.insertedId });
//       res.send(savedPet);
//     });

//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!",
//     );
//   } finally {
//   }
// }
// run().catch(console.dir);
// app.listen(port, () => {
//   console.log(`Pet Care Server listening on port ${port}`);
// });


// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const app = express();
// const port = process.env.PORT || 3000;
// const dns = require('node:dns');
// dns.setServers(['1.1.1.1', '8.8.8.8']);

// // middleware
// app.use(cors());
// app.use(express.json());

// const uri =
//   "mongodb+srv://petcareUserDb:nOiLnukCiFlsa13n@cluster0.jpvot78.mongodb.net/?appName=Cluster0";
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// app.get("/", (req, res) => {
//   res.send("Pet care server running");
// });

// async function run() {
//   try {
//     await client.connect();
//     const petsDB = client.db("petsDB");
//     const petsCollection = petsDB.collection("pets");
    
//     // adding database related apis here
    
//     // GET all pets
//     app.get("/pets", async (req, res) => {
//       try {
//         const pets = await petsCollection.find({}).toArray();
//         console.log("Fetching all pets");
//         res.send(pets);
//       } catch (error) {
//         console.error("Error fetching pets:", error);
//         res.status(500).send({ error: error.message });
//       }
//     });
    
//     // CREATE a new pet
//     app.post("/pets", async (req, res) => {
//       try {
//         const newPet = req.body;
//         console.log("hitting the pets api", newPet);
//         const result = await petsCollection.insertOne(newPet);
//         const savedPet = await petsCollection.findOne({ _id: result.insertedId });
//         res.send(savedPet);
//       } catch (error) {
//         console.error("Error creating pet:", error);
//         res.status(500).send({ error: error.message });
//       }
//     });
    
//     // UPDATE a pet
//     app.put("/pets/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         const updatedPet = req.body;
//         console.log("Updating pet with id:", id, updatedPet);
        
//         const result = await petsCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: updatedPet }
//         );
        
//         if (result.matchedCount === 0) {
//           return res.status(404).send({ error: "Pet not found" });
//         }
        
//         const pet = await petsCollection.findOne({ _id: new ObjectId(id) });
//         res.send(pet);
//       } catch (error) {
//         console.error("Error updating pet:", error);
//         res.status(500).send({ error: error.message });
//       }
//     });
    
//     // DELETE a pet
//     app.delete("/pets/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         console.log("Deleting pet with id:", id);
        
//         const result = await petsCollection.deleteOne({ _id: new ObjectId(id) });
        
//         if (result.deletedCount === 0) {
//           return res.status(404).send({ error: "Pet not found" });
//         }
        
//         res.send({ message: "Pet deleted successfully", id: id });
//       } catch (error) {
//         console.error("Error deleting pet:", error);
//         res.status(500).send({ error: error.message });
//       }
//     });

//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!",
//     );
//   } finally {
//   }
// }

// run().catch(console.dir);

// app.listen(port, () => {
//   console.log(`Pet Care Server listening on port ${port}`);
// });























const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const OpenAI = require('openai');
require('dotenv').config()
// middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || "mongodb+srv://petcareUserDb:nOiLnukCiFlsa13n@cluster0.jpvot78.mongodb.net/?appName=Cluster0";


// Initialize OpenAI
const openai = new OpenAI({
  apiKey: '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',
});

// Database connection caching for Vercel
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

app.get("/", (req, res) => {
  res.send("Pet care server running");
});
// --------------PET----------------
// GET all pets
app.get("/pets", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const petsCollection = db.collection("pets");
    const pets = await petsCollection.find({}).toArray();
    res.send(pets);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// CREATE pet
app.post("/pets", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const petsCollection = db.collection("pets");
    const newPet = req.body;
    console.log("Adding pet:", newPet);
    const result = await petsCollection.insertOne(newPet);
    const savedPet = await petsCollection.findOne({ _id: result.insertedId });
    res.send(savedPet);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// UPDATE pet
app.put("/pets/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const petsCollection = db.collection("pets");
    const id = req.params.id;
    const updatedPet = req.body;
    await petsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPet }
    );
    const pet = await petsCollection.findOne({ _id: new ObjectId(id) });
    res.send(pet);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE pet
app.delete("/pets/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const petsCollection = db.collection("pets");
    const id = req.params.id;
    const result = await petsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Pet not found" });
    }
    
    res.send({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
// ------------Doctors-------------------
// GET all doctors
app.get("/doctors", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const doctorsCollection = db.collection("doctors");
    const doctors = await doctorsCollection.find({}).toArray();
    res.send(doctors);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// CREATE doctor
app.post("/doctors", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const doctorsCollection = db.collection("doctors");
    const newDoctor = req.body;

    console.log("Adding doctor:", newDoctor);

    const result = await doctorsCollection.insertOne(newDoctor);
    const savedDoctor = await doctorsCollection.findOne({
      _id: result.insertedId,
    });

    res.send(savedDoctor);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// UPDATE doctor
app.put("/doctors/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const doctorsCollection = db.collection("doctors");
    const id = req.params.id;
    const updatedDoctor = req.body;

    await doctorsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedDoctor }
    );

    const doctor = await doctorsCollection.findOne({
      _id: new ObjectId(id),
    });

    res.send(doctor);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE doctor
app.delete("/doctors/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const doctorsCollection = db.collection("doctors");
    const id = req.params.id;

    const result = await doctorsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Doctor not found" });
    }

    res.send({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
// ----------------clinics---------------------
// GET all clinics
app.get("/clinics", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const clinicsCollection = db.collection("clinics");
    const clinics = await clinicsCollection.find({}).toArray();
    res.send(clinics);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// CREATE clinic
app.post("/clinics", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const clinicsCollection = db.collection("clinics");
    const newClinic = req.body;

    console.log("Adding clinic:", newClinic);

    const result = await clinicsCollection.insertOne(newClinic);
    const savedClinic = await clinicsCollection.findOne({
      _id: result.insertedId,
    });

    res.send(savedClinic);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// UPDATE clinic
app.put("/clinics/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const clinicsCollection = db.collection("clinics");
    const id = req.params.id;
    const updatedClinic = req.body;

    await clinicsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedClinic }
    );

    const clinic = await clinicsCollection.findOne({
      _id: new ObjectId(id),
    });

    res.send(clinic);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE clinic
app.delete("/clinics/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const clinicsCollection = db.collection("clinics");
    const id = req.params.id;

    const result = await clinicsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Clinic not found" });
    }

    res.send({ message: "Clinic deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});







// ----------------appointments---------------------

// GET all appointments
app.get("/appointments", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("appointments");
    const data = await collection.find({}).toArray();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// CREATE appointment
app.post("/appointments", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("appointments");
    const newItem = req.body;

    console.log("Adding appointment:", newItem);

    const result = await collection.insertOne(newItem);
    const savedItem = await collection.findOne({
      _id: result.insertedId,
    });

    res.send(savedItem);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// UPDATE appointment
app.put("/appointments/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("appointments");
    const id = req.params.id;
    const updatedItem = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedItem }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Appointment not found" });
    }

    const item = await collection.findOne({
      _id: new ObjectId(id),
    });

    res.send(item);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE appointment
app.delete("/appointments/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("appointments");
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID" });
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Appointment not found" });
    }

    res.send({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});




// ----------------medical records---------------------

// GET all medical records
app.get("/medical-records", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("medicalRecords");
    const data = await collection.find({}).toArray();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// CREATE medical record
app.post("/medical-records", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("medicalRecords");
    const newItem = req.body;

    console.log("Adding medical record:", newItem);

    const result = await collection.insertOne(newItem);
    const savedItem = await collection.findOne({
      _id: result.insertedId,
    });

    res.send(savedItem);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// UPDATE medical record
app.put("/medical-records/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("medicalRecords");
    const id = req.params.id;
    const updatedItem = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedItem }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Medical record not found" });
    }

    const item = await collection.findOne({
      _id: new ObjectId(id),
    });

    res.send(item);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE medical record
app.delete("/medical-records/:id", async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("medicalRecords");
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID" });
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Medical record not found" });
    }

    res.send({ message: "Medical record deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// ============= AI SYMPTOM CHECKER ENDPOINT =============
app.post('/api/ai-symptom-check', async (req, res) => {
  try {
    const { symptoms, petType, petAge, petName, petBreed, petWeight } = req.body;
    
    console.log("Received request:", { symptoms, petType, petAge, petName });
    
    // Pet information for AI
    const petInfo = `
      Pet Name: ${petName || 'Unknown'}
      Pet Type: ${petType || 'Unknown'}
      Age: ${petAge || 'Unknown'}
      Breed: ${petBreed || 'Unknown'}
      Weight: ${petWeight || 'Unknown'}
    `;
    
    const prompt = `
      As a veterinary AI assistant, analyze these symptoms for this pet:
      
      ${petInfo}
      
      Symptoms: ${symptoms.join(', ')}
      
      Please provide:
      1. Possible condition (short name)
      2. Severity level (choose one: Mild, Moderate, Severe, Urgent)
      3. Recommended specialty (choose one: General, Dermatology, Internal Medicine, Surgery, Cardiology, Neurology, Orthopedics, Ophthalmology, Dentistry)
      4. Brief description of the condition (1-2 sentences)
      5. Immediate care suggestions (what the owner can do right now)
      6. Recommendation (choose one: Home care, Visit vet within 3 days, Visit vet within 24 hours, Emergency)
      
      Format the response as JSON with these exact keys: condition, severity, specialty, description, immediateCare, recommendation
    `;
    
    // For now, return mock data since OpenAI might not be configured
    // This will help you test if the endpoint is working
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
    
    res.json({
      aiResult: mockResponse,
      recommendedDoctors: matchedDoctors
    });
    
  } catch (error) {
    console.error('AI Symptom Check Error:', error);
    res.status(500).json({ error: error.message });
  }
});


// For local development only
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Pet Care Server listening on port ${port}`);
  });
}

// Export for Vercel
module.exports = app;