const { capitalizeWords, filterActiveUsers, logAction } = require('../index');

describe('capitalizeWords', () => {
    test('capitalizes the first letter of each word', () => {
        expect(capitalizeWords('hello world')).toBe('Hello World');
    });

    test('handles multiple words and mixed capitalization', () => {
        expect(capitalizeWords('jAVASCRIPT is FUN')).toBe('JAVASCRIPT Is FUN');
    });

    test('returns an empty string when given an empty string', () => {
        expect(capitalizeWords('')).toBe('');
    });

    test('capitalizes words separated by punctuation', () => {
        expect(capitalizeWords('hello, world!')).toBe('Hello, World!');
    });

    test('handles numbers in the input', () => {
        expect(capitalizeWords('hello 123 world')).toBe('Hello 123 World');
    });
});

describe('filterActiveUsers', () => {
    const users = [
        { name: 'Amina', isActive: true },
        { name: 'Hassan', isActive: false },
        { name: 'Fatima', isActive: true },
    ];

    test('returns only active users', () => {
        expect(filterActiveUsers(users)).toEqual([
            { name: 'Amina', isActive: true },
            { name: 'Fatima', isActive: true },
        ]);
    });

    test('returns an empty array when there are no users', () => {
        expect(filterActiveUsers([])).toEqual([]);
    });

    test('returns an empty array when all users are inactive', () => {
        expect(filterActiveUsers([
            { name: 'Hassan', isActive: false },
            { name: 'Omar', isActive: false },
        ])).toEqual([]);
    });

    test('returns all users when every user is active', () => {
        expect(filterActiveUsers([
            { name: 'Amina', isActive: true },
            { name: 'Fatima', isActive: true },
        ])).toHaveLength(2);
    });

    test('does not modify the original array', () => {
        const originalUsers = [...users];

        filterActiveUsers(users);

        expect(users).toEqual(originalUsers);
    });
});

describe('logAction', () => {
    test('includes the username and action in the log message', () => {
        const result = logAction('logged in', 'Amina');

        expect(result).toContain('User Amina performed logged in at ');
    });

    test('includes a valid ISO timestamp', () => {
        const result = logAction('updated profile', 'Hassan');
        const timestamp = result.split(' at ')[1];

        expect(timestamp).toBeDefined();
        expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });

    test('generates a timestamp within the expected time range', () => {
        const before = Date.now();
        const result = logAction('logged out', 'Fatima');
        const after = Date.now();
        const timestamp = Date.parse(result.split(' at ')[1]);

        expect(timestamp).toBeGreaterThanOrEqual(before);
        expect(timestamp).toBeLessThanOrEqual(after);
    });

    test('handles empty action and username strings', () => {
        const result = logAction('', '');

        expect(result).toMatch(/^User  performed  at /);
        expect(result.split(' at ')[1]).toBeDefined();
    });
});