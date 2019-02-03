import { Guild } from 'discord.js';
import { RateLimitManager } from 'klasa';
import { Adder } from '../Adder';
import { PreciseTimeout } from '../PreciseTimeout';
import { AntiRaid } from './AntiRaid';

/**
 * @version 3.0.0
 */
export class GuildSecurity {

	/**
	 * The SkyraGuild instance which manages this instance
	 */
	public guild: Guild;

	/**
	 * The Adder instance used to control spam
	 */
	public adder: Adder<string> | null = null;

	/**
	 * The AntiRaid instance managed by this guild, if exists
	 */
	public raid = new AntiRaid(this.guild);

	/**
	 * The ratelimit management for the no-mention-spam behavior
	 */
	public nms = new RateLimitManager(
		this.guild.settings.get('no-mention-spam.mentionsAllowed') as number,
		this.guild.settings.get('no-mention-spam.timePeriod') as number * 1000
	);

	/**
	 * The lockdowns map
	 */
	public lockdowns: Map<string, PreciseTimeout> = new Map();

	/**
	 * The RegExp
	 */
	public regexp: RegExp | null = null;

	public constructor(guild: Guild) {
		this.guild = guild;
	}

	/**
	 * Build a super RegExp from an array
	 * @param filterArray The array to process
	 */
	public updateRegExp(filterArray: string[]) {
		const filtered = filterArray.reduce((acum, item, index) => acum + (index ? '|' : '') +
			item.replace(/\w(?=(\w)?)/g, (letter, nextWord) => `${letter}+${nextWord ? '\\W*' : ''}`), '');
		this.regexp = new RegExp(`\\b(?:${filtered})\\b`, 'gi');
		return this;
	}

}
