// app.js – warm UI, history, network view, localization, friendly tone

/* === Localization dictionary === */
const I18N = {
    en: {
        app_title: "PhishGuard",
        app_tagline: "A gentle helper that checks links for you.",
        language_label: "Language",
        tab_check: "Check a link",
        tab_history: "History",
        tab_about: "About",
        check_heading: "Paste a link to check",
        check_subtitle:
            "We look at the link’s shape and give a simple, friendly safety hint.",
        check_label: "Link to check",
        check_button: "Check",
        check_privacy_note:
            "All checks happen in your browser. We do not send your links anywhere.",
        demo_ip_url: "Try a suspicious link",
        demo_safe_url: "Try a common sign-in link",
        demo_phishy_url: "Try a phishy looking link",
        result_heading: "What we see in this link",
        result_subtitle:
            "We look at the address shape, not the actual website content.",
        result_overall: "Overall feeling",
        result_breakdown: "Link details",
        result_reasons: "Why we feel this way",
        result_raw_toggle: "Show technical details",
        network_heading: "How this link travels on the internet",
        network_subtitle:
            "A simple story of browser → name lookup → server → reply.",
        network_dns_title: "1. Name lookup (DNS)",
        network_http_title: "2. Talking to the website (HTTP)",
        network_http_request_title: "Request from your browser",
        network_http_response_title: "Reply from the website",
        network_note:
            "This is a simple simulation to help you understand, not an exact copy of real traffic.",
        history_heading: "Link history on this device",
        history_subtitle:
            "Only you can see this. We store it locally in your browser.",
        history_clear: "Clear history",
        history_empty: "You have not checked any links yet.",
        history_col_time: "Time",
        history_col_url: "Link",
        history_col_score: "Score",
        history_col_feel: "Feeling",
        about_heading: "What PhishGuard is for",
        about_subtitle:
            "Made for families, students and non-technical people who just want a gentle “is this link okay?” helper.",
        about_block_1_title: "Friendly safety hints",
        about_block_1_text:
            "We never try to scare you. We simply point out what looks unusual and remind you to be careful.",
        about_block_2_title: "Privacy-first",
        about_block_2_text:
            "All checks happen on your device. Your links are not uploaded to a server.",
        about_block_3_title: "Works with our browser add-on",
        about_block_3_text:
            "The browser add-on can gently highlight suspicious links in email and messaging apps and show a simple dashboard.",
        footer_text:
            "PhishGuard is an educational helper and does not guarantee a link is safe. When in doubt, please do not click.",
        risk_low: "Feels mostly okay",
        risk_medium: "Feels a bit risky",
        risk_high: "Feels very risky"
    },

    // Macedonian
    mk: {
        app_title: "PhishGuard",
        app_tagline: "Нежен помошник што ги проверува линковите за вас.",
        language_label: "Јазик",
        tab_check: "Провери линк",
        tab_history: "Историја",
        tab_about: "За алатката",
        check_heading: "Внесете линк за проверка",
        check_subtitle:
            "Гледаме како изгледа адресата и даваме едноставен совет за безбедност.",
        check_label: "Линк за проверка",
        check_button: "Провери",
        check_privacy_note:
            "Сите проверки се прават во вашиот прелистувач. Ништо не се праќа на сервер.",
        demo_ip_url: "Пробај сомнителен линк",
        demo_safe_url: "Пробај вообичаен линк за најава",
        demo_phishy_url: "Пробај линк што личи на фишинг",
        result_heading: "Што гледаме во овој линк",
        result_subtitle:
            "Гледаме само во форматот на адресата, не во содржината.",
        result_overall: "Општ впечаток",
        result_breakdown: "Детали за линкот",
        result_reasons: "Зошто така мислиме",
        result_raw_toggle: "Покажи технички детали",
        network_heading: "Како патува овој линк на интернет",
        network_subtitle:
            "Едноставна приказна: прелистувач → DNS → сервер → одговор.",
        network_dns_title: "1. DNS (пребарување на име)",
        network_http_title: "2. HTTP (разговор со веб-страницата)",
        network_http_request_title: "Барање од вашиот прелистувач",
        network_http_response_title: "Одговор од веб-страницата",
        network_note:
            "Ова е поедноставена симулација, само за објаснување.",
        history_heading: "Историја на линкови на овој уред",
        history_subtitle:
            "Само вие ја гледате. Се чува локално во прелистувачот.",
        history_clear: "Исчисти историја",
        history_empty: "Сè уште нема проверени линкови.",
        history_col_time: "Време",
        history_col_url: "Линк",
        history_col_score: "Оценка",
        history_col_feel: "Впечаток",
        about_heading: "За што служи PhishGuard",
        about_subtitle:
            "За семејства, студенти и луѓе без техничко искуство кои сакаат нежна проверка „дали линкот е во ред?“. ",
        about_block_1_title: "Пријателски совети",
        about_block_1_text:
            "Не плашиме, туку укажуваме на чудни работи и потсетуваме на внимателност.",
        about_block_2_title: "Приватност на прво место",
        about_block_2_text:
            "Сè се пресметува на вашиот уред. Линковите не се праќаат никаде.",
        about_block_3_title: "Работи со додаток за прелистувач",
        about_block_3_text:
            "Додатокот нежно означува сомнителни линкови во е-пошта и чет-апликации.",
        footer_text:
            "PhishGuard е едукативна алатка и не гарантира дека линкот е безбеден.",
        risk_low: "Главно изгледа во ред",
        risk_medium: "Малку ризично",
        risk_high: "Многу ризично"
    },

    // Bangla
    bn: {
        app_title: "PhishGuard",
        app_tagline: "লিংক নিরাপদ কি না আস্তে করে জানিয়ে দেয়।",
        language_label: "ভাষা",
        tab_check: "লিঙ্ক চেক",
        tab_history: "ইতিহাস",
        tab_about: "এ্যাপ সম্পর্কে",
        check_heading: "যে লিঙ্কটি চেক করতে চান",
        check_subtitle:
            "আমরা শুধু লিঙ্কের গঠন দেখে সহজ ভাষায় মতামত দেই।",
        check_label: "চেক করার লিঙ্ক",
        check_button: "চেক করুন",
        check_privacy_note:
            "সব হিসাব আপনার ব্রাউজারেই হয়। লিঙ্ক সার্ভারে পাঠানো হয় না।",
        demo_ip_url: "একটি সন্দেহজনক লিঙ্ক চেষ্টা করুন",
        demo_safe_url: "একটি পরিচিত সাইন-ইন লিঙ্ক চেষ্টা করুন",
        demo_phishy_url: "একটি ফিশিং টাইপ লিঙ্ক চেষ্টা করুন",
        result_heading: "এই লিঙ্ক থেকে আমরা কী দেখি",
        result_subtitle:
            "আমরা শুধু ঠিকানার আকার দেখি, ভেতরের কনটেন্ট নয়।",
        result_overall: "সামগ্রিক অনুভূতি",
        result_breakdown: "লিঙ্কের বিস্তারিত",
        result_reasons: "কেন এমন মনে হচ্ছে",
        result_raw_toggle: "টেকনিক্যাল ডিটেইল দেখুন",
        network_heading: "এই লিঙ্ক ইন্টারনেটে কীভাবে যায়",
        network_subtitle:
            "একটি ছোট গল্প: ব্রাউজার → নাম খোঁজা → সার্ভার → উত্তর।",
        network_dns_title: "১. নাম খোঁজা (DNS)",
        network_http_title: "২. ওয়েবসাইটের সাথে কথা (HTTP)",
        network_http_request_title: "আপনার ব্রাউজারের রিকোয়েস্ট",
        network_http_response_title: "ওয়েবসাইটের উত্তর",
        network_note:
            "এটি বোঝানোর জন্য তৈরি সহজ উদাহরণ, বাস্তব ট্রাফিকের পুরো কপি নয়।",
        history_heading: "এই ডিভাইসে লিঙ্ক ইতিহাস",
        history_subtitle:
            "এগুলো কেবল আপনি দেখেন। সব ডেটা আপনার ব্রাউজারেই থাকে।",
        history_clear: "ইতিহাস মুছে দিন",
        history_empty: "এখনো কোন লিঙ্ক চেক করেননি।",
        history_col_time: "সময়",
        history_col_url: "লিঙ্ক",
        history_col_score: "স্কোর",
        history_col_feel: "অনুভূতি",
        about_heading: "PhishGuard কেন তৈরি",
        about_subtitle:
            "পরিবার, শিক্ষার্থী এবং অ-প্রযুক্তিগত ব্যবহারকারীদের জন্য, যারা জানতে চান “এই লিঙ্কটা ঠিক আছে তো?”",
        about_block_1_title: "সহজ ভাষায় নিরাপত্তা",
        about_block_1_text:
            "আমরা ভয় দেখাই না, শুধু অস্বাভাবিক দিকগুলো দেখিয়ে দেই।",
        about_block_2_title: "প্রাইভেসি আগে",
        about_block_2_text:
            "সবকিছু আপনার ডিভাইসেই ঘটে। লিঙ্ক কোথাও পাঠানো হয় না।",
        about_block_3_title: "ব্রাউজার এক্সটেনশনের সাথে কাজ করে",
        about_block_3_text:
            "এক্সটেনশন ইমেইল ও মেসেজ অ্যাপে সন্দেহজনক লিঙ্ক আলতো করে হাইলাইট করতে পারে।",
        footer_text:
            "PhishGuard একটি শিক্ষামূলক টুল। এটি লিঙ্ক পুরোপুরি নিরাপদ তা নিশ্চিত করে না।",
        risk_low: "মোটামুটি ঠিকই মনে হচ্ছে",
        risk_medium: "কিছুটা ঝুঁকিপূর্ণ মনে হচ্ছে",
        risk_high: "খুব ঝুঁকিপূর্ণ মনে হচ্ছে"
    },

    // Spanish (simple, friendly)
    es: {
        app_title: "PhishGuard",
        app_tagline: "Un ayudante amable que revisa tus enlaces.",
        language_label: "Idioma",
        tab_check: "Revisar enlace",
        tab_history: "Historial",
        tab_about: "Acerca de",
        check_heading: "Pega un enlace para revisar",
        check_subtitle:
            "Miramos la forma del enlace y damos una recomendación sencilla.",
        check_label: "Enlace a revisar",
        check_button: "Revisar",
        check_privacy_note:
            "Todo se calcula en tu navegador. No enviamos los enlaces a ningún servidor.",
        demo_ip_url: "Probar un enlace sospechoso",
        demo_safe_url: "Probar un enlace de inicio de sesión común",
        demo_phishy_url: "Probar un enlace que parece phishing",
        result_heading: "Qué vemos en este enlace",
        result_subtitle:
            "Solo miramos la forma de la dirección, no el contenido de la página.",
        result_overall: "Sensación general",
        result_breakdown: "Detalles del enlace",
        result_reasons: "Por qué pensamos esto",
        result_raw_toggle: "Mostrar detalles técnicos",
        network_heading: "Cómo viaja este enlace por Internet",
        network_subtitle:
            "Una historia simple: navegador → DNS → servidor → respuesta.",
        network_dns_title: "1. Búsqueda de nombre (DNS)",
        network_http_title: "2. Conversación con la web (HTTP)",
        network_http_request_title: "Petición desde tu navegador",
        network_http_response_title: "Respuesta del sitio web",
        network_note:
            "Es una simulación sencilla para explicar, no tráfico real.",
        history_heading: "Historial de enlaces en este dispositivo",
        history_subtitle:
            "Solo tú lo ves. Se guarda localmente en tu navegador.",
        history_clear: "Borrar historial",
        history_empty: "Todavía no has revisado ningún enlace.",
        history_col_time: "Hora",
        history_col_url: "Enlace",
        history_col_score: "Puntuación",
        history_col_feel: "Sensación",
        about_heading: "Para qué sirve PhishGuard",
        about_subtitle:
            "Pensado para familias, estudiantes y personas no técnicas que solo quieren saber si un enlace parece seguro.",
        about_block_1_title: "Consejos amables",
        about_block_1_text:
            "No intentamos asustarte. Solo marcamos lo que se ve raro.",
        about_block_2_title: "Privacidad primero",
        about_block_2_text:
            "Todo ocurre en tu dispositivo. No subimos tus enlaces.",
        about_block_3_title: "Funciona con la extensión del navegador",
        about_block_3_text:
            "La extensión puede resaltar enlaces sospechosos en correo y chats.",
        footer_text:
            "PhishGuard es una herramienta educativa y no garantiza que un enlace sea seguro.",
        risk_low: "Parece bastante bien",
        risk_medium: "Parece algo arriesgado",
        risk_high: "Parece muy arriesgado"
    },

    // French
    fr: {
        app_title: "PhishGuard",
        app_tagline: "Un petit assistant qui vérifie vos liens.",
        language_label: "Langue",
        tab_check: "Vérifier un lien",
        tab_history: "Historique",
        tab_about: "À propos",
        check_heading: "Collez un lien à vérifier",
        check_subtitle:
            "Nous regardons la forme du lien et donnons un avis simple.",
        check_label: "Lien à vérifier",
        check_button: "Vérifier",
        check_privacy_note:
            "Tout est calculé dans votre navigateur. Aucun lien n’est envoyé sur un serveur.",
        demo_ip_url: "Essayer un lien suspect",
        demo_safe_url: "Essayer un lien de connexion courant",
        demo_phishy_url: "Essayer un lien qui ressemble à du phishing",
        result_heading: "Ce que nous voyons dans ce lien",
        result_subtitle:
            "Nous regardons seulement la forme de l’adresse, pas le contenu.",
        result_overall: "Impression globale",
        result_breakdown: "Détails du lien",
        result_reasons: "Pourquoi nous pensons cela",
        result_raw_toggle: "Afficher les détails techniques",
        network_heading: "Comment ce lien circule sur Internet",
        network_subtitle:
            "Une histoire simple : navigateur → DNS → serveur → réponse.",
        network_dns_title: "1. Recherche de nom (DNS)",
        network_http_title: "2. Dialogue avec le site (HTTP)",
        network_http_request_title: "Requête depuis votre navigateur",
        network_http_response_title: "Réponse du site",
        network_note:
            "C’est une simulation simplifiée pour expliquer, pas du trafic réel.",
        history_heading: "Historique des liens sur cet appareil",
        history_subtitle:
            "Vous seul le voyez. C’est stocké localement.",
        history_clear: "Effacer l’historique",
        history_empty: "Vous n’avez pas encore vérifié de lien.",
        history_col_time: "Heure",
        history_col_url: "Lien",
        history_col_score: "Score",
        history_col_feel: "Impression",
        about_heading: "À quoi sert PhishGuard",
        about_subtitle:
            "Pour les familles, étudiants et personnes non techniques qui veulent juste savoir si un lien semble sûr.",
        about_block_1_title: "Conseils doux",
        about_block_1_text:
            "Nous n’essayons pas de faire peur, nous signalons simplement ce qui paraît étrange.",
        about_block_2_title: "Priorité à la confidentialité",
        about_block_2_text:
            "Tout reste sur votre appareil. Les liens ne sont pas envoyés.",
        about_block_3_title: "Fonctionne avec l’extension navigateur",
        about_block_3_text:
            "L’extension peut surligner des liens suspects dans les e-mails et les discussions.",
        footer_text:
            "PhishGuard est un outil éducatif et ne garantit pas qu’un lien soit sûr.",
        risk_low: "Semble plutôt correct",
        risk_medium: "Semble un peu risqué",
        risk_high: "Semble très risqué"
    },

    // Turkish
    tr: {
        app_title: "PhishGuard",
        app_tagline: "Bağlantıları senin için nazikçe kontrol eder.",
        language_label: "Dil",
        tab_check: "Bağlantı kontrolü",
        tab_history: "Geçmiş",
        tab_about: "Hakkında",
        check_heading: "Kontrol etmek istediğin bağlantıyı yapıştır",
        check_subtitle:
            "Sadece bağlantının şeklini inceliyoruz ve basit bir uyarı veriyoruz.",
        check_label: "Kontrol edilecek bağlantı",
        check_button: "Kontrol et",
        check_privacy_note:
            "Tüm hesaplamalar tarayıcında yapılır. Bağlantılar sunucuya gönderilmez.",
        demo_ip_url: "Şüpheli bir bağlantı dene",
        demo_safe_url: "Yaygın bir giriş bağlantısı dene",
        demo_phishy_url: "Phishing’e benzeyen bir bağlantı dene",
        result_heading: "Bu bağlantıda ne görüyoruz",
        result_subtitle:
            "Sadece adresin şeklini inceliyoruz, içeriği değil.",
        result_overall: "Genel his",
        result_breakdown: "Bağlantı detayları",
        result_reasons: "Neden böyle düşünüyoruz",
        result_raw_toggle: "Teknik detayları göster",
        network_heading: "Bu bağlantı internette nasıl yol alır?",
        network_subtitle:
            "Basit bir hikâye: tarayıcı → DNS → sunucu → cevap.",
        network_dns_title: "1. İsim sorgusu (DNS)",
        network_http_title: "2. Siteyle konuşma (HTTP)",
        network_http_request_title: "Tarayıcıdan istek",
        network_http_response_title: "Siteden cevap",
        network_note:
            "Bu, anlatmak için basitleştirilmiş bir örnek.",
        history_heading: "Bu cihazdaki bağlantı geçmişi",
        history_subtitle:
            "Sadece sen görebilirsin. Yerel olarak saklanır.",
        history_clear: "Geçmişi temizle",
        history_empty: "Henüz hiç bağlantı kontrol etmedin.",
        history_col_time: "Zaman",
        history_col_url: "Bağlantı",
        history_col_score: "Puan",
        history_col_feel: "His",
        about_heading: "PhishGuard ne için?",
        about_subtitle:
            "Aileler, öğrenciler ve teknik olmayan kişiler için, sadece “bu bağlantı güvenli mi?” diye sormak isteyenlere.",
        about_block_1_title: "Yumuşak uyarılar",
        about_block_1_text:
            "Korkutmaya çalışmayız, sadece garip görünen yerleri gösteririz.",
        about_block_2_title: "Önce mahremiyet",
        about_block_2_text:
            "Her şey cihazında kalır. Bağlantılar gönderilmez.",
        about_block_3_title: "Tarayıcı eklentisiyle çalışır",
        about_block_3_text:
            "Eklenti, e-postalar ve sohbetlerde şüpheli bağlantıları işaretleyebilir.",
        footer_text:
            "PhishGuard eğitim amaçlıdır ve bağlantının tamamen güvenli olduğunu garanti etmez.",
        risk_low: "Genelde iyi görünüyor",
        risk_medium: "Biraz riskli görünüyor",
        risk_high: "Oldukça riskli görünüyor"
    },

    // Italian
    it: {
        app_title: "PhishGuard",
        app_tagline: "Un piccolo aiuto per controllare i tuoi link.",
        language_label: "Lingua",
        tab_check: "Controlla un link",
        tab_history: "Cronologia",
        tab_about: "Informazioni",
        check_heading: "Incolla un link da controllare",
        check_subtitle:
            "Guardiamo la forma dell’indirizzo e diamo un consiglio semplice.",
        check_label: "Link da controllare",
        check_button: "Controlla",
        check_privacy_note:
            "Tutto avviene nel tuo browser. I link non vengono inviati a nessun server.",
        demo_ip_url: "Prova un link sospetto",
        demo_safe_url: "Prova un link di accesso comune",
        demo_phishy_url: "Prova un link che sembra phishing",
        result_heading: "Cosa vediamo in questo link",
        result_subtitle:
            "Guardiamo solo la forma dell’indirizzo, non il contenuto.",
        result_overall: "Sensazione generale",
        result_breakdown: "Dettagli del link",
        result_reasons: "Perché lo pensiamo",
        result_raw_toggle: "Mostra dettagli tecnici",
        network_heading: "Come viaggia questo link su Internet",
        network_subtitle:
            "Una piccola storia: browser → DNS → server → risposta.",
        network_dns_title: "1. Ricerca del nome (DNS)",
        network_http_title: "2. Conversazione con il sito (HTTP)",
        network_http_request_title: "Richiesta dal tuo browser",
        network_http_response_title: "Risposta del sito",
        network_note:
            "È una simulazione semplificata per spiegare il concetto.",
        history_heading: "Cronologia dei link su questo dispositivo",
        history_subtitle:
            "Solo tu la vedi. È salvata localmente.",
        history_clear: "Cancella cronologia",
        history_empty: "Non hai ancora controllato nessun link.",
        history_col_time: "Ora",
        history_col_url: "Link",
        history_col_score: "Punteggio",
        history_col_feel: "Sensazione",
        about_heading: "A cosa serve PhishGuard",
        about_subtitle:
            "Per famiglie, studenti e persone non tecniche che vogliono sapere se un link sembra sicuro.",
        about_block_1_title: "Suggerimenti gentili",
        about_block_1_text:
            "Non vogliamo spaventare, solo evidenziare ciò che sembra strano.",
        about_block_2_title: "Privacy prima di tutto",
        about_block_2_text:
            "Tutto rimane sul tuo dispositivo. I link non vengono inviati.",
        about_block_3_title: "Funziona con l’estensione del browser",
        about_block_3_text:
            "L’estensione può evidenziare link sospetti in e-mail e chat.",
        footer_text:
            "PhishGuard è uno strumento educativo e non garantisce che il link sia sicuro.",
        risk_low: "Sembra per lo più sicuro",
        risk_medium: "Sembra un po’ rischioso",
        risk_high: "Sembra molto rischioso"
    },

    // Hindi
    hi: {
        app_title: "PhishGuard",
        app_tagline: "लिंक सुरक्षित है या नहीं, प्यार से बता देता है।",
        language_label: "भाषा",
        tab_check: "लिंक जाँचें",
        tab_history: "इतिहास",
        tab_about: "जानकारी",
        check_heading: "जाँचने के लिए लिंक पेस्ट करें",
        check_subtitle:
            "हम सिर्फ लिंक के आकार को देखकर साधारण सलाह देते हैं।",
        check_label: "जाँचने वाला लिंक",
        check_button: "जाँचें",
        check_privacy_note:
            "सब कुछ आपके ब्राउज़र में ही होता है। लिंक कहीं नहीं भेजे जाते।",
        demo_ip_url: "एक संदिग्ध लिंक आज़माएँ",
        demo_safe_url: "एक सामान्य लॉगिन लिंक आज़माएँ",
        demo_phishy_url: "फिशिंग जैसा दिखने वाला लिंक आज़माएँ",
        result_heading: "हम इस लिंक में क्या देखते हैं",
        result_subtitle:
            "हम सिर्फ पते के रूप को देखते हैं, अंदर की सामग्री को नहीं।",
        result_overall: "कुल मिलाकर भावना",
        result_breakdown: "लिंक विवरण",
        result_reasons: "ऐसा क्यों लगता है",
        result_raw_toggle: "तकनीकी विवरण देखें",
        network_heading: "यह लिंक इंटरनेट पर कैसे जाता है",
        network_subtitle:
            "छोटी कहानी: ब्राउज़र → DNS → सर्वर → जवाब।",
        network_dns_title: "1. नाम खोज (DNS)",
        network_http_title: "2. वेबसाइट से बात (HTTP)",
        network_http_request_title: "आपके ब्राउज़र से अनुरोध",
        network_http_response_title: "वेबसाइट से जवाब",
        network_note:
            "यह समझाने के लिए सरल उदाहरण है, असली ट्रैफिक की कॉपी नहीं।",
        history_heading: "इस डिवाइस पर लिंक इतिहास",
        history_subtitle:
            "इसे केवल आप देख सकते हैं। सब कुछ लोकली सेव है।",
        history_clear: "इतिहास साफ करें",
        history_empty: "आपने अभी तक कोई लिंक जाँचा नहीं है।",
        history_col_time: "समय",
        history_col_url: "लिंक",
        history_col_score: "स्कोर",
        history_col_feel: "अहसास",
        about_heading: "PhishGuard किसके लिए है",
        about_subtitle:
            "परिवार, छात्र और नॉन-टेक्निकल लोगों के लिए जो बस ये जानना चाहते हैं कि लिंक ठीक लगता है या नहीं।",
        about_block_1_title: "नरम सुरक्षा सलाह",
        about_block_1_text:
            "हम डराते नहीं, बस अजीब हिस्सों को दिखाते हैं।",
        about_block_2_title: "पहले प्राइवेसी",
        about_block_2_text:
            "सब कुछ आपके डिवाइस पर रहता है। लिंक कहीं नहीं भेजे जाते।",
        about_block_3_title: "ब्राउज़र एक्सटेंशन के साथ काम करता है",
        about_block_3_text:
            "एक्सटेंशन ईमेल और चैट में संदेहास्पद लिंक को हल्के से हाइलाइट कर सकता है।",
        footer_text:
            "PhishGuard एक शैक्षिक टूल है और लिंक के पूरी तरह सुरक्षित होने की गारंटी नहीं देता।",
        risk_low: "ज़्यादातर ठीक लग रहा है",
        risk_medium: "थोड़ा जोखिम भरा लग रहा है",
        risk_high: "काफी जोखिम भरा लग रहा है"
    },

    // German
    de: {
        app_title: "PhishGuard",
        app_tagline: "Ein freundlicher Helfer für deine Links.",
        language_label: "Sprache",
        tab_check: "Link prüfen",
        tab_history: "Verlauf",
        tab_about: "Über",
        check_heading: "Füge einen Link zum Prüfen ein",
        check_subtitle:
            "Wir schauen uns die Form des Links an und geben einen einfachen Hinweis.",
        check_label: "Zu prüfender Link",
        check_button: "Prüfen",
        check_privacy_note:
            "Alles passiert in deinem Browser. Links werden nicht an einen Server gesendet.",
        demo_ip_url: "Verdächtigen Link testen",
        demo_safe_url: "Gewöhnlichen Login-Link testen",
        demo_phishy_url: "Wie Phishing aussehenden Link testen",
        result_heading: "Was wir in diesem Link sehen",
        result_subtitle:
            "Wir betrachten nur die Adresse, nicht den Inhalt der Seite.",
        result_overall: "Gesamteindruck",
        result_breakdown: "Linkdetails",
        result_reasons: "Warum wir das denken",
        result_raw_toggle: "Technische Details anzeigen",
        network_heading: "Wie dieser Link durchs Internet reist",
        network_subtitle:
            "Eine einfache Geschichte: Browser → DNS → Server → Antwort.",
        network_dns_title: "1. Namenssuche (DNS)",
        network_http_title: "2. Gespräch mit der Website (HTTP)",
        network_http_request_title: "Anfrage von deinem Browser",
        network_http_response_title: "Antwort der Website",
        network_note:
            "Das ist eine vereinfachte Simulation, kein echter Traffic.",
        history_heading: "Linkverlauf auf diesem Gerät",
        history_subtitle:
            "Nur du siehst ihn. Er wird lokal gespeichert.",
        history_clear: "Verlauf löschen",
        history_empty: "Du hast noch keine Links geprüft.",
        history_col_time: "Zeit",
        history_col_url: "Link",
        history_col_score: "Punktzahl",
        history_col_feel: "Eindruck",
        about_heading: "Wofür PhishGuard gedacht ist",
        about_subtitle:
            "Für Familien, Studierende und Nicht-Techniker, die nur wissen wollen, ob ein Link okay aussieht.",
        about_block_1_title: "Sanfte Hinweise",
        about_block_1_text:
            "Wir wollen nicht erschrecken, sondern nur auf Ungewöhnliches hinweisen.",
        about_block_2_title: "Privatsphäre zuerst",
        about_block_2_text:
            "Alles bleibt auf deinem Gerät. Links werden nicht hochgeladen.",
        about_block_3_title: "Funktioniert mit der Browser-Erweiterung",
        about_block_3_text:
            "Die Erweiterung kann verdächtige Links in Mails und Chats markieren.",
        footer_text:
            "PhishGuard ist ein Lernwerkzeug und garantiert nicht, dass ein Link sicher ist.",
        risk_low: "Wirkt überwiegend okay",
        risk_medium: "Wirkt etwas riskant",
        risk_high: "Wirkt sehr riskant"
    }
};

