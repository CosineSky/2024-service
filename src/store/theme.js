import { defineStore } from 'pinia'
import ColorThief from 'colorthief'
import { toggleImg } from '@/utils'

export const useTheme = defineStore('themeId', {
    state() {
        return {
            bgColor: '',
            pointer: 1
        }
    },
    actions: {
        change(src) {
            const app = document.querySelector('#opacity-bg1')
            const opacityBg = document.querySelector('#opacity-bg')
            if (src) {
                toggleImg(src).then((img) => {
                    const colorThief = new ColorThief()
                    let rgb = colorThief.getColor(img)
                    rgb = [
                        Math.min(rgb[0] * 0.7, 255),
                        Math.min(rgb[1] * 0.8, 255),
                        Math.min(rgb[2] * 0.9, 255),
                    ];


                    const isRepeat = rgb.every((rgb, index) => {
                        return rgb === this.bgColor[index]
                    })
                    if (isRepeat) {
                        return
                    }
                    this.bgColor = rgb
                    if (this.pointer === 0) {
                        app.style.backgroundImage = `linear-gradient(rgb(${rgb}) , rgb(19, 19, 26) 50%)`
                        app.style.transition = 'background-color 1s ease';
                        app.style.opacity = '1'
                        opacityBg.style.opacity = '0'
                        this.pointer = 1
                    } else {
                        opacityBg.style.backgroundImage = `linear-gradient(rgb(${rgb}) , rgb(19, 19, 26) 50%)`
                        app.style.transition = 'background-color 1s ease';
                        opacityBg.style.opacity = '1'
                        app.style.opacity = '0'
                        this.pointer = 0
                    }
                })
            }
            else {
                this.bgColor = ''
                if (this.pointer === 0) {
                    app.style.backgroundImage = ``
                    app.style.transition = 'background-color 1s ease';
                    app.style.opacity = '1'
                    opacityBg.style.opacity = '0'
                    this.pointer = 1
                } else {
                    opacityBg.style.backgroundImage = ``
                    app.style.transition = 'background-color 1s ease';
                    opacityBg.style.opacity = '1'
                    app.style.opacity = '0'
                    this.pointer = 0
                }
            }
        },
        full(src) {
            const app = document.querySelector('#opacity-bg1')
            const opacityBg = document.querySelector('#opacity-bg')
            if (src) {
                toggleImg(src).then((img) => {
                    const colorThief = new ColorThief()
                    let rgb = colorThief.getColor(img)
                    rgb = [
                        Math.min(rgb[0] * 1.1, 255),
                        Math.min(rgb[1] * 1.2, 255),
                        Math.min(rgb[2] * 1.3, 255),
                    ];


                    const isRepeat = rgb.every((rgb, index) => {
                        return rgb === this.bgColor[index]
                    })
                    if (isRepeat) {
                        return
                    }
                    this.bgColor = rgb
                    if (this.pointer === 0) {
                        app.style.backgroundImage = `linear-gradient(rgb(${rgb}) , rgb(19, 19, 26) 120%)`
                        app.style.transition = 'background-color 1s ease';
                        app.style.opacity = '1'
                        opacityBg.style.opacity = '0'
                        this.pointer = 1
                    } else {
                        opacityBg.style.backgroundImage = `linear-gradient(rgb(${rgb}) , rgb(19, 19, 26) 120%)`
                        app.style.transition = 'background-color 1s ease';
                        opacityBg.style.opacity = '1'
                        app.style.opacity = '0'
                        this.pointer = 0
                    }
                })
            }
            else {
                this.bgColor = ''
                if (this.pointer === 0) {
                    app.style.backgroundImage = ``
                    app.style.opacity = '1'
                    opacityBg.style.opacity = '0'
                    this.pointer = 1
                } else {
                    opacityBg.style.backgroundImage = ``
                    opacityBg.style.opacity = '1'
                    app.style.opacity = '0'
                    this.pointer = 0
                }
            }
        },
        reset() {
            this.bgColor = '';
            this.pointer = 1;
            this.change('');
        }
    }
}) 