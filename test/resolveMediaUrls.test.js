const { resolveMediaUrls } = require('../lib/resolveMediaUrls');

const BASE_URL = 'http://localhost:3001/game-content/example-season/game-1/';

describe('resolveMediaUrls', () => {
    test('rewrites a relative media path (array) into an absolute URL', () => {
        const jsonData = {
            clue_J_1_1: { media: ['./media/img/clue.jpg'] }
        };

        resolveMediaUrls(jsonData, BASE_URL);

        expect(jsonData.clue_J_1_1.media).toEqual([
            'http://localhost:3001/game-content/example-season/game-1/media/img/clue.jpg'
        ]);
    });

    test('rewrites relative audio and video paths (strings) into absolute URLs', () => {
        const jsonData = {
            clue_J_1_2: { audio: './media/audio/clue.mp3' },
            clue_J_1_3: { video: './media/video/clue.mp4' }
        };

        resolveMediaUrls(jsonData, BASE_URL);

        expect(jsonData.clue_J_1_2.audio).toBe(
            'http://localhost:3001/game-content/example-season/game-1/media/audio/clue.mp3'
        );
        expect(jsonData.clue_J_1_3.video).toBe(
            'http://localhost:3001/game-content/example-season/game-1/media/video/clue.mp4'
        );
    });

    test('leaves an already-absolute URL unchanged', () => {
        const jsonData = {
            clue_J_1_4: { media: ['https://www.j-archive.com/media/2019-02-14_J_16.jpg'] }
        };

        resolveMediaUrls(jsonData, BASE_URL);

        expect(jsonData.clue_J_1_4.media).toEqual([
            'https://www.j-archive.com/media/2019-02-14_J_16.jpg'
        ]);
    });

    test('leaves clues without media/audio/video fields untouched', () => {
        const jsonData = {
            category_J_1: { category_name: 'SCIENCE', clue_count: 5 },
            clue_J_1_1: { correct_response: 'gravity' }
        };

        const result = resolveMediaUrls(jsonData, BASE_URL);

        expect(result).toEqual(jsonData);
    });

    test('ignores non-object values (e.g. top-level id/title strings)', () => {
        const jsonData = {
            id: 'example-season---game-1',
            game_title: 'Game 1'
        };

        expect(() => resolveMediaUrls(jsonData, BASE_URL)).not.toThrow();
        expect(jsonData.id).toBe('example-season---game-1');
    });
});
