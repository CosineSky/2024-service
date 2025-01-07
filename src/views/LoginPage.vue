<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {userInfo, userLogin, userRegister} from "../api/user.js";
import {useTheme} from "../store/theme";
import {router} from "../router";
import {md5} from "js-md5";
import NotificationToast from '../components/NotificationToast.vue';

const theme = useTheme()

const loginPhone = ref('');
const registerPhone = ref('');
const loginPassword = ref('');
const registerPassword = ref('');
const registerPasswordConfirm = ref('');
const name = ref('');
const reset = ref(false);

// 电话号码的规则
const chinaMobileRegex = /^(?:(?:\+|00)86)?1(?:3\d|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8\d|9[01256789])\d{8}$/

const toasts = ref([]);
let toastId = 0;

const showToast = (message, type = 'info') => {
	const id = toastId++;
	toasts.value.push({
		id,
		message,
		type
	});
	
	setTimeout(() => {
		toasts.value = toasts.value.filter(toast => toast.id !== id);
	}, 3000);
};

// 修改表单验证和提示
const validatePhone = (phone) => {
	if (!phone) {
		showToast('请输入手机号码', 'error');
		return false;
	}
	if (!chinaMobileRegex.test(phone)) {
		showToast('请输入正确的手机号码格式', 'error');
		return false;
	}
	return true;
};

onMounted(() => {
	theme.reset();
	
	let switchCtn = document.querySelector("#switch-cnt");
	let switchC1 = document.querySelector("#switch-c1");
	let switchC2 = document.querySelector("#switch-c2");
	let switchCircle = document.querySelectorAll(".switch_circle");
	let switchBtn = document.querySelectorAll(".switch-btn");
	let aContainer = document.querySelector("#a-container");
	let bContainer = document.querySelector("#b-container");
	let allButtons = document.querySelectorAll(".submit");
	
	const initializeLoginForm = () => {
		// 设置初始状态为登录表单
		switchCtn.classList.add("is-txr");
		switchCircle[0].classList.add("is-txr");
		switchCircle[1].classList.add("is-txr");
		
		switchC1.classList.add("is-hidden");
		switchC2.classList.remove("is-hidden");
		aContainer.classList.add("is-txl");
		bContainer.classList.add("is-txl");
		bContainer.classList.add("is-z");
	}
	
	let getButtons = (e) => e.preventDefault()
	let changeForm = () => {
		// 修改类名
		switchCtn.classList.add("is-gx");
		setTimeout(function () {
			switchCtn.classList.remove("is-gx");
		}, 1500)
		switchCtn.classList.toggle("is-txr");
		switchCircle[0].classList.toggle("is-txr");
		switchCircle[1].classList.toggle("is-txr");
		
		switchC1.classList.toggle("is-hidden");
		switchC2.classList.toggle("is-hidden");
		aContainer.classList.toggle("is-txl");
		bContainer.classList.toggle("is-txl");
		bContainer.classList.toggle("is-z");
	}
	
	// 点击切换
	const setupEventListeners = () => {
		allButtons.forEach(button => {
			button.addEventListener("click", getButtons);
		});
		switchBtn.forEach(btn => {
			btn.addEventListener("click", changeForm);
		});
	}
	
	initializeLoginForm();
	setupEventListeners();
	
	onUnmounted(() => {
		allButtons.forEach(button => {
			button.removeEventListener("click", getButtons);
		});
		switchBtn.forEach(btn => {
			btn.removeEventListener("click", changeForm);
		});
	});
})

function handleLogin() {
	if (!validatePhone(loginPhone.value)) return;
	
	if (!loginPassword.value) {
		showToast('请输入密码', 'error');
		return;
	}
	
	const hashedPassword = md5.create().update(loginPassword.value);
	userLogin({
		phone: loginPhone.value,
		password: hashedPassword.hex()
	}).then(res => {
		if (res.data.code === '000' || res.data.code === '200') {
			showToast('登录成功', 'success');
			const token = res.data.result;
			sessionStorage.setItem('token', token);
			router.push({path: "/home"});
			userInfo().then(res => {
				sessionStorage.setItem('user-token', JSON.stringify(res.data.result));
				router.push({path: "/home"});
			});
		} else if (res.data.code === '400') {
			showToast(res.data.msg || '手机号或密码错误', 'error');
			loginPassword.value = '';
		}
	}).catch(() => {
		showToast('登录失败，请稍后重试', 'error');
	});
}

