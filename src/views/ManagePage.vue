<script setup>
import {onMounted, ref} from "vue";
import {useTheme} from "../store/theme";
import ImageUploader from "../components/FileUploader.vue";
import {addNewAudio, deleteAudioById, updateAudioById} from "../api/song";

const theme = useTheme()

const song_id = ref("");
const song_title = ref("");
const song_artist = ref("");
const song_album = ref("");
const song_description = ref("");
const song_deletion = ref(false);

// 定义父组件的响应式变量
const song_url = ref('');
const cover_url = ref('');
const lyrics_url = ref('');

// 处理子组件传递过来的值
const receiveSongUrl = (value) => {
    song_url.value = value;
    console.log(song_url.value)
};
const receiveCoverUrl = (value) => {
    cover_url.value = value;
};
const receiveLyricsUrl = (value) => {
    lyrics_url.value = value;
};

function handleSubmit() {
	if (song_id.value === "") {
		addNewAudio({
			title: song_title.value,
			artist: song_artist.value,
			composer: song_album.value,
			arranger: song_description.value,
			audioFilePath: song_url.value,
			coverImagePath: cover_url.value,
		}).then(() => {
			console.log("Successfully uploaded a new song!")
		})
	}
	else {
		if (song_deletion.value) {
			deleteAudioById({
				songId : song_id.value,
			}).then(() => {
				console.log("Successfully deleted a song!")
			})
		}
		else {
			updateAudioById({
				title: song_title.value,
				artist: song_artist.value,
				composer: song_album.value,
				arranger: song_description.value,
				audioFilePath: song_url.value,
				coverImagePath: cover_url.value,
				songId : song_id.value,
			}).then(() => {
				console.log("Successfully updated a song!")
			})
		}
	}

}

onMounted(() => {
	theme.reset();
})
</script>

<template>
    <body>
	    <section class="user">
	        <div class="user_options-container">
	            <div class="user_options-text">
	                <div class="user_options-unregistered">
	                    <h2 class="user_unregistered-title">厌倦了那些老歌？</h2>
	                    <p class="user_unregistered-text">没关系！作为我们的音乐播放器管理者，您可以随时将全新的歌曲添加到我们的音乐库，打造属于您的专属旋律世界，随时随地与世界分享您的音乐心情。让每一首歌，都成为您灵感的源泉！</p>
		                <p class="user_unregistered-text">您只需在右侧的表单中填写歌曲的必要信息和文件。</p>
	                </div>
	                <div class="user_options-registered">
	                    <button class="user_registered-login" id="login-button">Login</button>
	                </div>
	            </div>
	            
	            <div class="user_options-forms" style="width: 640px" id="user_options-forms">
	                <div class="user_forms-login">
	                    <h2 class="forms_title">Upload A NEW SONG</h2>
	                    <form class="forms_form" >
	                        <div class="text-area">
		                        
	                            <h2>Song Information</h2>
	                            <div class="setting">
	                                <div class="setting-items">
	                                    <h3>Song Title</h3>
	                                    <input v-model="song_title" placeholder="..." type="text">
	                                </div>
	                                <div class="setting-items">
	                                    <h3>Artist</h3>
	                                    <input v-model="song_artist" placeholder="..." type="text">
	                                </div>
	                                <div class="setting-items">
	                                    <h3>Composer</h3>
	                                    <input v-model="song_album" placeholder="..." type="text">
	                                </div>
	                                <div class="setting-items">
	                                    <h3>Arranger</h3>
	                                    <input v-model="song_description" placeholder="..." type="text">
	                                </div>
	                            </div>
	                            
	                            <h2>Source Files</h2>
	                            <div class="setting">
	                                <div class="setting-items">
	                                    <h3>Song File(.mp3)</h3>
	                                    <image-uploader @updateFileUrl="receiveSongUrl"/>
	                                </div>
	                                <div class="setting-items">
	                                    <h3>Cover File(.jpg)</h3>
	                                    <image-uploader @updateFileUrl="receiveCoverUrl"/>
	                                </div>
	                                <div class="setting-items">
	                                    <h3>Lyrics File(.lyc)</h3>
	                                    <image-uploader @updateFileUrl="receiveLyricsUrl"/>
	                                </div>
	                            </div>
		                        
		                        <h2>Song ID</h2>
		                        <h3 style="margin-bottom: 10px">Only fill when you're to modify an existed song.</h3>
		                        <div class="setting">
			                        <div class="setting-items">
				                        <h3>DELETE SONG</h3>
				                        <input v-model="song_deletion" placeholder="..." type="checkbox" style="height: 100%">
			                        </div>
			                        <div class="setting-items">
				                        <h3>Song ID</h3>
				                        <input v-model="song_id" placeholder="..." type="text">
			                        </div>
		                        </div>
	                        </div>
	                        <div>
                                <input style="margin: 5px 5px 30px 5px" @click="handleSubmit" type="submit" value="Let's ROCK!" class="forms_buttons-action">
		                        <router-link to="/home" class="home-btn">
			                        <input style="margin: 5px" type="submit" value="Back" class="forms_buttons-cancel">
		                        </router-link>
	                        </div>
	                    </form>
	                </div>
	
	            </div>
	        </div>
	    </section>
    </body>
</template>

<style scoped>
/**
 * * General configs
 * */
*,
*::before,
*::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}

body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: "Nunito", sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url("../assets/pictures/bg4.jpg");
    background-repeat: no-repeat;
    background-size: cover;
}

