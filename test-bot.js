
const { onMessageCreate } = require('./src/messageCreateHandler');
const { ConversationManager } = require('./src/conversationManager');
const { ErrorHandler } = require('./src/errorHandler');
const async = require('async');

// Mock Discord message object
const createMockMessage = (content, isBot = false, isDM = false, mentionsBot = false) => {
  return {
    author: {
      id: '123456789',
      bot: isBot
    },
    content: content,
    channel: {
      type: isDM ? 1 : 0, // 1 = DM, 0 = guild channel
      send: (msg) => console.log('Bot would send:', msg),
      sendTyping: () => console.log('Bot is typing...')
    },
    client: {
      user: { id: 'bot123' }
    },
    mentions: {
      users: {
        has: (userId) => mentionsBot && userId === 'bot123'
      }
    },
    attachments: new Map(),
    reply: (msg) => console.log('Bot would reply:', msg)
  };
};

// Initialize components
const errorHandler = new ErrorHandler();
const conversationManager = new ConversationManager(errorHandler);
const conversationQueue = async.queue(() => {
  console.log('Message queued for processing (queue is mocked)');
}, 1);

// Test function
async function testBot() {
  console.log('Testing Discord Bot Message Processing...\n');

  // Test 1: DM message (should process)
  console.log('=== Test 1: Direct Message ===');
  const dmMessage = createMockMessage('Hello bot!', false, true, false);
  await onMessageCreate(dmMessage, conversationQueue, errorHandler, conversationManager);

  // Test 2: Guild message with bot mention (should process)
  console.log('\n=== Test 2: Guild Message with Bot Mention ===');
  const guildMentionMessage = createMockMessage('<@bot123> How are you?', false, false, true);
  await onMessageCreate(guildMentionMessage, conversationQueue, errorHandler, conversationManager);

  // Test 3: Guild message without bot mention (should NOT process)
  console.log('\n=== Test 3: Guild Message without Bot Mention ===');
  const guildNoMentionMessage = createMockMessage('Just chatting', false, false, false);
  await onMessageCreate(guildNoMentionMessage, conversationQueue, errorHandler, conversationManager);

  // Test 4: Bot message (should be ignored)
  console.log('\n=== Test 4: Message from Bot (should be ignored) ===');
  const botMessage = createMockMessage('I am a bot', true, false, false);
  await onMessageCreate(botMessage, conversationQueue, errorHandler, conversationManager);

  console.log('\n=== Testing Complete ===');
}

// Run the test
testBot().catch(console.error);
