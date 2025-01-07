/* eslint-disable */
<script setup>
// Vue Basics
import {computed, onMounted, ref, watch} from "vue"

// Assets
import {LOOP_MODE, NORMAL_MODE, PAUSE, PLAY, RANDOM_MODE} from "../assets/base64";

// Components
import Header from "../components/Header";
import LeftSideBar from "../components/LeftSideBar";
import SearchView from "../components/SearchView.vue";

// Others
import {useTheme} from "../store/theme";
import {formatTime} from '../utils/formatTime';
import {getUserById} from "../api/resolve";
import {ElMessage} from "element-plus";
import {getAllAudios} from "../api/song";


/*
    BACKGROUND
 */
const theme = useTheme()


/*
    ORIGINAL DESIGNS
 */
// main-elements
let song;
let progress;

// buttons
let playPauseButtons;
let forwardButtons;
let backwardButtons;
let playModeButtons;
let shareButtons;

// icons
let controlIcon;
let playModeIcon;

// test items
let progresses;
let controlIcons;
let playModeIcons;

function updateSongInfo() {
	try {
		if (songs.value[currentSongIndex.value]) {
			controlIcons.forEach(controlIcon => {
				controlIcon.src = PLAY;
			});
			song.src = songs.value[currentSongIndex.value].filePath;
			song.load();
			song.play();
			isPaused.value = false;
			theme.full(songs.value[currentSongIndex.value]?.picPath);
		}
	} catch (e) {
		console.log("Uncaught Error in updateSongInfo!", e);
	}
}


const registerDOMs = () => {
	/*
        Navs & Containers
	 */
	const navItems = document.querySelectorAll(".nav-item");
	const containers = document.querySelectorAll(".containers");
	
	navItems.forEach((navItem) => {
		navItem.addEventListener("click", () => {
			navItems.forEach((item) => {
				item.className = "nav-item";
			});
			navItem.className = "nav-item active";
		});
	});
	containers.forEach((container) => {
		let isDragging = false;
		let startX;
		let scrollLeft;
		
		container.addEventListener("mousedown", (e) => {
			isDragging = true;
			startX = e.pageX - container.offsetLeft;
			scrollLeft = container.scrollLeft;
		});
		container.addEventListener("mousemove", (e) => {
			if (!isDragging) {
				return;
			}
			e.preventDefault();
			
			const x = e.pageX - container.offsetLeft;
			const step = (x - startX) * 0.6;
			container.scrollLeft = scrollLeft - step;
		});
		container.addEventListener("mouseup", () => {
			isDragging = false;
		});
		container.addEventListener("mouseleave", () => {
			isDragging = false;
		});
		container.addEventListener('wheel', (e) => {
			container.scrollLeft += e.deltaY / 2;
		});
	});
	
	/*
        Songs Related
	 */
	song = document.getElementById("song");
	playPauseButtons = document.querySelectorAll(".play-pause-btn");
	forwardButtons = document.querySelectorAll(".controls button.forward");
	backwardButtons = document.querySelectorAll(".controls button.backward");
	playModeButtons = document.querySelectorAll(".play-mode-btn");
	shareButtons = document.querySelectorAll(".share-btn");
	
	progresses = document.querySelectorAll('.idProgress');
	controlIcons = document.querySelectorAll('.idControlIcon');
	playModeIcons = document.querySelectorAll('.idPlayModeIcon');
	
	
	function shareSong() {
		console.log("Hello!");
	}
	
	function playPause() {
		isPaused.value = !isPaused.value;
		try {
			if (song.paused) {
				song.play();
				controlIcons.forEach(controlIcon => {
					controlIcon.src = PLAY;
				});
			} else {
				song.pause();
				controlIcons.forEach(controlIcon => {
					controlIcon.src = PAUSE;
				});
			}
		} catch (e) {
			console.log("Uncaught Error in playPause!", e);
		}
	}
	
	function switchPlayMode() {
		playingMode.value = (playingMode.value + 1) % 3
		switch (playingMode.value) {
			case 0:
				playModeIcons.forEach(playModeIcon => {
					playModeIcon.src = NORMAL_MODE;
				});
				break;
			case 1:
				playModeIcons.forEach(playModeIcon => {
					playModeIcon.src = LOOP_MODE;
				});
				break;
			case 2:
				playModeIcons.forEach(playModeIcon => {
					playModeIcon.src = RANDOM_MODE;
				});
				break;
			default:
				break;
		}
	}
	
	song.addEventListener("loadedmetadata", function () {
		progresses.forEach(progress => {
			duration.value = song.duration;
			progress.max = song.duration;
			progress.value = song.currentTime;
		});
	});
	song.addEventListener("ended", function () {
		switchSongs(1);
	});
	song.addEventListener("timeupdate", function () {
		if (!song.paused) {
			progresses.forEach(progress => {
				progress.value = song.currentTime;
			});
		}
	});
	
	playPauseButtons.forEach(playPauseButton => {
		if (!playPauseButton._hasClickListener) {
			playPauseButton.addEventListener("click", playPause);
			playPauseButton._hasClickListener = true;
		}
	});
	playModeButtons.forEach(playModeButton => {
		if (!playModeButton._hasClickListener) {
			playModeButton.addEventListener("click", switchPlayMode);
			playModeButton._hasClickListener = true;
		}
	});
	shareButtons.forEach(shareButton => {
		if (!shareButton._hasClickListener) {
			shareButton.addEventListener("click", shareSong);
			shareButton._hasClickListener = true;
		}
	});
	forwardButtons.forEach(forwardButton => {
		if (!forwardButton._hasClickListener) {
			forwardButton.addEventListener("click", function () {
				switchSongs(1);
			});
			forwardButton._hasClickListener = true;
		}
	});
	backwardButtons.forEach(backwardButton => {
		if (!backwardButton._hasClickListener) {
			backwardButton.addEventListener("click", function () {
				switchSongs(-1);
			});
			backwardButton._hasClickListener = true;
		}
	});
	
	progresses.forEach(progress => {
		progress.addEventListener("input", function () {
			if (!song.paused) {
				song.currentTime = progress.value;
			}
		});
		progress.addEventListener("change", function () {
			try {
				if (song.paused) {
					song.play();
				}
			} catch (e) {
				console.log("Uncaught Error in change!", e);
			}
		});
	});
}


