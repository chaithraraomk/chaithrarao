const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/travelDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const PlaceSchema = new mongoose.Schema({
    name: String,
    lat: String,
    lon: String,
    display_name: String,
});

const Place = mongoose.model("Place", PlaceSchema);

app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query is required" });

    // Check if place exists in MongoDB
    let place = await Place.findOne({ name: query });

    if (!place) {
        // Fetch from OpenStreetMap API
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
        if (response.data.length === 0) {
            return res.status(404).json({ error: "Place not found" });
        }

        // Save new place in MongoDB
        const placeData = response.data[0];
        place = new Place({
            name: query,
            lat: placeData.lat,
            lon: placeData.lon,
            display_name: placeData.display_name,
        });
        await place.save();
    }

    res.json(place);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
