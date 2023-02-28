const router = require("express").Router();
const Hotel = require("../models/Hotel");


//create a pin

router.post("/", async (req,res)=>{
    const newHotel  = new Hotel(req.body);
    try{
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch(err) {
        res.status(500).json(err);
    }
});

//get all pins

router.get("/", async (req,res)=>{
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;