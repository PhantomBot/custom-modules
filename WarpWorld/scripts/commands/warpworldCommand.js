/**
 * warpworldCommand.js
 *
 * Thrown together by Durland for Warp World / PhantomBot users.
 *
 * https://warp.world/
 * https://forum.warp.world/u/thedurland/
 */
(function () {
	
    var secretKey = $.lang.get('warpworld.secret.key');
	
	var username = $.channelName.toLowerCase();
    var apiPath = "http://api.warp.world/" + username +  "/commands?token=" + secretKey;
    var map = {};

    function _get(url, json) {
        var HttpRequest = Packages.com.gmt2001.HttpRequest;
        var HashMap = Packages.java.util.HashMap;
        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, encodeURI(url), '', new HashMap());
        return (json ? JSON.parse(responseData.content) : responseData.content);
    }


    $.bind('command', function (event) {
        var command = event.getCommand(),
            sender = event.getSender(),  
            args = event.getArgs();

        if (map.hasOwnProperty(command.toLowerCase()) && command.length) {
            var cmd = map[command.toLowerCase()];
            var url = cmd.endpoint
                .replace("{{streamer}}", username)
                .replace("{{user}}", sender)
                .replace("{{message}}", args.join("+"))
                .replace("{{key}}", secretKey);
            $.say(_get(url));
        }
    });

    $.bind('initReady', function () {
        var response = _get(apiPath, true);
        if (response.success) {
            var cmdKeys = Object.keys(response.commands);
            for (var i = 0; i < cmdKeys.length; i++) {
                var cmd = response.commands[cmdKeys[i]];
                map[cmd.alias] = cmd;

                var permission = 1;
                if (cmd.permission.indexOf("viewer") > -1) {
                    permission = 7;
                } else if (cmd.permission.indexOf("mod") > -1) {
                    permission = 2;
                }

                $.registerChatCommand('./commands/warpworldCommand.js', cmd.alias, permission);
            }
        }

    });

})();
