/**
 * userDataSystem.js
 *
 * Provides various commands for storing and retrieving user data.
 *
 * @author illusionaryone
 */
(function() {

    /* List of commands to provide user data for.  Add a command to the list, or remove a command
     * as desired.  Note that removing a command does not clean the database table.
     */

    /**
     * @commandpath pcpp [set url] [user] [clear] - Set a URL, view a user, or clear your setting.
     */
    var commandList = [ 'pcpp' ];

    /**
     * Until the 2.3.5 release.
     */
    function hasKey(list, value, subIndex) {
        var i;
    
        if (subIndex > -1) {
            for (i in list) {
                if (list[i][subIndex].equalsIgnoreCase(value)) {
                    return true;
                }
            }
        } else {
            for (i in list) {
                if (list[i].equalsIgnoreCase(value)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
          var sender = event.getSender().toLowerCase(),
            command = event.getCommand().toLowerCase(),
            args = event.getArgs(),
            userData;

        if (hasKey(commandList, command)) {
            if (args.length == 0) {
                $.say($.whisperPrefix(sender) + $.lang.get('userdatasystem.usage.' + command));
                return;
            }

            if (args.length == 1) {
                if (args[0].equalsIgnoreCase('set')) {
                    $.say($.whisperPrefix(sender) + $.lang.get('userdatasystem.usage.' + command));
                    return;
                }

                if (args[0].equalsIgnoreCase('clear')) {
                    $.inidb.del('userdata_' + command, sender);
                    $.say($.whisperPrefix(sender) + $.lang.get('userdatasystem.clear.' + command));
                    return;
                }
                   
                userData = $.getIniDbString('userdata_' + command, args[0], $.lang.get('userdatasystem.nodata.' + command));
                $.say($.whisperPrefix(sender) + $.lang.get('userdatasystem.lookup.' + command, $.username.resolve(args[0]), userData));
                return;
            }

            if (args.length >= 2) {
                if (args[0].equalsIgnoreCase('set')) {
                    userData = args.splice(1);
                    $.setIniDbString('userdata_' + command, sender, userData);
                    $.say($.whisperPrefix(sender) + $.lang.get('userdatasystem.set.' + command, userData));
                    return;
                }

                /* No supported parameter was provided. */
                $.say($.whisperPrefix(sender) + $.lang.get('userdatasystem.usage.' + command));
                return;
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/userDataSystem.js')) {
            for (idx in commandList) {
                $.registerChatCommand('./systems/userDataSystem.js', commandList[idx], 7);
            }
        }
    });
})();
