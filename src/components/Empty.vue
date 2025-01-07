<script setup>
import {ref} from "vue";

const color = ref("#72d1fa")
const magic = defineProps({
	magic: {}
});
const emptyTitle = ref("未找到结果 :(")
const emptyMessage = ref([
	"抱歉，我们的数据库没跟上你的品味！",
	"找不到歌曲，就像音符没有五线谱，太难了！",
	"我们的服务器翻遍了每一个角落，但它只找到一根吉他弦。",
	"这首歌可能太低调了，没被发现，你试试更流行的？",
	"歌曲还没到现场呢，它可能堵在了节拍上。",
	"搜索结果为空，但你的音乐灵感无穷无尽，试试换个关键词？",
	"您搜的这首歌，可能还在火星上热播呢。",
	"天哪！连AI都找不到，快去录制它，或许你是原创之神。",
])
</script>

<template>
	<svg width="380px" height="500px" viewBox="0 0 837 1045" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<path d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z" id="Polygon-1" stroke="#007FB2" stroke-width="6"></path>
			<path d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z" id="Polygon-2" stroke="#20a0d3" stroke-width="6"></path>
			<path d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z" id="Polygon-3" stroke="#40c2f5" stroke-width="6"></path>
			<path d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z" id="Polygon-4" stroke="#09b7ff" stroke-width="6"></path>
			<path d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z" id="Polygon-5" stroke="#72d1fa" stroke-width="6"></path>
		</g>
	</svg>
	<div class="message-box">
		<h1>{{emptyTitle}}</h1>
		<p>{{emptyMessage[magic.magic]}}</p>
	</div>
</template>

<style scoped>
body {
	background-color: #2F3242;
}
svg {
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -250px;
	margin-left: -400px;
}
.message-box {
	height: 200px;
	width: 380px;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -100px;
	margin-left: 50px;
	color: #FFF;
	font-family: "Comic Sans MS", 幼圆, serif;
	font-weight: 300;
}
.message-box h1 {
	font-size: 60px;
	line-height: 46px;
	margin-bottom: 40px;
}

#Polygon-1 , #Polygon-2 , #Polygon-3 , #Polygon-4 , #Polygon-4, #Polygon-5 {
	animation: float 1s infinite ease-in-out alternate;
}
#Polygon-2 {
	animation-delay: .2s;
}
#Polygon-3 {
	animation-delay: .4s;
}
#Polygon-4 {
	animation-delay: .6s;
}
#Polygon-5 {
	animation-delay: .8s;
}

@keyframes float {
	100% {
		transform: translateY(20px);
	}
}
@media (max-width: 450px) {
	svg {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -250px;
		margin-left: -190px;
	}
	.message-box {
		top: 50%;
		left: 50%;
		margin-top: -100px;
		margin-left: -190px;
		text-align: center;
	}
}
</style>