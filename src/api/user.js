import { axios } from '../utils/request';
import { USER_MODULE } from './_prefix';

/*
    phone: string,
    password: string
 */
export const userLogin = (loginInfo) => {
    return axios.post(`${USER_MODULE}/login`, null, {
        params: loginInfo,
        headers: { 'Content-Type': 'application/json' }
    })
        .then((res) => {
            return res
        })
}

/*
    name: string,
    phone: string,
    password: string,
    captcha: string
 */
export const userRegister = (registerInfo) => {
    console.log(registerInfo)
    return axios.post(`${USER_MODULE}/register`, registerInfo, {
        headers: { 'Content-Type': 'application/json' }
    })
        .then((res) => {
            return res
        })
}

/*
    name: string,
    phone: string,
    password: string,
    captcha: string
 */
export const userUpdate = (updateInfo) => {
    return axios.post(`${USER_MODULE}`, null, {
        params: updateInfo,
        headers: { 'Content-Type': 'application/json' }
    })
        .then((res) => {
            return res
        })
}

/*
    Nothing
 */
export const userInfo = () => {
    return axios.get(`${USER_MODULE}`)
        .then(res => {
            return res;
        });
}
