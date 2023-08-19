
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import express from 'express';
import 'dotenv/config';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const uri = process.env.MONGODB_URI;


app.get('/', (req, res) => {
    res.send(`
    <div>
      <h1>Backup paths</h1>
      <form action="/submit" method="POST">
          <input type="submit" value="Save">
      </form>
    </div>
    `)
  });


app.post('/submit', (req, res) => {
    // console.log(req.body);
    run().catch(console.dir);
    res.send(run().catch(console.dir));
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const dbName = "FamilyDB";

        await client.connect();
        const db = await client.db(dbName);

        const workSchedule = {
            name: 'test 4.0',
            // time: [{day:"Mon", time_slot:"9:00-23:00"}, {day:"Fri", time_slot:"10:00-21:00"}]
        };
        await addWorkSchedule(db, 'workSchedule', workSchedule);
        // await updateWorkSchedule(db, 'workSchedule', new ObjectId("647b05464f2cf47c0bd85cac"), workSchedule);
        await selectWorkSchedule(db, 'workSchedule', {});

    }
    catch(e){
        console.log(e);
        return e;
    } 
    finally {
        await client.close();
    }
}

//Select
async function selectWorkSchedule(db, collection, data) {
    // Find all work schedules
    const result = await db.collection(collection).find(data).toArray();
    console.log(result);
    console.log("Found work schedule");
}

//Add
async function addWorkSchedule(db, collection, data) {
    // Create a new work schedule
    // const workSchedule = {
    //     name: 'Monday Schedule',
    //     days: ['Monday'],
    //     start: 8,
    //     end: 16
    // };
    let result = await db.collection(collection).insertOne(data);
    console.log("Inserted work schedule");
    console.log(result);
}

//Update
async function updateWorkSchedule(db, collection, id, data) {
    // Update a work schedule
    // const newWorkSchedule = {
    //     _id: result.insertedId,
    //     name: 'Monday Schedule',
    //     days: ['Monday', 'Tuesday'],
    //     start: 8,
    //     end: 16
    // };
    // result.insertedId
    await db.collection(collection).updateOne({ _id: id }, { $set: data });
    // console.log("Updated work schedule");
}

//Delete
async function deleteWorkSchedule(db, collection, data) {
    await db.collection(collection).deleteOne(data);
    // console.log("Deleted work schedule");
}