// 添加表单验证方法
const validateRegisterForm = () => {
	if (!name.value) {
		showToast('请输入用户名', 'error');
		return false;
	}
	if (!validatePhone(registerPhone.value)) return false;
	if (!registerPassword.value) {
		showToast('请输入密码', 'error');
		return false;
	}
	if (!registerPasswordConfirm.value) {
		showToast('请确认密码', 'error');
		return false;
	}
	if (registerPassword.value !== registerPasswordConfirm.value) {
		showToast('两次输入的密码不一致', 'error');
		return false;
	}
	return true;
};


function handleRegister() {
	if (!validateRegisterForm()) return;
	
	const hashedPassword = md5.create().update(registerPassword.value);
	userRegister({
		name: name.value,
		phone: registerPhone.value,
		password: hashedPassword.hex(),
	}).then(res => {
		if (res.data.code === '000' || res.data.code === '200') {
			showToast('注册成功', 'success');
			location.reload();
		} else if (res.data.code === '400') {
			showToast(res.data.msg || '注册失败，请重试', 'error');
		}
	}).catch(() => {
		showToast('注册失败，请稍后重试', 'error');
	});
}
</script>

<template>
	<body>
	<video autoplay muted loop id="video-background">
		<source src="../assets/videos/3.mp4" type="video/mp4">
		Your browser does not support the video tag.
	</video>
	<div class="shell">
		<div v-if="!reset" class="container a-container" id="a-container">
			<div class="toast-list">
				<NotificationToast
					v-for="toast in toasts"
					:key="toast.id"
					:message="toast.message"
					:type="toast.type"
				/>
			</div>
			<form action="" method="" class="form" id="a-form">
				<h2 class="form_title title">创建账号</h2>
				<input type="text" class="form_input"
				       placeholder="昵称" v-model="name">
				<input type="text" class="form_input"
				       placeholder="手机号" v-model="registerPhone">
				<input type="password" class="form_input"
				       placeholder="密码" v-model="registerPassword">
				<input type="password" class="form_input"
				       :class="{ 'error': registerPassword !==  registerPasswordConfirm}"
				       placeholder="确认密码" v-model="registerPasswordConfirm">
				<div style="display:flex; justify-content: space-between">
					<button style="margin-left: 10px" class="form_button button submit" @click="handleRegister">
						注册账户
					</button>
				</div>
			
			</form>
		</div>
		
		<div v-if="reset" class="container a-container" id="a-container">
			<div class="toast-list">
				<NotificationToast
					v-for="toast in toasts"
					:key="toast.id"
					:message="toast.message"
					:type="toast.type"
				/>
			</div>
		</div>
		
		<div class="container b-container" id="b-container">
			<div class="toast-list">
				<NotificationToast
					v-for="toast in toasts"
					:key="toast.id"
					:message="toast.message"
					:type="toast.type"
				/>
			</div>
			<form action="" method="" class="form" id="b-form">
				<h2 class="form_title title">登录账号</h2>
				<input type="text" class="form_input"
				       placeholder="手机号" v-model="loginPhone">
				<input type="password" class="form_input"
				       placeholder="密码" v-model="loginPassword">
				<div style="display: flex; flex-direction: column; justify-content: center">
					<button class="form_button button submit" @click="handleLogin">登录</button>
				</div>

			</form>
		</div>
		
		<div class="switch" id="switch-cnt">
			<div class="switch_circle"></div>
			<div class="switch_circle switch_circle-t"></div>
			<div class="switch_container" id="switch-c1">
				<h2 class="switch_title title" style="letter-spacing: 0;">Welcome Back！</h2>
				<p class="switch_description description">已经有账号了嘛，去登录账号继续跟随节拍前行吧！！！</p>
				<button class="switch_button button button-light switch-btn" @click="reset = false">去登录</button>
			</div>
			
			<div class="switch_container is-hidden" id="switch-c2">
				<h2 class="switch_title title" style="letter-spacing: 0;">Hello Friend！</h2>
				<p class="switch_description description">去注册一个账号，成为尊贵的粉丝会员，让我们踏入奇妙的旅途！</p>
				<button class="switch_button button button-light switch-btn">去注册</button>
			</div>
		</div>
	</div>
	</body>
</template>

<style scoped>
/**
 * * General variables
 * */
/**
 * * General configs
 * */
*,
*::before,
*::after {
	box-sizing: border-box;
	padding: 0;
	margin: 0;
	user-select: none;
}

body {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
	color: #a0a5a8;
}

.shell {
	position: relative;
	width: 1000px;
	min-width: 1000px;
	min-height: 600px;
	height: 600px;
	padding: 25px;
	background-color: #ecf0f3;
	border-radius: 12px;
	overflow: hidden;
}

