$(function () {
	var w = 20;
	$('#C').append(_.range(100).map(function(e){
		return '<div class="ew" style="left:'+(e*(w+1))+'px"><input id="I'+e+'" class="e" /></div>';
	}));
	var p = $('#PT');
	var pos = 0;
	var move = function(d) {
		pos += d;
		p.animate({left: (pos*(w+1)+6)+'px'}, 'fast');
		$('#I'+pos).focus();
	}
	$('.e,#S').on('keyup', function (e) {
		if (e.keyCode === 37 && pos > 0) {
			console.log('left');
			move(-1);
		};
		if (e.keyCode === 39) {
			console.log('right');
			move(1);
		};
	});

	var appendRow = function(m, s, o, fm) {
		var t = (new Date()).valueOf();
		var tds = [
		'<td><input class="m" value="'+m+'"></td>',
		'<td><input class="s" value="'+s+'"></td>',
		'<td><input class="o" value="'+o+'"></td>',
		'<td><input class="fm" value="'+fm+'"></td>',
		'<td class="db" onclick="removeRow(\''+t+'\');">Delete</td>',
		];
		$('#TB').append('<tr id="TR'+t+'">'+tds.join('')+'</tr>');
	}
	$('#AddButton').click(function() {
		appendRow('', '', '', '');
	});
	var mc = window.localStorage.getItem('mc');
	if (mc) {
		mc = JSON.parse(mc);
	};
	_.each(mc, function (e) {
		appendRow(e[0], e[1], e[2], e[3]);
	});
	$('#RunButton').click(function() {
		var mc = _.map($('#TB tr'), function(tr) {
			return ['m', 's', 'o', 'fm'].map(function (c) {
				return $(tr).find('.'+c).val();
			});
		});
		window.localStorage.setItem('mc', JSON.stringify(mc));
		var iS = $('[name=state]');
		var run = function () {
			var state = iS.val();
			if (state === '') {
				state = mc[0][0];
				iS.val(state);
			};
			console.log('cur state '+state);
			var getEntry = function(m, s) {
				for (var i = 0; i < mc.length; i++) {
					var e = mc[i];
					var isAny = e[1] === 'Any';
					var isStateMatch = e[0] === m;
					if (isStateMatch && (e[1] === 'else' || e[1] === s || (isAny && s !== ''))) {
						var trs = $('tbody tr');
						trs.removeClass('ctr');
						trs.eq(i).addClass('ctr');
						return e;
					}
				};
				return null;
			};
			var s = $('#I'+pos).val();
			var e = getEntry(state, s);
			console.log(e);
			if (!e) {
				$.error('unknow state '+state+' '+s);
				return;
			};
			var doOperation = function(after) {
				var ops = e[2].split(',');
				if (!ops) {
					after()
					return;
				}
				var _do = function(ops) {
					if (!ops || ops.length === 0) {
						after();
						return;
					}
					var c = ops[0];
					console.log(c);
					if (c === 'L') {
						if (pos === 0) {
							$.error('can not left');
						}
						move(-1);
					}
					if (c === 'R') {
						move(1);
					}
					if (c[0] === 'P') {
						$('#I'+pos).val(c[1]);
					}
					if (c === 'E') {
						$('#I'+pos).val('');
					}
					setTimeout(function () {
						_do(_.rest(ops));
					}, 200);
				};
				_do(ops);
			}
			var after = function() {
				console.log('next state '+e[3]);
				iS.val(e[3]);
				setTimeout(run, 500);
			};
			doOperation(after);
		};
		run();
	})
});
function removeRow(t)
{
	$('#TR'+t).remove();
}
