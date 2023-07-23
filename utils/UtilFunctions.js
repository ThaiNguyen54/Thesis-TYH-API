'use strict';
import Axios from "axios";
import * as fs from "fs";

export function VariableTypeChecker (value, type, length) {
    let result;
    let minLength;
    result = !(typeof  value != type || value == null || value.length <= minLength)
    return result
}

export async function DownloadImage(url, filename) {
    const response = await Axios.get(url, {responseType: 'arraybuffer'})

    fs.writeFile(filename, response.data, (error) => {
        if (error) throw error
        console.log('Image downloaded successfully')
    })
}

export function removeExtension(filename) {
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
}