/*
    USER
 */
const userToken = ref(JSON.parse(sessionStorage.getItem('user-token')));
const currentUserId = ref(userToken.value.id);


/*
    SONGS
 */
// Playing Status
const songs = ref([]);
const volume = ref(1);
const volumePercentage = ref('100%');

// 添加音量变化处理
const updateVolumeStyle = (e) => {
	const volume = e.target.value;
	volumePercentage.value = (volume * 100) + '%';
};

// 监听volume变化，同步更新所有音量控制器的样式
watch(volume, (newValue) => {
	song.volume = newValue;
	volumePercentage.value = (newValue * 100) + '%';
});
const displayingSongs = ref([]);
const isPaused = ref(true);
const duration = ref(0);
const playingMode = ref(0); /* 0 - Normal, 1 - Loop, 2 - Random */

// Current Playing
const currentTime = ref(0);
const currentSongId = ref(1);
const currentSongIndex = ref(0);
const isPlayingPage = ref(false);
const togglePlayingPage = () => {
	isPlayingPage.value = !isPlayingPage.value;
	registerDOMs();
}
const switchSongs = (del) => {
	console.log(playingMode.value, currentSongIndex.value, songs.value.length)
	switch (playingMode.value) {
		case 0:
			console.log("normal mode")
			currentSongIndex.value = (currentSongIndex.value + del + songs.value.length) % songs.value.length;
			break;
		case 1:
			console.log("loop mode")
			currentSongIndex.value = currentSongIndex.value;
			break;
		case 2:
			console.log("random mode")
			currentSongIndex.value = Math.floor(Math.random() * songs.value.length);
			break;
		default:
			break;
	}
	currentSongId.value = songs.value[currentSongIndex.value].id;
	updateSongInfo();
}


/*
    SEARCH
 */
const songResult = ref([]);


/*
    icons (currently useless)
 */
const isSharing = ref(false);
const showNowPlaying = ref(false);
const showQueue = ref(false);
const showRightContent = computed(() => {
	return showQueue.value || showNowPlaying.value
});


