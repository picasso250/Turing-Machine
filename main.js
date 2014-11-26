$(function () {
	$('#C').append(_.range(100).map(function(e){
		return '<div class="ew" style="left:'+(e*31)+'px"><input id="I'+e+'" class="e" /></div>';
	}));
	var p = $('#PT');
	var pos = 0;
	$('.e,#S').on('keyup', function (e) {
		if (e.keyCode === 37 && pos > 0) {
			console.log('left');
			pos--;
		};
		if (e.keyCode === 39) {
			console.log('right');
			pos++;
		};
		p.animate({left: (pos*31+12)+'px'}, 'fast');
		$('#I'+pos).focus();
	});
});
