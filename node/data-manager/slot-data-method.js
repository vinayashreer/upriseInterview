const { Slot, newDate } = require("./schemas/slot-schema");

/**
 * This file consists data methods of slot
 * --slot methods
 * createSlot
 * updateSlot
 * findAllSlotByQuery
 * findSlotByAggregate
 */


/**
 * create a slot
 * it creates a new object of slot and saves to Slot collection
 * on success saved object is sent as result with status code 201
 * on failure 500 is sent
 */
exports.createSlot = async (t) => {
    try {
        //object creation
        let newSlot = new Slot(t);
        //save to collection
        let result = await newSlot.save();
        if (result) {
            t.status = true; t.result = result; t.statusCode = 201; t.errCode = "";
        }
        else {
            t.status = false; t.statusCode = 500;
            t.errCode = "slot.create_slot:could-not-create-slot";
        }
        return t;
    }
    catch (e) {
        console.log(e);
        t.status = false; t.statusCode = 500;
        t.errCode = `slot.create_slot:failure`;
        return t;
    }
};

/**
 * 
 * updateSlot is used to update
 * fields of a slot object
 * 
 * it takes t as param which should contain slotId, upObj (object to update)
 * and slotObj (this is not mandatory, this can be generated in validate
 *  method while checking slotId existence and then can be sent to updateSlot method through transact method)
 * then it updates the given slotObj and updObj
 * 
 * it updates 
 * 1. lastUpDate field
 */
exports.updateSlot = async (t) => {
    try {
        //upObj contains key and value pair which has to be updated
        t.upObj.lastUpDate = newDate();
        let updatedSlot = await Slot.updateOne({ _id: t.slotObj._id }, { $set: t.upObj });
        if (updatedSlot && updatedSlot.nModified) {
            const res = await this.findAllSlotByQuery({ _id: t.slotObj._id });
            t.status = res.status; t.statusCode = res.statusCode;
            t.result = res.result; t.errCode = res.errCode;
        }
        else {
            t.status = false; t.statusCode = 500;
            t.errCode = "slot.update_slot:could-not-update-slot";
        }
        return t;
    }
    catch (e) {
        console.log(e);
        t.status = false; t.statusCode = 500;
        t.errCode = `slot.update_slot:failure`;
        return t;
    }
}

/**
 * The findAllSlotByQuery method finds all the slot object by query and virtually populate 
 * the t param contains query object
 * If slot are associated with the incoming query, the fetched slot are returned
 * Otherwise an appropriate error code is returned along with a false status
 * sort for sorting fields
 * skip to skip number of documents
 * limit to limit the documents
 */
exports.findAllSlotByQuery = async (t, sort, skip, limit) => {
    try {
        let vSlot = await Slot.find(t)
            .sort(sort ? sort : { lastUpDate: 1 })
            .skip(skip ? skip : 0).limit(limit ? limit : '');
        if (vSlot && vSlot.length) {
            t.status = true; t.statusCode = 200; t.result = vSlot;
        }
        else {
            t.status = false; t.statusCode = 404;
            t.errCode = 'slot.get_slot:slot-not-found';
        }
        return t;
    } catch (e) {
        console.log(e);
        t.status = false; t.statusCode = 500;
        t.errCode = `slot.get_slot:failure`;
        return t;
    }
};

/**
 * The findSlotByAggregate method aggregate all the slot object by query
 * the t param contains query object
 * If slots are associated with the incoming query, the fetched slots are returned
 * Otherwise an appropriate error code is returned along with a false status
 */
exports.findSlotByAggregate = async (t) => {
    try {
        let slots = await Slot.aggregate(t);
        if (slots && slots.length) {
            t.status = true; t.statusCode = 200; t.result = slots;
        }
        else {
            t.status = false; t.statusCode = 404;
            t.errCode = 'slot.get_slot:slot-not-found';
        }
        return t;
    } catch (e) {
        console.log(e);
        t.status = false; t.statusCode = 500;
        t.errCode = `slot.get_slot:failure`;
        return t;
    }
}