onMounted(() => {
	getUserById({
		userId: currentUserId.value
	}).then(() => {
		console.log("Got user by id!")
	});
	getAllAudios(() => {
		/* Nothing here. */
	}).then(res => {
		console.log("Success")
		songResult.value = res.data.result;
	}).catch(() => {
		console.log("Failed")
		songResult.value = [
			{
				"id": 1,
				"songName": "歌曲名称获取失败-静态数据1",
				"artist": "艺术家",
				"composer": "专辑名",
				"picPath": "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/958cd3c3-718b-4d88-8799-d939b364741b.jpg",
				"filePath": "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/73f314a1-bfef-41f5-a1a0-a548478704b6.mp3"
			},
			{
				"id": 2,
				"songName": "歌曲名称获取失败-静态数据2",
				"artist": "艺术家",
				"composer": "专辑名",
				"picPath": "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/a5242443-46cd-492d-8f5e-e56fc40ce3d8.jpg",
				"filePath": "http://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/592d4e1c-1d57-4579-8df9-bc9f11ea347a.mp3"
			},
		];
	})
	
	/*
        DOM & EVENTS
	 */
	registerDOMs();
	const volumeControl = document.getElementById('volumeControl');
	if (volumeControl) {
		volumeControl.style.setProperty('--volume-percentage', '100%');
	}
})


const playArtistSong = (songToPlay) => {
	console.log("p", songToPlay)
	// 检查歌曲是否已经在播放列表中
	const existingIndex = songs.value.findIndex(song => song.id === songToPlay.id);
	
	if (existingIndex !== -1) {
		// 如果歌曲已存在，直接播放该歌曲
		currentSongIndex.value = existingIndex;
		currentSongId.value = songToPlay.id;
	} else {
		// 如果歌曲不存在，添加到播放列表开头并播放
		songs.value = [songToPlay, ...songs.value];
		currentSongIndex.value = 0;
		currentSongId.value = songToPlay.id;
	}
	
	if (song) {
		controlIcons.forEach(controlIcon => {
			controlIcon.src = PLAY;
		});
		song.src = songToPlay.filePath;
		song.load();
		song.play();
		theme.full(songToPlay.picPath);
		isPaused.value = false;  // 设置为播放状态
	}
};

const pauseCurrentSong = () => {
	if (song) {
		song.pause();
		controlIcons.forEach(controlIcon => {
			controlIcon.src = PAUSE;
		});
		isPaused.value = true;  // 设置为暂停状态
	}
};

const updateSongs = (newSongs) => {
	console.log("u")
	songs.value = newSongs;
	displayingSongs.value = [...newSongs];
};

function updateCurrentTime(event) {
	currentTime.value = event.target.currentTime;
}
</script>