// language helper
function getPreferredLanguage() {
    const stored = localStorage.getItem("pg_lang");
    if (stored && I18N[stored]) return stored;
    const nav = (navigator.language || "en").split("-")[0];
    return I18N[nav] ? nav : "en";
}

let currentLang = getPreferredLanguage();

function applyTranslations() {
    const dict = I18N[currentLang] || I18N.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
    });
}

/* === Analysis logic (same as before) === */

const SUSPICIOUS_TLDS = [
    ".xyz",
    ".top",
    ".click",
    ".gq",
    ".tk",
    ".ml",
    ".cf",
    ".zip",
    ".review"
];

const PHISHING_KEYWORDS = [
    "login",
    "verify",
    "update",
    "secure",
    "account",
    "banking",
    "confirm",
    "password",
    "signin",
    "paypal",
    "office365",
    "support",
    "reset"
];

function isIpAddress(hostname) {
    const ipv4Regex =
        /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/;
    return ipv4Regex.test(hostname);
}

function getTld(hostname) {
    const parts = hostname.split(".");
    if (parts.length < 2) return "";
    return "." + parts[parts.length - 1];
}

function isPunycode(hostname) {
    return hostname.toLowerCase().includes("xn--");
}

function shannonEntropy(str) {
    const s = str.replace(/[^a-zA-Z0-9]/g, "");
    const len = s.length;
    if (!len) return 0;
    const counts = {};
    for (const ch of s) counts[ch] = (counts[ch] || 0) + 1;
    let entropy = 0;
    for (const ch in counts) {
        const p = counts[ch] / len;
        entropy -= p * Math.log2(p);
    }
    return entropy;
}

