exports.cutText = (text, length) => {
    let cuttenText = text.substring(0, length);

    if (text.length > length) {
        cuttenText += "...";
    }

    return cuttenText;
};