<template>
	<div class="body" v-show="!isPlayingPage">
		
		<!-- MAIN & RIGHT CONTENT -->
		<Header class="header" allow-search></Header>
		<img class="logo" src="../assets/pictures/logos/logo3.png" alt="">
		<left-side-bar class="left-side-bar"/>
		<div class="content" :class="{ 'full-width': !showRightContent }">
			<div class="main-view" :class="{ 'expanded': !showRightContent }">
				<el-container class="playlist-container" style="overflow: auto; height: 730px ;border-radius: 12px">
					<SearchView :songResult="songResult"
					            :current-song-id="currentSongId"
					            :is-paused="isPaused"
					            @playSong="playArtistSong"
					            @updateSongs="updateSongs"
					            @pauseSong="pauseCurrentSong"
					            :playlistResult=[]
					            :play-list=[]
					/>
				</el-container>
			</div>
			<div v-if="showRightContent" class="right-content">
				<div v-if="songs[currentSongIndex] !== undefined && showQueue" class="music-player music-info">
					<div class="album-cover" @click="togglePlayingPage">
						<img :src="songs[currentSongIndex].picPath" style="margin-top: 10px" id="rotatingImage" alt=""/>
						<span class="point"></span>
					</div>
					<h2>{{ songs[currentSongIndex].title }}</h2>
					<p>{{ songs[currentSongIndex].artist }}</p>
				</div>
			</div>
		</div>
		
		
		<!-- FOOTER -->
		<footer>
			<div class="bottom-description bottom-component"
			     style="display: flex; flex-direction: row; justify-content: center;">
				<div @click="togglePlayingPage">
					<img v-if="songs[currentSongIndex] !== undefined"
					     :src="songs[currentSongIndex].picPath" alt=""
					     style="
						     width: 60px;
						     margin: 0 0 0 10px;
						     border-radius: 5%;
							 border: 2px solid rgba(222, 215, 255, 0.9);
							 max-width: 120px;
							 box-shadow: 0 10px 60px rgba(200, 187, 255);
						"/>
					<audio id="song" @timeupdate="updateCurrentTime">
						<source
							v-if="songs[currentSongIndex] !== undefined"
							:src="songs[currentSongIndex].filePath"
							type="audio/mpeg"/>
					</audio>
				</div>
				<div v-if="songs[currentSongIndex] !== undefined"
				     style="display: flex; flex-direction: column; justify-content: center;">
					<p style="font-family: Consolas, serif; color: white; font-size: 16px; text-align: left; margin-left: 5px">
						{{ songs[currentSongIndex].title }}</p>
					<p style="font-family: Consolas, serif; color: white; font-size: 16px; text-align: left; margin-left: 5px">
						{{ songs[currentSongIndex].artist }}</p>
				</div>
			</div>
			
			<el-card class="bottom-controller bottom-component" style="
						position: absolute;
					    left: 50%;
					    transform: translateX(-50%);
					">
				<div class="controls" style="display: flex; flex-direction: row; margin: 10px 0 0 0">
					<button class="share-btn" style="margin: 0">
						<img src="../assets/icons/controller/mute.png" alt="" style="width: 60%">
					</button>
					<button class="backward" style="margin: 0 10px 0 10px">
						<img src="../assets/icons/controller/last.png" alt="" style="width: 60%">
					</button>
					<button class="play-pause-btn" style="margin: 0 10px 0 10px">
						<img id="controlIcon" class="idControlIcon" src="../assets/icons/controller/play.png" alt=""
						     style="width: 60%">
					</button>
					<button class="forward" style="margin: 0 10px 0 10px">
						<img src="../assets/icons/controller/next.png" alt="" style="width: 60%">
					</button>
					<button class="play-mode-btn" style="margin: 0">
						<img id="playModeIcon" class="idPlayModeIcon" src="../assets/icons/controller/normal.png" alt=""
						     style="width: 60%">
					</button>
				</div>
				<div style="display: flex; flex-direction: row; margin-top: 10px">
					<p style="margin-right: 10px; margin-bottom: 60px; color: white">{{ formatTime(currentTime) }}</p>
					<input type="range" value="0" id="progress" class="idProgress"
					       style="margin: 0 0 10px 0; width: 500px"/>
					<p style="margin-left: 10px; margin-bottom: 60px; color: white">{{ formatTime(duration) }}</p>
				</div>
			</el-card>
			
			<div class="right-controls">
				<div class="volume-control" style="display: flex; flex-direction: row; align-items: center">
					<h1 style="margin: 0">🔈</h1>
					<input type="range"
					       id="volumeControl"
					       min="0"
					       max="1"
					       step="0.01"
					       v-model="volume"
					       @input="updateVolumeStyle"
					       :style="{'--volume-percentage': volumePercentage}"
					/>
				</div>
			</div>
		</footer>
	</div>
	

</template>

<style scoped>

*,
*::before,
*::after {
	box-sizing: border-box;
	padding: 0;
	margin: 0;
}

.logo {
	position: absolute;
	top: 0px;
	left: -10px;
	width: 8%;
	height: 8%;
	z-index: 114514;
}

nav {
	user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
}

nav ul,
nav ul li {
	outline: 0;
}

nav ul li a {
	text-decoration: none;
}

img {
	width: 100%;
}

h1 {
	font-size: clamp(1.2rem, 3vw, 1.5rem);
}

.body {
	font-family: "Nunito", sans-serif;
	height: 100%;
	min-height: 100vh;
	background-color: #000000; /* rgba(0, 0, 0, 1); */
	background-repeat: no-repeat;
	background-size: cover;
	display: grid;
	grid-template-areas:
        "global-nav global-nav global-nav"
        "left-sidebar main-view main-view"
        "now-playing-bar now-playing-bar now-playing-bar";
	grid-template-columns: auto 1fr;
	grid-template-rows: 10% 81% 9%;
	grid-auto-rows: min-content;
	
	column-gap: 8px;
	padding: 8px;
	overflow: hidden;
}

