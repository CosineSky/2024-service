<script setup>
import {defineEmits, onMounted, ref} from "vue";
import musicAlbumOpened from "../icon/musicAlbumOpened.vue";
import musicAlbumClosed from "../icon/musicAlbumClosed.vue";
import searchIcon from "../icon/searchIcon.vue";
import plusIcon from "../icon/plusIcon.vue";
import playButton from "../icon/playButton.vue";
import {ElMessage, ElPopover} from "element-plus";


const emit = defineEmits();
const musicAlbums = ref([]);

let albumHoveredIndex = ref(null);
let hoverOnAlbum = ref(false);
let isSideBarOpen = ref(true);
let sideBarWidth = ref(250);
let user = ref("HanG");
const criticalWidth = 180;
const maximumWidth = 310;
const minWidth = 75;

/*
    USER
 */
const userToken = ref(JSON.parse(sessionStorage.getItem('user-token')));

function toggleSideBar() {
	isSideBarOpen = !isSideBarOpen;
	sideBarWidth.value = isSideBarOpen ? criticalWidth : minWidth;
}

function startResizing(event) {
	event.preventDefault();
	const initialWidth = sideBarWidth.value;
	const initialMouseX = event.clientX;
	
	const onMouseMove = (moveEvent) => {
		sideBarWidth.value = initialWidth + (moveEvent.clientX - initialMouseX);
		// 确保宽度不小于最小值
		if (sideBarWidth.value <= criticalWidth) {
			isSideBarOpen = false;
			sideBarWidth.value = minWidth;
		}
		// 确保宽度不大于最大值
		else if (sideBarWidth.value >= maximumWidth) {
			sideBarWidth.value = maximumWidth;
		} else
			isSideBarOpen = true;
	};
	
	const onMouseUp = () => {
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
	};
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mouseup', onMouseUp);
}

function toggleSearchBar() {
	const input = document.querySelector(".search-input");
	input.classList.toggle('active'); // 切换输入框的显示状态
	input.focus(); // 点击搜索图标后聚焦输入框
}

function blurSearchBar() {
	const input = document.querySelector(".search-input");
	if (input.classList.contains('active'))
		input.classList.remove('active');
	
}

function searchAlbum() {
	const input = document.querySelector(".search-input").value;
	// TODO:提交表单
}

onMounted(() => {

})

const popover1 = ref(null)

const closePopover = () => {
	popover1.value.hide();
}


defineProps({
	callParentFunction: Function
})


</script>

<template>
	<nav class="main-menu resizable-box" :style="{ width: sideBarWidth + 'px'}">
		<div class="top-control">
			<div class="toggle-button" @click="toggleSideBar">
				<music-album-opened v-tippy="{ content: '打开音乐库' }" v-if="isSideBarOpen"/>
				<music-album-closed v-tippy="{ content: '折叠音乐库' }" v-if="!isSideBarOpen"/>
				<p style="margin-left: 15px;font:normal small-caps bold 20px Arial, sans-serif ;" v-if="isSideBarOpen">
					音乐库</p>
			</div>
			
			<el-popover v-if="isSideBarOpen" class="dropdown-options"
			            ref="popover1"
			            :width="200"
			            trigger="click"
			            :hide-after=0
			            popper-class="left-popover">
				<template #reference>
					<div class="add-album">
						<plus-icon v-tippy="{ content: '创建新歌单' }" class="plus-icon"/>
					</div>
				</template>
				<ul @click="closePopover">
					<li>添加歌单</li>
				</ul>
			</el-popover>
		
		</div>
		<div class="search-container">
			<div class="search-album" v-if="isSideBarOpen" @click="toggleSearchBar">
				<search-icon v-tippy="{ content: '搜索歌单' }" class="search-icon"/>
			</div>
			<input type="text" class="search-input" placeholder="输入搜索歌单" @keydown.enter="searchAlbum"
			       @blur="blurSearchBar"/>
		</div>
		
		
		<div class="musicAlbums"
		     @mouseenter="()=>{hoverOnAlbum=true}"
		     @mouseleave="()=>{hoverOnAlbum=false}"
		     :style="{ scrollbarWidth : hoverOnAlbum? 'auto':'none'}"
		>
			<el-empty/>
			<div v-if="musicAlbums !== undefined" v-for="album in musicAlbums"
			     :key="album.id"
			     @mouseenter="()=>{albumHoveredIndex = album.id}"
			     @mouseleave="()=>{albumHoveredIndex = null}"
			     :style="{backgroundColor: albumHoveredIndex === album.id ? '#1F1F1F' : '#121212' }"
			     @click="emit('setCurrentPlaylist', album);"
			     class="musicAlbum-item">
				<img
					:src="album.picPath"
					alt="playlist"
					class="musicAlbum-image"
					:style="{opacity:albumHoveredIndex === album.id ? 0.4 :1}"
				/>
				<play-button v-tippy="{ content: '从头播放音乐' }" @click="" v-if="albumHoveredIndex === album.id"
				             class="play-button"/>
				
				<div class="musicAlbum-description">
					<p style="padding-bottom: 5px;font-size: 18px">{{ album.title }}</p>
					<p v-if="album.title !== '我喜欢的歌曲'" style="color: #b2b2b2;font-size: 13px">歌单 •
						{{ userToken.username }}</p>
					<p v-else style="color: #b2b2b2;font-size: 13px">默认收藏夹</p>
				</div>
			</div>
		</div>
		<div class="resizer" @mousedown="startResizing" :style="{left:(sideBarWidth+8) +'px'}"></div>
	
	</nav>