/* 设置响应式 */
@media (max-width: 1200px) {
	.shell {
		transform: scale(0.7);
	}
}

@media (max-width: 1000px) {
	.shell {
		transform: scale(0.6);
	}
}

@media (max-width: 800px) {
	.shell {
		transform: scale(0.5);
	}
}

@media (max-width: 600px) {
	.shell {
		transform: scale(0.4);
	}
}

.container {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	width: 600px;
	height: 100%;
	padding: 25px;
	background-color: #ecf0f3;
	transition: 1.25s;
}

.form {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.iconfont {
	margin: 0 5px;
	border: rgba(0, 0, 0, 0.5) 2px solid;
	border-radius: 50%;
	font-size: 25px;
	padding: 3px;
	opacity: 0.5;
	transition: 0.1s;
}

.iconfont:hover {
	opacity: 1;
	transition: 0.15s;
	cursor: pointer;
}

.form_input {
	width: 350px;
	height: 40px;
	margin: 4px 0;
	padding-left: 25px;
	font-size: 13px;
	color: black;
	letter-spacing: 0.15px;
	border: none;
	outline: none;
	background-color: #ecf0f3;
	transition: 0.25s ease;
	border-radius: 8px;
	box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
}

.form_input:focus {
	box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9;
}

.error {
	color: red; /* 错误边框颜色 */
}

.form_span {
	margin-top: 30px;
	margin-bottom: 12px;
}

.form_link {
	color: #181818;
	font-size: 15px;
	margin-top: 25px;
	border-bottom: 1px solid #a0a5a8;
	line-height: 2;
}

.title {
	font-size: 34px;
	font-weight: 700;
	line-height: 3;
	color: #181818;
	letter-spacing: 10px;
}

.description {
	font-size: 14px;
	letter-spacing: 0.25px;
	text-align: center;
	line-height: 1.6;
}

.button {
	width: 180px;
	height: 50px;
	border-radius: 25px;
	margin-top: 50px;
	font-weight: 700;
	font-size: 14px;
	letter-spacing: 1.15px;
	background-color: #4B70E2;
	color: #f9f9f9;
	box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
	border: none;
	outline: none;
}

.button-light {
	background-color: #4b9ee2;
}

.a-container {
	z-index: 100;
	left: calc(100% - 600px);
}

.b-container {
	left: calc(100% - 600px);
	z-index: 0;
}

.switch {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 400px;
	padding: 50px;
	z-index: 200;
	transition: 1.25s;
	background-color: #ecf0f3;
	overflow: hidden;
	box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #d1d9e6;
}

.switch_circle {
	position: absolute;
	width: 500px;
	height: 500px;
	border-radius: 50%;
	background-color: #ecf0f3;
	box-shadow: inset 8px 8px 12px #b8bec7, inset -8px -8px 12px #fff;
	bottom: -60%;
	left: -60%;
	transition: 1.25s;
}

.switch_circle-t {
	top: -30%;
	left: 60%;
	width: 300px;
	height: 300px;
}

.switch_container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	position: absolute;
	width: 400px;
	padding: 50px 55px;
	transition: 1.25s;
}

.switch_button {
	cursor: pointer;
}

.switch_button:hover,
.submit:hover {
	box-shadow: 6px 6px 10px #d1d9e6, -6px -6px 10px #f9f9f9;
	transform: scale(0.985);
	transition: 0.25s;
}

.switch_button:active,
.switch_button:focus {
	box-shadow: 2px 2px 6px #d1d9e6, -2px -2px 6px #f9f9f9;
	transform: scale(0.97);
	transition: 0.25s;
}

.is-txr {
	left: calc(100% - 400px);
	transition: 1.25s;
	transform-origin: left;
}

.is-txl {
	left: 0;
	transition: 1.25s;
	transform-origin: right;
}

.is-z {
	z-index: 200;
	transition: 1.25s;
}

.is-hidden {
	visibility: hidden;
	opacity: 0;
	position: absolute;
	transition: 1.25s;
}

.is-gx {
	animation: is-gx 1.25s;
}

@keyframes is-gx {
	
	0%,
	10%,
	100% {
		width: 400px;
	}
	
	30%,
	50% {
		width: 500px;
	}
}

.iconfont {
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
	cursor: pointer;
}

.logo {
	position: absolute;
	top: -10px;
	left: -10px;
	width: 150px;
	height: 150px;
}

#video-background {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover; /* 确保视频填充整个视口 */
	z-index: -1; /* 将视频置于内容后面 */
}

.toast-list {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 9999;
	pointer-events: none;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>