function hasHeavyEncoding(str) {
    const matches = str.match(/%[0-9A-Fa-f]{2}/g);
    return matches ? matches.length : 0;
}

function analyzeUrl(urlString) {
    let parsedUrl;
    const factors = [];
    let score = 0;

    try {
        if (!/^https?:\/\//i.test(urlString)) {
            urlString = "http://" + urlString;
        }
        parsedUrl = new URL(urlString);
    } catch {
        return {
            valid: false,
            error: "This does not look like a valid link.",
            score: 0,
            factors: [],
            parsed: null
        };
    }

    const { protocol, hostname, pathname, search, href } = parsedUrl;
    const fullPath = pathname + search;

    if (protocol === "http:") {
        score += 20;
        factors.push(
            "The link uses HTTP, which does not protect your data like HTTPS does."
        );
    }

    if (href.includes("@")) {
        score += 25;
        factors.push(
            "The link contains '@', which can be used to hide the real destination."
        );
    }

    if (isIpAddress(hostname)) {
        score += 25;
        factors.push(
            "The link goes to a number (IP address) instead of a normal website name."
        );
    }

    const tld = getTld(hostname).toLowerCase();
    if (SUSPICIOUS_TLDS.includes(tld)) {
        score += 15;
        factors.push(
            `The end of the address (${tld}) is less common and often used in scams.`
        );
    }

    const subdomainCount = Math.max(hostname.split(".").length - 2, 0);
    if (subdomainCount >= 3) {
        score += 15;
        factors.push(
            "The link has many dots and parts in the name, which may try to imitate other sites."
        );
    } else if (subdomainCount === 2) {
        score += 5;
        factors.push(
            "The link has several parts in the name. That can be fine, but needs attention."
        );
    }

    if (href.length > 100 && href.length <= 200) {
        score += 10;
        factors.push("The link is quite long, which sometimes hides its purpose.");
    } else if (href.length > 200) {
        score += 20;
        factors.push(
            "The link is very long. Very long links are often used to hide where you go."
        );
    }

    const hyphenCount = (hostname.match(/-/g) || []).length;
    if (hyphenCount >= 4) {
        score += 15;
        factors.push(
            "The website name has many dashes, which can be used to copy real brand names."
        );
    } else if (hyphenCount >= 2) {
        score += 7;
        factors.push(
            "The website name has several dashes. That can be okay, but it is worth a second look."
        );
    }

    const lowerPath = fullPath.toLowerCase();
    const matchedKeywords = PHISHING_KEYWORDS.filter((kw) =>
        lowerPath.includes(kw)
    );
    if (matchedKeywords.length > 0) {
        score += 20;
        factors.push(
            `The link mentions words like: ${matchedKeywords.join(
                ", "
            )}. Scammers often use these.`
        );
    }

    if (isPunycode(hostname)) {
        score += 25;
        factors.push(
            "The website name uses special characters that can look like normal letters. This can trick people."
        );
    }

    const hostEntropy = shannonEntropy(hostname);
    const pathEntropy = shannonEntropy(pathname);

    if (hostname.length > 12 && hostEntropy > 3.5) {
        score += 15;
        factors.push(
            "The website name looks very random, which is common for temporary scam sites."
        );
    }
    if (pathname.length > 20 && pathEntropy > 4) {
        score += 10;
        factors.push(
            "The link path looks very random, which may be used to hide what it does."
        );
    }

    const encodedCount = hasHeavyEncoding(fullPath);
    if (encodedCount >= 5 && encodedCount < 15) {
        score += 10;
        factors.push(
            "The link has several encoded characters. This can make it harder to read on purpose."
        );
    } else if (encodedCount >= 15) {
        score += 20;
        factors.push(
            "The link has a lot of encoded characters, which can strongly hide its real path."
        );
    }

    if (score > 100) score = 100;

    let riskLevel;
    if (score <= 30) riskLevel = "Low";
    else if (score <= 70) riskLevel = "Medium";
    else riskLevel = "High";

    return {
        valid: true,
        error: null,
        score,
        riskLevel,
        factors,
        parsed: {
            protocol,
            hostname,
            tld,
            pathname,
            search,
            href,
            subdomainCount,
            length: href.length,
            hyphenCount,
            hostEntropy: hostEntropy.toFixed(2),
            pathEntropy: pathEntropy.toFixed(2),
            encodedCount
        }
    };
}