/* HEADER */
.header {
	grid-area: global-nav;
	z-index: 1000;
}

/* TEMP */

left-side-bar {
	grid-area: left-sideBar;
	
}

.content {
	grid-area: main-view;
	
}

footer {
	grid-area: now-playing-bar;
	
}

/* MAIN MENU */

footer {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 75px;
	width: 100%;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
}

.user-info img {
	padding: 12px 24px 6px;
	border-radius: 50%;
}

.user-info p {
	color: #fff;
	font-size: clamp(0.8rem, 3vw, 1rem);
	font-weight: 500;
	text-align: center;
	line-height: 1;
	padding: 0 6px 32px;
}

.nav-item a {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 1rem;
	padding: 12px 0;
	margin: 0 8px;
	border-radius: 5px;
}

.nav-item.active a {
	background: rgba(106, 109, 155, 0.5);
	text-decoration: none;
}

/* CONTENT 包含中间和右边栏 是grid布局*/
.content {
	height: 100%;
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-rows: 100%;
	transition: all 0.3s ease;
	column-gap: 8px;
	
}

.content.full-width {
	grid-template-columns: 100% !important;
	
}

/* LEFT CONTENT */
.main-view {
	overflow: scroll;
	background-color: #121212 !important;
}

.main-view > {
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: #e5e5e5;
	transition: all 0.3s ease;
	margin: 0;
	padding: 0;
}

.main-view.expanded {
	
	margin: 0;
	padding: 0;
	width: 100%;
}

.swiper-slide img {
	border-radius: 20px;
	height: 300px;
	object-fit: cover;
	border: 2px solid rgba(159, 160, 168, 0.5);
}

/* ALBUMS */
.playlist-item img {
	inset: 0;
	width: 60px;
	object-fit: cover;
	transition: transform 0.8s;
	pointer-events: none;
	aspect-ratio: 1/1;
	border: 2px solid rgba(169, 150, 253, 0.5);
	border-radius: 10px;
	box-shadow: rgba(221, 221, 221, 0.3) 0px 8px 18px -3px,
	rgba(221, 221, 221, 0.2) 0px -3px 0px inset;
}

.playlist-item:hover img {
	transform: rotate(3deg) scale(1.14514);
}

.album-frame img {
	position: absolute;
	inset: 0;
	height: 100%;
	object-fit: cover;
	transition: transform 0.8s;
	pointer-events: none;
}

.album-frame:hover img {
	transform: rotate(3deg) scale(1.2);
}

.album h2 {
	font-size: clamp(0.9rem, 4vw, 1.1rem);
	font-weight: 500;
	line-height: 1.3;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
	max-width: 150px;
	
	@supports (-webkit-line-clamp: 2) {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}

.album p {
	font-size: clamp(0.9rem, 4vw, 1rem);
	opacity: 0.5;
}



/* RIGHT CONTENT */

.right-content {
	min-width: 350px;
	max-width: 350px;
	background-color: #171717;
	display: flex;
	flex-direction: column;
	border-radius: 12px;
	padding: 10px 20px 20px;
	color: #e5e5e5;
}

/* SONGS */
.song-img img {
	aspect-ratio: 4/3;
	border-radius: inherit;
	object-fit: cover;
	border: 2px solid rgba(159, 160, 168, 0.5);
	box-shadow: rgba(221, 221, 221, 0.3) 0px 6px 18px -3px,
	rgba(221, 221, 221, 0.2) 0px -3px 0px inset;
}

.song-img .overlay {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 92%;
	background-color: rgba(169, 150, 253, 0.6);
	border-radius: inherit;
	font-size: 1.75rem;
	opacity: 0;
	transition: all 0.4s linear;
	cursor: pointer;
}

.song-img:hover .overlay {
	opacity: 1;
}

.song h2 {
	font-size: 1rem;
}

.song p,
.song span {
	font-size: 0.8rem;
	font-weight: 300;
}

.song p {
	opacity: 0.8;
}

/* MUSIC PLAYER */

.music-player {
	display: flex;
	align-items: center;
	flex-direction: column;
	color: #fff;
	background: rgba(188, 184, 198, 0.2);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	box-shadow: inset 2px -2px 6px rgba(214, 214, 214, 0.2),
	inset -3px 3px 3px rgba(255, 255, 255, 0.3);
	border-radius: 16px;
	height: 210px;
}

.album-cover {
	position: relative;
}

.album-cover img {
	border-radius: 50%;
	border: 2px solid rgba(222, 215, 255, 0.9);
	max-width: 120px;
	aspect-ratio: 1/1;
	object-fit: cover;
	box-shadow: 0 10px 60px rgba(200, 187, 255);
	transition: transform 0.5s ease-out;
	pointer-events: none;
	user-select: none;
}

.point {
	position: absolute;
	top: 50%;
	left: 50%;
	-ms-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	width: 16px;
	background-color: rgba(17, 6, 58, 0.7);
	border: 2px solid rgba(222, 215, 255, 0.9);
	aspect-ratio: 1/1;
	border-radius: 50%;
	z-index: 2;
}

.music-player h2 {
	font-size: 1.2rem;
	font-weight: 500;
	margin: 8px 0 0 0;
}

.music-player p {
	font-size: 1rem;
	font-weight: 300;
	margin-bottom: 26px;
	opacity: 0.8;
}

/* Music Player Controls */

#progress {
	appearance: none;
	-webkit-appearance: none;
	width: 100%;
	height: 6px;
	background: rgba(200, 187, 255, 0.6);
	border-radius: 4px;
	margin-bottom: 16px;
	cursor: pointer;
}

