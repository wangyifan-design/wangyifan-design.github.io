// fallback.js

const fallbackReplies = [
  "That's a great question — I haven't explored that yet, but I'd love to know more.",
  "Hmm, not something I've deeply studied... but now I’m intrigued!",
  "I don’t have a solid answer on that, but it reminds me why I love design — it always leaves space for curiosity.",
  "I might need more time to think about that one. It sounds fascinating.",
  "I haven’t come across that in my work, but I'd be happy to explore it with you sometime."
];

// Export a function to get one random reply
function getFallbackReply() {
  const index = Math.floor(Math.random() * fallbackReplies.length);
  return fallbackReplies[index];
}
