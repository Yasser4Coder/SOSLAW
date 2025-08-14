// Service data for the ServicesSection
// New structure with multilingual support
export const services = [
  {
    id: "legal-translation",
    title: {
      ar: "الترجمة القانونية",
      fr: "Traduction juridique",
      en: "Legal Translation",
    },
    description: {
      ar: "نُترجم لك القانون بدقة واحتراف.",
      fr: "Nous traduisons le droit avec précision et professionnalisme.",
      en: "We translate law precisely and professionally.",
    },
    details: {
      ar: "في عالم القانون، كل كلمة تصنع فرقًا. نقدم خدمة الترجمة القانونية المتخصصة التي تجمع بين الدقة القانونية، الإلمام بالمصطلحات القضائية والإدارية، والاحتراف في الصياغة بلغات متعددة.",
      fr: "Dans le domaine juridique, chaque mot compte. Nous proposons un service de traduction juridique spécialisé, alliant précision juridique, maîtrise de la terminologie judiciaire et administrative, et rédaction professionnelle dans plusieurs langues.",
      en: "In the legal world every word matters. We provide specialized legal translation combining legal accuracy, mastery of judicial and administrative terminology, and professional drafting in multiple languages.",
    },
    what_we_translate: {
      ar: [
        "العقود والاتفاقيات",
        "الأحكام والقرارات القضائية",
        "الوثائق الرسمية والإدارية",
        "مذكرات الدفاع، الشكاوى، والنصوص القانونية",
        "بحوث وأطروحات قانونية (للطلاب والباحثين)",
      ],
      fr: [
        "Contrats et accords",
        "Jugements et décisions judiciaires",
        "Documents officiels et administratifs",
        "Mémoires de défense, plaintes et textes juridiques",
        "Recherches et thèses juridiques (étudiants/chercheurs)",
      ],
      en: [
        "Contracts and agreements",
        "Judgments and court decisions",
        "Official and administrative documents",
        "Defense memos, complaints and legal texts",
        "Legal research and theses (students & researchers)",
      ],
    },
    features: {
      ar: [
        "دقّة قانونية",
        "مصطلحات قضائية وإدارية متقنة",
        "صياغة احترافية بلغات متعددة",
      ],
      fr: [
        "Précision juridique",
        "Terminologie judiciaire et administrative maîtrisée",
        "Rédaction professionnelle multilingue",
      ],
      en: [
        "Legal precision",
        "Mastered judicial & administrative terminology",
        "Professional multilingual drafting",
      ],
    },
    tags: ["translation", "legal", "documents"],
    availability: {
      ar: "عن بُعد أو حضوريًا",
      fr: "À distance ou sur place",
      en: "Remote or in person",
    },
  },

  {
    id: "legal-documents",
    title: {
      ar: "إعداد النماذج القانونية",
      fr: "Préparation de modèles juridiques",
      en: "Legal Document Drafting",
    },
    description: {
      ar: "نماذج قانونية جاهزة، بصياغة دقيقة وموثوقة.",
      fr: "Modèles juridiques prêts, rédigés avec précision et fiabilité.",
      en: "Ready legal templates, drafted with precision and reliability.",
    },
    details: {
      ar: "نقدم خدمة إعداد النماذج القانونية المصاغة باحتراف وفق القوانين الجزائرية، ومُخصصة حسب احتياجاتك.",
      fr: "Nous fournissons un service de préparation de modèles juridiques rédigés professionnellement conformément aux lois algériennes et adaptés à vos besoins.",
      en: "We offer a service to prepare legal templates professionally drafted according to Algerian laws and customized to your needs.",
    },
    what_we_provide: {
      ar: [
        "عقود مدنية وتجارية (بيع، إيجار، شراكة، عمل، مقاولة...)",
        "وكالات (عامة، خاصة، عدلية...)",
        "إشعارات وتنبيهات قانونية",
        "شكاوى وعرائض إدارية وقضائية",
        "التزامات مكتوبة وتصريحات بالشرف",
        "مذكرات داخلية للمقاولات أو الجمعيات",
        "نماذج تأسيس الجمعيات أو التعاونيات",
        "ملفات إدارية قانونية جاهزة (طلبات، طعون، إلخ)",
      ],
      fr: [
        "Contrats civils et commerciaux (vente, location, partenariat, travail, entreprise...)",
        "Mandats (généraux, spéciaux, judiciaires...)",
        "Notifications et mises en demeure",
        "Plaintes et requêtes administratives et judiciaires",
        "Engagements écrits et déclarations sur l'honneur",
        "Mémos internes pour entreprises ou associations",
        "Modèles de constitution d'associations ou coopératives",
        "Dossiers administratifs juridiques prêts (demandes, recours, etc.)",
      ],
      en: [
        "Civil and commercial contracts (sale, rent, partnership, employment, company...)",
        "Powers of attorney (general, special, judicial...)",
        "Legal notices and warnings",
        "Complaints and administrative/judicial petitions",
        "Written commitments and declarations on honour",
        "Internal memos for companies or associations",
        "Templates for founding associations or cooperatives",
        "Ready legal administrative files (applications, appeals, etc.)",
      ],
    },
    process: {
      ar: [
        "استشارة أولية: تحديد نوع النموذج والغرض منه",
        "إعداد مخصص: بصياغة قانونية احترافية",
        "تسليم الوثيقة: في صيغة Word أو PDF",
        "إمكانية التعديل: حسب الحاجة أو التطورات",
      ],
      fr: [
        "Consultation initiale : déterminer le type de modèle et son objectif",
        "Préparation personnalisée : rédaction juridique professionnelle",
        "Livraison du document : en Word ou PDF",
        "Possibilité de modification : selon le besoin ou l'évolution",
      ],
      en: [
        "Initial consultation: identify model type and purpose",
        "Custom preparation: professional legal drafting",
        "Document delivery: Word or PDF format",
        "Editing option: as needed or upon developments",
      ],
    },
    how_we_deliver: {
      ar: "التسليم بصيغة Word أو PDF، مع إمكانية التعديل لاحقًا حسب الحاجة.",
      fr: "Livraison en Word ou PDF, avec possibilité de modifications ultérieures selon les besoins.",
      en: "Delivery in Word or PDF, with the option to modify later as needed.",
    },
    why_choose: {
      ar: "نماذج مواكبة لأحدث النصوص القانونية، لغة دقيقة وسهلة الفهم، خصوصية مضمونة، تسليم سريع وتنسيق احترافي.",
      fr: "Modèles conformes aux dernières dispositions légales, langage clair et précis, confidentialité assurée, livraison rapide et mise en forme professionnelle.",
      en: "Templates up-to-date with current laws, clear and precise language, guaranteed confidentiality, fast delivery and professional formatting.",
    },
    tags: ["documents", "templates", "legal-forms"],
    availability: {
      ar: "حضورياً أو عن بُعد (المنصة، WhatsApp، Email)",
      fr: "Présentiel ou à distance (plateforme, WhatsApp, Email)",
      en: "In person or remotely (platform, WhatsApp, Email)",
    },
  },

  {
    id: "arbitration-mediation",
    title: {
      ar: "التحكيم والوساطة",
      fr: "Arbitrage et médiation",
      en: "Arbitration & Mediation",
    },
    description: {
      ar: "نُقرب وجهات النظر ونحل النزاعات بحكمة وبسرعة.",
      fr: "Nous rapprochons les positions et résolvons les conflits avec sagesse et efficacité.",
      en: "We bring parties together and resolve disputes wisely and quickly.",
    },
    details: {
      ar: "تقديم خدمة التحكيم والوساطة كبديل سلمي وسريع وفعّال لحل المنازعات مع ضمان السرية والحياد وإمكانية إصدار قرار تحكيمي أو اتفاق ودي.",
      fr: "Fourniture de services d'arbitrage et de médiation comme alternative pacifique, rapide et efficace pour résoudre les différends, garantissant confidentialité et neutralité, pouvant aboutir à une sentence arbitrale ou un accord amiable.",
      en: "Providing arbitration and mediation services as a peaceful, fast and effective alternative to resolve disputes, ensuring confidentiality and neutrality, which may lead to an arbitral award or amicable agreement.",
    },
    difference_between: {
      ar: {
        التحكيم:
          "آلية قانونية شبيهة بالقضاء تصدر فيها حكم تحكيمي ملزم، تُستخدم غالبًا في العقود والنزاعات التجارية.",
        الوساطة:
          "آلية توافقية لحل النزاع بالتفاوض، تُبنى فيها اتفاقات رضائية بين الأطراف.",
      },
      fr: {
        Arbitrage:
          "Mécanisme juridique proche du judiciaire, aboutissant à une décision arbitrale contraignante, souvent utilisé pour les contrats et litiges commerciaux.",
        Médiation:
          "Mécanisme consensuel de résolution par la négociation, aboutissant à un accord amiable entre les parties.",
      },
      en: {
        Arbitration:
          "A legal mechanism similar to courts that issues a binding arbitral award, often used in contracts and commercial disputes.",
        Mediation:
          "A consensual mechanism resolving disputes through negotiation, resulting in a voluntary agreement between parties.",
      },
    },
    cases_we_handle: {
      ar: [
        "نزاعات الشراكة في الشركات أو التعاونيات",
        "خلافات عقارية أو سكنية",
        "نزاعات بين أرباب العمل والموظفين",
        "خلافات بين الجمعيات أو داخلها",
        "مشاكل أسرية أو اجتماعية",
      ],
      fr: [
        "Conflits de partenariat au sein d'entreprises ou coopératives",
        "Litiges immobiliers ou résidentiels",
        "Conflits employeur-employé",
        "Conflits entre associations ou internes",
        "Problèmes familiaux ou sociaux",
      ],
      en: [
        "Partnership disputes in companies or cooperatives",
        "Real estate or residential disputes",
        "Employer-employee disputes",
        "Conflicts within or between associations",
        "Family or social issues",
      ],
    },
    process: {
      ar: [
        "استقبال الطلب من أحد الأطراف",
        "التواصل مع الطرف الثاني للقبول بالوساطة أو التحكيم",
        "جلسات استماع سرية ومحايدة",
        "إعداد محضر اتفاق أو قرار تحكيمي موقّع وموثّق",
      ],
      fr: [
        "Réception de la demande d'une partie",
        "Contact avec la deuxième partie pour accepter la médiation ou l'arbitrage",
        "Séances d'audition confidentielles et impartiales",
        "Rédaction d'un procès-verbal d'accord ou d'une décision arbitrale signée et certifiée",
      ],
      en: [
        "Receive request from one party",
        "Contact the second party to accept mediation or arbitration",
        "Confidential and neutral hearing sessions",
        "Prepare a signed and certified agreement minute or arbitral award",
      ],
    },
    advantages: {
      ar: [
        "تجنب المساطر القضائية المعقدة والمكلفة",
        "الحفاظ على العلاقة بين الأطراف",
        "سرعة وفعالية",
        "سرية تامة",
      ],
      fr: [
        "Éviter les procédures judiciaires longues et coûteuses",
        "Préserver les relations entre parties",
        "Rapidité et efficacité",
        "Confidentialité totale",
      ],
      en: [
        "Avoid lengthy and costly court procedures",
        "Preserve relationships between parties",
        "Speed and effectiveness",
        "Full confidentiality",
      ],
    },
    supervision: {
      ar: "محكمون ومختصون في الوساطة معتمدون ذوو خلفية قانونية وتجربة ميدانية، مع ضمانات الحياد والاستقلالية.",
      fr: "Arbitres et médiateurs certifiés, spécialisés et expérimentés, garantissant neutralité et indépendance.",
      en: "Certified arbitrators and mediators with legal background and field experience, ensuring neutrality and independence.",
    },
    how_to_benefit: {
      ar: "حضوريًا في مقر SOS LAW أو عن بُعد عبر جلسات فيديو مؤمّنة. تُرسل الطلبات عبر البريد الإلكتروني أو WhatsApp.",
      fr: "En présentiel au bureau SOS LAW ou à distance via des sessions vidéo sécurisées. Les demandes sont envoyées par email ou WhatsApp.",
      en: "In person at SOS LAW offices or remotely via secure video sessions. Requests are sent via email or WhatsApp.",
    },
    tags: ["mediation", "arbitration", "dispute-resolution"],
    availability: {
      ar: "حضوريًا أو عن بُعد",
      fr: "Présentiel ou à distance",
      en: "In person or remote",
    },
  },

  {
    id: "legal-content",
    title: {
      ar: "إعداد المحتوى القانوني",
      fr: "Rédaction de contenu juridique",
      en: "Legal Content Preparation",
    },
    description: {
      ar: "محتوى قانوني احترافي يحميك ويبني ثقة عملائك.",
      fr: "Contenu juridique professionnel qui vous protège et renforce la confiance de vos clients.",
      en: "Professional legal content that protects you and builds client trust.",
    },
    details: {
      ar: "نُعد محتوى قانوني مخصّصًا حسب نوع النشاط لضمان الحماية القانونية، تعزيز الثقة، والامتثال للتشريعات الوطنية والدولية.",
      fr: "Nous préparons du contenu juridique adapté à votre activité pour assurer protection légale, renforcement de la confiance et conformité réglementaire.",
      en: "We prepare legal content tailored to your business to ensure legal protection, build trust, and ensure regulatory compliance.",
    },
    for_companies: {
      ar: [
        "النظام الداخلي للمؤسسة",
        "عقود الشغل والمهام",
        "عقود الشراكة، التوريد، الخدمات",
        "وثائق السياسات القانونية الداخلية (السرية، التنازع، استخدام الموارد...)",
      ],
      fr: [
        "Règlement intérieur",
        "Contrats de travail et fiches de poste",
        "Contrats de partenariat, fourniture, services",
        "Documents de politiques internes (confidentialité, conflits, usage des ressources...)",
      ],
      en: [
        "Internal regulations",
        "Employment contracts and job descriptions",
        "Partnership, supply, and service contracts",
        "Internal legal policy documents (confidentiality, conflicts, resource use...)",
      ],
    },
    for_platforms: {
      ar: [
        "الشروط العامة للاستخدام (CGU / Terms of Use)",
        "سياسة الخصوصية وحماية المعطيات الشخصية (Privacy Policy – conforme RGPD إن لزم)",
        "شروط البيع والدفع والتوصيل (CGV)",
        "عقود المستخدم أو العقود الإلكترونية",
      ],
      fr: [
        "Conditions générales d'utilisation (CGU)",
        "Politique de confidentialité et protection des données (conforme RGPD si nécessaire)",
        "Conditions de vente, paiement et livraison (CGV)",
        "Contrats utilisateurs ou contrats électroniques",
      ],
      en: [
        "Terms of Use (CGU)",
        "Privacy policy and personal data protection (GDPR-compliant if needed)",
        "Sales/payment/delivery terms (CGV)",
        "User agreements or electronic contracts",
      ],
    },
    for_ecommerce: {
      ar: [
        "ملفات حماية المستهلك",
        "عقود البائع / المزود",
        "صياغة إعلانات وبيانات قانونية توافق قانون التجارة الإلكترونية",
      ],
      fr: [
        "Dossiers de protection du consommateur",
        "Contrats vendeur/fournisseur",
        "Rédaction d'annonces et mentions légales conformes au e-commerce",
      ],
      en: [
        "Consumer protection files",
        "Vendor/supplier contracts",
        "Drafting ads and legal notices compliant with e-commerce law",
      ],
    },
    benefits: {
      ar: [
        "صياغة مهنية بلغة قانونية واضحة",
        "تكييف المحتوى مع القوانين المحلية والدولية",
        "توجيه استشاري لكل وثيقة",
        "إمكانية التحديث المستمر",
      ],
      fr: [
        "Rédaction professionnelle en langage juridique clair",
        "Adaptation aux lois locales et internationales",
        "Conseils juridiques pour chaque document",
        "Mises à jour continues possibles",
      ],
      en: [
        "Professional drafting in clear legal language",
        "Adaptation to local and international laws",
        "Advisory guidance for each document",
        "Possibility of ongoing updates",
      ],
    },
    target_audience: {
      ar: [
        "الشركات الناشئة",
        "المنصات الإلكترونية",
        "وكالات التسويق",
        "التجار الإلكترونيون",
        "الجمعيات والمنظمات",
      ],
      fr: [
        "Startups",
        "Plateformes en ligne",
        "Agences de marketing",
        "Commerçants en ligne",
        "Associations et ONG",
      ],
      en: [
        "Startups",
        "Online platforms",
        "Marketing agencies",
        "E-commerce merchants",
        "Associations & NGOs",
      ],
    },
    formats: {
      ar: [
        "إعداد الوثائق من الصفر",
        "مراجعة وتحسين محتوى قانوني موجود",
        "باقات شاملة حسب نوع النشاط",
      ],
      fr: [
        "Création de documents depuis zéro",
        "Revue et amélioration de contenu juridique existant",
        "Packs complets selon l'activité",
      ],
      en: [
        "Document drafting from scratch",
        "Review and improvement of existing legal content",
        "Comprehensive packages by activity",
      ],
    },
    tags: ["content", "compliance", "digital-law"],
    availability: {
      ar: "عن بُعد أو حضوريًا",
      fr: "À distance ou sur place",
      en: "Remote or in person",
    },
  },

  {
    id: "legal-audit",
    title: { ar: "التدقيق القانوني", fr: "Audit juridique", en: "Legal Audit" },
    description: {
      ar: "ندقق ملفاتك لنحمي مستقبلك القانوني.",
      fr: "Nous auditons vos dossiers pour protéger votre avenir juridique.",
      en: "We audit your files to protect your legal future.",
    },
    details: {
      ar: "مراجعة مهنية تهدف إلى تحليل وفحص الجوانب القانونية للمؤسسة وتقديم توصيات تصحيحية واستباقية.",
      fr: "Vérification professionnelle visant à analyser et examiner les aspects juridiques de l'entité et proposer des solutions correctives et préventives.",
      en: "Professional review aimed at analyzing and checking the legal aspects of the entity and providing corrective and preventive recommendations.",
    },
    what_we_audit: {
      ar: [
        "الوثائق القانونية: العقود، النظام الأساسي، محاضر الاجتماعات",
        "الرخص والتصاريح",
        "امتثال لقوانين الشغل والعمل",
        "حماية المعطيات الشخصية",
        "التزامات تجاه الضرائب والضمان الاجتماعي",
      ],
      fr: [
        "Documents juridiques : contrats, statuts, procès-verbaux",
        "Licences et autorisations",
        "Conformité au droit du travail",
        "Protection des données personnelles",
        "Obligations fiscales et sécurité sociale",
      ],
      en: [
        "Legal documents: contracts, statutes, meeting minutes",
        "Licenses and permits",
        "Compliance with labor law",
        "Personal data protection",
        "Tax and social security obligations",
      ],
    },
    outputs: {
      ar: [
        "تقرير مفصّل يتضمن نقاط القوة والخلل",
        "درجة الامتثال للتشريعات",
        "توصيات وإجراءات تصحيحية",
        "جلسة استشارية لشرح التقرير",
      ],
      fr: [
        "Rapport détaillé incluant forces et lacunes",
        "Niveau de conformité réglementaire",
        "Recommandations et mesures correctives",
        "Session consultative pour expliquer le rapport",
      ],
      en: [
        "Detailed report including strengths and gaps",
        "Level of legal compliance",
        "Recommendations and corrective measures",
        "Consultation session to explain the report",
      ],
    },
    who_needs: {
      ar: [
        "الشركات الناشئة أو القائمة",
        "الجمعيات والمنظمات غير الربحية",
        "المنصات الرقمية",
        "المقاولون الذاتيون الراغبون في هيكلة نشاطهم قانونيًا",
      ],
      fr: [
        "Startups et entreprises établies",
        "Associations et ONG",
        "Plateformes numériques",
        "Entrepreneurs souhaitant structurer légalement leur activité",
      ],
      en: [
        "Startups and established companies",
        "Associations and NGOs",
        "Digital platforms",
        "Self-employed contractors seeking legal structuring",
      ],
    },
    tags: ["audit", "compliance", "risk"],
    availability: {
      ar: "عن بُعد أو حضوريًا",
      fr: "À distance ou sur place",
      en: "Remote or in person",
    },
  },

  {
    id: "legal-consultation",
    title: {
      ar: "الاستشارة القانونية",
      fr: "Consultation juridique",
      en: "Legal Consultation",
    },
    description: {
      ar: "رأي قانوني موثوق لحل مشاكلك واتخاذ القرار الصحيح.",
      fr: "Avis juridique fiable pour résoudre vos problèmes et prendre la bonne décision.",
      en: "Trusted legal advice to solve your issues and make the right decision.",
    },
    details: {
      ar: "نوفر استشارات قانونية متخصصة لتوضيح الوضع القانوني وتوجيهك نحو الحل الأنسب، مع إمكانية تقديم تقرير مكتوب عند الطلب.",
      fr: "Nous proposons des consultations juridiques spécialisées pour clarifier votre situation et vous orienter vers la meilleure solution, avec rapport écrit sur demande.",
      en: "We provide specialized legal consultations to clarify your legal situation and guide you to the best solution, with written reports available on request.",
    },
    modes: {
      ar: [
        "حضوريًا في مقر SOS LAW",
        "عن بُعد عبر الهاتف، البريد الإلكتروني أو جلسات فيديو",
        "مكتوبة بتقرير استشاري مفصل عند الطلب",
      ],
      fr: [
        "Présentiel au siège de SOS LAW",
        "À distance par téléphone, email ou sessions vidéo",
        "Écrit sous forme de rapport consultatif sur demande",
      ],
      en: [
        "In person at SOS LAW offices",
        "Remote via phone, email or video sessions",
        "Written advisory report on request",
      ],
    },
    deliverables: {
      ar: ["نصيحة شفهية أو مكتوبة", "تقرير استشاري مفصّل (عند الطلب)"],
      fr: [
        "Conseil oral ou écrit",
        "Rapport consultatif détaillé (sur demande)",
      ],
      en: ["Oral or written advice", "Detailed advisory report (on request)"],
    },
    why_choose: {
      ar: "فريق مختص، لغة قانونية واضحة، سرّية تامة، توجيه عملي وقابل للتنفيذ.",
      fr: "Équipe spécialisée, langage juridique clair, confidentialité totale, orientation pratique et applicable.",
      en: "Specialized team, clear legal language, full confidentiality, practical and actionable guidance.",
    },
    tags: ["consulting", "advice", "legal"],
    availability: {
      ar: "حضوريًا أو عن بُعد",
      fr: "Présentiel ou à distance",
      en: "In person or remote",
    },
  },

  {
    id: "nursery-legal-package",
    title: {
      ar: "الباقة القانونية للروضات",
      fr: "Pack juridique pour crèches",
      en: "Nursery Legal Package",
    },
    description: {
      ar: "خدمة قانونية متكاملة ومخصصة لروضات الأطفال والمؤسسات التربوية.",
      fr: "Service juridique complet et personnalisé pour crèches et établissements éducatifs.",
      en: "Comprehensive and tailored legal service for nurseries and educational institutions.",
    },
    details: {
      ar: "باقة متخصصة لضمان مطابقة نشاط الروضة للإطار القانوني، مع استشارات، إعداد مستندات، وتكوين قانوني للمسيرين، ومرافقة في النزاعات.",
      fr: "Pack spécialisé garantissant la conformité juridique d'une crèche, avec conseils, préparation de documents, formation juridique pour gestionnaires et accompagnement en cas de litige.",
      en: "Specialized package to ensure a nursery's legal compliance, including advice, document preparation, legal training for managers, and dispute support.",
    },
    main_services: {
      ar: [
        "مرافقة التأسيس والاعتماد: التوجيه، إعداد ملف الاعتماد، صياغة المراسلات الإدارية",
        "استشارات قانونية مستمرة حسب الطلب: تفسير التعليمات والمراسيم، التعامل مع الزيارات التفتيشية",
        "صياغة ومراجعة الوثائق التربوية: النظام الداخلي، عقود تسجيل الأولياء، عقود العمل",
        "التكوين القانوني للمسيرين: دورات مصغرة أونلاين للحماية القانونية والإجراءات",
        "التمثيل أو التوجيه في حالات النزاع: مع الأولياء، مع الموظفين، مع الهيئات الإدارية",
      ],
      fr: [
        "Accompagnement pour création et accréditation : orientation, préparation du dossier, correspondances administratives",
        "Conseils juridiques continus sur demande : interprétation des textes, gestion des inspections",
        "Rédaction et revue de documents éducatifs : règlement intérieur, contrats d'inscription, contrats de travail",
        "Formation juridique pour gestionnaires : mini-formations en ligne sur protection légale et procédures",
        "Représentation ou orientation en cas de litige : avec parents, employés ou autorités administratives",
      ],
      en: [
        "Support for establishment and accreditation: guidance, accreditation file preparation, administrative correspondence",
        "Ongoing legal advice on demand: interpretation of rules, handling inspections",
        "Drafting and reviewing educational documents: internal regulations, parent registration contracts, employment contracts",
        "Legal training for managers: short online courses on legal protection and procedures",
        "Representation or guidance in disputes: with parents, staff, or administrative bodies",
      ],
    },
    additional_feature: {
      ar: "إمكانية الاشتراك في الباقة القانونية السنوية للروضات",
      fr: "Possibilité d'abonnement au pack juridique annuel pour crèches",
      en: "Option to subscribe to an annual legal package for nurseries",
    },
    delivery_modes: {
      ar: "حضوريًا أو عن بُعد عبر الفيديو والبريد الإلكتروني/WhatsApp",
      fr: "En présentiel ou à distance via vidéo, email/WhatsApp",
      en: "In person or remotely via video, email/WhatsApp",
    },
    tags: ["education", "nursery", "compliance"],
    availability: {
      ar: "عن بُعد أو حضوريًا",
      fr: "À distance ou sur place",
      en: "Remote or in person",
    },
  },

  {
    id: "legal-training",
    title: {
      ar: "التكوين القانوني",
      fr: "Formation juridique",
      en: "Legal Training Program",
    },
    description: {
      ar: "برنامج تكوين وتمكين قانوني متكامل للمسابقات والمهنيين.",
      fr: "Programme de formation juridique complet pour concours et professionnels.",
      en: "Comprehensive legal training and empowerment program for exams and professionals.",
    },
    details: {
      ar: "نقدّم برنامجًا تأهيليًا وتكوينيًا يضم دروسًا نظرية وتطبيقية، تمارين عملية، ومتابعة فردية لتحضير المسابقات والمناصب القانونية.",
      fr: "Nous proposons un programme d'habilitation incluant cours théoriques et pratiques, exercices, et suivi individuel pour préparer concours et carrières juridiques.",
      en: "We offer an empowerment program including theoretical and practical lessons, exercises, and individual follow-up to prepare for exams and legal careers.",
    },
    what_we_offer: {
      ar: [
        "تكوين حضوري بمجموعات صغيرة",
        "تكوين عن بُعد عبر منصات (Zoom...)",
        "دروس نظرية وتطبيقية",
        "تمارين ونماذج امتحانات سابقة",
        "متابعة فردية وتصحيح الأعمال",
        "جلسات تحفيزية ونصائح لإدارة التوتر",
      ],
      fr: [
        "Formation présentielle en petits groupes",
        "Formation à distance via plateformes (Zoom...)",
        "Cours théoriques et pratiques",
        "Exercices et annales",
        "Suivi individuel et correction des travaux",
        "Sessions de motivation et gestion du stress",
      ],
      en: [
        "In-person training in small groups",
        "Remote training via platforms (Zoom...)",
        "Theoretical and practical lessons",
        "Exercises and past exam papers",
        "Individual follow-up and corrections",
        "Motivational sessions and stress management tips",
      ],
    },
    target_audience: {
      ar: [
        "المترشّحون للمسابقات (دكتوراه، قضاء، محاماة...)",
        "المحترفون الراغبون في تطوير معارفهم القانونية",
      ],
      fr: [
        "Candidats aux concours (doctorat, magistrature, avocat...)",
        "Professionnels souhaitant approfondir leurs connaissances juridiques",
      ],
      en: [
        "Exam candidates (PhD, judiciary, bar ...)",
        "Professionals wanting to deepen legal knowledge",
      ],
    },
    formats: {
      ar: "حضوري أو عن بُعد، مع مواد تطبيقية وتصحيح فردي",
      fr: "Présentiel ou à distance, avec supports pratiques et correction individuelle",
      en: "In person or remote, with practical materials and individual correction",
    },
    tags: ["training", "education", "law"],
    availability: {
      ar: "حضوريًا أو عن بُعد",
      fr: "Présentiel ou à distance",
      en: "In person or remote",
    },
  },

  {
    id: "comprehensive-business-support",
    title: {
      ar: "مرافقة شاملة للمؤسسات الاقتصادية والناشئة",
      fr: "Accompagnement complet des entreprises et startups",
      en: "Comprehensive Business & Startup Support",
    },
    description: {
      ar: "من الفكرة إلى النجاح - نُرافقكم بثقة واستقرار.",
      fr: "De l'idée au succès - nous vous accompagnons avec confiance et stabilité.",
      en: "From idea to success - we accompany you with confidence and stability.",
    },
    details: {
      ar: "في بيئة أعمال تتغيّر بسرعة، تحتاج المؤسسات الناشئة والصغيرة إلى أكثر من مجرد فكرة جيدة. تحتاج إلى توجيه قانوني، إداري واستراتيجي يُساعدها على النمو بثقة واستقرار.",
      fr: "Dans un environnement commercial en évolution rapide, les startups et PME ont besoin de plus qu'une bonne idée. Elles ont besoin d'un accompagnement juridique, administratif et stratégique pour croître avec confiance et stabilité.",
      en: "In a rapidly changing business environment, startups and small businesses need more than just a good idea. They need legal, administrative and strategic guidance to help them grow with confidence and stability.",
    },
    what_we_provide: {
      ar: [
        "التأسيس القانوني للشركة (اختيار الشكل القانوني، صياغة العقود الأساسية...)",
        "إعداد ومراجعة العقود التجارية والإدارية",
        "التوجيه القانوني خلال مراحل النمو والتوسع",
        "المساعدة في الحصول على التمويل أو تسجيل العلامات التجارية",
        "الاستشارة في التعامل مع الإدارات والهيئات الرسمية",
      ],
      fr: [
        "Création juridique de l'entreprise (choix de la forme juridique, rédaction des contrats de base...)",
        "Préparation et révision des contrats commerciaux et administratifs",
        "Accompagnement juridique pendant les phases de croissance et d'expansion",
        "Aide pour obtenir du financement ou enregistrer des marques",
        "Conseils pour traiter avec les administrations et organismes officiels",
      ],
      en: [
        "Legal company formation (choosing legal structure, drafting basic contracts...)",
        "Preparation and review of commercial and administrative contracts",
        "Legal guidance during growth and expansion phases",
        "Assistance in obtaining funding or registering trademarks",
        "Consultation on dealing with administrations and official bodies",
      ],
    },
    target_audience: {
      ar: [
        "روّاد الأعمال وأصحاب المشاريع الناشئة",
        "المؤسسات الصغيرة والمتوسطة",
        "حاملي الأفكار والمبادرات الاقتصادية",
        "المستثمرين المحليين والدوليين",
      ],
      fr: [
        "Entrepreneurs et porteurs de projets naissants",
        "Petites et moyennes entreprises",
        "Porteurs d'idées et d'initiatives économiques",
        "Investisseurs locaux et internationaux",
      ],
      en: [
        "Entrepreneurs and startup project owners",
        "Small and medium enterprises",
        "Idea holders and economic initiatives",
        "Local and international investors",
      ],
    },
    why_choose: {
      ar: "خبرة قانونية وتجارية متكاملة، فهم عميق لمنظومة ريادة الأعمال في الجزائر، دعم مُستمر ومُخصّص حسب طبيعة النشاط، سرية تامة وحماية كاملة لأعمالك الفكرية، نتائج ملموسة تثبت جودة خدماتنا.",
      fr: "Expertise juridique et commerciale intégrée, compréhension approfondie de l'écosystème entrepreneurial en Algérie, accompagnement continu et personnalisé selon la nature de l'activité, confidentialité totale et protection complète de vos travaux intellectuels, résultats tangibles prouvant la qualité de nos services.",
      en: "Integrated legal and commercial expertise, deep understanding of the entrepreneurial ecosystem in Algeria, continuous and customized support according to the nature of the activity, total confidentiality and complete protection of your intellectual work, tangible results proving the quality of our services.",
    },
    tags: ["business", "startup", "corporate"],
    availability: {
      ar: "حضوريًا أو عن بُعد",
      fr: "Présentiel ou à distance",
      en: "In person or remote",
    },
  },

  {
    id: "elite-legal-package-students",
    title: {
      ar: "بــاقــة الـنـخـبــة الـقـانـونـيـة للطلبة",
      fr: "Pack Élite Juridique pour Étudiants",
      en: "Elite Legal Package for Students",
    },
    description: {
      ar: "رفيقك الأكاديمي والمهني - من لحظة انطلاق بحثك حتى يوم دفاعك.",
      fr: "Votre compagnon académique et professionnel - du début de votre recherche jusqu'à la défense.",
      en: "Your academic and professional companion - from the start of your research until defense day.",
    },
    details: {
      ar: "هل تشعر أحيانًا أن عبء الدراسة والبحوث القانونية يثقل كاهلك؟ هل تخشى من اختيار موضوع خاطئ، أو تائه بين المصطلحات والقوانين؟ مع 'بــاقة النخبة القانونية للطلبة'، أنت لست وحدك!",
      fr: "Vous sentez-vous parfois accablé par le fardeau des études et de la recherche juridique ? Craignez-vous de choisir un mauvais sujet ou d'être perdu entre terminologie et lois ? Avec le 'Pack Élite Juridique pour Étudiants', vous n'êtes pas seul !",
      en: "Do you sometimes feel burdened by the weight of legal studies and research? Are you afraid of choosing the wrong topic or getting lost between terminology and laws? With the 'Elite Legal Package for Students', you are not alone!",
    },
    what_we_offer: {
      ar: [
        "اختيار موضوع بحث يناسب طموحاتك، مع توفير مصادر قانونية رصينة",
        "ترجمة أكاديمية متقنة، بدقة في المصطلحات القانونية",
        "دروس دعم مخصصة: حصص فردية وجماعية",
        "تدريب عملي على التحرير القانوني",
        "مرافقة شاملة لمشروع التخرج",
        "دعم خاص للطلبة المغتربين",
        "تصحيح وتنسيق نصوصك الأكاديمية",
        "ورش عمل تفاعلية تشمل التحرير القانوني والصياغة",
      ],
      fr: [
        "Sélection d'un sujet de recherche adapté à vos ambitions, avec sources juridiques fiables",
        "Traduction académique soignée, précision terminologique juridique",
        "Cours de soutien personnalisés : séances individuelles et collectives",
        "Formation pratique à la rédaction juridique",
        "Accompagnement complet du projet de fin d'études",
        "Soutien spécial pour étudiants expatriés",
        "Correction et formatage de vos textes académiques",
        "Ateliers interactifs incluant rédaction juridique et formulation",
      ],
      en: [
        "Selection of research topic matching your ambitions, with reliable legal sources",
        "Careful academic translation, precise legal terminology",
        "Personalized support courses: individual and group sessions",
        "Practical training in legal drafting",
        "Comprehensive support for graduation project",
        "Special support for expatriate students",
        "Correction and formatting of your academic texts",
        "Interactive workshops including legal drafting and formulation",
      ],
    },
    target_audience: {
      ar: [
        "طلبة الليسانس الذين يريدون بناء أساس قوي",
        "طلبة الماستر الباحثين عن التفوق في بحوثهم وأطروحاتهم",
        "طلبة الدكتوراه الذين يسعون إلى تميز أكاديمي رفيع",
        "الخريجون المقبلون على مسابقات المحاماة، القضاء، والماستر المهنية",
      ],
      fr: [
        "Étudiants en licence souhaitant construire une base solide",
        "Étudiants en master cherchant l'excellence dans leurs recherches et mémoires",
        "Étudiants en doctorat visant l'excellence académique",
        "Diplômés se préparant aux concours d'avocat, magistrature et master professionnel",
      ],
      en: [
        "Bachelor students wanting to build a strong foundation",
        "Master students seeking excellence in their research and theses",
        "PhD students aiming for high academic distinction",
        "Graduates preparing for bar, judiciary, and professional master competitions",
      ],
    },
    why_choose: {
      ar: "فريق من خبراء القانون والأساتذة المتمرسين، دعم شخصي ومرن يتناسب مع جدولك الدراسي، أسعار مميزة تناسب ميزانية الطلبة، سرية تامة وحماية كاملة لأعمالك الفكرية، نتائج ملموسة تثبت جودة خدماتنا.",
      fr: "Équipe d'experts juridiques et professeurs expérimentés, soutien personnel et flexible adapté à votre emploi du temps, tarifs avantageux adaptés au budget étudiant, confidentialité totale et protection complète de vos travaux intellectuels, résultats tangibles prouvant la qualité de nos services.",
      en: "Experienced legal and academic team combining scientific and practical expertise in law, deep understanding of the specificities of the academic and legal context in Algeria and the Arab world, strict commitment to confidentiality and protection of intellectual property rights, personal and continuous support meeting your needs quickly and professionally, flexible working methods adapted to your intensive academic schedule, tangible results strengthening your scientific position.",
    },
    tags: ["students", "academic", "education"],
    availability: {
      ar: "حضوريًا أو عن بُعد",
      fr: "Présentiel ou à distance",
      en: "In person or remote",
    },
  },

  {
    id: "academic-leadership-support",
    title: {
      ar: "الريادة الأكاديمية – دعم الأساتذة الباحثين والمحاضرين",
      fr: "Leadership Académique – Soutien aux Professeurs-Chercheurs",
      en: "Academic Leadership – Support for Professors & Lecturers",
    },
    description: {
      ar: "ارفع مستوى أبحاثك، وارفع صوتك العلمي، وكن الأستاذ الملهم الذي يصنع الفرق.",
      fr: "Élevez le niveau de vos recherches, élevez votre voix scientifique, soyez le professeur inspirant qui fait la différence.",
      en: "Raise the level of your research, raise your scientific voice, be the inspiring professor who makes a difference.",
    },
    details: {
      ar: "في عالم القانون، لا يكفي أن تكون خبيرًا فقط، بل عليك أن تبرز وتترك بصمة بحثية وتعليمية قوية. مع خدمة 'الريادة الأكاديمية'، نقدم لك الدعم المتكامل الذي يرفع من جودة أبحاثك، يعزز من تأثيرك العلمي، ويرفد محاضراتك بأحدث الوسائل التعليمية.",
      fr: "Dans le monde du droit, il ne suffit pas d'être expert, il faut aussi se démarquer et laisser une empreinte de recherche et d'enseignement forte. Avec le service 'Leadership Académique', nous vous offrons un soutien intégré qui élève la qualité de vos recherches, renforce votre impact scientifique et enrichit vos cours avec les derniers outils pédagogiques.",
      en: "In the world of law, it's not enough to just be an expert, you must also stand out and leave a strong research and teaching mark. With the 'Academic Leadership' service, we provide you with integrated support that elevates the quality of your research, strengthens your scientific impact, and enriches your lectures with the latest educational tools.",
    },
    what_we_offer: {
      ar: [
        "تدقيق أكاديمي ولغوي دقيق لأبحاثك ومقالاتك العلمية",
        "ترجمة قانونية محترفة تضمن وصول أفكارك لمجتمع دولي بأفضل صورة",
        "إعداد مواد تعليمية وتدريبية مخصصة تضفي حيوية على محاضراتك ودروسك",
        "ورشات تطوير مهارات التدريس الجامعي والمنهجيات البحثية",
        "دعم احترافي في إعداد مقترحات المشاريع البحثية والمنح العلمية",
        "استشارات قانونية مهنية حول النشر، حقوق الملكية الفكرية، وتنظيم العمل الأكاديمي",
        "تأطير شامل لتنظيم الملتقيات، الأيام الدراسية، والندوات البيداغوجية",
      ],
      fr: [
        "Révision académique et linguistique rigoureuse de vos recherches et articles",
        "Traduction juridique professionnelle assurant la diffusion internationale de vos idées",
        "Préparation de supports pédagogiques personnalisés dynamisant vos cours",
        "Ateliers de développement des compétences d'enseignement universitaire et méthodologies",
        "Soutien professionnel pour préparer des propositions de projets de recherche et bourses",
        "Conseils juridiques professionnels sur publication, propriété intellectuelle, organisation académique",
        "Encadrement complet pour organiser colloques, journées d'études et séminaires pédagogiques",
      ],
      en: [
        "Rigorous academic and linguistic review of your research and articles",
        "Professional legal translation ensuring international dissemination of your ideas",
        "Preparation of personalized educational materials enlivening your courses",
        "Workshops on developing university teaching skills and research methodologies",
        "Professional support in preparing research project proposals and scholarships",
        "Professional legal advice on publishing, intellectual property, academic organization",
        "Complete supervision for organizing conferences, study days and pedagogical seminars",
      ],
    },
    why_choose: {
      ar: "فريق قانوني وأكاديمي متمرس يجمع بين الخبرة العلمية والعملية في القانون، فهم عميق لخصوصيات السياق الأكاديمي والقانوني في الجزائر والعالم العربي، التزام صارم بالسرية وحماية حقوق الملكية الفكرية، دعم شخصي ومتواصل يلبي احتياجاتكم بسرعة واحترافية، أساليب عمل مرنة تناسب جدولكم الأكاديمي المكثف، نتائج ملموسة تعزز مكانتكم العلمية.",
      fr: "Équipe juridique et académique expérimentée combinant expertise scientifique et pratique en droit, compréhension approfondie des spécificités du contexte académique et juridique en Algérie et dans le monde arabe, engagement strict à la confidentialité et protection des droits de propriété intellectuelle, soutien personnel et continu répondant à vos besoins rapidement et professionnellement, méthodes de travail flexibles adaptées à votre emploi du temps académique intensif, résultats tangibles renforçant votre position scientifique.",
      en: "Experienced legal and academic team combining scientific and practical expertise in law, deep understanding of the specificities of the academic and legal context in Algeria and the Arab world, strict commitment to confidentiality and protection of intellectual property rights, personal and continuous support meeting your needs quickly and professionally, flexible working methods adapted to your intensive academic schedule, tangible results strengthening your scientific position.",
    },
    tags: ["academic", "research", "professors"],
    availability: {
      ar: "حضوريًا أو عن بُعد",
      fr: "Présentiel ou à distance",
      en: "In person or remote",
    },
  },
];