#progress::-webkit-slider-thumb {
	appearance: none;
	-webkit-appearance: none;
	background: rgb(77, 58, 162);
	width: 20px;
	aspect-ratio: 1/1;
	border-radius: 50%;
	border: 4px solid rgb(234, 229, 255);
	box-shadow: 0 6px 10px rgba(200, 187, 255, 0.4);
}

.controls {
	display: flex;
	justify-content: center;
	align-items: center;
}

.controls button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	aspect-ratio: 1/1;
	margin: 20px;
	background: rgba(255, 255, 255, 0.6);
	border-radius: 50%;
	border: 0;
	outline: 0;
	color: #fff;
	font-size: 1.1rem;
	box-shadow: 0 4px 8px rgba(200, 187, 255, 0.3);
	cursor: pointer;
	transition: all 0.3s linear;
}

.controls button:is(:hover, :focus-visible) {
	transform: scale(0.96);
}

.controls button:nth-child(3) {
	transform: scale(1.3);
}

.controls button:nth-child(3):is(:hover, :focus-visible) {
	transform: scale(1.25);
}

.controls button:nth-child(1) {
	transform: scale(0.8);
}

.controls button:nth-child(5) {
	transform: scale(0.8);
}

/* MEDIA QUERIES */


@media (max-width: 1500px) {
	main {
		grid-template-columns: 15% 85%;
	}
	
	.user-info img {
		border-radius: 50%;
		padding: 12px 12px 6px;
	}
	
	.content {
		grid-template-columns: 70% 30%;
	}
}

@media (max-width: 1310px) {
	main {
		grid-template-columns: 8% 92%;
		margin: 30px;
	}
}

@media (max-width: 1250px) {
	.swiper-slide img {
		border-radius: 16px;
		height: 280px;
	}
	
	.controls button {
		margin: 15px;
	}
}

@media (max-width: 1100px) {
	.content:not(.full-width) {
		grid-template-columns: 60% 40%;
	}

	.swiper-slide img {
		height: 220px;
	}

}

@media (max-width: 910px) {
	main {
		grid-template-columns: 10% 90%;
		margin: 20px;
	}
	
	.main-view {
		/*padding: 30px 20px 20px;*/
	}
	
	.swiper-slide img {
		height: 180px;
	}
	
	.album {
		grid-template-rows: 3fr 2fr;
	}
	
	.album-frame {
		width: 100px;
	}
	
	.right-content {
		grid-template-rows: 55% 45%;
	}
	
}

@media (max-width: 825px) {
	.content:not(.full-width) {
		grid-template-columns: 52% 48%;
	}
	
	.swiper-slide {
		width: 280px;
	}
	
	.swiper-slide img {
		height: 200px;
	}
	
	.slide-overlay button {
		padding: 8px 12px;
	}
	
}

