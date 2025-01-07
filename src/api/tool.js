import {axios} from '../utils/request'
import {FILE_MODULE} from './_prefix'

/*
    // TODO - newly added
    payload: fileType
 */
export const uploadImage = (payload) => {
    console.log("Uploading file:", payload)
    return axios.post(`${FILE_MODULE}/images`, payload, {})
        .then(res => {
            return res
        })
}

/*
    // TODO - newly added
    payload: fileType
 */
export const uploadAudio = (payload) => {
    console.log("Uploading file:", payload)
    return axios.post(`${FILE_MODULE}/audios`, payload, {})
        .then(res => {
            return res
        })
}
