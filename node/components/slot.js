/**
 * ================================
 * Event Slots Component
 * ================================
 **/

/* The timesheet opcodes are
 * . addSlots
 * . getSlots
 * */

//Opcodes with required params
/**
 *  -- {
 *      op:"addSlots",
 *      dateTime:''
 *      timeZone:''
 *      }
 */

/**
 *  -- {
 *      op:"getSlots",
 *      dateTime:'',
 *      timeZone:''//optional
 *      }
 */


//validate plugin to check fields
var validator = require("validate.js");
const { createSlot, findAllSlotByQuery, updateSlot, findSlotByAggregate } = require("../data-manager/slot-data-method");
const { DateTime } = require("luxon");

//error codes to map with each op code error msg while sending error response
const opCodesErrCode = {
    addSlots: "create_new_slots",
    getSlots: 'get_slots',
};

//validator extension for datetime
let setDateExtend = () => validator.extend(validator.validators.datetime, {
    parse: function (val, options) {
        return +DateTime.fromFormat(val.toString(), options.format);//check date is valid
    },
    format: function (val, options) {
        return new Date(val.toString());
    }
});

//validate each field
const check = (a) => {
    a.proceed = a.check = a.status = true; a.errCode = ''; a.statusCode = 400;
    let { op } = a.$$;
    let eC = "";//used this variable to assign error field to set error code
    let fields = {};//used this variable to list all fields required for opcode
    let opEc = `slot.${opCodesErrCode[op]}:`;
    if (!['addSlots', 'getSlots'].includes(op)) {
        a.errCode = 'slot:invalid-opcode'; a.proceed = a.check = a.status = false;
        return a;
    }
    if (['addSlots', 'getSlots'].includes(op)) {
        setDateExtend();
        //listing all fields required with respective validation constraints
        //these constraints are validated using validator plugin
        fields = {
            'timeZone': validator.single(a.$$.timeZone, {
                presence: op === 'getSlots' ? false : { allowEmpty: false }, type: "string", length:
                    a.$$.timeZone ? { minimum: 1 } : undefined
            }),
            'dateTime': validator.single(a.$$.dateTime, {
                presence: { allowEmpty: false }, type: "string", datetime: typeof a.$$.dateTime == "string" ? {
                    format: op === 'getSlots' ? "dd-MMM-yyyy" : "dd-MMM-yyyy:hh:mm:ss",
                } : undefined
            }),
        };
        //here checked each field mentioned in above list, if any error quit with field name assigned to eC
        //that eC is used as error code in response
        a.check = Object.keys(fields).every(d => {
            eC = d;
            return !fields[d];
        });
        if (!a.check) {//if above check fails return
            a.errCode = `${opEc}required-valid-${eC}`;
            a.status = a.proceed = false;
            return a;
        }
    }
    a.statusCode = 200;
    a.proceed = a.validate = a.status;
    return a;
};

//this is the function to set date in utc format which is required to 
//do fetch operation in mongo
const setDateFormatForMongo = (date) => {
    if (date) {
        //if date contains time, set format as dd-MMM-yyyy:hh:mm:ss
        //else dd-MMM-yyyy
        const sp = date.split(":");
        let dtFrm = 'dd-MMM-yyyy';
        if (sp[1]) {
            dtFrm = dtFrm + ':hh:mm:ss';
        }
        return DateTime.fromFormat(date, dtFrm, { zone: 'UTC' }).toUTC();
    } else return undefined;
};

//validate fields with date base
const validate = async (a) => {
    let { op } = a.$$;
    // if the previous method has failed, just quit
    if (!a.proceed) return a;
    let eCode = `slot.process:${opCodesErrCode[op]}_fail;`;
    if (op === 'addSlots') {
        a.$$.slot = setDateFormatForMongo(a.$$.dateTime);
        a.$$.date = setDateFormatForMongo(a.$$.dateTime.split(":")[0]);
        //check date amd time zone already saved
        let slotRes = await findAllSlotByQuery({
            date: a.$$.date, timeZone: a.$$.timeZone,
        });
        a.result = slotRes.result;
        //if date exists
        if (slotRes.status) {
            //check slot exists for that date
            let timeSlotRes = await findAllSlotByQuery({ _id: slotRes.result[0]._id, slots: { $in: [a.$$.slot] } });
            a.status = a.proceed = a.validate = !timeSlotRes.status
            if (!a.status) {
                a.errCode = `${eCode}given-slot-is-booked`
                a.statusCode = 422;
                return a;
            }
        }
    }
    a.statusCode = 200;
    a.proceed = a.validate = a.status;
    return a;
};

//insert to or get from or update db
const transact = async (a) => {
    let { op } = a.$$, res, obj;
    // if the previous method has failed, just quit
    if (!a.proceed) return a;
    if (op === 'addSlots') {
        //if  date exists, update the slot array, else create new rec
        if (!a.result) {
            res = await createSlot({ ...a.$$, slots: [a.$$.slot] });
        } else {
            res = await updateSlot({
                slotObj: a.result[0], //fetched result while validate
                upObj: { slots: [...a.result[0].slots, a.$$.slot] }
            });
        }
    }
    else if (op === 'getSlots') {
        //check date or timezone is in params
        let query = {
            date: a.$$.dateTime ? setDateFormatForMongo(a.$$.dateTime) : undefined,
            timeZone: a.$$.timeZone
        };
        Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);
        obj = [{ $match: query },
        { $unwind: { path: '$slots', preserveNullAndEmptyArrays: true } },
            { $sort: { 'slots': -1 } }];
        //call the aggregate query
        res = await findSlotByAggregate(obj);
    }
    //send response
    if (res) {
        a.status = a.transact = a.proceed = res.status;
        a.statusCode = res.statusCode;
        a.errCode = res.errCode;
        a.result = res.result;
    }
    return a;
}

let _Slot = {};
_Slot.process = async (cmd) => {
    return await transact(await validate(await check(cmd)));
};

const slot_service = async (req, res) => {
    let Message = Object.create(_Slot);
    let tmp = {}; tmp.$$ = {};
    // get the req.body
    Object.assign(tmp.$$, req.body);
    // extract the op - just to get a shortcut
    tmp.op = req.body.op;
    // formulate a default error code
    let defaultErrCode = `slot:${req.body.op}-process-failure`;
    // create a result object by calling the Order.process method
    // the process sub-methods (check, validate & transact) invoke the data-methods.
    try {
        let y = await Message.process(tmp);
        // if success, send status = 200 along with result
        if (y.proceed) res.status(y.statusCode).json({ status: true, result: y.result });
        // if not, send status = 400 along with error code
        else res.status(y.statusCode).json({ status: false, errCode: y.errCode, errData: y.errData });
    }
    catch (e) {
        console.log(e);
        // if the process fails, send false status and default order error code
        res.status(424).send({ status: false, errCode: defaultErrCode });
    }
};

module.exports = {
    slot_check: check,
    slot_service: slot_service,
    slot_process: _Slot.process
}