/* === UI wiring (unchanged mostly) === */

const form = document.getElementById("url-form");
const input = document.getElementById("url-input");
const resultsCard = document.getElementById("results-card");
const riskLabel = document.getElementById("risk-label");
const riskMeterFill = document.getElementById("risk-meter-fill");
const riskScoreNumber = document.getElementById("risk-score-number");
const urlBreakdownList = document.getElementById("url-breakdown");
const riskFactorsList = document.getElementById("risk-factors");
const rawInfoPre = document.getElementById("raw-info");
const chips = document.querySelectorAll(".chip");

// Network elements
const networkCard = document.getElementById("network-card");
const protocolBadge = document.getElementById("protocol-badge");
const encryptionBadge = document.getElementById("encryption-badge");
const ipBadge = document.getElementById("ip-badge");
const dnsStepsList = document.getElementById("dns-steps");
const httpRequestPre = document.getElementById("http-request-pre");
const httpResponsePre = document.getElementById("http-response-pre");

// History elements
const historyEmpty = document.getElementById("history-empty");
const historyWrapper = document.getElementById("history-table-wrapper");
const historyTbody = document.getElementById("history-tbody");
const historyClearBtn = document.getElementById("history-clear");

// Tabs
document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        document.querySelectorAll(".tab-button").forEach((b) =>
            b.classList.remove("tab-active")
        );
        btn.classList.add("tab-active");
        document.querySelectorAll(".tab-panel").forEach((p) => {
            p.classList.remove("tab-panel-active");
        });
        document.getElementById(tab).classList.add("tab-panel-active");
    });
});

