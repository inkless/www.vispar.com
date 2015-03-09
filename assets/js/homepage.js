(function($) {
	$("#roomForm").on("submit", function() {
		window.location.href = "/chat/room/" + $(this.room).val();
		return false;
	});
})(jQuery);