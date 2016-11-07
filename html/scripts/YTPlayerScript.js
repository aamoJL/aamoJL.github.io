var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
    videoId: 'M7lc1UVf-VE',
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        },
    playerVars: {
        autoplay: 1,    //autoplay
        controls: 1,    //buttons
        disablekb: 1,   //keyboard controls
        fs: 0,          //fullscreen
        iv_load_policy: 3,  //annotations
        rel: 0          //related videos
    }
    });

    setVolume();

}

function setVolume(){
    var volume = player.getVolume();
    document.getElementById("volume").value = volume;
}

function onPlayerReady(event) {
//            event.target.playVideo();
    setVolume();
}

var done = false;
function onPlayerStateChange(event) {
//            if (event.data == YT.PlayerState.PLAYING && !done) {
//                
//            }
}

function muteVideo() {
    if(player.isMuted()){
        player.unMute();
    }
    else { player.mute();}
}

function playVideo() {
    var state = player.getPlayerState();
    if(state != 1){
        player.playVideo();
    }
    else {player.pauseVideo();}
}

function changeVideo() {
    var id = document.getElementById("change").value;
    player.loadVideoById(
        id)
}

function changeVolume() {
    var volume = document.getElementById("volume").value;

    player.setVolume(volume);
}

//css
//iframe:
//pointer-events: none;