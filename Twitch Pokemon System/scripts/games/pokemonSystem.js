(function() {
    var google = $.lang.get('waifugames.function.google'),
        reGetUrl = new RegExp(/(\[[\w\s]+\]\s)?(.*)\s=(.*)=.*/),
        reGetTitle = new RegExp(/(\[[\w\s]+\]\s)?(.*)\s=(.*)=.*/),
        attributes = {},
        responses = {
            fight: 1,
            miss: 1,
            block: 1,
            fail: 1,
            attribute: 1,
        },
        totalWaifus = 0,
        navigatorImg1 = $.lang.get('waifugames.alert.navigator'),
        navigatorImg2 = $.lang.get('waifugames.alert.navigator2'),
        navigatorImg3 = $.lang.get('waifugames.alert.navigator3'),
        hpScale = (($.users.length * 100) + 2000);

    // load();

    /*
     * @function load
     * @info Loads everything needed for this script to work. Add functions that need loading at startup in here.
     */
    function load() {
        loadWaifus();
        pushWaifus();
        loadResponses();
        loadaAtributes();
    }

    /*
     * @function loadWaifus
     * @info Gets a count of all the waifus and stores it in a variable. It will also generate a txt file with all the waifus.
     */
    function loadWaifus() {
        var string = '',
            i = 0,
            link;

        while ($.lang.exists('waifugames.waifu.' + i)) {
            link = (google + url(getWaifu(i)));
            string += $.lang.get('waifugames.function.characterlist') + i + ' ' + replace3($.lang.get('waifugames.waifu.' + i)) + '\r\n';
            ++i;
        }

        $.writeToFile(string, 'characterlist.txt', false);
        totalWaifus = i;
    }
    /*
     * @function pushWaifus
     * @info Pushes the entire waifu list to the db, it does disable auto commit first to make this process a lot faster.
     */
    function pushWaifus() {
        var i = 0,
            t = 0;

        $.inidb.setAutoCommit(false);
        while ($.lang.exists('waifugames.waifu.' + i)) {
            if (!$.inidb.exists('waifulist', i)) { // This will make setting pokemons faster since it does not need to write prokemons that are already on the disk.
                $.inidb.set('waifulist', i, $.lang.get('waifugames.waifu.' + i));
            }
            ++i;
        }

        while ($.lang.exists('waifugames.attribute.' + t)) {
            if (!$.inidb.exists('attributeList', t)) { // This will make setting pokemons faster since it does not need to write prokemons that are already on the disk.
                $.inidb.set('attributeList', t, $.lang.get('waifugames.attribute.' + t));
            }
            ++t;
          }
        $.inidb.setAutoCommit(true);
    }

    /*
     * @function loadResponses
     * Gets a count of all of the game responses and saves them in an object to be used later.
     */
    function loadResponses() {
        while ($.lang.exists('waifugames.fight.' + responses.fight)) {
            ++responses.fight;
        }

        while ($.lang.exists('waifugames.catchmiss.' + responses.miss)) {
            ++responses.miss;
        }

        while ($.lang.exists('waifugames.fight.block.' + responses.block)) {
            ++responses.block;
        }

        while ($.lang.exists('waifugames.fight.miss.' + responses.fail)) {
            ++responses.fail;
        }

        while ($.lang.exists('waifugames.bosses.' + responses.bosses)) {
            ++responses.bosses;
        }

        while ($.lang.exists('waifugames.attribute.' + responses.attribute)) {
            ++responses.attribute;
        }
    }

    function loadaAtributes() {
        var i = 1,
            t = 1;

        while ($.lang.exists('waifugames.attribute.' + i)) {
            while ($.lang.exists('waifugames.attack.' + i + '.' + t)) {
                attributes[i] = {
                    attacks: t++
                };
            }
            i++;
            t = 1;
        }
    }
    /*
     * @function replace
     *
     * @param {String} str
     * @return {String}
     */
    function replace(str) {
        return str.replace(/=/, '(').replace('[Rare]', '').replace('[S Rare]', '').replace('[SS Rare]', '').replace(/=/g, ')');
    }

    /*
     * @function replace2
     *
     * @param {String} str
     * @return {String}
     */
    function replace2(str) {
      var retval = str.match(reGetTitle).slice(2)[0];
       return retval == undefined ? "" : retval;
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
        if ($.inidb.get(username, 'candy') <= 0) {
            return 0;
        } else {
            return ($.inidb.exists(username, 'candy') ? $.inidb.get(username, 'candy') : 0);
        }
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
            return ($.inidb.HasKey(username, 'wHitPoints', id) ? ($.inidb.GetInteger(username, 'wHitPoints', id) >= 4000 ? hpScale : $.inidb.GetInteger(username, 'wHitPoints', id)) : 0);
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
        if ($.inidb.GetInteger(username, 'wLove', id) <= 0) {
            return 0;
        } else {
            return ($.inidb.HasKey(username, 'wLove', id) ? ($.inidb.GetInteger(username, 'wLove', id) >= 100 ? 100 : $.inidb.GetInteger(username, 'wLove', id)) : 0);
        }
    }
    /*
     * @function getAttribute
     * @param id
     * @return gets the attribute of a waifu in the user's harem
     */
    function getAttribute(username, id) {
        return ($.inidb.HasKey(username, 'wAttribute', id) ? $.inidb.GetInteger(username, 'wAttribute', id) : 1);
    }

    /*
     * @function getBosses
     * @info Used to get the amount of Bosses beaten
     *
     * @param {String} username
     */
    function getBosses(username) {
        return ($.inidb.exists(username, 'wBosses') ? $.inidb.get(username, 'wBosses') : 0);
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
     * @function getRandomOwnedIdFromUser
     * @info Will return a random Waifu id from that users waifu list, can be 0 if he does not have any.
     *
     * @return {Number} harem id.
     */
    function getRandomOwnedIdFromUser(username) {
        var keys = $.inidb.GetKeyList(username, 'waifus'),
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
    function getHarem(sender, waifu) {
        return ($.inidb.HasKey(sender, 'harem', getWaifuId(waifu)) ? $.inidb.GetString(sender, 'harem', getWaifuId(waifu)) : '');
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
     * @function url
     *
     * @param {String} str get
     * @return {String}
     */
    function url(str) {
        return str.replace('\'', '%27').match(reGetUrl)[2];
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

        if (getLevel(username, id) > 99) {
            return;
        }

        $.inidb.setAutoCommit(false);
        for (var i = 0; i < array.length; i++) {
            rnd = $.randRange(0, 2);
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
            $.panelsocketserver.alertImage($.lang.get('waifugames.alert.rarechance') + ',4');
            $.inidb.set('settings', 'rChance', 'true');
        } else {
            $.say($.lang.get('waifugames.rare.over'));
            $.inidb.set('settings', 'rChance', 'false');
        }
    }

    /*
     * function catchWaifu
     * @info Used to Seduce random character, Usage: !seduce.
     *
     * @param {String} username
     */
    function catchWaifu(username) {
        var id = $.randRange(0, totalWaifus),
            missR = $.randRange(1, responses.miss - 1),
            unlock = 1,
            chance = $.randRange(1, 5),
            rarechance = $.randRange(1, 25),
            reward = getReward(),
            waifu = getWaifu(id),
            link = (google + url(waifu)),
            candy = '',
            candy2 = '',
            candyDrop = $.randRange(1, 2),
            rare = '',
            seduced,
            atk = $.randRange(1, 5),
            def = $.randRange(1, 5),
            love = $.randRange(1, 30),
            lewd = $.randRange(1, responses.attribute - 1);

        /* RNG chance to receive one candy from attempting to seduce a character*/
        if (chance >= 4 && candyDrop > 1) {
            $.inidb.incr(username, 'candy', 1);
            candy = $.lang.get('waifugames.candy.dropped');
            candy2 = $.lang.get('waifugames.candy.dropped2');
        }

        /* When !rarechance is enabled this increases the chances of seducing a Rare character*/
        if ($.inidb.get('settings', 'rChance') == 'true') {
            rarechance = $.randRange(22, 25);
        }

        /* Changes the chances of seducing the character when [Rare], [S Rare] or [SS Rare] is included in the name*/
        if (waifu.includes('[Rare]')) {
            if (rarechance >= 16) {
                rare = $.lang.get('waifugames.catch.nrare', $.getPointsString(reward));
            } else {
                $.say($.lang.get('waifugames.catchmiss.' + missR, $.userPrefix(username, true), replace(waifu), id, candy2), replace2(waifu));
                return;
            }
        }

        if (waifu.includes('[S Rare]')) {
            if (rarechance >= 18) {
                rare = $.lang.get('waifugames.catch.srare', $.getPointsString(reward * 2));
            } else {
                $.say($.lang.get('waifugames.catchmiss.' + missR, $.userPrefix(username, true), replace(waifu), id, candy2), replace2(waifu));
                return;
            }
        }

        if (waifu.includes('[SS Rare]')) {
            if (rarechance >= 20) {
                rare = $.lang.get('waifugames.catch.ssrare', $.getPointsString(reward * 4));
            } else {
                $.say($.lang.get('waifugames.catchmiss.' + missR, $.userPrefix(username, true), replace(waifu), id, candy2), replace2(waifu));
                return;
            }
        }

        /* RNG chance to seduce a character, this also detects if you already have one of the same character or not*/
        if (chance <= 4) {
            seduced = true;
            if (hasWaifu(username, id)) {
                $.inidb.incr(username, 'waifus', id, unlock);
                $.say($.lang.get('waifugames.catch.own', rare + $.userPrefix(username, true), unlock, replace(waifu), id, $.shortenURL.getShortURL(link) + candy));
            } else {
                $.inidb.SetInteger(username, 'waifus', id, unlock);
                $.say($.lang.get('waifugames.catch.new', rare + $.userPrefix(username, true), unlock, replace(waifu), id, $.shortenURL.getShortURL(link) + candy));
                $.inidb.SetString(username, 'wHitPoints', getWaifuId(id), 50);
            }

            if ($.inidb.GetInteger(username, 'buffed', getWaifuId(id)) < 1) {
                $.inidb.SetInteger(username, 'buffed', getWaifuId(id), 1);

                if (getWaifu(id).includes('[Rare]')) {
                    atk = $.randRange(1, 20), def = $.randRange(1, 20);
                }

                if (getWaifu(id).includes('[S Rare]')) {
                    atk = $.randRange(20, 50), def = $.randRange(20, 50);
                }

                if (getWaifu(id).includes('[SS Rare]')) {
                    atk = $.randRange(50, 100), def = $.randRange(50, 100);
                }

                $.inidb.incr(username, 'wAttack', getWaifuId(id), atk);
                $.inidb.incr(username, 'wDefense', getWaifuId(id), def);
                $.inidb.incr(username, 'wLove', getWaifuId(id), love);
                $.inidb.incr(username, 'wAttribute', getWaifuId(id), lewd);
            }

        } else {
            $.say($.lang.get('waifugames.catchmiss.' + missR, $.userPrefix(username, true), replace(waifu), id, candy2, replace2(waifu)));
            seduced = false;
            return;
        }

        /* Detects the [Rare] messages in a characters name and then looks to see if you seduced them to trigger the image notification*/
        if (waifu.includes('[Rare]') && seduced == true) {
            $.panelsocketserver.alertImage(navigatorImg1 + ',5');
            $.inidb.incr('points', username, (reward));
            seduced = false;
        }

        if (waifu.includes('[S Rare]') && seduced == true) {
            $.panelsocketserver.alertImage(navigatorImg2 + ',5');
            $.inidb.incr('points', username, (reward * 2));
            seduced = false;
        }

        if (waifu.includes('[SS Rare]') && seduced == true) {
            $.panelsocketserver.alertImage(navigatorImg3 + ',5');
            $.inidb.incr('points', username, (reward * 4));
            seduced = false;
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
                $.inidb.SetString(receiver.toLowerCase(), 'wLove', getWaifuId(id), 0);
                $.inidb.SetString(receiver.toLowerCase(), 'harem', getWaifuId(id), 0);
                $.inidb.SetString(receiver.toLowerCase(), 'buffed', getWaifuId(id), 0);
                $.inidb.SetInteger(receiver.toLowerCase(), 'wAttribute', getWaifuId(id), getAttribute(username, getWaifuId(id)));
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
        if (getCandy(username) >= parseInt(amount)) {
            $.say($.lang.get('waifugames.giftcandy.success', $.userPrefix(username, true), $.userPrefix(receiver, false), amount));
            $.inidb.incr(receiver.toLowerCase(), 'candy', amount);
            $.inidb.decr(username, 'candy', amount);
        } else if (parseInt(amount) > getCandy(username)) {
            $.say($.lang.get('waifugames.candy.nostock', $.userPrefix(username, true)));
            return;
        }
    }

    /*
     * @function waifuProfile
     * @info Used to get your current profile of waifus.
     */
    function waifuProfile(username) {
        $.say($.lang.get('waifugames.profile.success', $.whisperPrefix(username), Math.floor((getTotalUserWaifus(username) / totalWaifus) * 100), getTotalUserWaifus(username), totalWaifus, getCandy(username), getWins(username), getLosses(username), getBosses(username)));
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
        } else {
            $.say($.lang.get('waifugames.split.404', $.whisperPrefix(username)));
        }
    }

    /*
     * @function buyWaifu
     * @info Used to buy waifus (You will need to use !pricecom to set the price.)
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
        $.inidb.set(username, 'wAttribute', $.randRange(1, (responses.attribute - 1)));
        $.say($.lang.get('waifugames.buywaifu.new', $.userPrefix(username, true), replace(waifu), getWaifuId(id), $.shortenURL.getShortURL(link)));
    }

    /*
     * @function genWaifu
     * @info This command is used to generate a waifu with custom stats.
     *
     * @param {String} username
     * @param {Number} id
     * @param {Number} exp
     * @param {Number} atk
     * @param {Number} def
     */
    function genWaifu(sender, id, exp, atk, def, lewd) {
        if (!waifuExists(id)) {
            $.say($.lang.get('waifugames.exist.404', $.whisperPrefix(sender)));
            return;
        }

        var waifu = getWaifu(id),
            link = (google + url(waifu));

        $.inidb.incr(sender, 'waifus', getWaifuId(id), 1);
        $.inidb.SetInteger(sender, 'wHitPoints', getWaifuId(id), 100);
        $.inidb.SetInteger(sender, 'wEXP', getWaifuId(id), exp);
        $.inidb.SetInteger(sender, 'wAttack', getWaifuId(id), atk);
        $.inidb.SetInteger(sender, 'wDefense', getWaifuId(id), def);
        $.inidb.SetInteger(sender, 'wAttribute', getWaifuId(id), lewd);
        $.say($.lang.get('waifugames.genwaifu.new', $.whisperPrefix(sender), replace(waifu), getWaifuId(id), getLevel(sender, id), getAttack(sender, id), getDefense(sender, id), $.shortenURL.getShortURL(link)));
    }

    /*
     * @function buyCandy
     * @info Used to buy candy
     *
     * @param {Number} amount
     */
    function buyCandy(sender, amount) {
        var price = $.inidb.get('pricecom', 'buycandy');

        if (amount >= 1 && $.inidb.get('points', sender) >= price * amount) {
            $.inidb.incr(sender, 'candy', amount);
            $.inidb.decr('points', sender, ((price * amount) - price));
            $.say($.lang.get('waifugames.candy.buy', $.whisperPrefix(sender), amount, $.getPointsString(price * amount), getCandy(sender)));
        } else {
            amount = ($.inidb.get('points', sender) / price);
            $.inidb.incr(sender, 'candy', amount);
            $.inidb.decr('points', sender, ((price * amount) - price));
            $.say($.lang.get('waifugames.candy.buy', $.whisperPrefix(sender), Math.floor(amount), $.getPointsString(price * Math.floor(amount)), getCandy(sender)));
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

        if (hasWaifu(sender, id)) {
            stats = $.lang.get('waifugames.checkwaifu.stats', getHitPoints(sender, id), getLevel(sender, id), getAttack(sender, id), getDefense(sender, id), getLove(sender, id), $.lang.get('waifugames.attribute.' + getAttribute(sender, id)));
        }

        $.say($.lang.get('waifugames.checkwaifu.success', $.userPrefix(sender, true), getUserWaifuCount(sender, id), replace3(getWaifu(id)), id, stats, $.shortenURL.getShortURL(link)));
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
     * @function releaseWaifu
     * @info USed to release a waifu
     *
     * @param {String} username
     * @param {Number|String} id
     */
    function releaseWaifu(username, id) {
        if ($.inidb.GetInteger(username, 'harem', getWaifuId(id)) > 0) {
            if ($.inidb.get(username, 'married') == getWaifuId(id)) {
                $.inidb.del(username, 'married');
            }

            if ($.inidb.GetInteger(username, 'harem', getWaifuId(id)) == 1) {
                $.inidb.RemoveKey(username, 'harem', getWaifuId(id));
            }
        }

        if ($.inidb.GetInteger(username, 'waifus', getWaifuId(id)) >= 1) {
            $.inidb.decr(username, 'waifus', getWaifuId(id), 1);
            $.inidb.RemoveKey(username, 'wEXP', getWaifuId(id));
            $.inidb.RemoveKey(username, 'wHitPoints', getWaifuId(id));
            $.inidb.RemoveKey(username, 'wAttack', getWaifuId(id));
            $.inidb.RemoveKey(username, 'wDefense', getWaifuId(id));
            $.inidb.RemoveKey(username, 'wLove', getWaifuId(id));
            $.inidb.RemoveKey(username, 'wAttribute', getWaifuId(id));
            $.inidb.RemoveKey(username, 'buffed', getWaifuId(id));
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

        $.inidb.SetInteger(username, 'harem', getWaifuId(id), 1);
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
     * @info Used to display your harem with HP
     *
     * @param {String} username
     */
    function getHarem(sender) {
        var keys = $.inidb.GetKeyList(sender, 'harem'),
            isMarried = false,
            array = [];

        for (var i = 0; i < keys.length; i++) {
            isMarried = false;
            if (getMarried(sender, keys[i]) == keys[i]) {
                isMarried = true;
            }
            array.push(replace2($.lang.get('waifugames.waifu.' + keys[i])) + (isMarried ? '(M)' : '') + ' [HP:' + getHitPoints(sender, keys[i]) + ']');
        }

        if (array.length > 0) {
            $.say($.lang.get('waifugames.harem.get', $.userPrefix(sender), array.join(', ')));
        } else {
            $.say($.lang.get('waifugames.harem.404', $.userPrefix(sender)));
        }
    }

    function attributeList(sender) {
      var keys = $.inidb.GetKeyList('attributeList', ''),
          array = [];

      for (var i = 1; i < keys.length; i++) {

          array.push(keys[i] + ':' + $.lang.get('waifugames.attribute.' + keys[i]));
      }

          $.say($.lang.get('waifugames.attribute.get', $.userPrefix(sender), (responses.attribute - 1), array.join(', ')));

    }

    function attribute(sender, action, waifuId) {
        if (!hasWaifu(sender, getWaifuId(waifuId))) {
            $.say($.lang.get('waifugames.harem.nostock'));
            return;
        }
        if (action > (responses.attribute - 1) || action < 1) {
            $.say($.lang.get('waifugames.attribute.404', $.userPrefix(sender), (responses.attribute - 1)));
            return;
        }
        $.inidb.SetInteger(sender, 'wAttribute', getWaifuId(waifuId), action);
        $.say($.lang.get('waifugames.attribute.success', $.userPrefix(sender), replace(getWaifu(waifuId)), $.lang.get('waifugames.attribute.' + action)));

    }

    /*
     * @function useCandy
     * @info Used to get candy amount
     *
     * @param {String} sender
     */
    function useCandy(username, amount, waifu) {
        var id = getWaifuId(waifu),
            candyEXP = $.randRange(100, 150) * amount;

        if (waifu == 'all' || amount == 'all') {
            var keys = $.inidb.GetKeyList(username, 'harem'),
                array = [];

            for (var i = 0; i < keys.length; i++) {

                if (i > parseInt(getCandy(username))) {
                    $.say($.lang.get('waifugames.candy.enough', $.whisperPrefix(username), getCandy(username)));
                    return;
                }

                $.inidb.SetInteger(username, 'wHitPoints', keys[i], 100);
                $.inidb.incr(username, 'wEXP', keys[i], candyEXP);
                $.inidb.incr(username, 'wAttack', keys[i], $.randRange(1, 2));
                $.inidb.incr(username, 'wDefense', keys[i], $.randRange(1, 2));
                $.inidb.incr(username, 'wLove', keys[i], $.randRange(0, 1));
                $.inidb.decr(username, 'candy', i);
                array.push(replace2($.lang.get('waifugames.waifu.' + keys[i])));
            }

            $.say($.lang.get('waifuGames.candy.useall', $.whisperPrefix(username), array.join(', ')));
            return;
        }

        if (parseInt(getCandy(username)) < amount) {
            $.say($.lang.get('waifugames.candy.enough', $.whisperPrefix(username), getCandy(username)));
            return;
        }

        if (parseInt(getCandy(username)) <= 0) {
            $.say($.lang.get('waifugames.candy.nostock', $.whisperPrefix(username), getCandy(username)));
            return;
        }

        if (!waifuExists(id)) {
            $.say($.lang.get('waifugames.exist.404', $.whisperPrefix(username)));
            return;
        }

        if (!hasWaifu(username, id)) {
            $.say($.lang.get('waifugames.candy.missing', $.whisperPrefix(username), replace(getWaifu(id))));
            return;
        }

        if (getLevel(username, id) >= 100) {
            $.inidb.SetInteger(username, 'wHitPoints', id, 100);
            $.inidb.decr(username, 'candy', amount);
            $.say($.lang.get('waifugames.level.max', $.whisperPrefix(username), replace(getWaifu(id))));
            return;
        }

        if ((150 * amount + getEXP(username, id)) > 120000) {
            $.say($.lang.get('waifugames.level.exceed', $.whisperPrefix(username), amount, replace(getWaifu(id))));
            return;
        }


        $.inidb.SetInteger(username, 'wHitPoints', getWaifuId(id), 100);
        $.inidb.incr(username, 'wEXP', id, candyEXP);
        $.inidb.incr(username, 'wAttack', id, $.randRange(1, (1 + amount)));
        $.inidb.incr(username, 'wDefense', id, $.randRange(1, (1 + amount)));
        $.inidb.incr(username, 'wLove', id, $.randRange(0, 1));
        $.inidb.decr(username, 'candy', amount);
        $.say($.lang.get('waifuGames.candy.use', $.whisperPrefix(username), replace(getWaifu(id)), candyEXP, getEXP(username, id), getHitPoints(username, id), getLevel(username, id), getAttack(username, id), getDefense(username, id), getCandy(username), $.lang.get('waifugames.attribute.' + getAttribute(username, id))));
    }

    function generateBoss(sender) {
        var bosses = $.randRange(1, 5),
            bossHP = $.inidb.GetInteger('boss', 'wHitPoints', $.inidb.get('boss', 'id'));

        if (bossHP <= 0) {
            $.inidb.set('boss', 'id', bosses);
            $.inidb.SetInteger('boss', 'harem', bosses, 1);
            $.inidb.SetInteger('boss', 'wHitPoints', bosses, hpScale);
            $.inidb.SetInteger('boss', 'wAttack', bosses, $.randRange(600, 6000));
            $.inidb.SetInteger('boss', 'wDefense', bosses, $.randRange(800, 8000));
            $.inidb.SetInteger('boss', 'wLove', bosses, 100);
            $.inidb.SetInteger('boss', 'wEXP', bosses, 120000);
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
        var randAttack,
            randFight = $.randRange(1, responses.fight - 1),
            randBlock = $.randRange(1, responses.block - 1),
            randMiss = $.randRange(1, responses.fail - 1),
            bosses = $.randRange(1, responses.bosses - 1),
            opponent = 'boss',
            id,
            id2 = getRandomHaremIdFromUser(opponent),
            dmg,
            dmgRec,
            critical,
            dmgMsg = '',
            winMsg = '',
            i = 0;

        if (action !== '') {
            id = getWaifuId(action);
        } else if (isMarried(username)) {
            id = getMarried(username);
        } else {
            id = getRandomHaremIdFromUser(username);
        }

        if (!hasHarem(username, id)) {
            $.say($.lang.get('waifugames.harem.not', $.whisperPrefix(username)));
            return;
        }

        if (getTotalUserHarems(username) <= 0) {
            $.say($.lang.get('waifugames.harem.404'));
            return
        }

        while (getHitPoints(username, id) < 1 && getTotalUserHarems(username) > i++) {
            id = getRandomHaremIdFromUser(username);
        }

        if ($.inidb.exists('boss', 'sender')) {
            bossName = $.userPrefix($.inidb.get('boss', 'sender'));
        } else {
            bossName = getBoss(id2);
        }

        critical = $.randRange(0, 15);
        dmg = Math.floor(Math.abs((20 * (getAttack(username, id) / getDefense(opponent, id2)) * (getLevel(username, id) / getLevel(opponent, id2)) * critical)));
        dmgRec = Math.floor(Math.abs((4 * (getAttack(opponent, id2) / getDefense(username, id)) * (getLevel(username, id) / getLevel(opponent, id2)) * critical)));

        if (dmg > 9999) {
            dmg = 9999;
        }

        if (dmgRec > 9999) {
            dmgRec = 9999;
        }

        if (getHitPoints(username, id) < 1) {
            $.say($.lang.get('waifugames.player.nohp', $.userPrefix(username), replace2(getWaifu(id))));
            return;
        } else if (getHitPoints(opponent, id2) < 1) {
            generateBoss();
        } else {

            if (!getEXP(username) >= 120000) {
                updateBattleStats(username, ['wAttack', 'wDefense'], id, false);
            }

            $.inidb.incr(username, 'wEXP', id, $.randRange(100, 150));

            $.inidb.decr(opponent, 'wHitPoints', id2, dmg);
            $.inidb.decr(username, 'wHitPoints', id, dmgRec);

            var attack = $.lang.get('waifugames.attack.' + $.inidb.GetInteger(username, 'wAttribute', id) + '.' + $.randRange(1, attributes[getAttribute(username, id)].attacks), bossName, getHitPoints(opponent, id2));

            if ($.inidb.GetInteger(username, 'wHitPoints', id) <= 0) {
                winMsg = $.lang.get('waifugames.boss.loss', $.userPrefix(opponent), bossName, $.userPrefix(username), replace2(getWaifu(id)));
                $.inidb.incr(username, 'wLosses', 1);
            }

            if ($.inidb.GetInteger(opponent, 'wHitPoints', id2) <= 0) {
                winMsg = $.lang.get('waifugames.boss.win', $.userPrefix(username), replace2(getWaifu(id)), '[Boss] ' + bossName, $.getPointsString(getBReward()));

                $.inidb.incr('points', username, (getBReward()));

                $.inidb.incr(username, 'wWins', 1);
                $.inidb.incr(opponent, 'wLosses', 1);
                $.inidb.incr(username, 'wBosses', 1);
                $.inidb.RemoveSection('boss', 'harem');
                $.inidb.del('boss', 'id');
                $.inidb.set('boss', 'sender', username);
                $.panelsocketserver.alertImage($.lang.get('waifugames.alert.boss') + ', 12');
            }

            var dmgRecMsg;

            if (dmg < 1) {
                dmgMsg = $.lang.get('waifugames.fight.miss.' + randMiss);
            } else {
                dmgMsg = $.lang.get('waifugames.fight.dmg', dmg);
            }

            if (dmgRec < 1) {
                dmgRecMsg = $.lang.get('waifugames.fight.block.' + randBlock, bossName);
            } else {
                dmgRecMsg = $.lang.get('waifugames.fight.dmgrec', dmgRec);
            }

            $.say($.lang.get('waifugames.fight.boss') + ' ' + $.lang.get('waifugames.fight.' + randFight, replace2(getWaifu(id)), getHitPoints(username, id), attack, bossName, getHitPoints(opponent, id2), dmgMsg, dmgRecMsg, winMsg));

        }

    }


    /*
     * @function battle
     * @param opponent
     * @return Battle with another waifu
     */
    function startBattle(username, opponent, action) {
        var randAttack,
            randFight = $.randRange(1, responses.fight - 1),
            randBlock = $.randRange(1, responses.block - 1),
            randMiss = $.randRange(1, responses.fail - 1),
            id,
            id2 = getRandomHaremIdFromUser(opponent),
            waifu1,
            waifu2,
            dmg,
            dmgRec,
            critical,
            dmgMsg = '',
            winMsg = '',
            i = 0;


        if (action != '') {
            id = getWaifuId(action);
        } else if (isMarried(username)) {
            id = getMarried(username);
        } else {
            id = getRandomHaremIdFromUser(username);
        }

        if (!hasHarem(username, id)) {
            $.say($.lang.get('waifugames.harem.not', $.whisperPrefix(username)));
            return;
        }

        while (getHitPoints(username, id) < 1 && getTotalUserHarems(username) > i++) {
            id = getRandomHaremIdFromUser(username);
        }

        while (getHitPoints(opponent, id2) < 1 && getTotalUserHarems(opponent) > i++) {
            id2 = getRandomHaremIdFromUser(opponent);
        }

        if (getTotalUserHarems(username) <= 0) {
            $.say($.lang.get('waifugames.harem.404', $.userPrefix(username)));
            return;
        }

        if (getTotalUserHarems(opponent) <= 0) {
            $.say($.lang.get('waifugames.harem.404op', $.userPrefix(opponent)));
            return;
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
            $.say($.lang.get('waifugames.harem.fight4042', $.userPrefix(opponent), replace(getWaifu(id))));
            return;
        } else {
            if (getTotalUserHarems(username) <= 0) {
                $.say($.lang.get('waifugames.harem.fight404'));
                return;
            }
        }


        critical = $.randRange(0, 10);
        dmg = Math.floor(Math.abs((0.6 * (getAttack(username, id) / getDefense(opponent, id2)) * (getLevel(username, id) / getLevel(opponent, id2)) * critical)));
        dmgRec = Math.floor(Math.abs((0.6 * (getAttack(opponent, id2) / getDefense(username, id)) * (getLevel(username, id) / getLevel(opponent, id2)) * critical)));

        if (dmg > 9999) {
            dmg = 9999;
        }

        if (dmgRec > 9999) {
            dmgRec = 9999;
        }


        if (getHitPoints(username, id) < 1) {
            $.say($.lang.get('waifugames.player.nohp', $.userPrefix(username), replace2(waifu1)));
            return;
        } else if (getHitPoints(opponent, id2) < 1) {
            $.say($.lang.get('waifugames.player.nohp', $.userPrefix(opponent), replace2(waifu2)));
            return;
        } else {

            if (!getEXP(username) >= 120000) {
                updateBattleStats(username, ['wAttack', 'wDefense'], id, false);
            }
            if (!getEXP(opponent) >= 120000) {
                updateBattleStats(opponent, ['wAttack', 'wDefense'], id2, false);
            }

            $.inidb.incr(username, 'wEXP', id, $.randRange(50, 100));
            $.inidb.incr(opponent, 'wEXP', id2, $.randRange(50, 100));

            $.inidb.decr(opponent, 'wHitPoints', id2, dmg);
            $.inidb.decr(username, 'wHitPoints', id, dmgRec);

            var attack = $.lang.get('waifugames.attack.' + $.inidb.GetInteger(username, 'wAttribute', id) + '.' + $.randRange(1, attributes[getAttribute(username, id)].attacks), replace2(getWaifu(id2)), getHitPoints(opponent, id2));

            if ($.inidb.GetInteger(username, 'wHitPoints', id) <= 0 && $.inidb.GetInteger(opponent, 'wHitPoints', id2) <= 0) {
                winMsg = $.lang.get('waifugames.win.draw', $.userPrefix(username), replace(waifu1), $.userPrefix(opponent), replace(waifu2));
                $.inidb.incr(opponent, 'wcandy', 1);
                $.inidb.incr(username, 'wcandy', 1);
                return;
            } else {

                if ($.inidb.GetInteger(username, 'wHitPoints', id) <= 0) {
                    winMsg = $.lang.get('waifugames.win.fight', $.userPrefix(opponent), replace2(waifu2), $.userPrefix(username), replace2(waifu1), $.getPointsString(getFReward()));
                    $.inidb.incr('points', opponent, getFReward());
                    $.inidb.incr(opponent, 'wWins', 1);
                    $.inidb.incr(opponent, 'candy', 1);
                    $.inidb.incr(username, 'wLosses', 1);
                }

                if ($.inidb.GetInteger(opponent, 'wHitPoints', id2) <= 0) {
                    winMsg = $.lang.get('waifugames.win.fight', $.userPrefix(username), replace2(waifu1), $.userPrefix(opponent), replace2(waifu2), $.getPointsString(getFReward()));
                    $.inidb.incr('points', username, getFReward());
                    $.inidb.incr(username, 'wWins', 1);
                    $.inidb.incr(username, 'candy', 1);
                    $.inidb.incr(opponent, 'wLosses', 1);
                }
            }

            var dmgRecMsg;

            if (dmg < 1) {
                dmgMsg = $.lang.get('waifugames.fight.miss.' + randMiss);
            } else {
                dmgMsg = $.lang.get('waifugames.fight.dmg', dmg);
            }

            if (dmgRec < 1) {
                dmgRecMsg = $.lang.get('waifugames.fight.block.' + randBlock, replace2(getWaifu(id2)));
            } else {
                dmgRecMsg = $.lang.get('waifugames.fight.dmgrec', dmgRec);
            }

            $.say($.lang.get('waifugames.fight.' + randFight, replace2(waifu1), getHitPoints(username, id), attack, replace2(waifu2), getHitPoints(opponent, id2), dmgMsg, dmgRecMsg, winMsg));

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
            subAction = args[1],
            user = String(action).replace(/[^a-zA-Z0-9_]/, '').toLowerCase(),
            waifuId = String(args.join(' ')).replace('#', ''),
            waifuId2 = String(args.slice(1).join(' ')).replace('#', '');

        if (command.equalsIgnoreCase('pokedex')) {
            if (action === undefined) {
                randomWaifu(sender);
            } else {
                checkWaifu(sender, waifuId);
            }
        }

        if (command.equalsIgnoreCase('catch')) {
            if ($.isOnline($.channelName)) {
                catchWaifu(sender);
            } else {
                $.say($.lang.get('waifugames.online.404', $.whisperPrefix(sender), $.channelName));
                return;
            }
        }

        if (command.equalsIgnoreCase('battle')) {
            if ($.isOnline($.channelName)) {
                if (!args.length >= 2) {
                    $.say($.lang.get('waifugames.fight.usage'));
                    return;
                } else {
                    startBattle(sender, user, waifuId2);
                }
            } else {
                $.say($.lang.get('waifugames.online.404', $.whisperPrefix(sender), $.channelName));
                return;
            }
        }

        if (command.equalsIgnoreCase('boss')) {
            if ($.isOnline($.channelName)) {
                generateBoss();
                bossBattle(sender.toLowerCase(), waifuId);
            } else {
                $.say($.lang.get('waifugames.online.404', $.whisperPrefix(sender), $.channelName));
                return;
            }
        }

        if (command.equalsIgnoreCase('forcecatch')) {
            catchWaifu(sender);
        }

        if (command.equalsIgnoreCase('forceboss')) {
            generateBoss();
            bossBattle(sender, waifuId);
        }

        if (command.equalsIgnoreCase('forcefight')) {
            if (!args.length >= 2) {
                $.say($.lang.get('waifugames.fight.usage'));
                return;
            } else {
                startBattle(sender, user, waifuId2);
            }
        }

        if (command.equalsIgnoreCase('candy')) {
            if (args.length == 0) {
                waifuProfile(sender);
            } else if (args.length == 1) {
                useCandy(sender, 1, waifuId);
            } else {
                if (args.length > 1) {
                    useCandy(sender, action, waifuId2);
                }
            }
        }

        if (command.equalsIgnoreCase('buycandy')) {
            buyCandy(sender, action);
        }

        if (command.equalsIgnoreCase('attribute')) {
            if (args.length == 0) {
                $.say($.lang.get('waifugames.attribute.usage', sender));
                return;
            } else {
                attribute(sender, action, waifuId2);
            }
        }

        if (command.equalsIgnoreCase('team')) {
            getHarem(sender);
        }

        if (command.equalsIgnoreCase('addteam')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.addharem.usage'));
            } else {
                addHarem(sender, waifuId);
            }
        }

        if (command.equalsIgnoreCase('kickteam')) {
            if (action === undefined) {
                $.say($.lang.get('waifugames.kickharem.usage'));
            } else {
                kickHarem(sender, waifuId);
            }
        }

        if (command.equalsIgnoreCase('resetteam')) {
            $.inidb.del(username, 'married');
            $.inidb.RemoveSection(sender, 'harem');
            $.say($.whisperPrefix(sender) + $.lang.get('waifugames.harem.reset'));
        }

        if (command.equalsIgnoreCase('giftpokemon')) {
            sendWaifu(sender, user, waifuId2);
        }

        if (command.equalsIgnoreCase('giftcandy')) {
            sendCandy(sender, user, subAction);
        }

        if (command.equalsIgnoreCase('buypokemon')) {
            buyWaifu(sender, waifuId);
        }

        if (command.equalsIgnoreCase('genpokemon')) {
            genWaifu(user, args[1], args[2], args[3], args[4], args[5]);
        }

        if (command.equalsIgnoreCase('profile')) {
            if (args.length >= 1) {
                waifuProfile(player);
            } else {
                waifuProfile(sender);
            }
        }

        if (command.equalsIgnoreCase('setpokemon')) {
            setWaifu(sender, waifuId);
        }

        if (command.equalsIgnoreCase('resetpokemon')) {
            resetWaifu(sender);
        }

        if (command.equalsIgnoreCase('rarechance')) {
            rareChance(action);
        }
        if (command.equalsIgnoreCase('resetratio')) {
            $.inidb.set(sender, 'wWins', 0);
            $.inidb.set(sender, 'wLosses', 0);
            $.inidb.set(sender, 'wBosses', 0);
            $.say($.lang.get('waifugames.reset.stats', $.whisperPrefix(sender)));
        }
        if (command.equalsIgnoreCase('release')) {
            releaseWaifu(sender, waifuId);
        }
        if (command.equalsIgnoreCase('pokereward')) {
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

        if (command.equalsIgnoreCase('resetboss')) {
          $.inidb.RemoveSection('boss', 'harem');
          $.inidb.del('boss', 'id');
          $.inidb.del('boss', 'sender');
          $.say($.lang.get('waifugames.bossreset'));
        }

        if (command.equalsIgnoreCase('pokehelp')) {
            $.say($.whisperPrefix(sender) + $.lang.exists('waifugames.waifuhelp'));
        }
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./games/pokemonSystem.js')) {
            $.registerChatCommand('./games/pokemonSystem.js', 'pokedex', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'profile', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'catch', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'battle', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'boss', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'attribute', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'forcecatch', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'forcefight', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'forceboss', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'candy', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'buycandy', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'giftpokemon', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'giftcandy', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'resetpokemon', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'release', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'setpokemon', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'buypokemon', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'team', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'addteam', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'kickteam', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'resetteam', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'pokehelp', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'rarechance', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'resetratio', 7);
            $.registerChatCommand('./games/pokemonSystem.js', 'pokereward', 1);
            $.registerChatCommand('./games/pokemonSystem.js', 'fightreward', 1);
            $.registerChatCommand('./games/pokemonSystem.js', 'bossreward', 1);
            $.registerChatCommand('./games/pokemonSystem.js', 'resetboss', 1);
            $.registerChatCommand('./games/pokemonSystem.js', 'genpokemon', 1);
            load();
        }
    });
})();
