document.addEventListener('DOMContentLoaded', () => {
    console.log('Theme script loaded');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) {
        console.error('Theme toggle button not found');
        return;
    }
    
    const themeIcon = themeToggle.querySelector('i');
    const logoElements = document.querySelectorAll('.logo');
    
    // Verifica o tema salvo no localStorage
    const savedTheme = localStorage.getItem('portfolio-theme');
    console.log('Saved theme:', savedTheme);
    
    function updateLogo(isLightTheme) {
        logoElements.forEach(logo => {
            logo.src = isLightTheme ? 'images/web_light.png' : 'images/web_dark.png';
        });
    }
    
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        updateLogo(true);
    }

    themeToggle.addEventListener('click', () => {
        console.log('Theme toggle clicked');
        // Alterna entre temas
        const isLightTheme = document.documentElement.classList.toggle('light-theme');
        
        // Atualiza o ícone
        if (isLightTheme) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('portfolio-theme', 'light');
            console.log('Switched to light theme');
            updateLogo(true);
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('portfolio-theme', 'dark');
            console.log('Switched to dark theme');
            updateLogo(false);
        }
    });
});
