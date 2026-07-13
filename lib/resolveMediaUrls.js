/*
 * Rewrite relative media/audio/video paths on a game's clues into absolute
 * URLs under baseUrl, so content authors can write "./media/..." references
 * that resolve correctly wherever the API happens to be hosted.
 */

const mediaKeys = ['media', 'audio', 'video'];

function resolveUrl(value, baseUrl) {
    if (typeof value === 'string' && !/^https?:\/\//i.test(value)) {
        return baseUrl + value.replace(/^\.\//, '');
    }
    return value;
}

function resolveMediaUrls(jsonData, baseUrl) {
    Object.keys(jsonData).forEach(function (key) {
        const clue = jsonData[key];
        if (clue && typeof clue === 'object') {
            mediaKeys.forEach(function (mediaKey) {
                if (mediaKey in clue) {
                    clue[mediaKey] = Array.isArray(clue[mediaKey])
                        ? clue[mediaKey].map(function (value) { return resolveUrl(value, baseUrl); })
                        : resolveUrl(clue[mediaKey], baseUrl);
                }
            });
        }
    });
    return jsonData;
}

module.exports = { resolveMediaUrls, resolveUrl };
