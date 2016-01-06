define(["require", "exports"], function (require, exports) {
    /**
     * This file is part of OWL Pluralization.
     *
     * OWL Pluralization is free software: you can redistribute it and/or
     * modify it under the terms of the GNU Lesser General Public License
     * as published by the Free Software Foundation, either version 3 of
     * the License, or (at your option) any later version.
     *
     * OWL Pluralization is distributed in the hope that it will be useful,
     * but WITHOUT ANY WARRANTY; without even the implied warranty of
     * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     * GNU Lesser General Public License for more details.
     *
     * You should have received a copy of the GNU Lesser General Public
     * License along with OWL Pluralization.  If not, see
     * <http://www.gnu.org/licenses/>.
     *
     * @module Temple
     * @namespace temple.locale.formatter
     * @class Pluralize
     */
    var Pluralize = (function () {
        function Pluralize() {
        }
        /**
         * @public
         * @static
         * @method capitalizeSame
         * @param {string} word
         * @param {string} sampleWord
         * @returns string
         */
        Pluralize.capitalizeSame = function (word, sampleWord) {
            if (sampleWord.match(/^[A-Z]/)) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            else {
                return word;
            }
        };
        //
        //
        /**
         * returns a plain Object having the given keys,
         * all with value 1, which can be used for fast lookups.
         *
         * @public
         * @static
         * @method capitalizeSame
         * @param {string} keys
         * @returns {{}}
         */
        Pluralize.toKeys = function (keys) {
            var keysArray = keys.split(',');
            var keysLength = keysArray.length;
            var table = {};
            for (var i = 0; i < keysLength; i++) {
                table[keysArray[i]] = 1;
            }
            return table;
        };
        /**
         * pluralizes the given singular noun.  There are three ways to call it:
         *   pluralize(noun) -> pluralNoun
         *     Returns the plural of the given noun.
         *   Example:
         *     pluralize("person") -> "people"
         *     pluralize("me") -> "us"
         *
         *   pluralize(noun, count) -> plural or singular noun
         *   Inflect the noun according to the count, returning the singular noun
         *   if the count is 1.
         *   Examples:
         *     pluralize("person", 3) -> "people"
         *     pluralize("person", 1) -> "person"
         *     pluralize("person", 0) -> "people"
         *
         *   pluralize(noun, count, plural) -> plural or singular noun
         *   you can provide an irregular plural yourself as the 3rd argument.
         *   Example:
         *     pluralize("chÃ¢teau", 2 "chÃ¢teaux") -> "chÃ¢teaux"
         *
         * @public
         * @method pluralize
         * @param {string} word
         * @param {number} count
         * @param {any} plural
         * @returns {string}
         */
        Pluralize.pluralize = function (word, count, plural) {
            // handle the empty string reasonably.
            if (word === '')
                return '';
            // singular case.
            if (count === 1)
                return word;
            // life is very easy if an explicit plural was provided.
            if (typeof plural === 'string')
                return plural;
            var lowerWord = word.toLowerCase();
            // user defined rules have the highest priority.
            if (lowerWord in Pluralize.userDefined) {
                return Pluralize.capitalizeSame(Pluralize.userDefined[lowerWord], word);
            }
            // single letters are pluralized with 's, "I got five A's on
            // my report card."
            if (word.match(/^[A-Z]$/))
                return word + "'s";
            // some word don't change form when plural.
            if (word.match(/fish$|ois$|sheep$|deer$|pox$|itis$/i))
                return word;
            if (word.match(/^[A-Z][a-z]*ese$/))
                return word; // Nationalities.
            if (lowerWord in Pluralize.uninflected)
                return word;
            // there's a known set of words with irregular plural forms.
            if (lowerWord in Pluralize.irregular) {
                return Pluralize.capitalizeSame(Pluralize.irregular[lowerWord], word);
            }
            // try to pluralize the word depending on its suffix.
            var suffixRulesLength = Pluralize.suffixRules.length;
            for (var i = 0; i < suffixRulesLength; i++) {
                var rule = Pluralize.suffixRules[i];
                if (word.match(rule[0])) {
                    return word.replace(rule[0], rule[1]);
                }
            }
            // if all else fails, just add s.
            return word + 's';
        };
        /**
         * @public
         * @static
         * @method define
         * @param {string} word
         * @param {any} plural
         * @return void
         */
        Pluralize.define = function (word, plural) {
            Pluralize.userDefined[word.toLowerCase()] = plural;
        };
        Pluralize.userDefined = {};
        // words that are always singular, always plural, or the same in both forms.
        Pluralize.uninflected = Pluralize.toKeys("aircraft,advice,blues,corn,molasses,equipment,gold,information,cotton,jewelry,kin,legislation,luck,luggage,moose,music,offspring,rice,silver,trousers,wheat,bison,bream,breeches,britches,carp,chassis,clippers,cod,contretemps,corps,debris,diabetes,djinn,eland,elk,flounder,gallows,graffiti,headquarters,herpes,high,homework,innings,jackanapes,mackerel,measles,mews,mumps,news,pincers,pliers,proceedings,rabies,salmon,scissors,sea,series,shears,species,swine,trout,tuna,whiting,wildebeest,pike,oats,tongs,dregs,snuffers,victuals,tweezers,vespers,pinchers,bellows,cattle");
        Pluralize.irregular = {
            // pronouns
            I: 'we',
            you: 'you',
            he: 'they',
            it: 'they',
            me: 'us',
            him: 'them',
            them: 'them',
            myself: 'ourselves',
            yourself: 'yourselves',
            himself: 'themselves',
            herself: 'themselves',
            itself: 'themselves',
            themself: 'themselves',
            oneself: 'oneselves',
            child: 'children',
            dwarf: 'dwarfs',
            mongoose: 'mongooses',
            mythos: 'mythoi',
            ox: 'oxen',
            soliloquy: 'soliloquies',
            trilby: 'trilbys',
            person: 'people',
            forum: 'forums',
            // latin plural in popular usage.
            syllabus: 'syllabi',
            alumnus: 'alumni',
            genus: 'genera',
            viscus: 'viscera',
            stigma: 'stigmata'
        };
        Pluralize.suffixRules = [
            // common suffixes
            [/man$/i, 'men'],
            [/([lm])ouse$/i, '$1ice'],
            [/tooth$/i, 'teeth'],
            [/goose$/i, 'geese'],
            [/foot$/i, 'feet'],
            [/zoon$/i, 'zoa'],
            [/([tcsx])is$/i, '$1es'],
            // fully assimilated suffixes
            [/ix$/i, 'ices'],
            [/^(cod|mur|sil|vert)ex$/i, '$1ices'],
            [/^(agend|addend|memorand|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi)um$/i, '$1a'],
            [/^(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)on$/i, '$1a'],
            [/^(alumn|alg|vertebr)a$/i, '$1ae'],
            // churches, classes, boxes, etc.
            [/([cs]h|ss|x)$/i, '$1es'],
            // words with -ves plural form
            [/([aeo]l|[^d]ea|ar)f$/i, '$1ves'],
            [/([nlw]i)fe$/i, '$1ves'],
            // -y
            [/([aeiou])y$/i, '$1ys'],
            [/(^[A-Z][a-z]*)y$/, '$1ys'],
            [/y$/i, 'ies'],
            // -o
            [/([aeiou])o$/i, '$1os'],
            [/^(pian|portic|albin|generalissim|manifest|archipelag|ghett|medic|armadill|guan|octav|command|infern|phot|ditt|jumb|pr|dynam|ling|quart|embry|lumbag|rhin|fiasc|magnet|styl|alt|contralt|sopran|bass|crescend|temp|cant|sol|kimon)o$/i, '$1os'],
            [/o$/i, 'oes'],
            // words ending in s...
            [/s$/i, 'ses']
        ];
        return Pluralize;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Pluralize;
});