</template>

<style scoped>

*,
*::before,
*::after {
	box-sizing: border-box;
	padding: 0;
	margin: 0;
}

ul {
	background-color: #282828;
	list-style-type: none;
	margin: 0;
	border-radius: 10px;
	padding: 5px;
}

li {
	color: white;
	padding: 10px 12px;
	border-radius: 10px;
}

li:hover {
	cursor: pointer;
	background-color: #404040;
	text-decoration: underline;
}

nav {
	user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
}


.main-menu.resizable-box {
	/* position: relative; /*使得子元素的absotute是相对于该元素 这里不设置，位置通过js控制 不然的话resizer会被gap遮蔽*/
	display: flex;
	flex-direction: column;
	border: none;
	border-radius: 12px;
	padding: 12px 0 20px;
	overflow: hidden;
	font-family: inherit;
	background-color: #121212;
	
}

.top-control {
	margin-top: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.add-album {
	color: #b2b2b2;
	margin-top: 5px;
	margin-right: 10px;
	width: 30px;
	cursor: pointer;
}

.search-container {
	margin: 12px 10px;
	display: flex;
	align-items: center;
	cursor: pointer;
}

.search-icon {
	font-size: 24px;
	transition: margin-right 0.3s ease;
}

.search-input {
	background-color: #404040;
	font-size: 15px;
	color: #ffffff;
	height: 35px;
	border: none;
	width: 0;
	opacity: 0;
	transition: width 0.3s ease, opacity 0.3s ease;
	padding: 5px;
	border-radius: 4px;
	outline: none;
}

.search-input.active {
	width: 70%; /* 设置输入框拉伸后的宽度 */
	opacity: 1;
}

.search-album {
	display: flex;
	color: #b2b2b2;
	width: 35px;
	height: 35px;
	cursor: pointer;
	align-items: center;
	justify-content: center;
}

.plus-icon {
	
	border-radius: 50%;
	transition: width, color, background-color ease-in-out 0.2s;
}

.plus-icon:hover {
	transform: scale(1.1);
	color: #efeeee;
	background-color: #404040;
}

.search-icon {
	padding: 3px;
	border-radius: 50%;
	transition: width, color, background-color ease-in-out 0.2s;
}

.search-icon:hover {
	transform: scale(1.05);
	color: #efeeee;
	background-color: #404040;
}

.toggle-button:hover {
	color: #efeeee;
}

.toggle-button {
	display: flex;
	align-items: center;
	width: 120px;
	margin: 0 0 0 16px;
	background-color: transparent;
	cursor: pointer;
	transition: color 0.2s ease;
	color: #b2b2b2;
}

.resizer {
	
	position: absolute;
	width: 7px;
	background-color: transparent;
	height: 92%;
	top: 85px;
	cursor: ew-resize; /* 水平调整光标 */
	
	&::before {
		opacity: 0;
		position: absolute;
		content: '';
		left: 3px;
		width: 1px;
		height: 100%;
		background-color: #9d9d9d;
		transition: opacity 0.2s ease-in-out;
	}
	
	&:hover::before {
		opacity: 1;
	}
}


.musicAlbums {
	height: 100%;
	padding: 0 10px 0 10px;
	overflow: auto;
	/*默认情况 滚动条消失*/
	
}

/*滑动条*/
.musicAlbums::-webkit-scrollbar {
	width: 12px; /* 滚动条宽度 */
}

.musicAlbums::-webkit-scrollbar:window-inactive {

}

.musicAlbums::-webkit-scrollbar-track {
	background: transparent; /* 滚动条背景 */
}

.musicAlbums::-webkit-scrollbar-thumb {
	background: #888; /* 滚动条颜色 */
	border-radius: 10px; /* 圆角 */
	
}

.musicAlbums::-webkit-scrollbar-thumb:hover {
	background-color: #555; /* 悬停时的颜色 */
}

.musicAlbum-item {
	display: flex;
	position: relative;
	align-items: center;
	border-radius: 10px;
	padding: 10px 0;
	color: #f6f6f6;
}

.musicAlbum-description {
	text-align: left;
	display: flex;
	flex-direction: column;
	
}

.musicAlbum-image {
	width: 55px; /* 调整图片大小 */
	height: 55px; /* 调整图片大小 */
	margin-right: 10px;
	border-radius: 10px;
}

.play-button {
	position: absolute;
	top: 20px;
	left: 10px;
	color: #f1f1f1; /* 播放键的颜色 */
	cursor: pointer; /* 鼠标移动到播放键上时显示为点击手型 */
	transition: transform 0.3s ease;
}

.play-button:hover {
	transform: scale(1.1);
}

.musicAlbum-description {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; /* 单行显示文本 */
}


</style>