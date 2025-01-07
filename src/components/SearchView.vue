<script setup>
import {onMounted, onUnmounted, ref, watch} from "vue";
import Empty from "./Empty.vue";
import {ElPopover} from "element-plus";
import playButton from "../icon/playButton.vue";
import checkMark from "../icon/checkMark.vue";
import pauseButton from "../icon/pauseButton.vue";

const emit = defineEmits(['pauseSong', 'updateSongs', 'back', 'switchToArtist', 'playSong']);
const props = defineProps({
	songResult: {
		type: Array,
		required: true,
	},
	currentSongId: {
		type: Number,
		// required: true
	},
	isPaused: {
		type: Boolean,
	}
});
const currentTab = ref('songs')

const handleTabClick = (tab) => {
	currentTab.value = tab
}
const userToken = ref(JSON.parse(sessionStorage.getItem('user-token')));
const currentUserId = ref(userToken.value.id);

// const songDurations = ref(new Map());
// watch(() => props.musicList, (newSongs) => {
//   loadSongDurations(newSongs, songDurations);
// }, { immediate: true });

let musicHoveredIndex = ref(null);
let musicClickedIndex = ref(null);
let musicPlayIndex = ref(null);
let musicPauseIndex = ref(null);
const isFirstPlay = ref(true);

const playFromId = (musicId) => {
	if (musicId === null || musicId === undefined) {
		if (props.songResult && props.songResult.length > 0) {
			musicPlayIndex = props.songResult[0].id;
			if (isFirstPlay) {
				isFirstPlay.value = false;
				emit('updateSongs', props.songResult);
			}
			emit('playSong', props.songResult[0]);
		}
	} else {
		musicPlayIndex = musicId;
		const songToPlay = props.songResult.find(song => song.id === musicId);
		if (songToPlay) {
			if (isFirstPlay) {
				isFirstPlay.value = false;
				emit('updateSongs', props.songResult);
			}
			emit('playSong', songToPlay);
		}
	}
	musicPauseIndex = null;
}

const pauseMusic = (musicId) => {
	musicPauseIndex = musicId;
	emit('pauseSong');
}

const enterArtistDescription = (artistName) => {
	emit('switchToArtist', artistName);
}

const popovers = ref([])
const getPopoverIndex = (popover) => {
	if (popover) {
		popovers.value.push(popover);
	}
}
const closePopover = (e) => {
	popovers.value.forEach((item) => {
		item.hide();
	})
}

onMounted(() => {
	musicPlayIndex = props.currentSongId;
	musicClickedIndex = props.currentSongId;
	musicPauseIndex = props.isPaused ? props.currentSongId : null;
})

onUnmounted(() => {
	popovers.value = null;
})

watch(() => props.currentSongId, (newId) => {
	if (newId) {
		musicPlayIndex = newId;
		musicClickedIndex = newId;
		musicPauseIndex = props.isPaused ? newId : null;
	}
}, {immediate: true});

watch(() => props.isPaused, (newValue) => {
	if (newValue) {
		musicPauseIndex = musicPlayIndex;
	} else {
		musicPauseIndex = null;
	}
});
</script>