// Language select
const langSelect = document.getElementById("lang-select");
langSelect.value = currentLang;
langSelect.addEventListener("change", () => {
    const val = langSelect.value;
    if (I18N[val]) {
        currentLang = val;
        localStorage.setItem("pg_lang", val);
        applyTranslations();
        renderHistory(); // update feeling words too
    }
});

function setRiskLabel(riskLevel, score) {
    riskLabel.className = "risk-label";

    const dict = I18N[currentLang] || I18N.en;
    let textKey = "risk_low";
    if (riskLevel === "Medium") textKey = "risk_medium";
    if (riskLevel === "High") textKey = "risk_high";

    const labelText = dict[textKey] || I18N.en[textKey];

    if (riskLevel === "Low") riskLabel.classList.add("risk-low");
    else if (riskLevel === "Medium") riskLabel.classList.add("risk-medium");
    else riskLabel.classList.add("risk-high");

    riskLabel.textContent = labelText;
    riskScoreNumber.textContent = score;
}

/* === Network simulation – strengthened === */

function fakeIpFromHostname(hostname) {
    let h1 = 0,
        h2 = 0,
        h3 = 0;
    for (let i = 0; i < hostname.length; i++) {
        const code = hostname.charCodeAt(i);
        if (i % 3 === 0) h1 += code;
        else if (i % 3 === 1) h2 += code;
        else h3 += code;
    }
    h1 = (h1 % 223) + 32;
    h2 = h2 % 255;
    h3 = h3 % 255;
    return `${h1}.${h2}.${h3}.42`;
}

