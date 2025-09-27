'use strict';


module.exports = {
async up(queryInterface, Sequelize) {
// Seed Users
await queryInterface.bulkInsert('Users', [
{
name: 'Test User',
email: 'test@example.com',
passwordHash: '$2b$10$abcdef...', // bcrypt hash
createdAt: new Date(),
updatedAt: new Date(),
},
]);


// Seed Videos
await queryInterface.bulkInsert('Videos', [
{
title: 'Daily English Listening 1',
url: 'https://example.com/video1.mp4',
date: '2025-09-23',
level: 'beginner',
createdAt: new Date(),
updatedAt: new Date(),
},
]);


// Seed Transcript
await queryInterface.bulkInsert('Transcripts', [
{
videoId: 1,
sentenceIndex: 1,
text: 'Hello, how are you?',
createdAt: new Date(),
updatedAt: new Date(),
},
{
videoId: 1,
sentenceIndex: 2,
text: 'I am fine, thank you.',
createdAt: new Date(),
updatedAt: new Date(),
},
]);
},


async down(queryInterface, Sequelize) {
await queryInterface.bulkDelete('Transcripts', null, {});
await queryInterface.bulkDelete('Videos', null, {});
await queryInterface.bulkDelete('Users', null, {});
},
};