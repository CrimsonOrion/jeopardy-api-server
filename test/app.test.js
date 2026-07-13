const request = require('supertest');
const app = require('../app');

describe('GET /status', () => {
    test('reports running', async () => {
        const response = await request(app).get('/status');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ Status: 'Running' });
    });
});

describe('GET /game-content/seasons', () => {
    test('returns the seasons list', async () => {
        const response = await request(app).get('/game-content/seasons');

        expect(response.status).toBe(200);
        expect(response.body).toContainEqual(
            expect.objectContaining({ id: 'final-fantasy' })
        );
    });
});

describe('GET /game-content/seasons/:id', () => {
    test('returns the games in that season', async () => {
        const response = await request(app).get('/game-content/seasons/final-fantasy');

        expect(response.status).toBe(200);
        expect(response.body).toContainEqual(
            expect.objectContaining({ id: 'final-fantasy---final-fantasy-game-1' })
        );
    });
});

describe('GET /game-content/games/:id', () => {
    test('resolves relative media paths into absolute URLs under the request host', async () => {
        const response = await request(app).get(
            '/game-content/games/final-fantasy---final-fantasy-game-1'
        );

        expect(response.status).toBe(200);
        expect(response.body.clue_J_1_2.audio).toMatch(
            /^http:\/\/[^/]+\/game-content\/final-fantasy\/final-fantasy-game-1\/media\/audio\/final-fantasy-game-1-j-1-2\.mp3$/
        );
    });

    test('404s when the game does not exist', async () => {
        const response = await request(app).get('/game-content/games/nope---nope');

        expect(response.status).toBe(500);
    });
});