function buildDnsTimeline(hostname, ip, isHttps) {
    dnsStepsList.innerHTML = "";

    const steps = [
        {
            title: "Browser reads the link",
            text: `It picks out the website name "${hostname}".`
        },
        {
            title: "Asking DNS for help",
            text: `The browser asks: “What is the IP address for ${hostname}?”`
        },
        {
            title: "DNS answer",
            text: `DNS replies with the IP address ${ip}.`
        },
        {
            title: isHttps ? "Making a safe tunnel (HTTPS)" : "Opening a direct connection",
            text: isHttps
                ? "The browser and website agree on encryption so others cannot easily read the traffic."
                : "The browser connects without encryption, so others on the network could see the data."
        }
    ];

    steps.forEach((s, idx) => {
        const li = document.createElement("li");
        const bullet = document.createElement("span");
        bullet.className = "timeline-bullet" + (idx === 0 ? " active" : "");
        const title = document.createElement("span");
        title.className = "timeline-step-label";
        title.textContent = s.title;
        const text = document.createElement("span");
        text.textContent = s.text;

        li.appendChild(bullet);
        li.appendChild(title);
        li.appendChild(text);
        dnsStepsList.appendChild(li);
    });

    const bullets = dnsStepsList.querySelectorAll(".timeline-bullet");
    bullets.forEach((b, i) => {
        setTimeout(() => {
            bullets.forEach((bb) => bb.classList.remove("active"));
            b.classList.add("active");
        }, 500 * (i + 1));
    });
}

