document.getElementById('hamburger').addEventListener('click', function () {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('hidden');
});

document.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const targetDiv = document.getElementById(targetId);

        // Hide all divs
        document.querySelectorAll('div').forEach(div => {
            if (!div.classList.contains('hidden')) {
                div.classList.add('hidden');
            }
        });

        // Show the target div
        if (targetDiv.classList.contains('hidden')) {
            targetDiv.classList.remove('hidden');
        }
    });
});