<template>
	<div class="search-view">
		<h1></h1>
		<div class="search-results">
			<div v-if="currentTab === 'songs'">
				<div class="tips">
					<p style="position:absolute; left:31px">#</p>
					<p style="position:absolute; left:132px">标题</p>
					<p class="album-text" style="position:absolute; left:60%">专辑</p>
					<p style="margin-left: auto; margin-right:30px">收藏</p>
				</div>
				<div class="musicList">
					<div class="music-item"
					     v-for="music in songResult"
					     :key="music.id"
					     :aria-selected="musicClickedIndex === music.id ? 'True':'False'"
					     @mouseenter="()=>{musicHoveredIndex = music.id;}"
					     @mouseleave="()=>{musicHoveredIndex = -1}"
					     @click="musicClickedIndex=music.id"
					     @dblclick="playFromId(music.id)"
					     :style="{backgroundColor: musicClickedIndex===music.id ? '#404040': musicHoveredIndex === music.id ? 'rgba(54,54,54,0.7)' :'rgba(0,0,0,0)',
				    }"> <!--@click事件写在script中的函数里 无法及时触发:style中的样式!!!-->
						<div style="width: 20px"
						     :style="{visibility: musicHoveredIndex === music.id||musicPlayIndex === music.id ? 'hidden' : 'visible' }">
							{{
								songResult.indexOf(music) + 1
							}}
						</div>
						<play-button @click="playFromId(music.id)" style="position: absolute;left: 14px;cursor: pointer"
						             v-if="(musicHoveredIndex === music.id&&musicPlayIndex!==music.id)||musicPauseIndex===music.id"
						             :style="{color: musicPauseIndex===music.id ? '#1ed660' : 'white'}"/>
						
						<pause-button @click="pauseMusic(music.id)"
						              style="color:#1ed660 ;position: absolute;left: 17px;cursor: pointer"
						              v-if="musicPlayIndex===music.id&&musicHoveredIndex === music.id&&musicPauseIndex!==music.id"/>
						<img width="17" height="17" alt=""
						     style="position: absolute;left: 24px;"
						     v-if="musicPlayIndex===music.id&&musicHoveredIndex !== music.id&&musicPauseIndex!==music.id"
						     src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif">
						
						<div class="music-detailed-info">
							<img class="music-image"
							     :src="music.picPath"
							     alt="歌曲图片"/>
							<div class="music-name-author" style="padding-left: 5px;">
								<p class="music-name"
								   :style="{color : musicPlayIndex ===music.id? '#1ED660':''}"
								   :class="[musicPlayIndex === music.id ? 'music-after-click' : '']"
								>{{ music.songName }} </p>
								<p class="music-author"
								   :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
									{{ music.artist }}</p>
							</div>
						</div>
						<div class="music-album-info" :style="{color:musicHoveredIndex === music.id? 'white' : '#b2b2b2'}">
							{{ music.composer }}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="(songResult.length === 0 && currentTab === 'songs')">
			<Empty :magic="Math.floor(Math.random() * 8)"/>
		</div>
	</div>
</template>


<style scoped>
ul {
	background-color: #282828;
	list-style-type: none;
	padding: 0;
	margin: 0;
	border-radius: 10px;
}

li {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: white;
	padding: 15px 12px;
}

li:hover {
	background-color: #363636;
	border-radius: 12px;
	cursor: pointer;
	text-decoration: underline;
}


p {
	text-align: left;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0;
}

.search-view {
	padding: 0;
	width: 100%;
}

.back-button {
	position: relative;
	margin: 24px 0 40px 24px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: 50%;
	color: #fff;
	transition: all 0.2s ease;
}

.search-results {
	list-style-type: none;
	padding: 0;
	width: 100%;
}

.tips {
	z-index: 0;
	display: flex;
	position: relative;
	padding: 5px 8px 5px 8px;
	width: 100%;
	box-sizing: border-box;
	user-select: none;
	color: #fff;
}

.musicList {
	border-top: 1px solid #363636;
	margin-top: 10px;
}

/*每行音乐的样式*/
.music-item {
	position: relative;
	border-radius: 10px;
	display: flex;
	align-items: center;
	padding: 10px 0 10px 25px;
	flex-grow: 1;
	min-width: 0;
	color: #fff;
}

/*左侧信息*/
.music-detailed-info {
	display: flex;
	flex-direction: row;
}

.music-image {
	display: flex;
	align-items: center;
	padding-left: 30px;
	height: 50px;
	width: 50px; /* Adjust as needed */
	border-radius: 10px;
}

.music-name {
	padding-bottom: 5px;
	font-size: 18px
}

.music-name:hover {
	cursor: pointer;
	text-decoration: underline;
}

.music-author {
	color: #b2b2b2;
	font-size: 15px
}

.music-author:hover {
	cursor: pointer;
	text-decoration: underline;
}

/*专辑信息*/
.music-album-info {
	width: 30%;
	text-align: left;
	position: absolute;
	left: 60%;
	color: #b2b2b2;
	text-overflow: ellipsis;
}

.music-album-info:hover {
	cursor: pointer;
	text-decoration: underline;
}

.info h3 {
	font-size: 18px;
	color: #e7e7e7;
}

.info p {
	font-size: 14px;
	color: #a9a9a9;
}
</style>
