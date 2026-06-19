// Apple Emoji Converter
document.addEventListener('DOMContentLoaded', function() {
    var emojiConvertor = new EmojiConvertor();
    emojiConvertor.replace_mode = 'img';
    emojiConvertor.img_sets.apple.path = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/';
    emojiConvertor.use_sheet = false;
    emojiConvertor.allow_native = false;

    function replaceEmojisInTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            var originalText = node.nodeValue;
            var newHtml = emojiConvertor.replace_unified(originalText);
            if (originalText !== newHtml) {
                var wrapper = document.createElement('span');
                wrapper.innerHTML = newHtml;
                // Since wrapper might contain multiple nodes (text + img + text), we insert them all
                while (wrapper.firstChild) {
                    node.parentNode.insertBefore(wrapper.firstChild, node);
                }
                node.parentNode.removeChild(node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName.toLowerCase() !== 'script' && node.tagName.toLowerCase() !== 'style' && !node.classList.contains('emoji-ignore')) {
                // Use Array.from to iterate safely while modifying child nodes
                Array.from(node.childNodes).forEach(replaceEmojisInTextNodes);
            }
        }
    }

    // Run the conversion on the body
    replaceEmojisInTextNodes(document.body);
    
    // Also patch document.getElementById('calc-result').innerHTML if needed? 
    // Wait, the calculator is dynamic. Let's create a global function for it.
    window.renderAppleEmojis = function(element) {
        replaceEmojisInTextNodes(element);
    };
});
