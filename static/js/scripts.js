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
        row.filter(filledCell).length >= (filteredData[index + 1]?.filter(filledCell).length || 0)
      );
      if (headerRowIndex === -1 || headerRowIndex > 25) {
        headerRowIndex = 0;
      }
      var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex));
      csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
      console.log(`Loaded data for ${filename}`);
      return csv;
    } catch (e) {
      console.error(`Error loading XLSX file ${filename}:`, e);
      return "";
    }
  }
  console.warn(`No data found for ${filename}`);
  return gk_fileData[filename] || "";
}

function changeLanguage() {
  const select = document.getElementById('languageSelect');
  const selectedLang = select.value;
  console.log(`Language changed to: ${selectedLang}`);
  document.documentElement.lang = selectedLang;

  const translations = {
    en: {
      section_tour: '🗺️ Experience Chad: Virtual Cultural Tour',
      tour_text: 'Explore Chad’s rich heritage through immersive 360° virtual tours and interactive AR experiences. Take a multimedia journey through Chad’s heritage, no passport required.',
      tour_festival: '🌍 360° Tour: Gerewol Festival',
      tour_text1: 'Step into the world of the Gerewol Festival, a breathtaking cultural event featuring dance, music, and tradition.',
      tour_explore: '🏛️ Explore Ancient Chad',
      tour_text2: 'Take a virtual tour of Chad’s historical landmarks, including the Ennedi Plateau and ancient rock art sites.',
      tour_artifacts: '📱 Augmented Reality: Chadian Artifacts',
      tour_text3: 'Use AR to interact with traditional Chadian artifacts, sculptures, and ancient manuscripts.',
      experience: 'Experience Now',
      section_portal: 'Membership & Community Portal',
      portal_text: 'Become part of a growing community dedicated to preserving and promoting Chadian culture.',
      portal_access: 'Exclusive Member Access',
      portal_text1: 'Join a network of cultural enthusiasts, researchers, and artists for access to exclusive content and events.',
      portal_discussion: '💬 Discussion Forums',
      portal_text2: 'Exchange ideas, share research, and collaborate with other members in our cultural discussion forums.',
      portal_newsletters: '📩 Monthly Newsletters',
      portal_text3: 'Stay updated on Chadian culture, events, and featured artists with our exclusive monthly newsletter.',
      join: 'Join Now',
      forum: 'Visit Forum',
      subscribe: 'Subscribe Now',
      section_quiz: '🏆 Test Your Knowledge: Interactive Quiz',
      quiz_text: 'Discover the rich traditions, languages, proverbs, and customs of Chad through a fun and interactive quiz.',
      section_join: '📞 Get Involved in Preserving Chadian Culture',
      join_text: 'Play a role in keeping Chad’s rich cultural heritage alive by volunteering, donating, or supporting artists and initiatives.',
      join_volunteer: '🤝 Volunteer & Collaborate',
      join_text1: 'Join cultural projects, assist in research, or help document Chadian traditions for future generations.',
      join_donate: '💰 Donate to Cultural Initiatives',
      join_text2: 'Your contributions help fund cultural preservation projects, support local artists, and document traditional heritage.',
      join_support: '🎨 Support Chadian Artists',
      join_text3: 'Discover and sponsor talented artists, musicians, and writers to ensure Chadian culture thrives.',
      donate: 'Donate Now',
      support: 'Support an Artist'
    },
    fr: {
      section_tour: '🗺️ Découvrez le Tchad : Visite Culturelle Virtuelle',
      tour_text: 'Explorez le riche patrimoine du Tchad grâce à des visites virtuelles à 360° et des expériences AR interactives.',
      tour_festival: '🌍 Visite à 360° : Festival Gerewol',
      tour_text1: 'Plongez dans le monde du festival Gerewol, un événement culturel époustouflant avec danse, musique et tradition.',
      tour_explore: '🏛️ Explorer le Tchad Ancien',
      tour_text2: 'Faites une visite virtuelle des monuments historiques du Tchad, y compris le plateau de l’Ennedi.',
      tour_artifacts: '📱 Réalité Augmentée : Artefacts Tchadiens',
      tour_text3: 'Utilisez la RA pour interagir avec des artefacts tchadiens, sculptures et manuscrits anciens.',
      experience: 'Découvrir Maintenant',
      section_portal: 'Portail de Membres et Communauté',
      portal_text: 'Rejoignez une communauté dévouée à la préservation et à la promotion de la culture tchadienne.',
      portal_access: 'Accès Exclusif aux Membres',
      portal_text1: 'Rejoignez un réseau d’enthousiastes, chercheurs et artistes pour un accès exclusif.',
      portal_discussion: '💬 Forums de Discussion',
      portal_text2: 'Échangez des idées, partagez des recherches et collaborez dans nos forums culturels.',
      portal_newsletters: '📩 Newsletters Mensuelles',
      portal_text3: 'Restez informé sur la culture tchadienne, les événements et les artistes avec notre newsletter.',
      join: 'Rejoindre',
      forum: 'Visiter le Forum',
      subscribe: 'S’abonner',
      section_quiz: '🏆 Testez Vos Connaissances : Quiz Interactif',
      quiz_text: 'Découvrez les traditions, langues, proverbes et coutumes du Tchad avec un quiz amusant.',
      section_join: '📞 Participez à la Préservation de la Culture Tchadienne',
      join_text: 'Contribuez à maintenir vivant le riche patrimoine culturel du Tchad en vous impliquant.',
      join_volunteer: '🤝 Volontariat et Collaboration',
      join_text1: 'Participez à des projets culturels ou aidez à documenter les traditions tchadiennes.',
      join_donate: '💰 Faire un Don pour les Initiatives Culturelles',
      join_text2: 'Vos dons financent la préservation culturelle et soutiennent les artistes locaux.',
      join_support: '🎨 Soutenir les Artistes Tchadiens',
      join_text3: 'Découvrez et parrainez des artistes talentueux pour que la culture tchadienne prospère.',
      donate: 'Faire un Don',
      support: 'Soutenir un Artiste'
    },
    ar: {
      section_tour: '🗺️ استكشف تشاد: جولة ثقافية افتراضية',
      tour_text: 'استكشف التراث الغني لتشاد من خلال جولات افتراضية 360 درجة وتجارب الواقع المعزز.',
      tour_festival: '🌍 جولة 360 درجة: مهرجان جيريول',
      tour_text1: 'ادخل عالم مهرجان جيريول، حدث ثقافي مدهش يضم الرقص والموسيقى والتقاليد.',
      tour_explore: '🏛️ استكشاف تشاد القديمة',
      tour_text2: 'قم بجولة افتراضية في المعالم التاريخية لتشاد، بما في ذلك هضبة إنيدي.',
      tour_artifacts: '📱 الواقع المعزز: القطع الأثرية التشادية',
      tour_text3: 'استخدم الواقع المعزز للتفاعل مع القطع الأثرية التقليدية والمخطوطات القديمة.',
      experience: 'استكشف الآن',
      section_portal: 'بوابة العضوية والمجتمع',
      portal_text: 'كن جزءًا من مجتمع مكرس للحفاظ على الثقافة التشادية وتعزيزها.',
      portal_access: 'الوصول الحصري للأعضاء',
      portal_text1: 'انضم إلى شبكة من المتحمسين والباحثين والفنانين للوصول إلى محتوى حصري.',
      portal_discussion: '💬 منتديات النقاش',
      portal_text2: 'تبادل الأفكار وشارك الأبحاث وتعاون في منتدياتنا الثقافية.',
      portal_newsletters: '📩 النشرات الإخبارية الشهرية',
      portal_text3: 'ابقَ على اطلاع بالثقافة التشادية والأحداث والفنانين من خلال نشرتنا الإخبارية.',
      join: 'انضم الآن',
      forum: 'زيارة المنتدى',
      subscribe: 'اشترك الآن',
      section_quiz: '🏆 اختبر معرفتك: اختبار تفاعلي',
      quiz_text: 'اكتشف التقاليد واللغات والأمثال والعادات التشادية من خلال اختبار ممتع.',
      section_join: '📞 شارك في الحفاظ على الثقافة التشادية',
      join_text: 'العب دورًا في الحفاظ على التراث الثقافي الغني لتشاد من خلال التطوع أو التبرع.',
      join_volunteer: '🤝 التطوع والتعاون',
      join_text1: 'شارك في مشاريع ثقافية أو ساعد في توثيق التقاليد التشادية.',
      join_donate: '💰 التبرع للمبادرات الثقافية',
      join_text2: 'تبرعاتك تدعم مشاريع الحفاظ الثقافي وتدعم الفنانين المحليين.',
      join_support: '🎨 دعم الفنانين التشاديين',
      join_text3: 'اكتشف ورعاية الفنانين الموهوبين لضمان ازدهار الثقافة التشادية.',
      donate: 'تبرع الآن',
      support: 'دعم فنان'
    },
    es: {
      section_tour: '🗺️ Experimenta Chad: Tour Cultural Virtual',
      tour_text: 'Explora el rico patrimonio de Chad a través de tours virtuales de 360° y experiencias de realidad aumentada.',
      tour_festival: '🌍 Tour 360°: Festival Gerewol',
      tour_text1: 'Sumérgete en el mundo del Festival Gerewol, un evento cultural impresionante con danza, música y tradición.',
      tour_explore: '🏛️ Explora el Chad Antiguo',
      tour_text2: 'Realiza un tour virtual por los monumentos históricos de Chad, incluyendo la Meseta de Ennedi.',
      tour_artifacts: '📱 Realidad Aumentada: Artefactos Chadianos',
      tour_text3: 'Usa RA para interactuar con artefactos tradicionales, esculturas y manuscritos antiguos de Chad.',
      experience: 'Explorar Ahora',
      section_portal: 'Portal de Membresía y Comunidad',
      portal_text: 'Forma parte de una comunidad dedicada a preservar y promover la cultura chadiana.',
      portal_access: 'Acceso Exclusivo para Miembros',
      portal_text1: 'Únete a una red de entusiastas, investigadores y artistas para acceder a contenido exclusivo.',
      portal_discussion: '💬 Foros de Discusión',
      portal_text2: 'Intercambia ideas, comparte investigaciones y colabora en nuestros foros culturales.',
      portal_newsletters: '📩 Boletines Mensuales',
      portal_text3: 'Mantente actualizado sobre la cultura chadiana, eventos y artistas con nuestro boletín.',
      join: 'Unirse Ahora',
      forum: 'Visitar Foro',
      subscribe: 'Suscribirse',
      section_quiz: '🏆 Pon a Prueba Tus Conocimientos: Cuestionario Interactivo',
      quiz_text: 'Descubre las tradiciones, idiomas, proverbios y costumbres de Chad con un cuestionario divertido.',
      section_join: '📞 Involúcrate en la Preservación de la Cultura Chadiana',
      join_text: 'Contribuye a mantener vivo el rico patrimonio cultural de Chad mediante voluntariado o donaciones.',
      join_volunteer: '🤝 Voluntariado y Colaboración',
      join_text1: 'Participa en proyectos culturales o ayuda a documentar las tradiciones chadianas.',
      join_donate: '💰 Donar a Iniciativas Culturales',
      join_text2: 'Tus donaciones apoyan proyectos de preservación cultural y a artistas locales.',
      join_support: '🎨 Apoyar a Artistas Chadianos',
      join_text3: 'Descubre y patrocina a artistas talentosos para que la cultura chadiana prospere.',
      donate: 'Donar Ahora',
      support: 'Apoyar a un Artista'
    },
    pt: {
      section_tour: '🗺️ Experimente o Chade: Tour Cultural Virtual',
      tour_text: 'Explore o rico patrimônio do Chade através de tours virtuais de 360° e experiências de realidade aumentada.',
      tour_festival: '🌍 Tour 360°: Festival Gerewol',
      tour_text1: 'Mergulhe no mundo do Festival Gerewol, um evento cultural impressionante com dança, música e tradição.',
      tour_explore: '🏛️ Explore o Chade Antigo',
      tour_text2: 'Faça um tour virtual pelos monumentos históricos do Chade, incluindo o Planalto de Ennedi.',
      tour_artifacts: '📱 Realidade Aumentada: Artefatos Chadianos',
      tour_text3: 'Use RA para interagir com artefatos tradicionais, esculturas e manuscritos antigos do Chade.',
      experience: 'Explorar Agora',
      section_portal: 'Portal de Membros e Comunidade',
      portal_text: 'Faça parte de uma comunidade dedicada a preservar e promover a cultura chadiana.',
      portal_access: 'Acesso Exclusivo para Membros',
      portal_text1: 'Junte-se a uma rede de entusiastas, pesquisadores e artistas para acessar conteúdo exclusivo.',
      portal_discussion: '💬 Fóruns de Discussão',
      portal_text2: 'Troque ideias, compartilhe pesquisas e colabore em nossos fóruns culturais.',
      portal_newsletters: '📩 Newsletters Mensais',
      portal_text3: 'Mantenha-se atualizado sobre a cultura chadiana, eventos e artistas com nossa newsletter.',
      join: 'Juntar-se Agora',
      forum: 'Visitar Fórum',
      subscribe: 'Inscrever-se',
      section_quiz: '🏆 Teste Seus Conhecimentos: Quiz Interativo',
      quiz_text: 'Descubra as tradições, idiomas, provérbios e costumes do Chade com um quiz divertido.',
      section_join: '📞 Envolva-se na Preservação da Cultura Chadiana',
      join_text: 'Contribua para manter vivo o rico patrimônio cultural do Chade por meio de voluntariado ou doações.',
      join_volunteer: '🤝 Voluntariado e Colaboração',
      join_text1: 'Participe de projetos culturais ou ajude a documentar as tradições chadianas.',
      join_donate: '💰 Doar para Iniciativas Culturais',
      join_text2: 'Suas doações apoiam projetos de preservação cultural e artistas locais.',
      join_support: '🎨 Apoiar Artistas Chadianos',
      join_text3: 'Descubra e patrocine artistas talentosos para que a cultura chadiana prospere.',
      donate: 'Doar Agora',
      support: 'Apoiar um Artista'
    }
  };

  try {
    document.querySelectorAll('[data-lang]').forEach(element => {
      const key = element.getAttribute('data-lang');
      if (translations[selectedLang][key]) {
        element.textContent = translations[selectedLang][key];
      }
    });
  } catch (e) {
    console.error('Error updating translations:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Cookie Consent Modal
    const consentModal = document.getElementById('consent-modal');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');
    if (consentModal && !localStorage.getItem('cookieConsent')) {
      consentModal.style.display = 'flex';
      consentModal.style.opacity = '0';
      setTimeout(() => { consentModal.style.opacity = '1'; }, 100);
    }
    if (acceptCookies) {
      acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        consentModal.style.opacity = '0';
        setTimeout(() => { consentModal.style.display = 'none'; }, 300);
        if (typeof gtag === 'function') {
          gtag('consent', 'update', { 'analytics_storage': 'granted' });
        }
      });
    }
    if (declineCookies) {
      declineCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        consentModal.style.opacity = '0';
        setTimeout(() => { consentModal.style.display = 'none'; }, 300);
        if (typeof gtag === 'function') {
          gtag('consent', 'update', { 'analytics_storage': 'denied' });
        }
      });
    }

    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
      });
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Interactive Map
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
    if (mapAreas && regionInfo) {
      mapAreas.forEach(area => {
        area.addEventListener('click', (e) => {
          e.preventDefault();
          const region = area.dataset.region;
          if (regionData[region]) {
            regionTitle.textContent = regionData[region].title;
            regionDescription.textContent = regionData[region].description;
            regionInfo.style.display = 'block';
            regionInfo.style.opacity = '0';
            setTimeout(() => { regionInfo.style.opacity = '1'; }, 100);
            regionInfo.setAttribute('aria-live', 'polite');
          }
        });
      });
    }

    // Quiz Functionality
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
      const questions = [
        {
          id: 'question1',
          name: 'quiz1',
          correct: 'B',
          correctText: 'Correct! N\'Djamena is the capital of Chad.',
          incorrectText: 'Incorrect. The correct answer is N\'Djamena.'
        },
        {
          id: 'question2',
          name: 'quiz2',
          correct: 'D',
          correctText: 'Correct! Arabic and French are the national languages of Chad.',
          incorrectText: 'Incorrect. The correct answer is Arabic and French.'
        },
        {
          id: 'question3',
          name: 'quiz3',
          correct: 'C',
          correctText: 'Correct! Toumaï is the oldest known human ancestor discovered in Chad.',
          incorrectText: 'Incorrect. The correct answer is Toumaï, the oldest known human ancestor.'
        }
      ];
      let currentQuestion = 0;
      const submitBtn = quizContainer.querySelector('.submit-btn');
      const resultDiv = quizContainer.querySelector('.result');
      const badgeDiv = quizContainer.querySelector('.badge');
      let correctAnswers = 0;

      submitBtn.addEventListener('click', () => {
        const current = questions[currentQuestion];
        const selected = quizContainer.querySelector(`input[name="${current.name}"]:checked`);
        resultDiv.setAttribute('aria-live', 'polite');
        
        if (!selected) {
          resultDiv.textContent = 'Please select an answer.';
          resultDiv.classList.add('error');
          resultDiv.classList.remove('success');
          resultDiv.style.display = 'block';
          return;
        }

        if (selected.value === current.correct) {
          resultDiv.textContent = current.correctText;
          resultDiv.classList.add('success');
          resultDiv.classList.remove('error');
          correctAnswers++;
        } else {
          resultDiv.textContent = current.incorrectText;
          resultDiv.classList.add('error');
          resultDiv.classList.remove('success');
        }
        resultDiv.style.display = 'block';

        setTimeout(() => {
          resultDiv.style.display = 'none';
          document.getElementById(current.id).style.display = 'none';
          quizContainer.querySelector(`.options:nth-of-type(${currentQuestion + 1})`).style.display = 'none';
          
          currentQuestion++;
          if (currentQuestion < questions.length) {
            document.getElementById(questions[currentQuestion].id).style.display = 'block';
            quizContainer.querySelector(`.options:nth-of-type(${currentQuestion + 1})`).style.display = 'flex';
          } else {
            if (correctAnswers === questions.length) {
              badgeDiv.style.display = 'block';
              badgeDiv.setAttribute('aria-live', 'polite');
            } else {
              resultDiv.textContent = `Quiz completed! You got ${correctAnswers} out of ${questions.length} correct. Try again!`;
              resultDiv.classList.add('error');
              resultDiv.style.display = 'block';
            }
          }
        }, 1500);
      });
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      const formMessage = contactForm.querySelector('.form-message');
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        formMessage.setAttribute('aria-live', 'polite');
        if (name.length < 2) {
          formMessage.textContent = 'Name must be at least 2 characters long.';
          formMessage.classList.add('error');
          formMessage.classList.remove('success');
          formMessage.style.display = 'block';
          return;
        }
        if (!emailRegex.test(email)) {
          formMessage.textContent = 'Please enter a valid email address.';
          formMessage.classList.add('error');
          formMessage.classList.remove('success');
          formMessage.style.display = 'block';
          return;
        }
        if (message.length < 10) {
          formMessage.textContent = 'Message must be at least 10 characters long.';
          formMessage.classList.add('error');
          formMessage.classList.remove('success');
          formMessage.style.display = 'block';
          return;
        }
        formMessage.textContent = 'Message sent successfully!';
        formMessage.classList.add('success');
        formMessage.classList.remove('error');
        formMessage.style.display = 'block';
        contactForm.reset();
        setTimeout(() => { formMessage.style.display = 'none'; }, 3000);
      });
    }

    // Virtual Tour, Membership Portal, and Join Us Buttons
    const actionButtons = document.querySelectorAll('.experience-btn, .join-btn, .forum-btn, .newsletter-btn, .action-btn');
    actionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.getAttribute('data-lang') || btn.textContent;
        console.log(`Clicked ${action} button: ${btn.getAttribute('href')}`);
        // Placeholder for future functionality (e.g., redirect or modal)
      });
    });

  } catch (e) {
    console.error('Error in DOMContentLoaded handler:', e);
  }
});