<script setup>
import {ref} from "vue";
import {uploadAudio, uploadImage} from "../api/tool";
import {defineEmits} from 'vue';

const emit = defineEmits();
const fileList = ref([])
const fileUrl = ref('')
const isUploadingFiles = ref(false);

const handleExceed = () => {
    alert("File count exceeded!")
}

const handleChange = (file, fileList) => {
    isUploadingFiles.value = true;
    fileList.value = fileList
    let formData = new FormData()
    formData.append('file', file.raw)
	uploadAudio(formData)
        .then(res => {
            fileUrl.value = res.data.result
            isUploadingFiles.value = false;
            passFileUrl(fileUrl.value)
	        console.log("File Url: ", fileUrl.value)
        })
}

const checkFile = (file, fileType) => {
	const fileExt = file.name.split('.').pop().toLowerCase()
	const isAllowedSize = () => {
		return file.size / 1024 / 1024 < 32;
	}
	const isAllowedType = () => {
		switch (fileType) {
			case 'cover':
				return fileExt === 'png' || fileExt === 'jpg';
			case 'audio':
				return fileExt === 'mp3';
			case 'lyrics':
				return fileExt === 'lyc';
			default:
				return false;
		}
	}
	
	return isAllowedSize() && isAllowedType();
}

const uploadHttpRequest = () => {
    return new XMLHttpRequest()
}

const passFileUrl = (url) => {
    emit('updateFileUrl', url);
};
</script>

<template>
    <el-upload
        v-model:file-list="fileList"
        :limit="1"
        list-type="picture"
        :on-change="handleChange"
        :on-exceed="handleExceed"
        :on-remove="handleChange"
        :http-request="uploadHttpRequest"
        drag
    >
    </el-upload>
</template>

<style scoped>
el-upload {
    width: 100px;
}
</style>