/**
 * MIT License
 * Copyright © 2019-Present Zachary Halpern (@ZeldaZach)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

 /**
  * scryfallCard.js
  *
  * Implements '!card card name' which will find the appropriate Magic: the Gathering card.
  * and display the contents in Twitch chat.
  */

(function() {
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            card_name = args.join(" ");

        const scryfall_api = "https://api.scryfall.com/cards/named?fuzzy=";

        if (command.equalsIgnoreCase("card")) {
            const url = scryfall_api.concat(encodeURIComponent(card_name));        
            const data = JSON.parse($.customAPI.get(url).content);

            // Error returned by Scryfall
            if (data.status === 404) {
                $.say($.whisperPrefix(sender) + data.details);
                return;
            }

            // Planeswalkers and Creatures have Loyalty or P/T
            // Instants, Artifacts, etc don't.
            var extra_component;
            if (data.loyalty) {
                extra_component = " (Loyalty: " + data.loyalty + ")";
            } else if (data.power) {
                extra_component = " " + data.power + "/" + data.toughness;
            } else {
                extra_component = ""
            }

            var response = data.name + ", "
                + data.mana_cost + " | "
                + data.type_line + extra_component + " | "
                + data.oracle_text;

            $.say(response);
            return;
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./custom/scryfallCard.js')) {
            $.registerChatCommand('./custom/scryfallCard.js', 'card', 7);
        }
    });
})();