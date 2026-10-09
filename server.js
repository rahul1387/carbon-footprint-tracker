// ========================================
// CARBON FOOTPRINT TRACKER - SERVER
// ========================================
//
// Express server that:
//   1. Serves the static frontend (HTML/CSS/JS)
//   2. Exposes a small REST API backed by a
//      locally running MongoDB instance
//
// Default connection: mongodb://127.0.0.1:27017
// Override with the MONGODB_URI environment variable.
// ========================================

const path = require("path");
const express = require("express");
const { MongoClient } = require("mongodb");


// ----------------------------------------
// CONFIG
// ----------------------------------------

const PORT = Number(process.env.PORT) || 3000;

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

const DB_NAME =
    process.env.MONGODB_DB || "carbontrack";

const COLLECTION_NAME = "activities";

const CONNECT_TIMEOUT_MS = 8000;


// ----------------------------------------
// APP
// ----------------------------------------

const app = express();

app.use(express.json({ limit: "200kb" }));


let activities = null;


// ----------------------------------------
// API HELPERS
// ----------------------------------------

function toActivity(doc) {

    if (!doc) return null;

    const { _id, ...rest } = doc;

    return {
        id: String(_id),
        ...rest
    };

}


function isValidId(id) {

    return (
        typeof id === "string" &&
        id.length > 0 &&
        id.length < 128
    );

}


// ----------------------------------------
// API ROUTES
// ----------------------------------------

app.get("/api/health", (req, res) => {

    res.json({
        ok: activities !== null,
        database: DB_NAME,
        collection: COLLECTION_NAME
    });

});


// LIST -------------------------------------------------

app.get("/api/activities", async (req, res, next) => {

    try {

        const docs = await activities
            .find({})
            .sort({ date: -1, createdAt: -1 })
            .toArray();


        res.json(docs.map(toActivity));

    } catch (error) {

        next(error);

    }

});


// CREATE / UPSERT ---------------------------------------

app.post("/api/activities", async (req, res, next) => {

    try {

        const body = req.body;


        if (!body || typeof body !== "object" || Array.isArray(body)) {

            return res
                .status(400)
                .json({ error: "A JSON activity object is required." });

        }


        const activity = { ...body };


        // Server owns these fields
        delete activity.id;
        delete activity._id;


        const id =
            isValidId(String(body.id || ""))
                ? String(body.id)
                : null;


        if (!id) {

            return res
                .status(400)
                .json({ error: "Activity id is missing." });

        }


        if (activity.createdAt === undefined) {

            activity.createdAt = new Date().toISOString();

        }


        // Upsert keyed by the client id so that
        // repeated saves / migrations stay idempotent
        await activities.updateOne(
            { _id: id },
            { $set: activity },
            { upsert: true }
        );


        const doc = await activities.findOne({ _id: id });


        res.status(201).json(toActivity(doc));

    } catch (error) {

        next(error);

    }

});


// DELETE -----------------------------------------------

app.delete("/api/activities/:id", async (req, res, next) => {

    try {

        const { id } = req.params;


        if (!isValidId(id)) {

            return res
                .status(400)
                .json({ error: "Invalid activity id." });

        }


        const result =
            await activities.deleteOne({ _id: id });


        if (result.deletedCount === 0) {

            return res
                .status(404)
                .json({ error: "Activity not found." });

        }


        res.json({ ok: true, deleted: 1 });

    } catch (error) {

        next(error);

    }

});


// CLEAR ALL (handy for testing/reset) -------------------

app.delete("/api/activities", async (req, res, next) => {

    try {

        const result = await activities.deleteMany({});

        res.json({
            ok: true,
            deleted: result.deletedCount
        });

    } catch (error) {

        next(error);

    }

});


// ----------------------------------------
// STATIC FRONTEND
// ----------------------------------------

app.use(express.static(__dirname));


// Unknown API routes -> JSON 404 (not index.html)
app.use("/api", (req, res) => {

    res
        .status(404)
        .json({ error: "Not found." });

});


// Errors -> JSON
app.use((error, req, res, next) => {

    console.error("[api]", error.message);

    res
        .status(500)
        .json({ error: "Server error." });

});


// ----------------------------------------
// MONGODB CONNECTION
// ----------------------------------------

async function connectDatabase() {

    const client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS
    });


    await client.connect();


    const db = client.db(DB_NAME);

    activities = db.collection(COLLECTION_NAME);


    // Indexes used by the list endpoint
    await activities.createIndex({ date: -1 });

    await activities.createIndex({ createdAt: -1 });


    return client;

}


// ----------------------------------------
// START
// ----------------------------------------

async function start() {

    try {

        const client = await connectDatabase();


        app.listen(PORT, () => {

            console.log("");
            console.log("  CarbonTrack is running");
            console.log("  ------------------------------------------------");
            console.log(`  Frontend : http://localhost:${PORT}`);
            console.log(`  API      : http://localhost:${PORT}/api/activities`);
            console.log(`  MongoDB  : ${MONGODB_URI}`);
            console.log(`  Database : ${DB_NAME}.${COLLECTION_NAME}`);
            console.log("  ------------------------------------------------");
            console.log("");


            const shutdown = async () => {

                console.log("\nShutting down...");

                try {
                    await client.close();
                } catch (error) {
                    // ignore
                }

                process.exit(0);

            };


            process.on("SIGINT", shutdown);
            process.on("SIGTERM", shutdown);

        });

    } catch (error) {

        console.error("");
        console.error("  Could not connect to the local MongoDB instance.");
        console.error(`  Tried: ${MONGODB_URI}`);
        console.error("");
        console.error("  Fix it by:");
        console.error("    1. Starting the MongoDB Windows service:");
        console.error('         net start MongoDB');
        console.error("    2. Or pointing to another instance:");
        console.error('         set MONGODB_URI=mongodb://127.0.0.1:27017');
        console.error("");

        process.exit(1);

    }

}


start();
