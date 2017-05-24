var swPlayer = {};
swPlayer.playlist = [
	{"src":"media/Susanne-Guido-Enrique.mp3", "title":"Improvisation<br /> «???»"},
	{"src":"media/Alle-Voegel-sind-schon-da.mp3", "title":"Improvisation<br /> «Alle Vögel sind schon da»"},
	{"src":"media/Emmentaler.mp3", "title":"Emmentaler"},
	{"src":"media/D-Zyt-isch-da.mp3", "title":"Improvisation «D'Zyt isch da»"},
	{"src":"media/Bim-Elmi-zBi-kurz.mp3", "title":"Bim Elmi z'Bi"}
];
swPlayer.elem = {};

swPlayer.next = function () {
	swPlayer.loadSong(++swPlayer.currentSongID);
}

swPlayer.prev = function () {
	swPlayer.loadSong(--swPlayer.currentSongID);
}

swPlayer.loadSong = function(ID) {
	swPlayer.currentSongID = ID % swPlayer.playlist.length;
	swPlayer.currentSong = swPlayer.playlist[swPlayer.currentSongID];
	swPlayer.elem.player.src = swPlayer.currentSong.src;
	swPlayer.elem.title.html(swPlayer.currentSong.title);
	swPlayer.elem.playlistItems.removeClass("selected");
	swPlayer.elem.playlistItems.eq(ID).addClass("selected");
}

swPlayer.playSong = function(ID) {
	swPlayer.loadSong(ID);
	swPlayer.elem.player.play();
}


// init
$( document ).ready(function() {
	if($("[sw-audio-player]").length > 0) {
		swPlayer.elem.seekslider = $("input[sw-audio-seekslider]");
		swPlayer.elem.player = $("[sw-audio-player]").get(0);
		swPlayer.elem.playlist = $("[sw-playlist][for]");
		swPlayer.elem.playlistItems = $(swPlayer.elem.playlist).find("a");
		// swPlayer.elem.player = new Audio();
		swPlayer.elem.title = $("[sw-audio-title]").first();
		swPlayer.loadSong( 0 );
		/*
		swPlayer.play = swPlayer.elem.player.play;
		swPlayer.pause = swPlayer.elem.player.pause;
		*/
		swPlayer.toggle = function() { swPlayer.elem.player.paused ? swPlayer.elem.player.play()  :  swPlayer.elem.player.pause(); }
		// swPlayer.elem.player.play();
	/*
		swPlayer.elem.player.ontimeupdate = function() {
			swPlayer.elem.seekslider.val( swPlayer.elem.player.currentTime / swPlayer.elem.player.duration * 100 );
		};
	*/
	}
});


// https://stackoverflow.com/questions/12314345/custom-progress-bar-for-audio-and-progress-html5-elements

