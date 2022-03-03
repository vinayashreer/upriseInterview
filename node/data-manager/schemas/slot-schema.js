const mongoose = require('mongoose');
const { DateTime } = require("luxon");
const { Schema } = mongoose;
let newDate = () => DateTime.fromFormat(DateTime.local().
    toFormat("dd-MMM-yyyy:HH:mm:ss"),
    "dd-MMM-yyyy:HH:mm:ss", { zone: 'UTC' }).toUTC();

const slotSchema = new Schema({
    _id: {
        type: String,
        default: function () {
            //object Id to string
            return new mongoose.Types.ObjectId();
        }
    },
    lastUpDate: {
        type: Date,
        default: () => { return newDate() }
    },
    slots: {
        type: [Date],
        required: true
    },
    timeZone: {
        type: String,
        trim: true
    },
    date: {
        type: Date
    }
});

slotSchema.pre('save', function (next) {
    this.lastUpDate = newDate();
    next();
});

const Slot = mongoose.model('slot', slotSchema);
exports.Slot = Slot;
exports.newDate = newDate;