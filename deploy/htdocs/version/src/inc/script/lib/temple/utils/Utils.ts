/**
 * Php version of strtotime
 *
 * @example strtotime("now");
			strtotime("10 September 2000");
			strtotime("+1 day");
			strtotime("+1 week");
			strtotime("+1 week 2 days 4 hours 2 seconds");
			strtotime("next Thursday");
			strtotime("last Monday");
 * @autor Mient-jan Stelling
 * @param {string} text
 * @param {number} now
 * @returns boolean|number
 */
export function strToTime(text:string, now:number ):any
{
	var match, year, date, days, ranges, len, times, regex, i;

	if (!text) {
		return null;
	}

	// Unecessary spaces
	text = text.replace(/^\s+|\s+$/g, '')
		.replace(/\s{2,}/g, ' ')
		.replace(/[\t\r\n]/g, '')
		.toLowerCase();

	if (text === 'now') {
		return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
	}

	match = text.match(/^(\d{2,4})-(\d{2})-(\d{2})(?:\s(\d{1,2}):(\d{2})(?::\d{2})?)?(?:\.(\d+)?)?$/);
	if (match) {
		year = match[1] >= 0 && match[1] <= 69 ? + match[1] + 2000 : match[1];
		return (new Date(year, parseInt(match[2], 10) - 1, match[3],
			match[4] || 0, match[5] || 0, match[6] || 0, match[7] || 0).getTime()) / 1000 | 0;
	}

	date = now ? new Date(now * 1000) : new Date();
	days = {
		'sun': 0,
		'mon': 1,
		'tue': 2,
		'wed': 3,
		'thu': 4,
		'fri': 5,
		'sat': 6
	};
	ranges = {
		'yea': 'FullYear',
		'mon': 'Month',
		'day': 'Date',
		'hou': 'Hours',
		'min': 'Minutes',
		'sec': 'Seconds'
	};

	function lastNext(type, range, modifier) {
		var diff, day = days[range];

		if (typeof day !== 'undefined') {
			diff = day - date.getDay();

			if (diff === 0) {
				diff = 7 * modifier;
			}
			else if (diff > 0 && type === 'last') {
				diff -= 7;
			}
			else if (diff < 0 && type === 'next') {
				diff += 7;
			}

			date.setDate(date.getDate() + diff);
		}
	}

	function process(val) {
		var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
			type = splt[0],
			range = splt[1].substring(0, 3),
			typeIsNumber = /\d+/.test(type),
			ago = splt[2] === 'ago',
			num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

		if (typeIsNumber) {
			num *= parseInt(type, 10);
		}

		if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
			return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
		}
		if (range === 'wee') {
			return date.setDate(date.getDate() + (num * 7));
		}

		if (type === 'next' || type === 'last') {
			lastNext(type, range, num);
		}
		else if (!typeIsNumber) {
			return false;
		}
		return true;
	}

	times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
		'|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
		'|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
	regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

	match = text.match(new RegExp(regex, 'gi'));
	if (!match) {
		return false;
	}

	for (i = 0, len = match.length; i < len; i++) {
		if (!process(match[i])) {
			return false;
		}
	}

	return (date.getTime() / 1000) | 0;
}
