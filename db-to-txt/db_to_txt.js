(function() {
	var file = 'points.txt', // location to write.
		table = 'points', // table to pull.
		keys,
		data,
		i;

	setTimeout(function() {
		$.consoleLn('Writing data from ' + table + ' to ' + file);
		keys = $.inidb.GetKeyList(table, '');
	
		for (i in keys) {
			data += (keys[i] + '=' + $.inidb.get('points', keys[i]));
		}

		$.writeToFile(data, file, false);
		$.consoleLn('Done.');
	}, 1);
})();