function buildHttpPanels(parsed) {
    if (!parsed) {
        httpRequestPre.textContent = "";
        httpResponsePre.textContent = "";
        protocolBadge.textContent = "";
        encryptionBadge.textContent = "";
        ipBadge.textContent = "";
        dnsStepsList.innerHTML = "";
        return;
    }

    const { protocol, hostname, pathname, search } = parsed;
    const isHttps = protocol === "https:";
    const ip = fakeIpFromHostname(hostname || "example.com");
    const path = (pathname || "/") + (search || "");

    const requestLines = [
        `GET ${path || "/"} HTTP/1.1`,
        `Host: ${hostname}`,
        "User-Agent: FriendlyBrowser/1.0",
        "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        isHttps ? "// Encrypted thanks to HTTPS" : "// Not encrypted (plain HTTP)"
    ];

    const responseLines = [
        "HTTP/1.1 200 OK",
        `Server: example-${hostname || "site"}`,
        "Content-Type: text/html; charset=UTF-8",
        "Content-Length: 18xx",
        isHttps
            ? "Strict-Transport-Security: max-age=31536000"
            : "// No HSTS header present"
    ];

    httpRequestPre.textContent = requestLines.join("\n");
    httpResponsePre.textContent = responseLines.join("\n");

    protocolBadge.textContent = `Protocol: ${protocol ? protocol.replace(":", "") : "http"}`;
    encryptionBadge.textContent = isHttps
        ? "Encryption: HTTPS (safer)"
        : "Encryption: none (HTTP)";
    ipBadge.textContent = `Example IP used: ${ip}`;

    buildDnsTimeline(hostname || "example.com", ip, isHttps);
}