@media (max-width: 750px) {
	main {
		grid-template-columns: 15% 85%;
	}
	
	.content:not(.full-width) {
		grid-template-columns: 100%;
		grid-template-areas:
        "leftContent"
        "rightContent";
	}
	
	.main-view {
		grid-area: leftContent;
	}
	
	.album {
		grid-template-rows: 3fr 2fr;
	}
	
	.album-frame {
		width: 140px;
	}
	
	.right-content {
		grid-area: rightContent;
		border-left: unset;
		grid-template-rows: 60% 40%;
		row-gap: 16px;
	}
	
	#progress {
		width: 60%;
	}
	
	.controls button {
		margin: 20px;
	}
}

@media (max-width: 580px) {
	.swiper-slide {
		width: 290px;
	}
	
	.swiper-slide img {
		height: 180px;
	}
	
	.artist img {
		width: 80px;
	}
}

@media (max-width: 450px) {
	.user-info img {
		border-radius: 50%;
		padding: 6px 6px 2px;
	}
	
}

.album-details img {
	width: 150px;
	height: 150px;
	border-radius: 10px;
}

.details-text h2 {
	margin: 10px 0;
	font-size: 24px;
}

.details-text p {
	font-size: 16px;
	color: #bbb;
}

/* 动画：淡入效果 */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.right-controls {
	display: flex;
	align-items: center;
	gap: 16px;
	position: absolute;
	right: 80px;
}

.feature-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.1);
	transition: all 0.2s ease;
	position: relative;
	cursor: pointer;
	color: white;
}

.feature-icon:hover {
	background: rgba(255, 255, 255, 0.2);
	transform: translateY(-2px);
}

.feature-icon img {
	width: 16px;
	height: 16px;
	transition: all 0.2s ease;
}

.feature-icon:hover img {
	filter: brightness(1.2);
}

.feature-icon[data-tooltip]:hover::after {
	content: attr(data-tooltip);
	position: absolute;
	top: -25px;
	left: 50%;
	transform: translateX(-50%);
	background-color: #282828;
	color: white;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	white-space: nowrap;
	z-index: 1000;
}

.feature-icon.active {
	background: #1db954;
}

.feature-icon.active img,
.feature-icon.active svg {
	filter: brightness(0) invert(1);
}

.feature-icon.active:hover {
	background: #1ed760;
}

.album-cover {
	width: 240px;
	height: 240px;
	border-radius: 10px;
	object-fit: cover;
}

.seek-bar input {
	width: 100%; /* 让进度条宽度填满可用空间 */
	margin-top: 10px;
}

.playlist-item img {
	transition: all 0.3s ease;
}

.playlist-item img.playing {
	border-color: #ddc323;
	box-shadow: 0 0 10px rgba(221, 195, 35, 0.5);
	transform: scale(1.05);
}

.playlist-item:hover img:not(.playing) {
	transform: scale(1.05);
	border-color: rgba(255, 255, 255, 0.8);
}


/* 设置整个页面的输入范围滑条样式 */
#volumeControl {
	-webkit-appearance: none; /* 去掉默认样式 */
	appearance: none;
	width: 120px; /* 设置宽度 */
	height: 4px; /* 设置高度 */
	border-radius: 2px; /* 设置圆角 */
	outline: none; /* 去除焦点时的轮廓 */
	transition: background 0.3s; /* 背景色平滑过渡 */
}

/* 设置滑块按钮样式 */
#volumeControl::-webkit-slider-thumb {
	-webkit-appearance: none; /* 去掉默认样式 */
	appearance: none;
	width: 12px; /* 设置滑块宽度 */
	height: 12px; /* 设置滑块高度 */
	border-radius: 50%; /* 圆形滑块 */
	background: #fff; /* 设置滑块背景颜色为白色 */
	border: none; /* 去除边框 */
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
	cursor: pointer; /* 设置鼠标悬停时的指针样式 */
	transition: all 0.2s ease; /* 添加过渡效果 */
}

/* 滑块按钮悬停效果 */
#volumeControl::-webkit-slider-thumb:hover {
	transform: scale(1.2);
}

/* 设置滑块被点击时的样式 */
#volumeControl:active::-webkit-slider-thumb {
	background: #8bc34a; /* 点击时滑块的背景颜色 */
	border-color: #66bb6a; /* 点击时滑块边框颜色 */
}
</style>
