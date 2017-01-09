(function() {
    var google = 'http://pokemondb.net/pokedex/',
        reGetUrl = new RegExp(/(\[Legendary\]\s)?(.*)\s=(.*)=/),
        reGetTitle = new RegExp(/(\[Legendary\]\s)?(.*)\s=(.*)=.*/),
        responses = {
            win: 1,
            lost: 1,
            stalemate: 1
        },
        totalWaifus = 0,
        navigatorImg = 'navigator.gif';

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
            string += 'Pokémon #' + i + ' ' + replace($.lang.get('waifugames.waifu.' + i)) + '\r\n';
            ++i;
        }
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
            $.inidb.SetString('pokelist', '', i, $.lang.get('waifugames.waifu.' + i));
            ++i;
        }
        $.inidb.setAutoCommit(true);
    }

    /*
     * @function loadResponses
     * Gets a count of all of the game responses and saves them in an object to be used later.
     */
    function loadResponses() {
        while ($.lang.exists('waifugames.win.' + responses.win)) {
            responses.win++;
        }

        while ($.lang.exists('waifugames.lose.' + responses.lost)) {
            responses.lost++;
        }

        while ($.lang.exists('waifugames.stalemate.' + responses.stalemate)) {
            responses.stalemate++;
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
        var results = $.inidb.searchByValue('pokelist', name)[0];

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
        var results = $.inidb.searchByValue('pokelist', name)[0];

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
        return (isNaN(parseInt(id)) ? $.inidb.HasKey(username, 'pokemon', getWaifuIdByName(id)) : $.inidb.HasKey(username, 'pokemon', id));
    }

    /*
     * @function getTotalUserWaifus
     * @info Used to get the amount of waifus a user has.
     *
     * @param {String} username
     * @return {Number} total amount of waifus the user has; can be 0
     */
    function getTotalUserWaifus(username) {
        return ($.inidb.GetKeyList(username, 'pokemon').length !== 0 ? $.inidb.GetKeyList(username, 'pokemon').length : 0);
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
        return ($.inidb.HasKey(username, 'pokemon', getWaifuId(id)) ? $.inidb.GetInteger(username, 'pokemon', getWaifuId(id)) : 0);
    }

    /*
     * @function getCandy
     * @info Used to get the amount of candy
     *
     * @param {String} username
     * @return {Number} total amount of candy that user has; can be 0
     */
    function getCandy(username) {
        return ($.inidb.exists(username, 'pcandy') ? $.inidb.get(username, 'pcandy') : 0);
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
        return ($.inidb.HasKey(username, 'team', id) ? $.inidb.GetInteger(username, 'team', id) : 0);
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
        return Math.round((Math.sqrt(getEXP(username, id) / 50)));
    }

    /*
     * @function getAttack
     * @param id
     * @return gets the attack of a waifu in the user's harem
     */
    function getAttack(username, id) {
        return ($.inidb.HasKey(username, 'pAttack', id) ? $.inidb.GetInteger(username, 'pAttack', id) : 0);
    }

    /*
     * @function getDefense
     * @param id
     * @return gets the defense of a waifu in the user's harem
     */
    function getDefense(username, id) {
        return ($.inidb.HasKey(username, 'pDefense', id) ? $.inidb.GetInteger(username, 'pDefense', id) : 0);
    }

    /*
     * @function getLove
     * @param id
     * @return gets the Love of a waifu in the user's harem
     */
    function getLove(username, id) {
        return ($.inidb.HasKey(username, 'pLove', id) ? $.inidb.GetInteger(username, 'pLove', id) : 0);
    }

    /*
     * @function getLewd
     * @param id
     * @return gets the lewdness of a waifu in the user's harem
     */
    function getLewd(username, id) {
        return ($.inidb.HasKey(username, 'pLewdness', id) ? $.inidb.GetInteger(username, 'pLewdness', id) : 0);
    }

    /*
     * @function getRandomharemIdFromUser
     * @info Will return a random harem id from that users harem list, can be 0 if he does not have any.
     *
     * @return {Number} harem id.
     */
    function getRandomharemIdFromUser(username) {
        var keys = $.inidb.GetKeyList(username, 'team'),
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
     * @function getRandomharemNameFromUser
     * @info Will return a random harem name from that users harem list, can be '' if he does not have any.
     *
     * @return {String} harem name.
     */
    function getRandomharemNameFromUser(username) {
        var keys = $.inidb.GetKeyList(username, 'team'),
            temp = [];

        for (var i = 0; i < keys.length; i++) {
            temp.push($.inidb.GetString(username, 'team', keys[i]));
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
        return $.inidb.exists(username, 'favorite');
    }

    /*
     * @function getMarried
     * @info Pulls married waifu id
     *
     * return {Boolean}
     */
    function getMarried(username) {
        return ($.inidb.exists(username, 'favorite') ? $.inidb.get(username, 'favorite') : 0);
    }

    /*
     * @function hasharem
     * @info Used to check if a user has a specific harem.
     *
     * @param {String} username
     * @param {Number|String} id or waifu name; warning the name might not be accurate.
     * @return {Boolean}
     */
    function hasharem(username, id) {
        return (isNaN(parseInt(id)) ? $.inidb.HasKey(username, 'team', getWaifuIdByName(id)) : $.inidb.HasKey(username, 'team', id));
    }

    /*
     * @function getharem
     * @info Gets a harem from a user.
     *
     * @param {Number|String} waifu
     * @return {String} harem name; will return "" if the user does not own that harem
     */
    function getharem(username, waifu) {
        return ($.inidb.HasKey(username, 'team', getWaifuId(waifu)) ? $.inidb.GetString(username, 'team', getWaifuId(waifu)) : '');
    }

    /*
     * @function getTotalUserharems
     * @info Used to get the amount of harems a user has.
     *
     * @param {String} username
     * @return {Number} total amount of waifus the user has; can be 0
     */
    function getTotalUserharems(username) {
        return ($.inidb.GetKeyList(username, 'team').length !== 0 ? $.inidb.GetKeyList(username, 'team').length : 0);
    }

    /*
     * @function getReward
     * @info Retrieve reward data
     *
     * @param {String} reward
     */
    function getReward(reward) {
        return ($.inidb.exists('settings', 'pReward') ? $.inidb.get('settings', 'pReward') : 100);
    }

    /*
     * @function replace
     *
     * @param {String} str
     * @return {String}
     */
    function replace(str) {
        return str.replace(/=/, '(').replace('[Legendary]', '').replace(/=/g, ')');
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
     * @function url
     *
     * @param {String} str
     * @return {String}
     */
    function url(str) {
        return str.match(reGetUrl)[2] + ' ' + str.match(reGetUrl)[3];
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
        $.inidb.incr(username, 'team', getWaifuId(id), 5);
        $.inidb.setAutoCommit(true);
    }

    function rareChance(action) {
      var toggle = $.inidb.get('settings', 'rChance');

        if (toggle == 'true') {
            $.say($.lang.get('waifugames.rare.over'));
            $.inidb.set('settings', 'rChance', 'false');

        } else if (toggle == 'false') {
            $.panelsocketserver.alertImage('rarechance.gif' + ',4');
            $.say($.lang.get('waifugames.rare.chance'));
            $.inidb.set('settings', 'rChance', 'true');

        } else {
          return;
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
            unlock = 1,
            chance = $.randRange(1, 5),
            reward = getReward(),
            waifu = getWaifu(id),
            link = (google + url(waifu)),
            candy = '',
            rare = '';

        if (waifu.includes('[Legendary]') && !hasWaifu(username, id)) {
            rare = ('/me +' + $.getPointsString(reward) + ' ');
            if ($.inidb.get('settings', 'rChance') == 'true') {
                chance = $.randRange(1, 4);
            } else {
                chance = $.randRange(1, 15);
            }

            $.panelsocketserver.alertImage(navigatorImg + ',5');
            $.inidb.incr('points', username, reward);
        }

        if (chance >= 4) {
            $.inidb.incr(username, 'pcandy', 1);
            candy = $.lang.get('waifugames.candy.dropped');
        }

        if (chance <= 4) {
            if (hasWaifu(username, id)) {
                $.inidb.incr(username, 'pokemon', id, unlock);
                $.say($.lang.get('waifugames.catch.own', rare + $.userPrefix(username, true), unlock, replace(waifu), id, $.shortenURL.getShortURL(link) + candy));
            } else {
                $.inidb.SetInteger(username, 'pokemon', id, unlock);
                $.say($.lang.get('waifugames.catch.new', rare + $.userPrefix(username, true), unlock, replace(waifu), id, $.shortenURL.getShortURL(link) + candy));
            }
        } else {
            $.say($.lang.get('waifugames.catch.miss', $.userPrefix(username, true), replace(waifu), id) + candy);
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
                $.say($.lang.get('waifugames.random.married', $.userPrefix(username, true), replace(getWaifu(id)), id, getLevel(username, id), getAttack(username, id), getDefense(username, id), getLove(username, id), $.shortenURL.getShortURL(link)));
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
            $.inidb.incr(receiver.toLowerCase(), 'pokemon', id, 1);
            $.inidb.decr(username, 'pokemon', id, 1);
        } else {
            $.say($.lang.get('waifugames.giftwaifu.404', $.userPrefix(username, true)));
        }
    }

    /*
     * @function waifuProfile
     * @info Used to get your current profile of waifus.
     */
    function waifuProfile(username) {
        $.say($.lang.get('waifugames.profile.success', $.whisperPrefix(username), getTotalUserWaifus(username), totalWaifus, getCandy(username), Math.floor((getTotalUserWaifus(username) / totalWaifus) * 100)));
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

        if (!hasharem(username, id)) {
            $.say($.lang.get('waifugames.harem.kick404'));
            return
        }

        if (waifuExists(id) && hasWaifu(username, id)) {
            $.inidb.set(username, 'favorite', getWaifuId(id));
            $.inidb.incr(username, 'pLove', getWaifuId(id), 50);
            $.inidb.incr(username, 'pLewdness', getWaifuId(id), 20);
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
            $.inidb.del(username, 'favorite');
            $.inidb.decr(username, 'pLove', getMarried(username), 60);
            $.inidb.decr(username, 'pLewdness', getMarried(username), 20);
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

        $.say($.lang.get('waifugames.buywaifu.new', $.userPrefix(username, true), replace(waifu), getWaifuId(id), $.shortenURL.getShortURL(link)));
        $.inidb.incr(username, 'pokemon', getWaifuId(id), 1);
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

        if (hasharem(sender, id)) {
            stats = $.lang.get('waifugames.checkwaifu.stats', getLevel(sender, id), getAttack(sender, id), getDefense(sender, id), getLove(sender, id));
        }

        $.say($.lang.get('waifugames.checkwaifu.success', $.userPrefix(sender, true), getUserWaifuCount(sender, id), replace(waifu), id, stats, $.shortenURL.getShortURL(link)));
    }

    /*
     * @function addharem
     * @info Adds a harem to that users list
     *
     * @param {String} username
     * @param {Number} id
     */
    function addharem(username, id) {
        var atk = 1, def = 1, love = 1, lewd = 1;

        if (!waifuExists(id)) {
            $.say($.lang.get('waifugames.exist.404', $.whisperPrefix(username)));
            return;
        }

        if (hasharem(username, id)) {
            $.say($.lang.get('waifugames.harem.repeat', $.whisperPrefix(username)));
            return;
        }

        if (!hasWaifu(username, id)) {
            $.say($.lang.get('waifugames.harem.owned', $.whisperPrefix(username)));
            return;
        }

        if (getTotalUserharems(username) >= 6) {
            $.say($.lang.get('waifugames.harem.denied'));
            return;
        }

        if (getWaifu(id).includes('[Legendary]')) {
            atk = $.randRange(1, 20), def = $.randRange(1, 20), love = $.randRange(1, 30), lewd = 10;
        }

        $.inidb.SetString(username, 'team', getWaifuId(id), 1);
        $.inidb.SetString(username, 'pAttack', getWaifuId(id), atk);
        $.inidb.SetString(username, 'pDefense', getWaifuId(id), def);
        $.inidb.SetString(username, 'pLove', getWaifuId(id), love);
        $.inidb.SetString(username, 'pLewdness', getWaifuId(id), lewd);
        $.say($.lang.get('waifugames.harem.success', $.userPrefix(username, true), replace(getWaifu(id))));
    }

    /*
     * @function kickharem
     * @info USed to kick a harem
     *
     * @param {String} username
     * @param {Number|String} id
     */
    function kickharem(username, id) {
        if (getEXP(username, getWaifuId(id)) >= 1) {
            $.inidb.RemoveKey(username, 'team', getWaifuId(id));
            $.inidb.RemoveKey(username, 'pAttack', getWaifuId(id));
            $.inidb.RemoveKey(username, 'pDefense', getWaifuId(id));
            $.inidb.RemoveKey(username, 'pLove', getWaifuId(id));
            $.inidb.RemoveKey(username, 'pLewdness', getWaifuId(id));
            $.say($.lang.get('waifugames.harem.kick', replace(getWaifu(id))));
        } else {
            $.say($.lang.get('waifugames.harem.kick404'));
        }
    }

    /*
     * @function getharem
     * @info Used to get a harem
     *
     * @param {String} username
     */
    function getharem(username) {
        var keys = $.inidb.GetKeyList(username, 'team'),
            array = [];

        for (var i = 0; i < keys.length; i++) {
            array.push(replace($.lang.get('waifugames.waifu.' + keys[i])) + " #" + keys[i]);
        }

        if (array.length >= 1) {
            $.say($.lang.get('waifugames.harem.get', $.whisperPrefix(username), array.join(', ')));
        } else {
            $.say($.lang.get('waifugames.harem.404'));
        }
    }

    /*
     * @function getCandy
     * @info USed to get candy amount
     *
     * @param {String} sender
     */
    function useCandy(username, amount, id) {
      if (getCandy(username) < 1) {
          $.say($.lang.get('waifugames.candy.nostock', $.whisperPrefix(username)));
          return;
      }
        if (id === undefined) {
          id = getWaifuId(amount);
          amount = 1;
        } else {
          id = getWaifuId(id);
        }

        if (!waifuExists(id)) {
            $.say($.lang.get('waifugames.exist.404', $.whisperPrefix(username)));
            return;
        }

        if (!hasHarem(username, id)) {
            $.say($.lang.get('waifugames.candy.missing', $.whisperPrefix(username)));
            return;
        }

        $.inidb.incr(username, 'team', id, 100*amount);
        $.inidb.incr(username, 'pAttack', id, 1*amount);
        $.inidb.incr(username, 'pDefense', id, 1*amount);
        $.inidb.incr(username, 'pLove', id, 1*amount);
        $.inidb.incr(username, 'pLewdness', id, 1*amount);
        $.inidb.decr(username, 'pcandy', 1*amount);
        $.say($.lang.get('waifuGames.candy.use', $.whisperPrefix(username), replace(getWaifu(id)), replace2(getWaifu(id)), (25*amount), getEXP(username, id), getLevel(username, id), getCandy(username, id)));
    }

    /*
     * @function battle
     * @param opponent
     * @return Battle with another waifu
     */
    function startBattle(username, opponent, action) {
        var random1 = $.randRange(1, responses.win),
            random2 = $.randRange(1, responses.stalemate),
            random3 = $.randRange(1, responses.lost),
            id,
            id2 = getRandomharemIdFromUser(opponent),
            player1,
            player2 = getWaifu(id2),
            attacked = $.userPrefix(opponent),
            attacker = $.userPrefix(username);

        if (!action == '') {
            id =getWaifuId(action);
            player1 = getWaifu(getWaifuId(action));
        } else {
            id = getRandomharemIdFromUser(username);
            player1 = getWaifu(id);
        }

        if (opponent.equalsIgnoreCase(username)) {
            $.say($.lang.get('waifugames.harem.same'));
            return;
        }

        if (getTotalUserharems(opponent) <= 0) {
            $.say($.lang.get('waifugames.harem.fight4042'));
            return;
        } else if (getTotalUserharems(username) <= 0) {
            $.say($.lang.get('waifugames.harem.fight404'));
            return;
        }

        if ($.randRange((getAttack(username, id) / 20), getAttack(username, id)) > getDefense(opponent, id2)) {
            updateBattleStats(username, ['pLove', 'pDefense'], id, true);
            updateBattleStats(username, ['pLewdness', 'pAttack'], id, false);
            updateBattleStats(opponent, ['pLewdness', 'pLove', 'pDefense'], id2, false);
            $.inidb.incr('points', username, 25);
            $.say($.lang.get('waifugames.win.' + random1, replace2(player1), replace2(player2), attacker, attacked, $.pointNameMultiple));
        } else if ($.randRange((getDefense(username, id) / 20), getDefense(username, id)) > getAttack(opponent, id2)) {
            updateBattleStats(username, ['pAttack'], id, false);
            updateBattleStats(opponent, ['pDefense'], id2, false);
            $.say($.lang.get('waifugames.stalemate.' + random2, replace2(player1), replace2(player2), attacker, attacked, $.pointNameMultiple));
        } else {
            updateBattleStats(opponent, ['pLove', 'pLewdness', 'pDefense'], id2, false);
            updateBattleStats(username, ['pLove', 'pLewdness', 'pDefense'], id, true);
            $.inidb.incr('points', opponent, 25);
            $.say($.lang.get('waifugames.lose.' + random3, replace2(player1), replace2(player2), attacker, attacked, $.pointNameMultiple));
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

        if (command.equalsIgnoreCase('pokedex')) {
            if (action === undefined) {
                randomWaifu(sender);
            } else {
                checkWaifu(sender, args.join(' '));
            }
        }

        if (command.equalsIgnoreCase('battle')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.fight.usage'));
                return;
            }
            startBattle(sender, action.toLowerCase(), args.slice(1).join(' '));
        }

        if (command.equalsIgnoreCase('candy')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.candy.get', $.whisperPrefix(sender), getCandy(sender)));
                return;
            } else {
                useCandy(sender, action, subAction);
            }
        }

        if (command.equalsIgnoreCase('team')) {
            getharem(sender);
        }

        if (command.equalsIgnoreCase('addteam')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.addharem.usage'));
            } else {
                addharem(sender, args.join(' '));
            }
        }

        if (command.equalsIgnoreCase('kickteam')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.kickharem.usage'));
            } else {
                kickharem(sender, args.join(' '));
            }
        }

        if (command.equalsIgnoreCase('resetteam')) {
            $.inidb.RemoveSection(sender, 'team');
            $.say($.whisperPrefix(sender) + $.lang.get('waifugames.harem.reset'));
        }

        if (command.equalsIgnoreCase('catch')) {
            if ($.isOnline($.channelName)) {
                catchWaifu(sender);
            } else {
                $.say($.lang.get('waifugames.online.404', $.whisperPrefix(sender), $.channelName));
                return;
            }
        }

        if (command.equalsIgnoreCase('giftpokemon')) {
            sendWaifu(sender, action, args.slice(1).join(' '));
        }

        if (command.equalsIgnoreCase('buypokemon')) {
            buyWaifu(sender, args.join(' '));
        }

        if (command.equalsIgnoreCase('profile')) {
            waifuProfile(sender);
        }

        if (command.equalsIgnoreCase('setpokemon')) {
            setWaifu(sender, args.join(' '));
        }

        if (command.equalsIgnoreCase('resetpokemon')) {
            resetWaifu(sender);
        }

        if (command.equalsIgnoreCase('rarechance')) {
            rareChance(action);
        }

        if (command.equalsIgnoreCase('pokereward')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.reward.get', $.getPointsString(getReward())));
            } else {
                $.inidb.set('settings', 'pReward', action);
                $.say($.lang.get('waifugames.reward.set', $.getPointsString(action)));
            }
        }

        if (command.equalsIgnoreCase('pokemonhelp')) {
            $.say($.whisperPrefix(sender) + $.lang.exists('waifugames.waifuhelp'));
        }
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./games/waifuGames.js')) {
            $.registerChatCommand('./games/waifuGames.js', 'pokedex');
            $.registerChatCommand('./games/waifuGames.js', 'profile');
            $.registerChatCommand('./games/waifuGames.js', 'battle');
            $.registerChatCommand('./games/waifuGames.js', 'candy');
            $.registerChatCommand('./games/waifuGames.js', 'catch');
            $.registerChatCommand('./games/waifuGames.js', 'giftpokemon');
            $.registerChatCommand('./games/waifuGames.js', 'resetpokemon');
            $.registerChatCommand('./games/waifuGames.js', 'setpokemon');
            $.registerChatCommand('./games/waifuGames.js', 'buypokemon');
            $.registerChatCommand('./games/waifuGames.js', 'team');
            $.registerChatCommand('./games/waifuGames.js', 'addteam');
            $.registerChatCommand('./games/waifuGames.js', 'kickteam');
            $.registerChatCommand('./games/waifuGames.js', 'resetteam');
            $.registerChatCommand('./games/waifuGames.js', 'pokemonhelp');
            $.registerChatCommand('./games/waifuGames.js', 'rarechance', 1);
            $.registerChatCommand('./games/waifuGames.js', 'pokereward', 1);
            load();
        }
    });
})();