button {
    background-color: transparent;
    padding: 0;
    border: 0;
    outline: 0;
    cursor: pointer;
}

.text-area {
    padding: 20px 20px 0 20px;
    h2 {
        text-transform: uppercase;
        font-size: 1.2em;
        margin-bottom: 20px;
        letter-spacing: .2em;
        font-weight: 480;
    }
    h3 {
        text-transform: uppercase;
        font-size: .9em;
        letter-spacing: .2em;
        font-weight: 320;
    }
    p {
        font-size: .7em;
        width: 75%;
        line-height: 2em;
    }
    span {
        font-size: .9em;
        line-height: 2em;
    }
}


.setting {
    position: relative;
    padding-bottom: 20px;
}

.setting-items {
    display: flex;
    margin-bottom: 20px;
    flex-direction: row;
    justify-content: space-between;
}

input[type=text] {
    height: 40px;
}

input::-moz-placeholder {
    font-size: 0.85rem;
    font-family: "Montserrat", sans-serif;
    font-weight: 300;
    letter-spacing: 0.1rem;
    color: #ccc;
}
input:-ms-input-placeholder {
    font-size: 0.85rem;
    font-family: "Montserrat", sans-serif;
    font-weight: 300;
    letter-spacing: 0.1rem;
    color: #ccc;
}
input::placeholder {
    font-size: 0.85rem;
    font-family: "Montserrat", sans-serif;
    font-weight: 300;
    letter-spacing: 0.1rem;
    color: #ccc;
}

/**
 * * Page background
 * */
.user {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-size: cover;
}
.user_options-container {
    position: relative;
    width: 80%;
}
.user_options-text {
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-color: rgba(34, 34, 34, 0.85);
    border-radius: 3px;
}

/**
 * * Registered and Unregistered user box and text
 * */
.user_options-registered,
.user_options-unregistered {
    width: 50%;
    padding: 75px 45px;
    color: #fff;
    font-weight: 300;
}

.user_unregistered-title {
    margin-bottom: 15px;
    font-size: 1.66rem;
    line-height: 1em;
}

.user_unregistered-text {
    font-size: 0.83rem;
    line-height: 1.4em;
}

.user_registered-login {
    margin-top: 30px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 10px 30px;
    color: #fff;
    text-transform: uppercase;
    line-height: 1em;
    letter-spacing: 0.2rem;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
.user_registered-login:hover {
    color: rgba(34, 34, 34, 0.85);
    background-color: #ccc;
}

/**
 * * Login and signup forms
 * */
.user_options-forms {
    position: absolute;
    top: 50%;
    left: 30px;
    width: calc(50% - 30px);
    min-height: 800px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 2px 0 15px rgba(0, 0, 0, 0.25);
    overflow: auto;
    transform: translate3d(100%, -50%, 0);
    transition: transform 0.4s ease-in-out;
}
.user_options-forms .user_forms-login {
    transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
}
.user_options-forms .forms_title {
    margin-bottom: 10px;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1em;
    text-transform: uppercase;
    color: #e8716d;
    letter-spacing: 0.1rem;
}

.user_options-forms :focus {
    border-color: gray;
}

.user_options-forms {
    font-family: "Montserrat", sans-serif;
    letter-spacing: 0.1rem;
    color: #ccc;
    text-decoration: underline;
    transition: color 0.2s ease-in-out;
}
.user_options-forms {
    color: #b3b3b3;
}


.user_options-forms .forms_buttons-action {
    background-color: #e8716d;
    border-radius: 3px;
    padding: 10px 35px;
    font-size: 1rem;
    font-family: "Montserrat", sans-serif;
    font-weight: 480;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.1rem;
    transition: background-color 0.2s ease-in-out;
}
.user_options-forms .forms_buttons-action:hover {
    background-color: #e14641;
}
.user_options-forms .forms_buttons-cancel {
	background-color: #469de3;
	border-radius: 3px;
	padding: 10px 35px;
	font-size: 1rem;
	font-family: "Montserrat", sans-serif;
	font-weight: 480;
	color: #ffffff;
	text-transform: uppercase;
	letter-spacing: 0.1rem;
	transition: background-color 0.2s ease-in-out;
}
.user_options-forms .forms_buttons-cancel:hover {
	background-color: #4c7ce3;
}

.user_options-forms .user_forms-signup,
.user_options-forms .user_forms-login {
    position: absolute;
    top: 70px;
    left: 40px;
    width: calc(100% - 80px);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out, transform 0.5s ease-in-out;
}

.user_options-forms .user_forms-login {
    transform: translate3d(0, 0, 0);
    opacity: 1;
    visibility: visible;
}

.user_options-forms input[type=text] {
    border-bottom: 1px solid #ccc;
    padding: 6px 20px 6px 6px;
    font-family: "Montserrat", sans-serif;
    font-size: 1.1rem;
    font-weight: 320;
    color: gray;
    letter-spacing: 0.1rem;
    transition: border-color 0.2s ease-in-out;
}

/**
 * * Responsive 990px
 * */
@media screen and (max-width: 990px) {
    .user_options-forms {
        min-height: 350px;
    }

    .user_options-forms .user_forms-login .forms_buttons-action {
        margin-top: 30px;
    }
    .user_options-forms,
    .user_options-forms .user_forms-login {
        top: 40px;
    }
    
    .user_options-registered,
    .user_options-unregistered {
        padding: 50px 45px;
    }
}


</style>