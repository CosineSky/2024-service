import { axios } from '../utils/request';
import { SONG_MODULE } from './_prefix';


/*
    // TODO - modified
    no params needed
 */
export const getAllAudios = () => {
    return axios.get(`${SONG_MODULE}`, {})
        .then(res => {
            return res;
        });
}

/*
    // TODO - modified
    song_name: string
    album?: string
    artist: string
    + description: string
    audio_path: string
    + cover_path: string
    lyrics_path?: string
    upload_time: datetime
 */
export const addNewAudio = (songInfo) => {
    console.log(songInfo)
    return axios.post(`${SONG_MODULE}`, songInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res;
        });
}

/*
    // TODO - newly added
    audioId: number
    audioVO: {
        song_name: string,
        song_author: string,
    }
 */
export const updateAudioById = (audioId) => {
    console.log(audioId)
    return axios.put(`${SONG_MODULE}/${audioId.songId}`, audioId,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res;
        });
}

/*
    // TODO - newly added
    audioId: number
 */
export const deleteAudioById = (audioId) => {
    console.log(audioId)
    return axios.delete(`${SONG_MODULE}/${audioId.songId}`,{})
        .then(res => {
            return res;
        });
}

/*
    // TODO - modified
    no params needed
 */
export const getCounts = () => {
    return axios.get(`${SONG_MODULE}/counts`, {})
        .then(res => {
            return res;
        });
}
