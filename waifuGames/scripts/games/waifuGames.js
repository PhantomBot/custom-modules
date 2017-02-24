(function() {
    var google = 'http://google.com/images?q=',
        reGetUrl = new RegExp(/(\[Rare\]\s)?(.*)\s=(.*)=.*/),
        reGetTitle = new RegExp(/(\[Rare\]\s)?(.*)\s=(.*)=.*/),
        responses = {
            attack: 1,
            fight: 1,
            miss: 1,
			      bosses: 1
        },
        totalWaifus = 0,
        navigatorImg = $.lang.get('waifugames.alert.navigator');

    // load();

    /*
     * @function load
     * @info Loads everything needed for this script to work. Add functions that need loading at startup in here.
     */
    function load() {
        loadWaifus();
        pushWaifus();
        loadResponses();
    }

    /*
     * @function loadWaifus
     * @info Gets a count of all the waifus and stores it in a variable. It will also generate a txt file with all the waifus.
     */
     function loadWaifus() {
     var string = '',
         i = 0;

     while ($.lang.exists('waifugames.waifu.' + i)) {
         string += 'Waifu #' + i + ' ' + replace($.lang.get('waifugames.waifu.' + i)) + '\r\n';
         ++i;
     }

     $.writeToFile(string, 'waifus.txt', false);
     totalWaifus = i;
 }
    /*
     * @function pushWaifus
     * @info Pushes the entire waifu list to the db, it does disable auto commit first to make this process a lot faster.
     */
    function pushWaifus() {
        var i = 0;

        $.inidb.setAutoCommit(false);
        while ($.lang.exists('waifugames.waifu.' + i)) {
            if (!$.inidb.exists('waifulist', i)) { // This will make setting pokemons faster since it does not need to write prokemons that are already on the disk.
                $.inidb.set('waifulist', i, $.lang.get('waifugames.waifu.' + i));
            }
            ++i;
        }
        $.inidb.setAutoCommit(true);
    }

    /*
     * @function loadResponses
     * Gets a count of all of the game responses and saves them in an object to be used later.
     */
    function loadResponses() {
        while ($.lang.exists('waifugames.attack.' + responses.attack)) {
            ++responses.attack;
        }

        while ($.lang.exists('waifugames.fight.' + responses.fight)) {
            ++responses.fight;
        }

        while ($.lang.exists('waifugames.catchmiss.' + responses.miss)) {
            ++responses.miss;
        }

        while ($.lang.exists('waifugames.bosses.' + responses.bosses)) {
            ++responses.bosses;
        }
    }

    /*
     * @function getWaifuByName
     * @info Gets the waifu string by searching for its name in the db.
     *
     * @param {String} name
     * @return {String} waifu name; will return "" if the waifu does not exist.
     */
    function getWaifuByName(name) {
        var results = $.inidb.searchByValue('waifulist', name)[0];

        return (results === undefined ? '' : $.lang.get('waifugames.waifu.' + results));
    }

    /*
     * @function getWaifuById
     * @info Gets the waifu string by searching for its id
     *
     * @param {Number} id
     * @return {String} waifu name; will return "" if the waifu does not exist.
     */
    function getWaifuById(id) {
        return ($.lang.exists('waifugames.waifu.' + id) ? $.lang.get('waifugames.waifu.' + id) : '');
    }

    /*
     * @function getWaifu
     * @info Gets the waifu string by either searching for its name, or by its id.
     *
     * @param {Number|String} waifu
     * @return {String} waifu name; will return "" if the waifu does not exist.
     */
    function getWaifu(waifu) {
        return (isNaN(parseInt(waifu)) ? getWaifuByName(waifu) : getWaifuById(waifu));
    }

    /*
     * @function waifuExists
     * @info Checks if a waifu exist
     *
     * @param {Number|String} waifu
     * @return {Boolean}
     */
    function waifuExists(waifu) {
        return (isNaN(parseInt(waifu)) ? (getWaifuByName(waifu) !== '') : (getWaifuById(waifu) !== ''));
    }

    /*
     * @function getWaifuIdByName
     * @info Gets the waifu id by its name.
     *
     * @param {String} name
     * @return {Number} waifu id; will return 0 if it does not exist.
     */
    function getWaifuIdByName(name) {
        var results = $.inidb.searchByValue('waifulist', name)[0];

        return (results === undefined ? 0 : results);
    }

    /*
     * @function getWaifuId
     * @info Gets the waifu id by its name or id
     *
     * @param {String} name
     * @return {Number} waifu id; will return 0 if it does not exist.
     */
    function getWaifuId(name) {
        return (isNaN(parseInt(name)) ? getWaifuIdByName(name) : name);
    }

    /*
     * @function hasWaifu
     * @info Used to check if a user has a specific waifu.
     *
     * @param {String} username
     * @param {Number|String} id or waifu name; warning the name might not be accurate.
     * @return {Boolean}
     */
    function hasWaifu(username, id) {
        return (isNaN(parseInt(id)) ? $.inidb.HasKey(username, 'waifus', getWaifuIdByName(id)) : $.inidb.HasKey(username, 'waifus', id));
    }

    /*
     * @function getTotalUserWaifus
     * @info Used to get the amount of waifus a user has.
     *
     * @param {String} username
     * @return {Number} total amount of waifus the user has; can be 0
     */
    function getTotalUserWaifus(username) {
        return $.inidb.GetKeyList(username, 'waifus').length;
    }

    /*
     * @function getUserWaifuCount
     * @info Used to get the amount of waifus a user has with that id
     *
     * @param {String} username
     * @param {Number} id
     * @return {Number} total amount of waifus that user has with that id; can be 0
     */
    function getUserWaifuCount(username, id) {
        return ($.inidb.HasKey(username, 'waifus', getWaifuId(id)) ? $.inidb.GetInteger(username, 'waifus', getWaifuId(id)) : 0);
    }
    /*
     * @function getWins
     * @info Used to get the amount of Wins
     *
     * @param {String} username
     */
    function getWins(username) {
        return ($.inidb.exists(username, 'wWins') ? $.inidb.get(username, 'wWins') : 0);
    }
    /*
     * @function getLosses
     * @info Used to get the amount of Losses
     *
     * @param {String} username
     */
    function getLosses(username) {
        return ($.inidb.exists(username, 'wLosses') ? $.inidb.get(username, 'wLosses') : 0);
    }

    /*
     * @function getCandy
     * @info Used to get the amount of candy
     *
     * @param {String} username
     * @return {Number} total amount of candy that user has; can be 0
     */
    function getCandy(username) {
        return ($.inidb.exists(username, 'candy') ? $.inidb.get(username, 'candy') : 0);
    }

    /*
     * @function getEXP
     * @info Used to get the amount of EXP a waifu has
     *
     * @param {String} username
     * @param {Number} id
     * @return {Number} total amount of EXP that waifu has; can be 0
     */
    function getEXP(username, id) {
        return ($.inidb.HasKey(username, 'wEXP', id) ? $.inidb.GetInteger(username, 'wEXP', id) : 0);
    }

    /*
     * @function getLevel
     * @param id
     * @return gets waifu level
     */
    function getLevel(username, id) {
        if (getEXP(username, id) <= 0) {
            return 1;
        }

        if (getEXP(username, id) >= 120000) {
            return 100;
        }

        return Math.round((Math.sqrt(getEXP(username, id) / 12)));
    }

    /*
     * @function getHitPoints
     * @param id
     * @return gets the hitpoints of a waifu in the user's harem
     */
     function getHitPoints(username, id) {
             if ($.inidb.GetInteger(username, 'wHitPoints', id) <= 0) {
                 return 0;
             } else {
                 return ($.inidb.HasKey(username, 'wHitPoints', id) ? ($.inidb.GetInteger(username, 'wHitPoints', id) >= 2500 ? 2500 : $.inidb.GetInteger(username, 'wHitPoints', id)) : 0);
             }
           }

    /*
     * @function getAttack
     * @param id
     * @return gets the attack of a waifu in the user's harem
     */
    function getAttack(username, id) {
        return ($.inidb.HasKey(username, 'wAttack', id) ? $.inidb.GetInteger(username, 'wAttack', id) : 0);
    }

    /*
     * @function getDefense
     * @param id
     * @return gets the defense of a waifu in the user's harem
     */
    function getDefense(username, id) {
        return ($.inidb.HasKey(username, 'wDefense', id) ? $.inidb.GetInteger(username, 'wDefense', id) : 0);
    }

    /*
     * @function getLove
     * @param id
     * @return gets the Love of a waifu in the user's harem
     */
    function getLove(username, id) {
        return ($.inidb.HasKey(username, 'wLove', id) ? ($.inidb.GetInteger(username, 'wLove', id) >= 100 ? 100 : $.inidb.GetInteger(username, 'wLove', id)) : 0);
    }

    /*
     * @function getLewd
     * @param id
     * @return gets the lewdness of a waifu in the user's harem
     */
    function getLewd(username, id) {
        return ($.inidb.HasKey(username, 'wLewdness', id) ? $.inidb.GetInteger(username, 'wLewdness', id) : 0);
    }

    /*
     * @function getRandomHaremIdFromUser
     * @info Will return a random harem id from that users harem list, can be 0 if he does not have any.
     *
     * @return {Number} harem id.
     */
    function getRandomHaremIdFromUser(username) {
        var keys = $.inidb.GetKeyList(username, 'harem'),
            temp = [];

        for (var i = 0; i < keys.length; i++) {
            temp.push(keys[i]);
        }
        if (temp.length > 0) {
            return $.randElement(temp);
        } else {
            return 0;
        }
    }

    /*
     * @function getRandomHaremNameFromUser
     * @info Will return a random harem name from that users harem list, can be '' if he does not have any.
     *
     * @return {String} harem name.
     */
    function getRandomHaremNameFromUser(username) {
        var keys = $.inidb.GetKeyList(username, 'harem'),
            temp = [];

        for (var i = 0; i < keys.length; i++) {
            temp.push($.inidb.GetString(username, 'harem', keys[i]));
        }

        if (temp.length > 0) {
            return $.randElement(temp);
        } else {
            return '';
        }
    }

    /*
     * @function isMarried
     * @info Checks if a user is married
     *
     * return {Boolean}
     */
    function isMarried(username) {
        return $.inidb.exists(username, 'married');
    }

    /*
     * @function getMarried
     * @info Pulls married waifu id
     *
     * return {Boolean}
     */
    function getMarried(username) {
        return ($.inidb.exists(username, 'married') ? $.inidb.get(username, 'married') : 0);
    }

    /*
     * @function hasHarem
     * @info Used to check if a user has a specific harem.
     *
     * @param {String} username
     * @param {Number|String} id or waifu name; warning the name might not be accurate.
     * @return {Boolean}
     */
    function hasHarem(username, id) {
        return (isNaN(parseInt(id)) ? $.inidb.HasKey(username, 'harem', getWaifuIdByName(id)) : $.inidb.HasKey(username, 'harem', id));
    }

    /*
     * @function getHarem
     * @info Gets a harem from a user.
     *
     * @param {Number|String} waifu
     * @return {String} harem name; will return "" if the user does not own that harem
     */
    function getHarem(username, waifu) {
        return ($.inidb.HasKey(username, 'harem', getWaifuId(waifu)) ? $.inidb.GetString(username, 'harem', getWaifuId(waifu)) : '');
    }

    /*
     * @function getTotalUserHarems
     * @info Used to get the amount of harems a user has.
     *
     * @param {String} username
     * @return {Number} total amount of waifus the user has; can be 0
     */
    function getTotalUserHarems(username) {
        return ($.inidb.GetKeyList(username, 'harem').length !== 0 ? $.inidb.GetKeyList(username, 'harem').length : 0);
    }

    /*
     * @function getReward
     * @info Retrieve reward data
     *
     * @param {String} reward
     */
    function getReward(reward) {
        return ($.inidb.exists('settings', 'wReward') ? $.inidb.get('settings', 'wReward') : 100);
    }
    /*
     * @function getFReward
     * @info Retrieve reward data
     *
     * @param {String} reward
     */
    function getFReward(reward) {
        return ($.inidb.exists('settings', 'wFReward') ? $.inidb.get('settings', 'wFReward') : 25);
    }
    /*
     * @function getFReward
     * @info Retrieve reward data
     *
     * @param {String} reward
     */
    function getBReward(reward) {
        return ($.inidb.exists('settings', 'wBReward') ? $.inidb.get('settings', 'wBReward') : 10000);
    }

    /*
     * @function replace
     *
     * @param {String} str
     * @return {String}
     */
    function replace(str) {
        return str.replace(/=/, '(').replace('[Rare]', '').replace(/=/g, ')');
    }

    /*
     * @function replace2
     *
     * @param {String} str
     * @return {String}
     */
    function replace2(str) {
        return str.match(reGetTitle).slice(2)[0];
    }

    /*
     * @function replace
     *
     * @param {String} str
     * @return {String}
     */
    function replace3(str) {
        return str.replace(/=/, '(').replace(/=/g, ')');
    }

    /*
     * @function url
     *
     * @param {String} str
     * @return {String}
     */
    function url(str) {
        return str.replace('\'', '%27').match(reGetUrl)[2] + ' ' + str.replace('\'', '%27').match(reGetUrl)[3];
    }

    /*
     * @function updateBattleStats
     * @info Used to update a users stats after a battle
     *
     * @param {String} username
     * @param {Array} array
     * @param {Number} id
     * @param {Boolean} isDecr
     */
    function updateBattleStats(username, array, id, isDecr) {
        var rnd;

        $.inidb.setAutoCommit(false);
        for (var i = 0; i < array.length; i++) {
            rnd = $.randRange(0, 1);
            if (isDecr === false) {
                $.inidb.incr(username, array[i], getWaifuId(id), rnd);
            } else {
                if ($.inidb.GetInteger(username, array[i], getWaifuId(id)) > 0) {
                    $.inidb.decr(username, array[i], getWaifuId(id), rnd);
                }
            }
        }
        $.inidb.incr(username, 'harem', getWaifuId(id), 5);
        $.inidb.setAutoCommit(true);
    }

    function rareChance() {
        var toggle = $.inidb.exists('settings', 'rChance') ? $.inidb.get('settings', 'rChance') : 'false';

        if (toggle == 'false') {
            $.say($.lang.get('waifugames.rare.chance'));
            $.panelsocketserver.alertImage('rarechance.gif' + ',4');
            $.inidb.set('settings', 'rChance', 'true');
        } else {
            $.say($.lang.get('waifugames.rare.over'));
            $.inidb.set('settings', 'rChance', 'false');
        }
    }

    /*
     * function catchWaifu
     * @info Used to catch random waifus.
     *
     * @param {String} username
     */
    function catchWaifu(username) {
        var id = $.randRange(0, totalWaifus),
            missR = $.randRange(1, responses.miss - 1),
            unlock = $.randRange(1, 2),
            chance = $.randRange(1, 5),
            rarechance = $.randRange(4, 25),
            reward = getReward(),
            waifu = getWaifu(id),
            link = (google + url(waifu)),
            candy = '',
            candy2 = '',
            candyDrop = $.randRange(1, 2);
            rare = '';


        if (chance >= 4 && candyDrop > 1) {
            $.inidb.incr(username, 'candy', 1);
            candy = $.lang.get('waifugames.candy.dropped');
            candy2 = $.lang.get('waifugames.candy.dropped2');
        }

        if ($.inidb.get('settings', 'rChance') == 'true') {
            rarechance = $.randRange(18, 20);
        }

        if (waifu.includes('[Rare]')) {
            if (rarechance >= 20) {
                rare = ('/me RARE! +' + $.getPointsString(reward) + ' ');
                $.panelsocketserver.alertImage(navigatorImg + ',5');
                $.inidb.incr('points', username, reward);
            } else {
                $.say($.lang.get('waifugames.catchmiss.' + missR, $.userPrefix(username, true), replace(waifu), id, candy2));
                return;
            }
        }

        if (chance <= 4) {
            if (hasWaifu(username, id)) {
                $.inidb.incr(username, 'waifus', id, unlock);
                $.say($.lang.get('waifugames.catch.own', rare + $.userPrefix(username, true), unlock, replace(waifu), id, $.shortenURL.getShortURL(link) + candy));
            } else {
                $.inidb.SetInteger(username, 'waifus', id, unlock);
                $.say($.lang.get('waifugames.catch.new', rare + $.userPrefix(username, true), unlock, replace(waifu), id, $.shortenURL.getShortURL(link) + candy));
            }
        } else {
            $.say($.lang.get('waifugames.catchmiss.' + missR, $.userPrefix(username, true), replace(waifu), id, candy2));
            return;
        }
    }

    /*
     * function randomWaifu
     * @info Used to get a random waifu.
     *
     * @param {String} username
     */
    function randomWaifu(username) {
        var id = $.randRange(0, totalWaifus),
            waifu = getWaifu(id),
            link = (google + url(waifu));

        if (getTotalUserWaifus(username) === 0) {
            $.say($.lang.get('waifugames.random.0', $.whisperPrefix(username)));
        } else {
            if (!isMarried(username)) {
                $.say($.lang.get('waifugames.random.success', $.userPrefix(username, true), replace(waifu), id, $.shortenURL.getShortURL(link)));
            } else {
                id = getWaifuId(getMarried(username));
                link = (google + url(getWaifu(id)));
                $.say($.lang.get('waifugames.random.married', $.userPrefix(username, true), replace(getWaifu(id)), id, getHitPoints(username, id), getLevel(username, id), getAttack(username, id), getDefense(username, id), getLove(username, id), $.shortenURL.getShortURL(link)));
            }
        }
    }

    /*
     * function sendWaifu
     * @info Used to send someone a waifu.
     *
     * @param {String} username
     * @param {String} receiver
     * @param {Number} id
     */
    function sendWaifu(username, receiver, id) {
        if (!waifuExists(id)) {
            $.say($.lang.get('waifugames.exist.404', $.whisperPrefix(username)));
            return;
        }

        id = getWaifuId(id);

        var waifu = getWaifu(id),
            link = (google + url(waifu));

        if (getUserWaifuCount(username, id) > 0) {
            $.say($.lang.get('waifugames.giftwaifu.success', $.userPrefix(username, true), replace(waifu), $.userPrefix(receiver, false), $.shortenURL.getShortURL(link)));
            $.inidb.incr(receiver.toLowerCase(), 'waifus', id, 1);
            if (getEXP(username, id) > getEXP(receiver.toLowerCase(), id)) {
              $.inidb.SetString(receiver.toLowerCase(), 'wEXP', getWaifuId(id), getEXP(username, getWaifuId(id)));
              $.inidb.SetString(receiver.toLowerCase(), 'wHitPoints', getWaifuId(id), getHitPoints(username, getWaifuId(id)));
              $.inidb.SetString(receiver.toLowerCase(), 'wAttack', getWaifuId(id), getAttack(username, getWaifuId(id)));
              $.inidb.SetString(receiver.toLowerCase(), 'wDefense', getWaifuId(id), getDefense(username, getWaifuId(id)));
            }
            $.inidb.decr(username, 'waifus', id, 1);
        } else {
            $.say($.lang.get('waifugames.giftwaifu.404', $.userPrefix(username, true)));
        }
    }

    /*
     * function sendCandy
     * @info Used to send someone candy.
     *
     * @param {String} username
     * @param {String} receiver
     * @param {Number} candy amount
     */
    function sendCandy(username, receiver, amount) {
        var candy = $.inidb.get(username, 'candy');

        if (candy >= amount) {
            $.say($.lang.get('waifugames.giftcandy.success', $.userPrefix(username, true), $.userPrefix(receiver, false), amount));
            $.inidb.incr(receiver.toLowerCase(), 'candy', amount);
            $.inidb.decr(username, 'candy', amount);
        } else {
            $.say($.lang.get('waifugames.candy.nostock', $.userPrefix(username, true)));
            return;
        }
    }

    /*
     * @function waifuProfile
     * @info Used to get your current profile of waifus.
     */
    function waifuProfile(username) {
        $.say($.lang.get('waifugames.profile.success', $.whisperPrefix(username), getTotalUserWaifus(username), totalWaifus, getCandy(username), Math.floor((getTotalUserWaifus(username) / totalWaifus) * 100), getWins(username), getLosses(username)));
    }

    /*
     * @function setWaifu
     * @info Used to set a waifu.
     *
     * @param {String} username
     * @param {Number} id
     */
    function setWaifu(username, id) {
        if (id === undefined) {
            $.say($.lang.get('waifugames.marry.null', $.whisperPrefix(username)));
            return;
        }

        if (isMarried(username)) {
            $.say($.lang.get('waifugames.marry.already', $.whisperPrefix(username), replace(getWaifu(getMarried(username)))));
            return;
        }

        if (!hasHarem(username, id)) {
            $.say($.lang.get('waifugames.harem.kick404', $.whisperPrefix(username)));
            return
        }

        if (waifuExists(id) && hasWaifu(username, id)) {
            $.inidb.set(username, 'married', getWaifuId(id));
            $.inidb.incr(username, 'wLove', getWaifuId(id), 50);
            $.inidb.incr(username, 'wLewdness', getWaifuId(id), 20);
            $.say($.lang.get('waifugames.marry.success', $.userPrefix(username, true), replace(getWaifu(id))));

        } else {
            $.say($.lang.get('waifugames.exist.404', $.whisperPrefix(username)));
        }
    }

    /*
     * @function resetWaifu
     * @info Removes married waifu.
     *
     * @param {String} username
     */
    function resetWaifu(username) {
        if (isMarried(username)) {
            $.say($.lang.get('waifugames.split.success', $.whisperPrefix(username), replace(getWaifu(getMarried(username)))));
            $.inidb.del(username, 'married');
            $.inidb.decr(username, 'wLove', getMarried(username), 60);
            $.inidb.decr(username, 'wLewdness', getMarried(username), 20);
        } else {
            $.say($.lang.get('waifugames.split.404', $.whisperPrefix(username)));
        }
    }

    /*
     * @function buyWaifu
     * @info Used to buy waifus
     *
     * @param {String} username
     * @param {Number} id
     */
    function buyWaifu(username, id) {
        if (!waifuExists(id)) {
            $.say($.lang.get('waifugames.exist.404', $.whisperPrefix(username)));
            $.inidb.incr('points', username, $.inidb.get('pricecom', 'buywaifu'));
            return;
        }

        var waifu = getWaifu(id),
            link = (google + url(waifu));

        $.inidb.incr(username, 'waifus', getWaifuId(id), 1);
        $.say($.lang.get('waifugames.buywaifu.new', $.userPrefix(username, true), replace(waifu), getWaifuId(id), $.shortenURL.getShortURL(link)));
    }

    /*
     * @function buyCandy
     * @info Used to buy candy
     *
     * @param {Number} id
     */
    function buyCandy(sender, amount) {
        var price = $.inidb.get('pricecom', 'buycandy');

        if (amount >= 1 && $.inidb.get('points', sender) >= price * amount) {
            $.inidb.incr(sender, 'candy', amount);
            $.inidb.decr('points', sender, ((price * amount) - price));
            $.say($.lang.get('waifugames.candy.buy', $.whisperPrefix(sender), amount, $.getPointsString(price * amount), getCandy(sender)));
        } else {
            amount = 1;
            $.inidb.incr(sender, 'candy', amount);
            $.say($.lang.get('waifugames.candy.buy', $.whisperPrefix(sender), amount, $.getPointsString(price), getCandy(sender)));
        }

    }

    /*
     * @function checkWaifu
     * @info Checks if a user owns that harem
     *
     * @param {String} username
     * @param {Number} id
     */
    function checkWaifu(sender, id) {
        if (!waifuExists(id)) {
            $.say($.lang.get('waifugames.exist.404', $.whisperPrefix(sender)));
            return;
        }

        id = getWaifuId(id);

        var waifu = getWaifu(id),
            link = (google + url(waifu)),
            stats = '';

        if (hasHarem(sender, id)) {
            stats = $.lang.get('waifugames.checkwaifu.stats', getHitPoints(sender, id), getLevel(sender, id), getAttack(sender, id), getDefense(sender, id), getLove(sender, id));
        }

        $.say($.lang.get('waifugames.checkwaifu.success', $.userPrefix(sender, true), getUserWaifuCount(sender, id), replace(getWaifu(id)), id, stats, $.shortenURL.getShortURL(link)));
    }

    /*
     * @function releaseWaifu
     * @info USed to release a waifu
     *
     * @param {String} username
     * @param {Number|String} id
     */
    function releaseWaifu(username, id) {


        if ($.inidb.GetInteger(username, 'harem', getWaifuId(id)) > 0) {
            $.say($.lang.get('waifugames.harem.release404', replace(getWaifu(id))));
            return;
        }

        if ($.inidb.GetInteger(username, 'waifus', getWaifuId(id)) >= 1) {
            $.inidb.decr(username, 'waifus', getWaifuId(id), 1);
            $.inidb.RemoveKey(username, 'wEXP', getWaifuId(id));
            $.inidb.RemoveKey(username, 'wHitPoints', getWaifuId(id));
            $.inidb.RemoveKey(username, 'wAttack', getWaifuId(id));
            $.inidb.RemoveKey(username, 'wDefense', getWaifuId(id));
            $.inidb.RemoveKey(username, 'wLove', getWaifuId(id));
            $.inidb.RemoveKey(username, 'wLewdness', getWaifuId(id));
            $.say($.lang.get('waifugames.harem.release', replace(getWaifu(id))));
        } else {
            $.say($.lang.get('waifugames.harem.release404', replace(getWaifu(id))));
            return;
        }
    }

    /*
     * @function addHarem
     * @info Adds a harem to that users list
     *
     * @param {String} username
     * @param {Number} id
     */
    function addHarem(username, id) {
        var hp = 100,
            atk = 1,
            def = 1,
            love = 1,
            lewd = 1;

        if (!waifuExists(id)) {
            $.say($.lang.get('waifugames.exist.404', $.whisperPrefix(username)));
            return;
        }

        if (hasHarem(username, id)) {
            $.say($.lang.get('waifugames.harem.repeat', $.whisperPrefix(username)));
            return;
        }

        if (!hasWaifu(username, id)) {
            $.say($.lang.get('waifugames.harem.owned', $.whisperPrefix(username)));
            return;
        }

        if (getTotalUserHarems(username) >= 6) {
            $.say($.lang.get('waifugames.harem.denied'));
            return;
        }

        if (getWaifu(id).includes('[Rare]')) {
            atk = $.randRange(1, 20), def = $.randRange(1, 20), love = $.randRange(1, 30), lewd = 10;
        }

        $.inidb.SetString(username, 'harem', getWaifuId(id), 1);
        $.say($.lang.get('waifugames.harem.success', $.userPrefix(username, true), replace(getWaifu(id))));
    }

    /*
     * @function kickHarem
     * @info USed to kick a harem
     *
     * @param {String} username
     * @param {Number|String} id
     */
    function kickHarem(username, id) {
        if ($.inidb.get(username, 'married') == getWaifuId(id)) {
            $.inidb.del(username, 'married');
        }

        if ($.inidb.GetInteger(username, 'harem', getWaifuId(id)) == 1) {
            $.inidb.RemoveKey(username, 'harem', getWaifuId(id));
            $.say($.lang.get('waifugames.harem.kick', replace(getWaifu(id))));
        } else {
            $.say($.lang.get('waifugames.harem.kick404', $.userPrefix(username, true)));
        }
    }

    /*
     * @function getHarem
     * @info Used to get a harem
     *
     * @param {String} username
     */
    function getHarem(username) {
        var keys = $.inidb.GetKeyList(username, 'harem'),
            array = [];

        for (var i = 0; i < keys.length; i++) {
            array.push(replace2($.lang.get('waifugames.waifu.' + keys[i])) + ' #' + keys[i]);
        }

        if (array.length >= 1) {
            $.say($.lang.get('waifugames.harem.get', $.whisperPrefix(username), array.join(', ')));
        } else {
            $.say($.lang.get('waifugames.harem.404'));
        }
    }

    /*
     * @function getCandy
     * @info Used to get candy amount
     *
     * @param {String} sender
     */
    function useCandy(username, amount, id) {

        if (id === '') {
            id = getWaifuId(amount);
            amount = 1;
        } else {
            id = getWaifuId(id);
            amount = amount;
        }

          if (amount > getCandy(username)) {
              $.say($.lang.get('waifugames.candy.enough', $.whisperPrefix(username)));
              return;
          }

          if (getCandy(username) < 1) {
              $.say($.lang.get('waifugames.candy.nostock', $.whisperPrefix(username)));
              return;
          }

          if (!waifuExists(id)) {
              $.say($.lang.get('waifugames.exist.404', $.whisperPrefix(username)));
              return;
          }
	    
          if (getLevel(username, id) >= 100) {
              $.inidb.SetInteger(username, 'wHitPoints', id, 100);
              $.inidb.decr(username, 'candy', amount);
              $.say($.lang.get('waifugames.level.max', $.whisperPrefix(username), replace(getWaifu(id))));
              return;
          }
          
          if ((100 * amount +  getEXP(username, id)) > 120000) {
            $.say($.lang.get('waifugames.level.exceed', $.whisperPrefix(username), amount, replace(getWaifu(id))));
            return;
          }

        $.inidb.SetInteger(username, 'wHitPoints', id, 100);
        $.inidb.incr(username, 'wEXP', id, (100 * amount));
        $.inidb.incr(username, 'wAttack', id, $.randRange(1, (1 + amount)));
        $.inidb.incr(username, 'wDefense', id, $.randRange(1, (1 + amount)));
        $.inidb.incr(username, 'wLove', id, $.randRange(1, (1 + amount)));
        $.inidb.incr(username, 'wLewdness', id, $.randRange(1, (1 + amount)));
        $.inidb.decr(username, 'candy', amount);
        $.say($.lang.get('waifuGames.candy.use', $.whisperPrefix(username), replace(getWaifu(id)), (100 * amount), getEXP(username, id), getHitPoints(username, id), getLevel(username, id), getAttack(username, id), getDefense(username, id), getCandy(username, id)));
    }

    function generateBoss(sender) {
        var bosses = $.randRange(1, 5),
            bossHP  = $.inidb.GetInteger('boss', 'wHitPoints', $.inidb.get('boss', 'id'));

        if (bossHP <= 0) {
            $.inidb.set('boss', 'id', bosses);
            $.inidb.SetInteger('boss', 'harem', bosses, 1);
            $.inidb.SetInteger('boss', 'wHitPoints', bosses, 2500);
            $.inidb.SetInteger('boss', 'wAttack', bosses, $.randRange(200,600));
            $.inidb.SetInteger('boss', 'wDefense', bosses, $.randRange(800,1000));
            $.inidb.SetInteger('boss', 'wLove', bosses, 1000);
        }

              return bosses;

    }

    function getBoss(sender, bosses) {
        if ($.inidb.GetInteger('boss', 'wHitPoints', $.inidb.get('boss', 'id')) > 0) {
            return $.lang.get('waifugames.bosses.' + $.inidb.get('boss', 'id'));
        } else {
            return $.lang.get('waifugames.bosses.' + generateBoss(sender));
        }
    }
    /*
     * @function battle
     * @param opponent
     * @return Battle with the boss
     */
    function bossBattle(username, action) {
        var random1 = $.randRange(1, responses.attack - 1),
            random2 = $.randRange(1, responses.fight - 1),
			      bosses = $.randRange(1, responses.bosses - 1),
			      opponent = 'boss',
            id,
            id2 = getRandomHaremIdFromUser(opponent),
            waifu1,
            waifu2,
            player1 = $.userPrefix(username),
			      player2 = opponent,
            attack = $.lang.get('waifugames.attack.' + random1),
            dmg,
            dmgRec,
            dmgMsg = '',
            winMsg = '';

        if (action !== '') {
            id = getWaifuId(action);
        } else if (isMarried(username) && getHitPoints(username, getMarried(username)) > 1) {
            id = getMarried(username);
        } else {
            id = getRandomHaremIdFromUser(username);
        }


        waifu1 = getWaifu(id);
        waifu2 = getBoss(id2, generateBoss());

            if (getTotalUserHarems(username) <= 0) {
                $.say($.lang.get('waifugames.harem.fight404'));
                return;
        }

        if (getAttack(username, id) >= getDefense(opponent, id2)) {
            dmg = Math.floor($.randRange(getDefense(opponent, id2), getAttack(username, id)) / 2 - getDefense(opponent, id2) / 3);
        } else {
            dmg = Math.floor($.randRange(0, Math.floor(getAttack(username, id) / 6)));
        }

        if (getDefense(opponent, id2) >= getAttack(username, id)) {
            dmgRec = Math.floor($.randRange(getAttack(username, id), getDefense(opponent, id2)) / 2 - getAttack(username, id) / 3);
        } else {
            dmgRec = Math.floor($.randRange(0, getAttack(opponent, id2) / 6));
        }

        if (dmgRec >= 100) {
          dmgRec = $.randRange(90,100);
        }

        if (getHitPoints(username, id) < 1) {
            $.say($.lang.get('waifugames.player.nohp', player1, replace2(waifu1)));
            return;
        } else if (getHitPoints(opponent, id2) < 1) {
			       generateBoss();
        } else {

            if (!getEXP(username) >= 120000) {
                updateBattleStats(username, ['wLewdness', 'wAttack', 'wDefense'], id, false);
            }

            $.inidb.incr(username, 'wEXP', id, 50);

            $.inidb.decr(opponent, 'wHitPoints', id2, dmg);
            $.inidb.decr(username, 'wHitPoints', id, dmgRec);


            if ($.inidb.GetInteger(username, 'wHitPoints', id) <= 0) {
                winMsg = $.lang.get('waifugames.boss.loss', player2, replace2(waifu2), player1, replace2(waifu1), $.getPointsString(getFReward()));
                $.inidb.incr(username, 'wLosses', 1);
            }

            if ($.inidb.GetInteger(opponent, 'wHitPoints', id2) <= 0) {
                winMsg = $.lang.get('waifugames.boss.win', player1, replace2(waifu1), player2, '[Boss] ' + replace2(waifu2), $.getPointsString(getBReward()));
                $.inidb.incr('points', username, (getBReward()));
                $.inidb.incr(username, 'wWins', 1);
                $.inidb.incr(username, 'candy', 10);
                $.inidb.incr(opponent, 'wLosses', 1);
				        $.inidb.RemoveSection('boss', 'harem');
                $.inidb.del('boss', 'id');
                $.panelsocketserver.alertImage($.lang.get('waifugames.alert.boss') + ', 12');
            }

            var dmgRecMsg = $.lang.get('waifugames.fight.dmgrec', dmgRec);

            if (dmg === 0) {
                dmgMsg = $.lang.get('waifugames.fight.miss');
            } else {
                dmgMsg = $.lang.get('waifugames.fight.dmg', dmg);
            }

            $.say('[BOSS FIGHT] ' + $.lang.get('waifugames.fight.' + random2, replace2(waifu1), getHitPoints(username, id), dmgRecMsg, attack, dmgMsg, '[Boss] ' + replace2(waifu2), getHitPoints(opponent, id2), winMsg));

        }

    }
    /*
     * @function battle
     * @param opponent
     * @return Battle with another waifu
     */
    function startBattle(username, opponent, action) {
        var random1 = $.randRange(1, responses.attack - 1),
            random2 = $.randRange(1, responses.fight - 1),
            id,
            id2 = getRandomHaremIdFromUser(opponent),
            waifu1,
            waifu2,
            player1 = $.userPrefix(username),
            player2 = $.userPrefix(opponent),
            attack = $.lang.get('waifugames.attack.' + random1),
            dmg,
            dmgRec,
            dmgMsg = '',
            winMsg = '';

        if (action !== '') {
            id = getWaifuId(action);
        } else if (isMarried(username) && getHitPoints(username, getMarried(username)) > 1) {
            id = getMarried(username);
        } else {
            id = getRandomHaremIdFromUser(username);
        }

        if (isMarried(opponent) && getHitPoints(opponent, getMarried(opponent)) > 1) {
            id2 = getMarried(opponent);
        } else {
            id2 = getRandomHaremIdFromUser(opponent);
        }

        waifu1 = getWaifu(id);
        waifu2 = getWaifu(id2);

        if (opponent.equalsIgnoreCase(username)) {
            $.say($.lang.get('waifugames.harem.same'));
            return;
        }

        if (getTotalUserHarems(opponent) <= 0) {
            $.say($.lang.get('waifugames.harem.fight4042'));
            return;
        } else {
            if (getTotalUserHarems(username) <= 0) {
                $.say($.lang.get('waifugames.harem.fight404'));
                return;
            }
        }

        if (getAttack(username, id) >= getDefense(opponent, id2)) {
            dmg = Math.floor($.randRange(getDefense(opponent, id2), getAttack(username, id)) / 2 - getDefense(opponent, id2) / 3);
        } else {
            dmg = Math.floor($.randRange(0, getAttack(username, id) / 6));
        }

        if (getDefense(opponent, id2) >= getAttack(username, id)) {
            dmgRec = Math.floor($.randRange(getAttack(username, id), getDefense(opponent, id2)) / 2 - getAttack(username, id) / 3);
        } else {
            dmgRec = Math.floor($.randRange(0, getAttack(opponent, id2) / 6));
        }

        if (getHitPoints(username, id) < 1) {
            $.say($.lang.get('waifugames.player.nohp', player1, replace2(waifu1)));
            return;
        } else if (getHitPoints(opponent, id2) < 1) {
            $.say($.lang.get('waifugames.player.nohp', player2, replace2(waifu2)));
            return;
        } else {

            if (!getEXP(username) >= 120000) {
                updateBattleStats(username, ['wLewdness', 'wAttack', 'wDefense'], id, false);
            }
            if (!getEXP(opponent) >= 120000) {
                updateBattleStats(opponent, ['wLewdness', 'wAttack', 'wDefense'], id2, false);
            }

            $.inidb.incr(username, 'wEXP', id, 50);
            $.inidb.incr(opponent, 'wEXP', id2, 50);

            $.inidb.decr(opponent, 'wHitPoints', id2, dmg);
            $.inidb.decr(username, 'wHitPoints', id, dmgRec);

            if ($.inidb.GetInteger(opponent, 'wHitPoints', id2) <= 0 && $.inidb.GetInteger(username, 'wHitPoints', id) <= 0) {
                winMsg = $.lang.get('waifugames.win.draw', player1, replace2(waifu1), player2, replace2(waifu2));
            }

            if ($.inidb.GetInteger(username, 'wHitPoints', id) <= 0) {
                winMsg = $.lang.get('waifugames.win.fight', player2, replace2(waifu2), player1, replace2(waifu1), $.getPointsString(getFReward()));
                $.inidb.incr('points', opponent, getFReward());
                $.inidb.incr(opponent, 'wWins', 1);
                $.inidb.incr(opponent, 'candy', 1);
                $.inidb.incr(username, 'wLosses', 1);
            }

            if ($.inidb.GetInteger(opponent, 'wHitPoints', id2) <= 0) {
                winMsg = $.lang.get('waifugames.win.fight', player1, replace2(waifu1), player2, replace2(waifu2), $.getPointsString(getFReward()));
                $.inidb.incr('points', username, getFReward());
                $.inidb.incr(username, 'wWins', 1);
                $.inidb.incr(username, 'candy', 1);
                $.inidb.incr(opponent, 'wLosses', 1);
            }

            var dmgRecMsg = $.lang.get('waifugames.fight.dmgrec', dmgRec);

            if (dmg === 0) {
                dmgMsg = $.lang.get('waifugames.fight.miss');
            } else {
                dmgMsg = $.lang.get('waifugames.fight.dmg', dmg);
            }

            $.say($.lang.get('waifugames.fight.' + random2, replace2(waifu1), getHitPoints(username, id), dmgRecMsg, attack, dmgMsg, replace2(waifu2), getHitPoints(opponent, id2), winMsg));

        }

    }

    /*
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        if (command.equalsIgnoreCase('waifu')) {
            if (action === undefined) {
                randomWaifu(sender);
            } else {
                checkWaifu(sender, args.join(' '));
            }
        }

        if (command.equalsIgnoreCase('seduce')) {
            if ($.isOnline($.channelName)) {
                catchWaifu(sender);
            } else {
                $.say($.lang.get('waifugames.online.404', $.whisperPrefix(sender), $.channelName));
                return;
            }
        }

        if (command.equalsIgnoreCase('boss')) {
          if ($.isOnline($.channelName)) {
              generateBoss();
              bossBattle(sender, args.join(' '));
          } else {
           $.say($.lang.get('waifugames.online.404', $.whisperPrefix(sender), $.channelName));
            return;
          }
        }

        if (command.equalsIgnoreCase('fight')) {
          if ($.isOnline($.channelName)) {
              startBattle(sender, action.toLowerCase(), args.slice(1).join(' '));
              if (action === undefined) {
                    $.say($.lang.get('waifugames.fight.usage'));
                    return;
              }
          } else {
            $.say($.lang.get('waifugames.online.404', $.whisperPrefix(sender), $.channelName));
            return;
          }
        }

        if (command.equalsIgnoreCase('candy')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.candy.get', $.whisperPrefix(sender), getCandy(sender)));
                return;
            } else {
                useCandy(sender, action, args.slice(1).join(' '));
            }
        }

        if (command.equalsIgnoreCase('buycandy')) {
            buyCandy(sender, action);
        }

        if (command.equalsIgnoreCase('harem')) {
            getHarem(sender);
        }

        if (command.equalsIgnoreCase('addharem')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.addharem.usage'));
            } else {
                addHarem(sender, args.join(' '));
            }
        }

        if (command.equalsIgnoreCase('kickharem')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.kickharem.usage'));
            } else {
                kickHarem(sender, args.join(' '));
            }
        }

        if (command.equalsIgnoreCase('resetharem')) {
            $.inidb.del(username, 'married');
            $.inidb.RemoveSection(sender, 'harem');
            $.say($.whisperPrefix(sender) + $.lang.get('waifugames.harem.reset'));
        }

        if (command.equalsIgnoreCase('giftwaifu')) {
            sendWaifu(sender, action, args.slice(1).join(' '));
        }

        if (command.equalsIgnoreCase('giftcandy')) {
            sendCandy(sender, action, args[1]);
        }

        if (command.equalsIgnoreCase('buywaifu')) {
            buyWaifu(sender, args.join(' '));
        }

        if (command.equalsIgnoreCase('profile')) {
            waifuProfile(sender);
        }

        if (command.equalsIgnoreCase('setwaifu')) {
            setWaifu(sender, args.join(' '));
        }

        if (command.equalsIgnoreCase('resetwaifu')) {
            resetWaifu(sender);
        }

        if (command.equalsIgnoreCase('rarechance')) {
            rareChance(action);
        }
        if (command.equalsIgnoreCase('resetratio')) {
            $.inidb.set(sender, 'wWins', 0);
            $.inidb.set(sender, 'wLosses', 0);
            $.say($.lang.get('waifugames.reset.stats', $.whisperPrefix(sender)));
        }
        if (command.equalsIgnoreCase('release')) {
            releaseWaifu(sender, args.join(' '));
        }
        if (command.equalsIgnoreCase('waifureward')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.reward.get', $.getPointsString(getReward())));
            } else {
                $.inidb.set('settings', 'wReward', action);
                $.say($.lang.get('waifugames.reward.set', $.getPointsString(action)));
            }
        }

        if (command.equalsIgnoreCase('fightreward')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.fightreward.get', $.getPointsString(getFReward())));
            } else {
                $.inidb.set('settings', 'wFReward', action);
                $.say($.lang.get('waifugames.fightreward.set', $.getPointsString(action)));
            }
        }

        if (command.equalsIgnoreCase('bossreward')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.bossreward.get', $.getPointsString(getBReward())));
            } else {
                $.inidb.set('settings', 'wBReward', action);
                $.say($.lang.get('waifugames.bossreward.set', $.getPointsString(action)));
            }
        }
        if (command.equalsIgnoreCase('waifuhelp')) {
            $.say($.whisperPrefix(sender) + $.lang.exists('waifugames.waifuhelp'));
        }
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./games/waifuGames.js')) {
            $.registerChatCommand('./games/waifuGames.js', 'waifu', 7);
            $.registerChatCommand('./games/waifuGames.js', 'profile', 7);
            $.registerChatCommand('./games/waifuGames.js', 'fight', 7);
            $.registerChatCommand('./games/waifuGames.js', 'boss', 7);
            $.registerChatCommand('./games/waifuGames.js', 'candy', 7);
            $.registerChatCommand('./games/waifuGames.js', 'buycandy', 7);
            $.registerChatCommand('./games/waifuGames.js', 'seduce', 7);
            $.registerChatCommand('./games/waifuGames.js', 'giftwaifu', 7);
            $.registerChatCommand('./games/waifuGames.js', 'giftcandy', 7);
            $.registerChatCommand('./games/waifuGames.js', 'resetwaifu', 7);
            $.registerChatCommand('./games/waifuGames.js', 'release', 7);
            $.registerChatCommand('./games/waifuGames.js', 'setwaifu', 7);
            $.registerChatCommand('./games/waifuGames.js', 'buywaifu', 7);
            $.registerChatCommand('./games/waifuGames.js', 'harem', 7);
            $.registerChatCommand('./games/waifuGames.js', 'addharem', 7);
            $.registerChatCommand('./games/waifuGames.js', 'kickharem', 7);
            $.registerChatCommand('./games/waifuGames.js', 'resetharem', 7);
            $.registerChatCommand('./games/waifuGames.js', 'waifuhelp', 7);
            $.registerChatCommand('./games/waifuGames.js', 'rarechance', 7);
            $.registerChatCommand('./games/waifuGames.js', 'resetratio', 7);
            $.registerChatCommand('./games/waifuGames.js', 'waifureward', 1);
            $.registerChatCommand('./games/waifuGames.js', 'fightreward', 1);
            $.registerChatCommand('./games/waifuGames.js', 'bossreward', 1);
            load();
        }
    });
})();