function updateNetworkView(parsed) {
    buildHttpPanels(parsed || null);
    networkCard.classList.remove("hidden");
}

/* === History === */

const HISTORY_KEY = "pg_history";

function loadHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function addToHistory(entry) {
    const history = loadHistory();
    history.unshift(entry);
    if (history.length > 200) history.pop();
    saveHistory(history);
    renderHistory();
}

function renderHistory() {
    const history = loadHistory();
    historyTbody.innerHTML = "";
    if (!history.length) {
        historyEmpty.classList.remove("hidden");
        historyWrapper.classList.add("hidden");
        return;
    }
    historyEmpty.classList.add("hidden");
    historyWrapper.classList.remove("hidden");

    const dict = I18N[currentLang] || I18N.en;

    history.forEach((item) => {
        const tr = document.createElement("tr");
        const tdTime = document.createElement("td");
        const tdUrl = document.createElement("td");
        const tdScore = document.createElement("td");
        const tdFeel = document.createElement("td");

        tdTime.textContent = item.time;
        tdUrl.textContent = item.url;
        tdScore.textContent = item.score;

        tdFeel.textContent =
            item.riskLevel === "Low"
                ? dict.risk_low
                : item.riskLevel === "Medium"
                    ? dict.risk_medium
                    : dict.risk_high;

        tr.appendChild(tdTime);
        tr.appendChild(tdUrl);
        tr.appendChild(tdScore);
        tr.appendChild(tdFeel);
        historyTbody.appendChild(tr);
    });
}

historyClearBtn.addEventListener("click", () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
});

/* === Rendering main result === */

function renderResult(result, originalUrl) {
    if (!result.valid) {
        resultsCard.classList.remove("hidden");
        setRiskLabel("High", 100);
        riskMeterFill.style.width = "100%";
        urlBreakdownList.innerHTML = "";
        riskFactorsList.innerHTML = "";
        const li = document.createElement("li");
        li.textContent = result.error || "This does not look like a valid link.";
        riskFactorsList.appendChild(li);
        rawInfoPre.textContent = "";
        updateNetworkView(null);
        return;
    }

    const { score, riskLevel, factors, parsed } = result;

    setRiskLabel(riskLevel, score);
    riskMeterFill.style.width = `${score}%`;

    urlBreakdownList.innerHTML = "";
    const breakdownItems = [
        `Full link: ${parsed.href}`,
        `Protocol: ${parsed.protocol}`,
        `Website name: ${parsed.hostname}`,
        `End part (TLD): ${parsed.tld || "(none)"}`,
        `Path: ${parsed.pathname || "/"}`,
        `Extra parameters: ${parsed.search || "(none)"}`,
        `Approx. subdomains: ${parsed.subdomainCount}`,
        `Total length: ${parsed.length} characters`,
        `Dashes in name: ${parsed.hyphenCount}`,
        `Name randomness: ${parsed.hostEntropy}`,
        `Path randomness: ${parsed.pathEntropy}`,
        `Encoded characters: ${parsed.encodedCount}`
    ];

    breakdownItems.forEach((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        urlBreakdownList.appendChild(li);
    });

    riskFactorsList.innerHTML = "";
    if (!factors.length) {
        const li = document.createElement("li");
        li.textContent =
            "We did not see strong warning signs, but please still be careful.";
        riskFactorsList.appendChild(li);
    } else {
        factors.forEach((text) => {
            const li = document.createElement("li");
            li.textContent = text;
            riskFactorsList.appendChild(li);
        });
    }

    rawInfoPre.textContent = JSON.stringify(result, null, 2);
    resultsCard.classList.remove("hidden");

    updateNetworkView(parsed);

    const now = new Date();
    const timeStr = now.toLocaleString();
    addToHistory({
        time: timeStr,
        url: originalUrl,
        score,
        riskLevel
    });
}

/* === Events === */

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = input.value.trim();
    if (!url) return;
    const result = analyzeUrl(url);
    renderResult(result, url);
});

chips.forEach((chip) => {
    chip.addEventListener("click", () => {
        const url = chip.getAttribute("data-url");
        input.value = url;
        const result = analyzeUrl(url);
        renderResult(result, url);
    });
});

/* === Init === */

applyTranslations();
renderHistory();
