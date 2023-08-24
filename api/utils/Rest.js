'use strict';

export function SendSuccessToken (res, token, user) {
    if(!res) {
        return;
    }

    let out = {};
    out.success = true;
    out.token = token;
    out.id = user._id;
    out.LoginName = user.LoginName;
    out.UserName = user.UserName;
    out.Avatar = user.Avatar;
    out.BackgroundImg = user.BackgroundImg;
    out.RegisterDate = user.RegisterDate;
    out.Email = user.Email;
    res.status(200);
    res.contentType('json');
    return res.json(out);

}

export function SendError (res, code, message, httpCode, description, error) {
    if (!res) {
        return;
    }

    let output = {};
    output.success = false;
    output.code = code;
    output.message = message ? message.toString() : "Unidentified error";

    if(description) {
        output.description = description.toString();
    }
    else if (error) {
        output.error = error;
    }

    console.log(output);
    let status = httpCode ? httpCode : 500;

    res.status(status);
    res.contentType('json');
    return res.json(output);
}

export function SendSuccess (res, data, iHttpCode, message) {
    if(!res) {
        return;
    }

    let HttpStatus = iHttpCode ? iHttpCode : 200;
    let out = {
        "success": true,
        "message": message
    };

    if(data) {
        out.data = data;
    }

    res.status(HttpStatus);
    res.contentType('json');
    return res.json(out);
}