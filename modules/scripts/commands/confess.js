module.exports.config = {
    name: "confess",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "Custom",
    description: "Post a confession mentioning someone's Facebook link.",
    commandCategory: "Messaging",
    usages: "[Your message | FB profile URL]",
    cooldowns: 5,
    UsePrefix: true, // Add this to toggle prefix usage
};

module.exports.run = async function ({ api, event, args }) {
    const PREFIX = "."; // Define the prefix
    const { UsePrefix, name } = this.config; // Get prefix settings from config
    const messageBody = event.body; // The message sent by the user

    // Validate if the prefix is required and the message starts with it
    if (UsePrefix && !messageBody.startsWith(PREFIX + name)) return;

    const reply = (msg) => api.sendMessage(msg, event.threadID, event.messageID);

    // Extract command arguments, removing the prefix and command name
    const commandContent = messageBody.slice((PREFIX + name).length).trim();
    const [message, fbLink] = commandContent.split("|").map(item => item?.trim());
    if (!message || !fbLink) {
        return reply(`Incorrect format.\nUsage: ${PREFIX}${name} [Your message | FB profile URL].`);
    }

    try {
        // Format the message with the Facebook link mentioned
        const formattedMessage = `📢 Confession Alert! 📢\n\n${message}\n\n🔗 Mentioned: ${fbLink}`;

        // Post the message in the bot's current thread
        api.sendMessage(formattedMessage, event.threadID, (err) => {
            if (err) {
                reply("Failed to post the confession. Please try again later.");
            } else {
                reply("Your confession has been posted successfully!");
            }
        });
    } catch (error) {
        reply("An error occurred while processing your request. Please try again later.");
    }
};
