(function() {

	var query = window.location.search.substring(1),
		params = query.split('&'),
		redirect = "";

	for (var i=0, len=params.length; i<len; ++i) {
		var kv = params[i].split("=");
		if (kv[0] === "redirect" && kv[1]) {
			redirect = decodeURIComponent(kv[1]);
			break;
		}
	}

	if (redirect) {
		$('#login_form [name="redirect"]').val(redirect);
	}

})();