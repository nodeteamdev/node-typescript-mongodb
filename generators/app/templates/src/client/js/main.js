window.onload = () => {
    document.getElementById('login').addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        alert('Hey, how are you?');
    })
};
