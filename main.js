'use strict'

import toast  from "./toastMess/toast.js"
import html from "./core/index.js"

import songLibraryList from "./data/songs/songsLibraryList.js"
import sliders from "./data/sliders/sliders.js"
import myPlayList from "./data/myPlayList/myPlayList.js"
import listWantHear from "./data/discover/listWantHear.js"
import listTodaySelection from "./data/discover/listTodaySelection.js"

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const ZING_MP3_KEY = 'ZING_MP3_KEY'

// modal js
const btnCreateListSong = $('.sidebar-createPlayList__btn')
const modal = $('.modal')
const btnClose = $('.modal__form-close')
const btnForm  = $('.modal__form-btn')

// header js
const header = $('.header')
const headerSearch = $('.header-left__search')
const headerInput = $('.header-left__search-input')
const suggetList = $('.sugget-list')

// change container js 
const appContainerActive = $('.app__container.app__container--active')
const appContainers = $$('.app__container')
const sideBarBtns = $$('.sidebar-nav > .sidebar-nav__list .sidebar-nav__item')
const arrayContainers = Array.from(appContainers)


// setting menu js 
const settingMenu = $('.setting-menu')
const settingMenuBtn = $('.header-right__item-setting')

// not more acitons
const toastDiv = $('#toast')  
const btnSidebarSubnavs = $$('.sidebar-subnav .sidebar-subnav__list .sidebar-nav__item ')
const btnSidebarLibrarys = $$('.sidebar-library .sidebar-subnav__list .sidebar-nav__item ')

// render list song
const listSong = $('.list-song')

// event song 
const audio = $('#audio')
const player = $('.playing-bar__center')
const btnTogglePlay = $('.player-control--btn-toggle-play')
const btnNext = $('.player-control--btn-next')
const btnPrev = $('.player-control--btn-prev')
const btnRandom = $('.player-control--btn-random')
const btnRepeat = $('.player-control--btn-repeat')

//input value
const inputDurationValue = $('.player-durations__box .player-durations__time')
const supportRangeInputValue = $('.player-durations__sub-input')
const libraryListSong = $('.tab-myMusic__library .list .list-song')

// input volumn
const btnVol = $('.player-control--btn.player-control--btn-vol')
const inputVolume = $('.player-volumn__box .player-volumn__input')
const supportInputVol = $('.player-volumn__box .player-volumn__sub-input')

// player card song 
const playerCardSong = $('.playing-bar__left .card-song ')

//slider 

const sliderBtnPrev = $('.slider-btn--prev')
const sliderBtnNext = $('.slider-btn--next')
const sliderItemBoxs = $('.slider__item-box')

// play-list tab myMusic\
const playlitTabMusic = $('.tab-myMusic .playlist .playlist-list')

const playlistContainers = $$('.playlist-list')
const btnPrevPlaylist  = $$('.playlist-btn.playlist-btn--left')
const btnNextPlaylist  = $$('.playlist-btn.playlist-btn--right')

// tab discover

const discorverWantHear = $('.tab-discover .playlist--want-to-hear .playlist .playlist-list')
const discoverTodaySelection = $('.tab-discover .playlist--today-selections .playlist .playlist-list')


