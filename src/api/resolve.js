import {axios} from "@/utils/request";
import {SONG_MODULE, USER_MODULE} from "@/api/_prefix";

/*
    // TODO: newly added
    + user_id: number
 */
export const getUserById = (userId) => {
    console.log(userId)
    return axios.get(`${USER_MODULE}/${userId.userId}`, {})
        .then(res => {
            return res;
        });
}

/*
    // TODO: newly added
    + song_id: number
 */
export const getSongById = (songId) => {
    console.log(songId)
    return axios.get(`${SONG_MODULE}/${songId.songId}`, {})
        .then(res => {
            return res;
        });
}
