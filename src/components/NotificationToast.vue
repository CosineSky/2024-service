<template>
	<Transition name="toast">
		<div v-if="show"
		     class="toast-container"
		     :class="type">
			<div class="toast-content">
				<div class="toast-message">{{ message }}</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue';

const props = defineProps({
	message: {
		type: String,
		required: true
	},
	type: {
		type: String,
		default: 'info'
	},
	duration: {
		type: Number,
		default: 3000
	}
});

const show = ref(false);
let timer = null;

onMounted(() => {
	show.value = true;
	if (props.duration > 0) {
		timer = setTimeout(() => {
			show.value = false;
		}, props.duration);
	}
});

onUnmounted(() => {
	if (timer) clearTimeout(timer);
});
</script>

<style scoped>
.toast-container {
	position: fixed;
	top: 8%;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16px 24px;
	color: white;
	z-index: 9999;
	width: 350px;
	border-radius: 8px;
	backdrop-filter: blur(8px);
}

.toast-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-right: 12px;
	width: 24px;
}

.error-icon, .success-icon {
	font-size: 20px;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
}

.success {
	background: rgba(76, 175, 80, 0.95);
}

.error {
	background: rgb(227, 30, 35);
}

.info {
	background: rgba(33, 150, 243, 0.95);
}

.toast-content {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.toast-message {
	font-size: 14px;
	line-height: 1.4;
	font-weight: 500;
	text-align: center;
	margin: 0 auto;
}

.toast-enter-active,
.toast-leave-active {
	transition: all 0.3s ease;
}

.toast-enter-from {
	opacity: 0;
	transform: translate(-50%, -20px);
}

.toast-leave-to {
	opacity: 0;
	transform: translate(-50%, -20px);
}

.success .toast-message {
	color: #E8F5E9;
}

.error .toast-message {
	color: #ffffff;
}

.toast-container {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style> 