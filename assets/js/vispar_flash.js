(function() {
	VP.flashAPI = {
		getRoom: getRoom,
		getUser: getUser,
		isArchive: isArchive,
		getMode: getMode,
		forceAudioOnly: forceAudioOnly,
		getServerIp: getServerIp,
		setServerIp: setServerIp,
		showFlash: showFlash
	};

	var serverIp = '52.10.61.227';

	// just for now...
	function getRoom() {
		return VP.roomInfo.id;
	}

	function getUser() {
		return VP.userInfo.id;
	}

	function isArchive() {
		return '';
	}

	function getMode() {
		return "auto";
	}

	function forceAudioOnly() {
		return '';
	}

	function getServerIp() {
		return serverIp;
	}

	function setServerIp(ip) {
		serverIp = ip;
	}

	function showFlash() {
		swfobject.embedSWF("/flash/vispar.swf", "visparFlashObj", "100%", "550", "9.0.0", "expressInstall.swf");
	}

})();