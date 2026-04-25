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

// middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || "mongodb+srv://petcareUserDb:nOiLnukCiFlsa13n@cluster0.jpvot78.mongodb.net/?appName=Cluster0";

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

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Pet Care Server listening on port ${port}`);
  });
}

// Export for Vercel
module.exports = app;