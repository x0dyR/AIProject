module.exports = {
    RequestBookText: () => {
        var inputValue = document.getElementsByClassName("BookRequestText")[0];
        var text = inputValue.value;
        console.log(text)
        return text;
    }
}