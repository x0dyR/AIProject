// Scripts/onboarding.js
document.getElementById('onboardingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const favoriteGenres = document.getElementById('favoriteGenres').value;
    const favoriteAuthors = document.getElementById('favoriteAuthors').value;
    const readingGoals = document.getElementById('readingGoals').value;
    
    const onboardingData = { favoriteGenres, favoriteAuthors, readingGoals };
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    
    // Перенаправляем на страницу поиска книг с ИИ
    window.location.href = "./search.html";
  });
  