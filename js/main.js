/*
1.render song (OK)
2.scroll top (OK)
3. play/pause/seek ( chạy / ngừng / tua)(OK)
4.CD rotate (đĩa quay)(OK)
5.Next / prev(OK)
6.nút random(OK)
7.  next/repeat(xử lý khi hết bài-next-hay hát lại 1 bài)(OK)
8.active songs()(OK)
9.scroll active Song into view(OK)
10. play song when click
*/



const $= document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)


        const PLAYER_STORAGE_KEY = 'F8_PLAYER'
        const player = $('.player')
        const cd = $('.cd')
        const heading = $('header h2')// tên bài hát
        const cdThumb = $('.cd-thumb')// ảnh bài hát
        const audio = $('#audio')// link bài hát
        const playBtn= $('.btn-toggle-play')
        const progress = $('#progress')
        const nextBtn = $('.btn-next')
        const prevBtn = $('.btn-prev')
        const randomBtn = $('.btn-random')
        const repeatBtn = $('.btn-repeat')
        const playlist=$('.playlist')

        // console.log(audio)

const app = {
    
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Cô ấy đã từng",
            singer: "Shine Thành Anh",
            path: "./music/coaydatung.mp3",
            image:"./img/coaydatung.webp"
              
        },
        {
            name: "Đi đi đi",
            singer: "Vicetone,K-ICM,T-ICM,Kelsey,Zickky",
            path: "./music/NAVADA-dididi.mp3",
            image:"./img/di-di-di.jpeg"
              
        },
        {
            name: "Người âm phủ",
            singer: "OSAD",
            path: "./music/NguoiAmPhu.mp3",
            image: "./img/nguoiamphu.webp"
        },
        {
            name: "Cô thắm không về",
            singer: "Phát Hồ x JokeS Bii x Sinike ft. DinhLong",
            path: "./music/cothamkhongve.mp3",
            image: "./img/cothamkove.webp"
        },
        {
            name: "Siêu cô đơn",
            singer: "Yan Nguyễn",
            path: "./music/sieucodon.mp3",
            image: "./img/sieucodon.jpg"
        },
        {
            name: "Phía sau em",
            singer: "Kay trần x BinZ",
            path: "./music/phiasauem.mp3",
            image: "./img/phiasauem.jpg"
        },
        {
            name: "Thê tử",
            singer: "Minh Vương-Hương ly",
            path: "./music/thetu.mp3",
            image:"./img/thetu.jpg"
              
        },
        {
            name: "Về bên anh",
            singer: "「Lofi Ver.」- Jack x Mihle ",
            path: "./music/vebenanh.mp3",
            image:"./img/vebenanh.jpg"
              
        },
        {
            name: "Tri kỷ",
            singer: "Phan Mạnh Quỳnh",
            path: "./music/triki.mp3",
            image:"./img/triki.jpg"
              
        },
        {
            name: "Can't remember the name",
            singer: "No love ",
            path: "./music/Can'trememberthename.mp3",
            image:"./img/memberthename.jpg"
              
        },
        {
            name: "Nếu là anh",
            singer: "The Men",
            path: "./music/neulaanh.mp3",
            image:"./img/neulaanh.webp"
              
        },
        {
            name: "Tháng 4 là lời nói dối của em",
            singer: "Hà Anh Tuấn",
            path: "./music/thang4noidoi.mp3",
            image:"./img/thang4noidoi.jpg"
              
        },
        
    ],
    setConfig : function(key,value){
        this.config[key]= value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    render: function(){
        const htmls =  this.songs.map((song,index) =>{
            return ` <div class="song ${index===this.currentIndex?'active':''}" data-index="${index}">
                  <div class="thumb"
                      style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>
          `;
        })
        playlist.innerHTML = htmls.join('');

    },
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
        
    },
    handeEvents:function (){// ham xử lý xự kiện
        const _this=this;// chỉ cái app
        const cdWidth = cd.offsetWidth; // kich thước chiều ngan của cd hiện tại
    //    Xử lý CD quay/dừng
        const cdThumbAnimation=cdThumb.animate([
            {
                transform:'rotate(360deg)'
            }
        ],{
            duration:10000,
            iterations:Infinity
        })
        cdThumbAnimation.pause();
       
       
        // Xử lý phóng to thu nhỏ CD
        document.onscroll = function () {// sự kiện kéo thanh scoll
            const scrollTop=window.scrollY||document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            console.log(newCdWidth)
            cd.style.width =newCdWidth > 0? newCdWidth + 'px': 0;// nếu >0 lấy newCD còn nhỏ hơn 0 lấy 0(if else kiểu viết gọn thôi)
            cd.style.opacity =  newCdWidth / cdWidth;// làm mờ đi
        }


        // ////////////////////XỬ LÝ PLAY///////////////////////////////////////////////
        playBtn.onclick = function(){
            if(_this.isPlaying){  
                audio.pause();// ham play()/pause() là những hàm có sẵn trong js nhưng là kiểu bổ trợ
            }
            else{
                audio.play();
            }
        }
        // khi bài hát được chạy
        audio.onplay =function () {
            _this.isPlaying=true;
            player.classList.add('playing');
            cdThumbAnimation.play();
        }
        // // khi bài hát bị ngừng
        audio.onpause = function () {
            _this.isPlaying=false; 
            player.classList.remove('playing');
            cdThumbAnimation.pause();
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value=progressPercent

            }


        }
        // xử lý khi tua bài hát 
        progress.onchange = function(e){
            const seekTime = e.target.value * audio.duration /100;// thời gian mới khi mk ấn tua
            audio.currentTime = seekTime;
        }

        // khi next bài hát
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // khi prev bài hát
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // khi Random được bật/tắt
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom);// neu _this.isRandom đúng thì add ko thì remove
        }



        // Xử lý lặp đi lặp lại 1 bài
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat);// neu _this.isRandom đúng thì add ko thì remove
        }



        // Xử lý next Song ko kết thúc bài hát
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }
            else{
                nextBtn.click();// tự động ấn click khi hết bài
            }
        }

        // lắng nghe click vào playlist
        playlist.onclick = function(e){
            // xử lý khi click vào bài hát=> chuyển đến bài hát đó
            const songNode =e.target.closest('.song:not(.active)');
            if( songNode||e.target.closest('.option')){//.closest() trả về chính nõ hoặc thẻ cha của nó
                    // xử lý click vào bài hát
                    if(songNode){
                       _this.currentIndex = Number(songNode.dataset.index);
                       _this.loadCurrentSong();
                       audio.play();
                       _this.render();
                    }
                    //   // xử lý click vào cái 3 chấm (option) ở bài hát
                    if(e.target.closest('.option')){

                    }
            }
        }
    },

    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'nearest',
            });
        },300)
        
    },
    loadCurrentSong: function() {// tải bài hát hiện tại

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage=`url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >=this.songs.length){
            this.currentIndex=0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex=this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex
        do{
            newIndex=Math.floor(Math.random()*this.songs.length)
        }while(this.currentIndex===newIndex)// nếu lặp lại bài cũ thì cho chạy tiếp
        this.currentIndex=newIndex
        this.loadCurrentSong();
    },
    start: function(){
        // Gán cấu hình vào ứng dụng
        this.loadConfig();



        // định nghĩa các thuộc tính
        this.defineProperties();


        // lắng nghe và xử lý các sự kiện(DOM events)
        this.handeEvents();


        // tải thông tin bài hát đầu tiên vào giao diện khi chạy ứng dụng
        this.loadCurrentSong();
        // this.currentSong();// lấy ra bài hát hiện tại
        
        // Render lại playlist
        this.render();

        // hiển thị trạng thái ban đầu của button repeat
        randomBtn.classList.toggle('active',this.isRandom);
        repeatBtn.classList.toggle('active',this.isRepeat);
    }
}
app.start();