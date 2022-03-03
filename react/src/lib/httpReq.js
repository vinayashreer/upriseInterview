//set the required url 
let commonStruct = {
    //baseURL: 'http://localhost:8081/api'
    baseURL:'https://uprisebooking.herokuapp.com/api'
};

//routes used
let routes = {
    //slot
    slot: 'slot',
};

//create a post req with params
let createReq = async ({ reqObj, url }, headerObj) => {
    headerObj = headerObj || {};
    let _uri = '/' + routes[url];
    let header = {
        'Content-Type': 'application/json',
        ...headerObj,
    };
    let req = {
        baseURL: commonStruct.baseURL + _uri,
        method: 'POST',
        data: JSON.stringify(reqObj),
        headers: header,
    };
    //console.log(JSON.stringify(req));
    return await request({ options: req });
};

const constructErrResp = (data, status) => {
    if (data && data.message) {
        return data.message;
    }
    else {
        return 'Unexpected error ' + status;
    }
};


/**
 * Request Wrapper with default success/error actions
 */
const request = async function ({ options }) {
    const client = async (url, opt) => await fetch(url, { method: opt.method, headers: opt.headers, body: opt.data });

    const onSuccess = function (response) {
        //console.log(JSON.stringify(response))
        if (response && response.data) {
            let returnResp = {
                status: true,
                data: options && options.data && (options.data.pdf || options.data.csv) ? response.data : {
                    ...response.data, cookie: (response.data['set-cookie']
                        && response.data['set-cookie'][0]) ? response.data['set-cookie'][0] : '',
                },
                msgType: 0,
                err: '',
                statusCode: response && response.status ? response.status : 0,
            };
            if (!response.data && !response.data.status) {
                returnResp.status = false;
                returnResp.data = [];
            }
            //console.log(response.data['set-cookie'])
            return returnResp;
        } else {
            return response;
        }
    };

    //console.log("response is 1 sadasdasd asasd 3")

    const onError = (error) => {
        //console.log('error is 1');
        // console.log(error);
        if (error.response) {
            //Request was made but server responded with something
            // other than 2xx
            // console.debug('Data:', JSON.stringify(error.response.data));
            // console.debug('Headers:', error.response.headers);
            if (error.response.status === 401 ||
                error.response.status === 440 || error.response.status === 424) {
                //console.log('Unauthorized access-' + error.response.status);
                let returnResp = {
                    status: false,
                    msgType: 2,
                    data: { ...error.response.data },
                    err: constructErrResp(error.response.data, error.response.status),
                    statusCode: error.response && error.response.status ? error.response.status : 0,
                };
                return returnResp;
            }
            else if (error.response.status === 503) {
                // error.response.data.message = "Something went wrong, try again"
                let returnResp = {
                    status: false,
                    msgType: 2,
                    statusCode: error.response && error.response.status ? error.response.status : 0,
                    data: { ...error.response.data },
                    err: constructErrResp({ message: 'Something went wrong, try again' }, error.response.status),
                };
                return returnResp;
            }
            else {
                let returnResp = {
                    status: false,
                    msgType: 1,
                    statusCode: error.response && error.response.status ? error.response.status : 0,
                    data: { ...error.response.data },
                    err: constructErrResp(error.response.data, error.response.status),
                };
                return returnResp;
            }
        }
        else {
            //console.log('error is');
            //console.log(error);
            // Something else happened while setting up the request
            // triggered the error
            let returnResp = {
                status: false,
                msgType: 2,
                err: error.message,
                statusCode: error.response && error.response.status ? error.response.status : 0,
                data: {},
            };
            return returnResp;
        }
        //return Promise.reject(error.response || error.message);
    };

    //console.log('response is 1 sadasdasd asasd 4');
    return await client(options.baseURL, options)
        .then(resp => resp.json().then(res => onSuccess(res)))
        .catch(err => onError(err));
};

export { request, createReq, commonStruct, routes };

