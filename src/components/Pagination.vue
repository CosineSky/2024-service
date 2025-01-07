<script setup>
const props = defineProps({
	total: {
		type: Number,
		required: true
	},
	pageSize: {
		type: Number,
		required: true
	},
	currentPage: {
		type: Number,
		required: true
	},
	background: {
		type: Boolean,
		default: false
	},
	layout: {
		type: String,
		default: 'prev, pager, next'
	}
})

const emit = defineEmits(['size-change', 'current-change'])
</script>

<template>
	<div class="box">
		<el-pagination
			@size-change="emit('size-change', $event)"
			@current-change="emit('current-change', $event)"
			:current-page="currentPage"
			:page-size="pageSize"
			:background="background"
			:layout="layout"
			:total="total"
		/>
	</div>
</template>

<style lang="less" scoped>
.box {
	display: flex;
	justify-content: center;
	padding: 30px 0;
}

:deep(.el-pagination) {
	display: flex;
	align-items: center;
	gap: 4px;
	
	button, .el-pager li {
		background-color: transparent !important;
		color: rgb(210, 210, 210) !important;
		min-width: 32px;
		height: 32px;
		line-height: 32px;
		padding: 0;
		margin: 0;
		border-radius: 4px;
		font-weight: normal;
		font-size: 13px;
		border: 1px solid rgba(255, 255, 255, 0.15) !important;
		transition: all 0.3s;
		
		&:hover:not(.is-active):not(:disabled) {
			background-color: rgba(220, 55, 55, 0.5) !important;
			color: white !important;
		}
		
		&.is-active {
			background-color: rgb(236, 65, 65) !important;
			color: white !important;
			border: none !important;
		}
		
		&:disabled {
			border: 1px solid rgba(255, 255, 255, 0.15) !important;
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
	
	.el-pager {
		display: flex;
		gap: 4px;
		margin: 0;
		padding: 0;
		
		.more {
			border: none !important;
			
			&:hover {
				background-color: transparent !important;
			}
		}
		
		li.number::marker {
			display: none;
			content: "";
		}
	}
}
</style>
