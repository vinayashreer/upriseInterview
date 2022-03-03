const { Message } = require("./schemas/message-schema");

/**
 * This file consists data methods of message
 * --message methods
 * createMessage
 * findAllMessageByQuery
 * findMessageByAggregate
 */


/**
 * create a message
 * it creates a new object of message and saves to Message collection
 * on success saved object is sent as result with status code 201
 * on failure 500 is sent
 */
exports.createMessage = async (t) => {
    try {
        //object creation
        let newMessage = new Message(t);
        //save to collection
        let result = await newMessage.save();
        if (result) {
            t.status = true; t.result = result; t.statusCode = 201; t.errCode = "";
        }
        else {
            t.status = false; t.statusCode = 500;
            t.errCode = "message.create_message:could-not-create-message";
        }
        return t;
    }
    catch (e) {
        console.log(e);
        t.status = false; t.statusCode = 500;
        t.errCode = `message.create_message:failure`;
        return t;
    }
};

/**
 * The findAllMessageByQuery method finds all the message object by query and virtually populate 
 * the t param contains query object
 * If message are associated with the incoming query, the fetched message are returned
 * Otherwise an appropriate error code is returned along with a false status
 * sort for sorting fields
 * skip to skip number of documents
 * limit to limit the documents
 */
exports.findAllMessageByQuery = async (t, sort, skip, limit) => {
    try {
        let vMessage = await Message.find(t)
            .sort(sort ? sort : { lastUpDate: 1 })
            .skip(skip ? skip : 0).limit(limit ? limit : '');
        if (vMessage && vMessage.length) {
            t.status = true; t.statusCode = 200; t.result = vMessage;
        }
        else {
            t.status = false; t.statusCode = 404;
            t.errCode = 'message.get_message:message-not-found';
        }
        return t;
    } catch (e) {
        console.log(e);
        t.status = false; t.statusCode = 500;
        t.errCode = `message.get_message:failure`;
        return t;
    }
};

/**
 * The findMessageByAggregate method aggregate all the message object by query
 * the t param contains query object
 * If messages are associated with the incoming query, the fetched messages are returned
 * Otherwise an appropriate error code is returned along with a false status
 */
exports.findMessageByAggregate = async (t) => {
    try {
        let messages = await Message.aggregate(t);
        if (messages && messages.length) {
            t.status = true; t.statusCode = 200; t.result = messages;
        }
        else {
            t.status = false; t.statusCode = 404;
            t.errCode = 'message.get_message:message-not-found';
        }
        return t;
    } catch (e) {
        console.log(e);
        t.status = false; t.statusCode = 500;
        t.errCode = `message.get_message:failure`;
        return t;
    }
}