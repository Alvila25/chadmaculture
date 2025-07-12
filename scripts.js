var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};

function filledCell(cell) {
  return cell !== '' && cell != null;
}

function loadFileData(filename) {
  if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
    try {
      var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
      var firstSheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[firstSheetName];
      var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
      var filteredData = jsonData.filter(row => row.some(filledCell));
      var headerRowIndex = filteredData.findIndex((row, index) =>
        row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
      );
      if (headerRowIndex === -1 || headerRowIndex > 25) {
        headerRowIndex = 0;
      }
      var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex));
      csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
      return csv;
    } catch (e) {
      console.error(e);
      return "";
    }
  }
  return gk_fileData[filename] || "";
}

function changeLanguage() {
  const select = document.getElementById('languageSelect');
  const selectedLang = select.value;
  console.log(`Language changed to: ${selectedLang}`);
  document.documentElement.lang = selectedLang;
  // Add translation logic here (e.g., using i18next or JSON files)
}

document.addEventListener('DOMContentLoaded', () => {
  const consentModal = document.getElementById('consent-modal');
  const acceptCookies = document.getElementById('accept-cookies');
  const declineCookies = document.getElementById('decline-cookies');
  if (!localStorage.getItem('cookieConsent')) {
    consentModal.style.display = 'flex';
  }
  acceptCookies.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    consentModal.style.display = 'none';
    gtag('consent', 'update', { 'analytics_storage': 'granted' });
  });
  declineCookies.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    consentModal.style.display = 'none';
    gtag('consent', 'update', { 'analytics_storage': 'denied' });
  });
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  const mapAreas = document.querySelectorAll('map area');
  const regionInfo = document.getElementById('region-info');
  const regionTitle = document.getElementById('region-title');
  const regionDescription = document.getElementById('region-description');
  const regionData = {
    ennedi: {
      title: 'Ennedi Plateau',
      description: 'A UNESCO World Heritage Site known for its stunning rock formations and ancient cave paintings.'
    },
    zakouma: {
      title: 'Zakouma National Park',
      description: 'A protected wildlife sanctuary famous for its elephants, lions, and diverse ecosystems.'
    },
    'lake-chad': {
      title: 'Lake Chad',
      description: 'Once one of Africa’s largest lakes, it plays a crucial role in the region’s history and economy.'
    }
  };
  mapAreas.forEach(area => {
    area.addEventListener('click', (e) => {
      e.preventDefault();
      const region = area.dataset.region;
      regionTitle.textContent = regionData[region].title;
      regionDescription.textContent = regionData[region].description;
      regionInfo.style.display = 'block';
    });
  });
  const quizForm = document.querySelector('.quiz-container');
  const submitBtn = quizForm.querySelector('.submit-btn');
  const resultDiv = quizForm.querySelector('.result');
  const badgeDiv = quizForm.querySelector('.badge');
  submitBtn.addEventListener('click', () => {
    const selected = quizForm.querySelector('input[name="q1"]:checked');
    if (!selected) {
      resultDiv.textContent = 'Please select an answer.';
      resultDiv.classList.add('error');
      resultDiv.style.display = 'block';
      return;
    }
    if (selected.value === 'b') {
      resultDiv.textContent = 'Correct! The Ennedi Plateau is a UNESCO World Heritage Site.';
      resultDiv.classList.remove('error');
      resultDiv.classList.add('success');
      badgeDiv.style.display = 'block';
    } else {
      resultDiv.textContent = 'Incorrect. The correct answer is Ennedi Plateau.';
      resultDiv.classList.remove('success');
      resultDiv.classList.add('error');
    }
    resultDiv.style.display = 'block';
  });
  const contactForm = document.getElementById('contact-form');
  const formMessage = contactForm.querySelector('.form-message');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (name.length < 2 || !email.includes('@') || message.length < 10) {
      formMessage.textContent = 'Please fill out all fields correctly.';
      formMessage.classList.add('error');
      formMessage.style.display = 'block';
      return;
    }
    formMessage.textContent = 'Message sent successfully!';
    formMessage.classList.remove('error');
    formMessage.classList.add('success');
    formMessage.style.display = 'block';
    contactForm.reset();
  });
});
