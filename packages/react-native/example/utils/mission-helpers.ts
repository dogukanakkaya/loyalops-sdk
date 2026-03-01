import type { MissionType } from '@loyalops/react-native';

export function getMissionActionUrl(type: MissionType, config: Record<string, unknown>): string | null {
    switch (type) {
        case 'x_follow':
            return `https://x.com/${config.targetUsername}`;
        case 'x_like':
        case 'x_retweet':
        case 'x_comment':
            return (config.tweetUrl as string) ?? null;
        case 'google_subscribe':
            return (config.channelUrl as string) ?? null;
        case 'google_comment':
            return (config.videoUrl as string) ?? null;
        case 'telegram_join':
            return (config.channelUrl as string) ?? null;
        case 'discord_join':
            return (config.inviteUrl as string) ?? null;
        case 'twitch_follow':
        case 'twitch_subscribe':
            return (config.channelUrl as string) ?? null;
        case 'mailchimp_subscribe':
            return (config.audienceUrl as string) ?? null;
        case 'link_visit':
            return (config.url as string) ?? null;
        default:
            return null;
    }
}

export function getMissionActionLabel(type: MissionType): string | undefined {
    switch (type) {
        case 'x_follow': return 'Follow on X';
        case 'x_like': return 'Like Post';
        case 'x_retweet': return 'Retweet';
        case 'x_comment': return 'Comment';
        case 'google_subscribe': return 'Subscribe on YouTube';
        case 'google_comment': return 'Comment on Video';
        case 'telegram_join': return 'Join Telegram Channel';
        case 'discord_join': return 'Join Discord Server';
        case 'twitch_follow': return 'Follow on Twitch';
        case 'twitch_subscribe': return 'Subscribe on Twitch';
        case 'mailchimp_subscribe': return 'Subscribe to Newsletter';
        case 'link_visit': return 'Visit Link';
        case 'connect_x': return 'Connect X';
        case 'connect_google': return 'Connect Google';
        case 'connect_discord': return 'Connect Discord';
        case 'connect_telegram': return 'Connect Telegram';
        case 'connect_twitch': return 'Connect Twitch';
    }
}

export function getMissionTypeIcon(type: MissionType): string {
    if (type.includes('x_') || type === 'connect_x') return '𝕏';
    if (type.includes('google_') || type === 'connect_google') return '▶';
    if (type.includes('telegram') || type === 'connect_telegram') return '✈';
    if (type.includes('discord') || type === 'connect_discord') return '💬';
    if (type.includes('twitch') || type === 'connect_twitch') return '🎮';
    if (type === 'link_visit') return '🔗';
    if (type === 'mailchimp_subscribe') return '📧';
    if (type === 'quiz') return '❓';
    if (type === 'redeemable_code') return '🎫';
    return '⭐';
}