const app = {
    isPlaying: false,
    isRepeating: false,
    isMuted: false,
    isRandom: false,
    isClearSliderInterval: false,
    consfig: JSON.parse(localStorage.getItem(ZING_MP3_KEY)) || {},
    setConfig (key, value) {
        this.consfig[key] = value
        localStorage.setItem(ZING_MP3_KEY, JSON.stringify(this.consfig))
    },
    arrRandom: [],
    pageIndex: 1,
    currentIndex: 0,
    songs: songLibraryList,
    sliders,
    listWantHear,
    listTodaySelection,

    renderSongLibrary (){
        const htmls = this.songs.map( (song, index) => {
            return html`<li class="list-song__item list-song__item--${index}" data-index=${index}>
                                <div class="list-song__item-left">
                                    <div class="card-song">
                                        <div class="card-song__img-box">
                                            <div class="card-song__img" style="background-image: url(${song.img})"> </div>
                                                <div class="card-song__img-btn ">
                                                <i class="card-song__img-icon card-song__img-btn-play fas fa-play"></i>
                                                <i class="card-song__img-icon card-song__img-btn-gif-play"></i>
                                            </div>
                                        </div>
                                        <div class="card-song__info">
                                            <span class="card-song__name t-l--1">
                                                ${song.name}
                                            </span>
                                            <div class="card-song__author t-l--1">
                                                ${song.singer.map(
                                                    (name , index) => {
                                                        return html`<a href="#" class="card-song__author-link">
                                                                ${name}
                                                            </a>`
                                                    } 
                                                )
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-song__item-center">
                                    <div class="card-name__song">
                                        <a href="#" class="card-name__song-link t-l--1">
                                            ${song.name}
                                            <span class="single">${song.singer.length > 1 && '(more)' || '(single)'}</span>
                                        </a>
                                    </div>
                                </div>
                                <div class="list-song__item-right">
                                    <ul class="card-song__controls-list">
                                        <li class="btn card-song__controls-item btn--circle-s-l">
                                                <i class="fas fa-film"></i>
                                        </li>
                                        <li class="btn card-song__controls-item btn--circle-s-l">
                                            <i class="fas fa-microphone"></i>
                                        </li>
                                        <li class="btn card-song__controls-item card-song__controls-item--heart--active btn--circle-s-l btn--heart-remove-song-library">
                                            <i class="card-song__controls-item-heart-empty far fa-heart"></i>
                                            <i class="card-song__controls-item-heart-fill fas fa-heart"></i>
                                        </li>
                                        <li class="btn card-song__controls-item btn--circle-s-l">
                                            <i class="fas fa-ellipsis-h"></i>
                                        </li>
                                    </ul>
                                    <span class="card-song__durationTime">
                                        5:13
                                    </span>
                                </div>
                                </li>`
        })
        listSong.innerHTML = htmls.join('')
    },

    addClassForSlider (index) {
        switch (index) {
            case 0: 
                return 'prev'
            case 1: 
                return 'current'
            case 2: 
                return 'next'
            case 3: 
                return 'first'
            case 5: 
                return 'last'
            default:
                return 'add'
        }
    },

    renderSlider () {
        sliderItemBoxs.innerHTML = this.sliders.map (
            (slider, index) => {
                return html`
                <div class="slider__item ${this.addClassForSlider(index)}">
                    <div class="slider__item-display">
                        <a href="#" class="slider__item-link">
                            <div class="slider__item-img" style = "background-image: url(${slider.path})"></div>
                        </a>
                    </div>
                </div>
                `
            }
        )
        .join('')
    },

    renderPlaylist() {
        this.htmlsPlaylist(discoverTodaySelection, listTodaySelection)
        this.htmlsPlaylist(discorverWantHear, listWantHear)
        this.htmlsPlaylist(playlitTabMusic, myPlayList)
    },

    htmlsPlaylist (element, playlist) {
        const htmls = playlist.map(
            (item) => {
                return html`
                    <div class="playlist-item ">
                        <div class="playlist-item__img-box parent-control-box">
                            <div class="playlist-item__img">
                                <div  style="background-image: url(${item.path})" ></div>
                            </div>
                            <div class="control-box">
                                <div class="btn btn--circle-normal  btn--control-list btn--control-list-remove">
                                    <i class="fas fa-times"></i>
                                </div>
                                <div class="btn btn--circle-normal  btn--control-list btn--control-list-play">
                                    <i class="fas fa-play"></i>
                                </div>
                                <div class="btn btn--circle-normal  btn--control-list btn--control-list-menu">
                                    <i class="fas fa-ellipsis-h"></i>
                                </div>
                            </div>
                        </div>
                        <div class="playlist-item__body">
                            <a href="#" class="playlist-item__title">
                                ${item.title}
                            </a>
                            <span class = "playlist-item__desc">
                                ${item.names.map (
                                    (name) => {
                                        return `${name}`
                                    }
                                ).join(', ')}
                            </span>
                        </div>
                </div>
                `
            }
        )
        .join('')
        element.innerHTML = htmls
    },

    handleEvent() {
        const _this = this

        window.onkeyup = (e) => {
                switch (e.keyCode) {
                    case 13: 
                    case 32:
                        if(_this.isPlaying) {
                            audio.pause()
                        }
                        else {
                            audio.play()
                            }
                        break;
                    case 39 : 
                        btnNext.click();
                        break;
                    case 37 : 
                        btnPrev.click();
                    default : 
                        break;
                }
        }


        //#region sự kiện cuộn chuột playlist

       Array.from(playlistContainers).forEach((item, i) => {
        
            btnNextPlaylist[i].addEventListener('click', () => {
                item.scrollLeft += item.getBoundingClientRect().width;
                console.log(item.getBoundingClientRect().width)
            })
        
            btnPrevPlaylist[i].addEventListener('click', () => {
                item.scrollLeft -= item.getBoundingClientRect().width;
            })
        })

   
       //#endregion

        //#region sử lý sự kiện thống báo remove heart button
        const btnHeartPlayer = $('.playing-bar .card-song__controls-item.btn--heart-remove-song-library')
        const btnHeartSongLibrarys = $$('.tab-myMusic__library .list-song .list-song__item .card-song__controls-item.btn--heart-remove-song-library')

       this.removeHealth(btnHeartPlayer)
       for(const  btnHeartSongLibrary  of  btnHeartSongLibrarys) {
                this.removeHealth(btnHeartSongLibrary)
       }
       
        //#endregion

       //#region sự kiện của slider
       let sliderInterval = setInterval(()=> {
            _this.nextSlider()
       }, 5000)

       sliderBtnNext.onclick = () => {
            _this.nextSlider()
            
       }
       
       sliderBtnPrev.onclick = () => {
           _this.prevSlider()
        }
        //#endregion
        
        //#region  sự kiện với modal

        btnCreateListSong.onclick = (e) => {
            modal.classList.add('active')
        }

        btnClose.onclick = () => {
            modal.classList.remove('active')
        }

        btnForm.onclick = (e) => {
            e.preventDefault()
        }
        //#endregion

        //#region  sự kiện khi click vào ô tìm kiếm

        suggetList.onmousedown = (e) => {
            e.preventDefault()
        }
        
        headerInput.onfocus = () => {
            headerSearch.classList.add('header-left__search--when-focus')
        }
        
        headerInput.onblur = () => {
            headerSearch.classList.remove('header-left__search--when-focus')
        }

        //#endregion

        //#region menu 
        settingMenuBtn.onclick = ()  => {
            settingMenu.classList.toggle('open')
        }
        
        
        settingMenu.onmousedown = (e) => {
            e.target.preventDefault()
        }

        //#endregion
        
        //#region  chuyển page
        Array.from(sideBarBtns).forEach ((sideBarBtn, index) => {
            const container = arrayContainers[index]
            sideBarBtn.onclick = () => {
                $('.sidebar-nav__item.sidebar-nav__item--active').classList.remove('sidebar-nav__item--active')
                $('.app__container.app__container--active').classList.remove('app__container--active')
                sideBarBtn.classList.add('sidebar-nav__item--active')
                container.classList.add('app__container--active')
            }
        })
        //#endregion
        
        //#region sự kiện cuộn chuột với paga được active
        appContainerActive.onscroll = () => {
                const hScroll = appContainerActive.scrollTop || appContainerActive.scrollY
                if(hScroll) {
                    Object.assign(header.style, {
                        backgroundColor: '#170f23',
                        boxShadow: '0 3px 3px rgba(0 , 0, 0, 0.1)'
                    })
                }
                else{
                    Object.assign(header.style, {
                        backgroundColor: 'transparent',
                        boxShadow: 'none'
                    })
                }
        }
        //#endregion

        //#region  thông báo  
        function notAcitonsInfurture(btns) {
            for(const btn of btns){
                btn.onclick = () => {
                    
                    if(toastDiv) {
                        _this.notification(toastDiv,'Thông báo','Chưa thêm chức năng này')
                    }
                }
            }
        }
        
        notAcitonsInfurture(Array.from(btnSidebarLibrarys))
        notAcitonsInfurture(Array.from(btnSidebarSubnavs))
        //#endregion

        //#region  phát nhạc với button trong library song
        libraryListSong.onclick = (e) => {
            
            const songNotActive = e.target.closest('.tab-myMusic__library .list-song .list-song__item:not(.list-song__item--active)');
            const songActive = e.target.closest('.tab-myMusic__library .list-song .list-song__item.list-song__item--active')
            
            const btnPlaySong = e.target.closest('.card-song__img-icon.card-song__img-btn-play');
            const btnGifPlay = e.target.closest('.card-song__img-icon.card-song__img-btn-gif-play');

           if(songNotActive) {
               if(btnPlaySong) {
                btnPlaySong.onmousedown = () =>{
                    _this.currentIndex = songNotActive.dataset.index
                    _this.loadCurrentSong()
                    _this.scrollIntoViewSong()
                    _this.activeCurrentSong()
                    audio.play()
                }
               }
           }
           if(songActive) {
                if(btnPlaySong) {
                    btnPlaySong.onmousedown = () => audio.play()
                }
           }
           if(btnGifPlay) {
               btnGifPlay.onclick = () => audio.pause()
           }
        }
        //#endregion

        //#region  thay đổi 
        inputDurationValue.oninput = (e) => {
            const value = parseInt(inputDurationValue.value)
            const curTime = Math.round(audio.duration / 100 * value)
            audio.currentTime = curTime
            supportRangeInputValue.style.width = value  + "%"
            audio.pause()
        }

        inputDurationValue.onchange = () => {
            audio.play()
        }
        //#endregion

        //#region  tăng - giảm -muted 
        btnVol.onclick = () => { 
            _this.isMuted = !_this.isMuted
            _this.setConfig('isMutated', _this.isMuted)
            audio.muted = !audio.muted
            
            if(_this.isMuted) {
                btnVol.classList.remove('player-control--btn-vol-active')
                inputVolume.value = 0

                supportInputVol.style.width = inputVolume.value + '%'
            }
            else {
                inputVolume.value = 100
                audio.volume = 1
                supportInputVol.style.width = inputVolume.value + '%'
                btnVol.classList.add('player-control--btn-vol-active')
            }
        }

        inputVolume.oninput =(e) => {
            const value = parseInt(inputVolume.value)
            _this.setConfig('valueVolumn', inputVolume.value)
            supportInputVol.style.width = value + '%'
            audio.volume = value / 100
            if(value) {
                btnVol.classList.add('player-control--btn-vol-active')
            }
            else {
                btnVol.classList.remove('player-control--btn-vol-active')
            }
           
        }

        //#endregion

        //#region sự kiện audio
        audio.onplay = () => {
                _this.isPlaying = true
                player.classList.add('playing')
                _this.getCurSongLibActive().classList.add('list-song__item--play')
                // _this.loadCurrentSong()
            }

        audio.onpause = () => {
            player.classList.remove('playing')
            _this.isPlaying = false
            _this.getCurSongLibActive().classList.remove('list-song__item--play')
        }

        audio.ontimeupdate = () => {
            const curPercent = Math.floor(audio.currentTime / audio.duration * 100)
            inputDurationValue.value = curPercent
            const value = parseInt(inputDurationValue.value)
            supportRangeInputValue.style.width = value  + "%"
        }

        audio.onended = () => {
            if(_this.isRepeating) {
                btnNext.click()
            }
            btnNext.click()
        }
        //#endregion

        //#region  play - repeat - next - prev - random
        btnTogglePlay.onclick = () => {
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
            } 
            
        }

        btnNext.onclick = () => {
            if(_this.isRandom) {
                _this.randomIndexSong()
            }
            else  if(_this.currentIndex >= _this.songs.length -1) {
                _this.currentIndex = 0
            }
            else {
                _this.currentIndex++;
            }
            _this.loadCurrentSong()
            _this.scrollIntoViewSong()
            _this.activeCurrentSong()
            audio.play()
        }

        btnPrev.onclick = () => {
            if(_this.isRandom) {
                _this.randomIndexSong()
            }
            else if(_this.currentIndex <= 0) {
                _this.currentIndex =  _this.songs.length -1
            }
            else {
                _this.currentIndex--;
            }
            _this.loadCurrentSong()
            _this.scrollIntoViewSong()
            _this.activeCurrentSong()
            audio.play()
        }

        btnRepeat.onclick = () => {
            _this.isRepeating = !_this.isRepeating
            _this.setConfig('isRepeating', _this.isRepeating)
            btnRepeat.classList.toggle('active', _this.isRepeating)
    }
        btnRandom.onclick = () => {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)

            btnRandom.classList.toggle('active', _this.isRandom)
        }
        //#endregion
    },

    notification (element, title, message) {
        if(element) {   
            toast(element, title, message)
        }
    },

    removeHealth (btn) {
            btn.onclick = () => {
                btn.classList.toggle('card-song__controls-item--heart--active')
            }
    },

    nextSlider() {
        const prevItem = $('.slider__item.prev')
        const currentItem = $('.slider__item.current')
        const nextItem = $('.slider__item.next')
        const lastItem = $('.slider__item.last')
        const addItem = $('.slider__item.add')
        const firstItem = $('.slider__item.first')

        prevItem.classList.replace('prev','current')
        currentItem.classList.replace('current','next')
        nextItem.classList.replace('next','last')
        lastItem.classList.replace('last','add')
        addItem.classList.replace('add','first')
        firstItem.classList.replace('first','prev')
    },

    prevSlider () {
        const prevItem = $('.slider__item.prev')
        const currentItem = $('.slider__item.current')
        const nextItem = $('.slider__item.next')
        const lastItem = $('.slider__item.last')
        const addItem = $('.slider__item.add')
        const firstItem = $('.slider__item.first')

        prevItem.classList.replace('prev','first')
        currentItem.classList.replace('current','prev')
        nextItem.classList.replace('next','current')
        lastItem.classList.replace('last','next')
        addItem.classList.replace('add','last')
        firstItem.classList.replace('first','add')
    },

    //thực hiện random index
    randomIndexSong() {
        this.arrRandom.push(this.currentIndex)
        let nextIndexSong
        do {
            nextIndexSong = Math.floor(Math.random() * this.songs.length )
            if( this.arrRandom.length >= this.songs.length ) {
                this.arrRandom = []
                this.arrRandom.push(this.currentIndex)
            }
        }
       while(this.arrRandom.includes(nextIndexSong))
       this.currentIndex = nextIndexSong
    },

    // thực hiện load bài hát hiện tại
    loadCurrentSong () {
        playerCardSong.innerHTML = html`
                <div class="card-song__img-box playing-bar__left-box-img">
                    <div class="card-song__img" style="background-image: url(${this.currentSong.img})" > </div>
                </div>
                <div class="card-song__info">
                    <a href="#" class="card-song__name-link">
                        ${this.currentSong.name}
                    </a>
                    <div class="card-song__author">
                        ${this.currentSong.singer.map(
                            (name) => html`
                              <a href="#" class="card-song__author-link">
                                 ${name}
                                </a>
                            `
                        )}
                    </div>
            </div>`
        audio.src = this.currentSong.path
        audio.volume = parseInt(inputVolume.value) / 100
    },

    // // thực hiện active cho menu - page
    // loadActiveMenuPage () {
    //     appContainers[this.pageIndex].classList.add('app__container--active')
    //     sideBarBtns[this.pageIndex].classList.add('sidebar-nav__item--active')
    // },

    //load trạng thái trước đó

    loadState() {
        if(this.isMuted) {
            btnVol.classList.remove('player-control--btn-vol-active')
            inputVolume.value = 0
            supportInputVol.style.width = 0
        }
        else {
            inputVolume.value = this.consfig.valueVolumn
            audio.volume = Math.floor(this.consfig.valueVolumn / 100)
            supportInputVol.style.width = parseInt(this.consfig.valueVolumn) + '%'
            btnVol.classList.add('player-control--btn-vol-active')
        }
        btnRandom.classList.toggle('active',this.consfig.isRandom)
        btnRepeat.classList.toggle('active',this.consfig.isRepeating)
        console.log(inputDurationValue.value)
    },

    // thực hiện active bài hát
    activeCurrentSong () {
        $('.list-song__item.list-song__item--active').classList.remove('list-song__item--active');
        $('.list-song__item.list-song__item--'+ this.currentIndex).classList.add('list-song__item--active');
    },

    //thực hiện active bài hát đầu tiên
    loadActiveCurrentSong() {
        $('.list-song__item.list-song__item--'+ this.currentIndex).classList.add('list-song__item--active');
    },

    //lấy bài hát active
    getCurSongLibActive(){
        return  $('.list-song__item.list-song__item--active') 
    },

    //thực hiện cuộn chuột đến bài hát hiện tại
    scrollIntoViewSong(){
       switch (this.currentIndex){
            case 0:
            case 1:
            case 2:
            case 3:
                setTimeout(() => {
                    $('.list-song__item.list-song__item--'+ this.currentIndex).scrollIntoView(
                        {
                            behavior: "smooth",
                            block: "start"
                        }
                    );
                },300)

            default:
                setTimeout(() => {
                    $('.list-song__item.list-song__item--'+ this.currentIndex).scrollIntoView(
                        {
                            behavior: "smooth",
                            block: "center"
                        }
                    );
                },300)


       }
    },

    //thực hiện lấy ra bài hát hiện tại
    defineProperty: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },

    start (){
        this.renderSongLibrary()
        
        this.renderSlider()

        this.renderPlaylist()

        this.handleEvent()

        this.defineProperty()

        this.loadCurrentSong()

        this.loadActiveCurrentSong()

        this.loadState()
    }


}

app.start()

















