VP.flashAPI = {
	getRoom: getRoom,
	getUser: getUser,
	isArchive: isArchive,
	getMode: getMode,
	forceAudioOnly: forceAudioOnly,
	getServerIp: getServerIp
};

// just for now...
function getRoom()
{ 
    return VP.pageInfo.room;
} 
function getUser()
{ 
    return VP.pageInfo.user.name;
} 
function isArchive()
{ 
    return '';
} 
function getMode()
{ 
    return "auto";
} 
function forceAudioOnly()
{ 
    return '';
} 
function getServerIp()
{ 
    return "52.10.61.227";
} 