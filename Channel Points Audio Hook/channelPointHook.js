(function () {
    var clip1Toggle = $.getSetIniDbBoolean('channelPointsHookSettings', 'clip1Toggle', false),
        clip1ID = $.getSetIniDbString('channelPointsHookSettings', 'clip1ID', 'noIDSet'),
        clip1Config = $.getSetIniDbBoolean('channelPointsHookSettings', 'clip1Config', false),
        clip1Hook = $.getSetIniDbString('channelPointsHookSettings', 'clip1Hook', 'noHookSet'),
        clip1Reward = $.getSetIniDbString('channelPointsHookSettings', 'clip1Reward', 'noNameSet');

    function updateChannelPointsHookConfig() {
        clip1Toggle = $.getIniDbBoolean('channelPointsHookSettings', 'clip1Toggle', false);
        clip1ID = $.getIniDbString('channelPointsHookSettings', 'clip1ID', 'noIDSet');
        clip1Config = $.getIniDbBoolean('channelPointsHookSettings', 'clip1Config', false);
        clip1Hook = $.getIniDbString('channelPointsHookSettings', 'clip1Hook', 'noHookSet');
        clip1Reward = $.getIniDbString('channelPointsHookSettings', 'clip1Reward', 'noNameSet');
    }

    /*
     * @event command
     */
    $.bind('command', function (event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0];

        if (command.equalsIgnoreCase('channelpointshook')) {
            if (action === undefined) {
                if (clip1Toggle === false) {
                    $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.notenabled'));
                    return;
                }
                var config = '';
                if (clip1Toggle === true) {
                    config += ' clip1';
                }
                $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.current', config));
                return;
            }

            /*
             * @commandpath usage
             */
            if (action.equalsIgnoreCase('usage')) {
                $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.usage'));
                return;
            }

            /*
             * @commandpath info
             */
            if (action.equalsIgnoreCase('info')) {
                $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.info'));
                return;
            }

            /*
             * @commandpath clip1
             */
            if (action.equalsIgnoreCase('clip1')) {
                if (args[1] === undefined) {
                    if (clip1Toggle === false) {
                        $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.clip1.info'));
                        return;
                    }
                    $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.clip1.current', clip1Reward, clip1Hook));
                    return;
                }

                /*
                 * @commandpath clip1 usage
                 */
                if (args[1].equalsIgnoreCase('usage')) {
                    $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.clip1.usage'));
                    return;
                }

                /*
                 * @commandpath clip1 config
                 */
                if (args[1].equalsIgnoreCase('config')) {
                    clip1Config = !clip1Config;
                    $.getSetIniDbBoolean('channelPointsHookSettings', 'clip1Config', clip1Config);
                    if (clip1Config === true) {
                        $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.clip1.config.start'));
                        clip1ID = 'noIDSet';
                        clip1Reward = 'noNameSet';
                        $.setIniDbString('channelPointsHookSettings', 'clip1ID', clip1ID);
                        $.setIniDbString('channelPointsHookSettings', 'clip1Reward', clip1Reward);
                        return;
                    }
                    $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.clip1.config.failed'));
                    // config is closed when the reward is successfully redeemed - see the reward ID config in channel points events below.
                    return;
                }

                /*
                 * @commandpath clip1 hook
                 */
                if (args[1].equalsIgnoreCase('hook')) {
                    if (args[2] === undefined) {
                        if (clip1Hook.equals('noHookSet')) {
                            $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.clip1.hook.notset'));
                            return;
                        }
                        $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.clip1.hook.usage', clip1Hook));
                        return;
                    }
                    clip1Hook = args[2];
                    $.setIniDbString('channelPointsHookSettings', 'clip1Hook', clip1Hook);
                    $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.clip1.hook.message', clip1Hook));
                    return;
                }

                /*
                 * @commandpath clip1 toggle
                 */
                if (args[1].equalsIgnoreCase('toggle')) {
                    if (clip1Toggle === false) {
                        if (clip1ID.equals('noIDSet')) {
                            $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.clip1.toggle.id'));
                            return;
                        }
                        if (clip1Hook.equals('noHookSet')) {
                            $.say($.whisperPrefix(sender) + $.lang.get('channelpointshook.clip1.toggle.hook'));
                            return;
                        }
                    }
                    clip1Toggle = !clip1Toggle;
                    $.setIniDbBoolean('channelPointsHookSettings', 'clip1Toggle', clip1Toggle);
                    $.say($.whisperPrefix(sender) + (clip1Toggle ? $.lang.get('channelpointshook.clip1.enabled', clip1Reward) : $.lang.get('channelpointshook.clip1.disabled')));
                    return;
                }
            }
        }
    })

    /*
     * @event channelPointsRedemptions
     */
    $.bind('PubSubChannelPoints', function (event) {
        var redemptionID = event.getRedemptionID(),
            rewardID = event.getRewardID(),
            userID = event.getUserID(),
            username = event.getUsername(),
            displayName = event.getDisplayName(),
            rewardTitle = event.getRewardTitle(),
            cost = event.getCost(),
            inputPrompt = event.getInputPrompt(),
            userInput = event.getUserInput(),
            fulfillmentStatus = event.getFulfillmentStatus();

        $.consoleDebug('Channel Point event ' + rewardTitle + ' parsed to JavaScript. ID is: ' + rewardID);

        /*
         * rewardID config
         */
        if (clip1Config === true) {
            clip1ID = rewardID;
            clip1Reward = rewardTitle;
            $.setIniDbString('channelPointsHookSettings', 'clip1ID', clip1ID);
            $.setIniDbString('channelPointsHookSettings', 'clip1Reward', clip1Reward);
            clip1Config = false;
            $.setIniDbBoolean('channelPointsHookSettings', 'clip1Config', clip1Config);
            $.say($.lang.get('channelpointshook.clip1.config.complete', clip1Reward));
            return;
        }

        /*
         * audiohook play clip1
         */
        if (rewardID.equals(clip1ID)) {
            if (clip1Toggle === true) {
                $.consoleDebug('clip1RunStart');
                // $.say('!audiohook play ' + clip1Hook);
                $.alertspollssocket.triggerAudioPanel(clip1Hook);
                return;
            }
        }
    });

    /*
     * Add chat commands
     */
    $.bind('initReady', function () {
        $.registerChatCommand('./custom/channelPointHook.js', 'channelpointshook', 1);
    });

    /*
     * Update the API
     */
    $.updateChannelPointsHookConfig = updateChannelPointsHookConfig();

})();