import { createApp } from 'vue'
import {router} from './router'
import App from './App.vue'
import axios from 'axios'
import ElementPlus from 'element-plus'
import pinia from './store/store'
import 'element-plus/dist/index.css'
import '@/style/ElStyle.css'

import 'tippy.js/dist/tippy.css';
import VueTippy from 'vue-tippy'

// const { app, BrowserWindow } = require('electron');
// // const path = require('path');
//
// let mainWindow;
//
// function createWindow() {
//     mainWindow = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             nodeIntegration: true
//         }
//     });
//
//     mainWindow.loadURL('http://localhost:8081'); // 这里指向 Spring Boot 后端服务
//     mainWindow.on('closed', () => {
//         mainWindow = null;
//     });
// }
//
// app.whenReady().then(() => {
//     createWindow();
//
//     app.on('activate', () => {
//         if (BrowserWindow.getAllWindows().length === 0) {
//             createWindow();
//         }
//     });
// });
//
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });



axios.defaults.baseURL = ("http://localhost:8081")
// axios.defaults.baseURL = ("http://172.29.4.13:8082")
axios.defaults.timeout = 30000;

createApp(App)
    .use(ElementPlus).use(
    VueTippy,
    // optional
    {
        directive: 'tippy', // => v-tippy
        componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
        defaultProps: {
            placement: 'top',
            allowHTML: true,
            arrow: false,
        }, // => Global default options * see all props
    }
)
    .use(router)
    .use(pinia)
    .mount('#app')