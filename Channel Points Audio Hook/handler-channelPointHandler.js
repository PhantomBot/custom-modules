$.lang.register('channelpointshook.notenabled', 'no channel points audio hook functions are enabled at the moment. Please use "!channelpointshook info" for information about what can be done with this command or "!channelpointshook usage for usage."');
$.lang.register('channelpointshook.info', 'PhantomBot can be configured to play up to one audio hook based on channel points redemptions. ');
$.lang.register('channelpointshook.usage', 'Usage: !channelpointshook [info / usage / clip1]');
$.lang.register('channelpointshook.current', 'channel points audio hook redemptions currently enabled for$1. Use "channelpointshook usage" for command usage or "!channelpointshook info" for what this command is all about.');
$.lang.register('channelpointshook.config.failed', 'no channel point redemption was detected. Please try again.');
$.lang.register('channelpointshook.audiohook.failed', 'The referenced audio hook is not valid and is not in the audio hooks database. Please check and try again.');

$.lang.register('channelpointshook.clip1.info', 'audio hook 1 is not enabled. When the audio hook redemption is claimed, the user will have a set audio hook played for them. To configure please use "!channelpointshook clip1 config" or for more info please use "!channelpointshook clip1 usage".');
$.lang.register('channelpointshook.clip1.current', 'audio hook 1 is registered to $1 and the user will have the hook $2 played for each redemtion. To change please use "!channelpointshook clip1 [config / hook]"');
$.lang.register('channelpointshook.clip1.usage', 'Usage: !channelpointshook clip1 [usage / config / hook / toggle]');
$.lang.register('channelpointshook.clip1.config.start', 'channel points clip1 config active. Please redeen desired reward.');
$.lang.register('channelpointshook.clip1.config.complete', 'Channel points clip1 config complete. Audio hook 1 is now registered to reward $1.');
$.lang.register('channelpointshook.clip1.hook.notset', 'channel points reward, the audio hook to play has not been set. use "!channelpointshook clip1 hook [name of the audio hook to play]" to set.');
$.lang.register('channelpointshook.clip1.hook.usage', 'channel points reward, the audio hook to play is set to $1. Use "!channelpointshook clip1 hook [name of the hook to play]" to change.');
$.lang.register('channelpointshook.clip1.hook.message', 'channel points redemption clip1 will play audio hook $1 for the user who redeemed the reward.');
$.lang.register('channelpointshook.clip1.toggle.id', 'unable to enable clip1 as no valid reqard ID was found. Please use "!channelpointshook clip1 config" to set reward.');
$.lang.register('channelpointshook.clip1.toggle.hook', 'unable to enable clip1 as no audio hook has been set. Please use "!channelpointshook clip1 hook [name of the hook to play]" to set.');
$.lang.register('channelpointshook.clip1.enabled', 'channel points redemtion clip1 enabled for reward $1.');
$.lang.register('channelpointshook.clip1.disabled', 'channel points redemtion clip1 disabled.');