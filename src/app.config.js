'use strict'
module.exports = /*@ngInject*/ function ($httpProvider, AppConfig, $translateProvider) {
  

  // $translateProvider.translations('en', {
  //   'javascript': {
  //     'loaders': {
  //       analyse_website: 'Site analysis',
  //       get_logo: 'Logo recovery',
  //       get_images: 'Images recovery',
  //       get_text: 'Text recovery'
  //     },
  //     'alerts':{
  //       nice_logo: 'Wow! Nice logo',
  //       get_content: 'Content recovery',
  //       logo_choice: 'Logo choice',
  //       typo_choice: 'Font choice',
  //       colors_choice: 'Site colors choice',
  //       hero_choice: 'Image background choice',
  //       pages_creation: 'Pages creation',
  //       menu_creation: 'Menu creation',
  //       layout_creation: 'Layout creation',
  //       url_creation: 'URL creation',
  //       site_optimization: 'Site optimisation',
  //       email_already_use: 'This email is already in use',
  //       site_being_build: 'Your site is being created. Are you sure you want to leave?',
  //       nice_hero: 'Wow! Nice background image',
  //       image_bank_limit: "The image library has reached its limit",
  //       image_too_small: " Orson Lift detected that your image is not of good quality. We propose that you import one or choose from our image library.",
  //       bigger_width_than: "For a quality issue, download an image with a width greater than",
  //       bigger_width_than_format: 'px in JPG or PNG format'
  //     }
  //   },
  //   'site': {
  //     'actions':{
  //       'select': 'Select',
  //       'modify': 'Change',
  //       'create_logo': 'Create a logo',
  //       'continue': 'Continue',
  //       'cancel': 'Cancel',
  //       'validate': 'Validate',
  //       'suprise_me': 'Surprise me !',
  //       'reinit': 'Re-initialize',
  //       'change_my_image': 'Change my image',
  //       'create_my_site': 'Create my site',
  //       'custom_my_site_now': 'Customize my site now',
  //       'create_site_orson':'Create your site on Orson.io',
  //       'site': 'http://en.orson.io',
  //       'previous': 'Previous',
  //       'next': 'Next',
  //       'connect': 'Log in'
  //     },

  //     'labels': {
  //       'logo_colors': 'Logo colors',
  //       'typography': 'Typography',
  //       'email': 'Email',
  //       'wrong_email':"Your email is not valid"
  //     },
  //     'home': {
  //       'baseline': 'Orson Lift will allow to you to create a website on Orson.io by recovering automatically',
  //       'baseline2': 'your website content from a website or from a Facebook Page',
  //       'website': 'Website',
  //       'connect_url': 'https://secure.orson.io/en/sessions/new'
  //     },
  //     'website': {
  //       'label': "Type your website url to recover",
  //       'placeholder': 'http://www.mywebsite.com',
  //       'get_back_content': 'Orson Lift is recovering the content of',
  //       'error_msg': "Your url is not valid. Check that your url start by 'http:// ou https://'"
  //     },
  //     'facebook': {
  //       'title': 'Select the Facebook page to transform'
  //     },
  //     'toolarge': {
  //       'toolarge': 'Oops ! Your website is too large ',
  //       'too_much_pages': "Orson Lift can't recover the whole content of your website. It is too big, more than 100 pages. Contact us for more informations support@orson.io",
  //       'start_orson': 'You can start now to create a website on Orson.io'
  //     },
  //     'soon': {
  //       'soon_available': 'Soon available',
  //       'soon_available_help': "Orson Lift will be soon available with other website builders."
  //     },
  //     'logo': {
  //       'validate_logo': 'Validate your logo',
  //       'retrieve_logo': 'We have recovered your logo from your',
  //       'facebook_page': 'Facebook page.',
  //       'website': 'website.',
  //       'can_change_anytime': "You can change your logo at any moment in the editor Orson.io",
  //       'choose_logo': 'Choose a logo',
  //       'import_logo': "Import a logo from your computer or create one. You can change your logo at any moment in the editor Orson.io"
  //     },
  //     'logo_creator': {
  //       'create_your_logo': 'Create your logo',
  //       'create_your_logo_help': "Be unique by creating your logo. Don't worry, you can change it any time you want.",
  //       'facebook_page': 'Facebook page.',
  //       'website': 'website.',
  //       'can_change_anytime': "you can change your logo at any moment in the editor Orson.io",
  //       'choose_logo': 'Choose a logo',
  //       'import_logo': "Import a logo from your computer or create one. You can change your logo at any moment in the editor Orson.io"
  //     },
  //     'typo': {
  //       'choose_your_typo': 'Select your fonts',
  //       'choose_your_typo_help': "Give an identity to your website thanks to nice fonts. Our designers have paired beautiful matching fonts to make it easier for you to choose!",
  //       'title': 'Title'
  //     },

  //     'colors': {
  //       'choose_your_colors': 'Select your colors',
  //       'choose_your_colors_help': "For better readibility, stay minimalist and use a touch of color only for what matters.",
  //       'button': 'Button',
  //       'title': 'Title',
  //       'text': 'Text',
  //       'background': 'Background'
  //     },
  //     'hero': {
  //       'choose_your_hero': 'Select your background image',
  //       'choose_your_hero_help': "Finally, choose the image that will set the tone on your site. We have selected for you high quality royalty-free images",
  //       'photo_by': 'Photo by'
  //     },
  //     'email': {
  //       'add': 'At one stage of happiness!',
  //       'add_help': "Sign up with your email to finalize the creation of your website",
  //       'terms_continue': 'By continuing, you accept the ',
  //       'orson_lift_terms': 'terms of Orson Lift '
  //     },
  //     'loader': {
  //       'site_ready_soon': 'Your website is almost ready ',
  //       'congratulations': "Congratulations! ",
  //       'site_ready_customize': 'Your site is ready to be finalized on',
  //       'custom': 'Customize your site to your image ',
  //       'custom_help': 'Modify your images, your texts according to your taste in a few clicks.',
  //       'domain_name': 'Get a professional address',
  //       'domain_name_help': 'Book a professional domain name for free or simply redirect your domain name to Orson.io.',
  //       'seo': 'Boost your presence on Google',
  //       'seo_help': 'Publish your site directly online to be visible to millions of visitors.',
  //       'ready_email_notification':"Wait for it! Your website is being built!",
  //       'ready_email_notification_help':"Check your email inbox. We will inform you as soon as your website will be created within 1 hour."

  //     }


  //   }
  // });


  // $translateProvider.translations('fr', {
  //   'javascript': {
  //     'loaders': {
  //       analyse_website: 'Analyse du site',
  //       get_logo: 'Récupération du logo du site',
  //       get_images: 'Récupération de vos images',
  //       get_text: 'Récupération du texte'
  //     },
  //     'alerts':{
  //       nice_logo: 'Wow! Super logo',
  //       get_content: 'Aspiration du contenu',
  //       logo_choice: 'Choix du logo',
  //       typo_choice: 'Choix des typographies',
  //       colors_choice: 'Choix des couleurs du site',
  //       hero_choice: 'Choix de l’image de fond',
  //       pages_creation: 'Création des pages',
  //       menu_creation: 'Création du menu',
  //       layout_creation: 'Mise en place des éléments',
  //       url_creation: 'Création de l’adresse',
  //       site_optimization: 'Optimisation du site',
  //       email_already_use: 'Cet email est déjà utilisé',
  //       site_being_build: 'Votre site est en cours de création. Etes vous sur de vouloir partir?',
  //       nice_hero: 'Wow! Belle image de fond',
  //       image_bank_limit: "La bibliothèque d'images a atteinds sa limite",
  //       image_too_small: " Orson Lift a détecté que votre image n’était pas de bonne qualité. Nous vous conseillons d’en importer une ou de choisir parmi notre bibliothèque d’images.",
  //       bigger_width_than: "Pour une question de qualité, téléchargez une image avec une largeur supérieur à ",
  //       bigger_width_than_format: 'px au format JPG ou PNG'
  //     }
  //   },
  //   'site': {
  //     'actions':{
  //       'select': 'Sélectionner',
  //       'modify': 'Modifier',
  //       'create_logo': 'Créer un logo',
  //       'continue': 'Continuer',
  //       'cancel': 'Annuler',
  //       'validate': 'Valider',
  //       'suprise_me': 'Surprenez moi !',
  //       'reinit': 'Réinitialiser',
  //       'change_my_image': 'Modifier mon image',
  //       'create_my_site': 'Créer mon site internet',
  //       'custom_my_site_now': 'Personnaliser mon site maintenant',
  //       'create_site_orson':'Créer votre site sur Orson.io',
  //       'site': 'http://fr.orson.io',
  //       'previous': 'Précédant',
  //       'next': 'Suivant',
  //       'connect': 'Se connecter'
  //     },

  //     'labels': {
  //       'logo_colors': 'Couleurs du logo',
  //       'typography': 'Typographie',
  //       'email': 'Adresse Email',
  //       'wrong_email':"Votre adresse email n'est pas valide."
  //     },
  //     'home': {
  //       'baseline': 'Orson Lift vous permet de créer un site Orson.io en récupérant automatiquement',
  //       'baseline2': 'les contenus de votre site internet ou d’une Facebook Page',
  //       'website': 'Site internet',
  //       'connect_url': 'https://secure.orson.io/fr/sessions/new'
  //     },
  //     'website': {
  //       'label': "Entrez l'adresse de votre site à récupérer",
  //       'placeholder': 'http://www.monsite.com',
  //       'get_back_content': 'Orson Lift récupère le contenu de',
  //       'error_msg': "Votre adresse n'est pas valide. Vérifiez qu'elle commence par 'http:// ou https://'"
  //     },
  //     'facebook': {
  //       'title': 'Sélectionnez la page facebook à récupérer'
  //     },
  //     'toolarge': {
  //       'toolarge': 'Oops ! Votre site est trop large. ',
  //       'too_much_pages': ' Orson Lift ne parvient pas à récupérer le contenu de votre site, celui-ci contient plus de 100 pages.',
  //       'start_orson': 'Vous pouvez commencer dès maintenant à créer votre site sur Orson.io',
  //       'toolarge': 'Oops ! Votre site est trop large. '
  //     },
  //     'soon': {
  //       'soon_available': 'Bientôt disponible! ',
  //       'soon_available_help': "Orson Lift sera bientôt disponible avec d'autres outils de création de site."
  //     },
  //     'logo': {
  //       'validate_logo': 'Validez votre logo',
  //       'retrieve_logo': 'Nous avons récupéré votre logo depuis votre',
  //       'facebook_page': 'page Facebook.',
  //       'website': 'site internet.',
  //       'can_change_anytime': "Vous pouvez changer votre logo ci-dessous et à tout moment dans l'application Orson.io.",
  //       'choose_logo': 'Choisissez un logo',
  //       'import_logo': "Importez un logo depuis votre ordinateur ou créez en un. Vous pouvez changer votre logo ci-dessous et à tout moment dans l'application Orson.io."
  //     },
  //     'logo_creator': {
  //       'create_your_logo': 'Créez votre logo',
  //       'create_your_logo_help': "Soyez unique en créant votre logo. Ne vous inquiétez pas, vous pourrez le modifier à tout moment.",
  //       'facebook_page': 'page Facebook.',
  //       'website': 'site internet.',
  //       'can_change_anytime': "Vous pouvez changer votre logo ci-dessous et à tout moment dans l'application Orson.io.",
  //       'choose_logo': 'Choisissez un logo',
  //       'import_logo': "Importez un logo depuis votre ordinateur ou créez en un. Vous pouvez changer votre logo ci-dessous et à tout moment dans l'application Orson.io."
  //     },
  //     'typo': {
  //       'choose_your_typo': 'Choisissez votre typographie',
  //       'choose_your_typo_help': "Donner une identité à votre site grâce à une belle Typographie. Nos designers ont sélectionné pour vous les plus belles associations de typographie !",
  //       'title': 'Titre'
  //     },

  //     'colors': {
  //       'choose_your_colors': 'Choisissez vos couleurs',
  //       'choose_your_colors_help': "Pour un confort de lecture de votre site web, restez sobre, et utilisez une touche de couleur uniquement pour ce qui a de l’importance.",
  //       'button': 'Bouton',
  //       'title': 'Titre',
  //       'text': 'Texte',
  //       'background': 'Fond'
  //     },
  //     'hero': {
  //       'choose_your_hero': 'Choisissez votre image de fond',
  //       'choose_your_hero_help': "Enfin, choisissez l’image qui donnera le ton sur ce que contient votre site. Nous avons sélectionné pour vous des images libres de droits de grande qualité ",
  //       'photo_by': 'Photo par'
  //     },
  //     'email': {
  //       'add': 'A une étape du bonheur !',
  //       'add_help': "Inscrivez-vous avec votre email pour finaliser la création de votre site internet ",
  //       'terms_continue': 'En continuant, vous acceptez les ',
  //       'orson_lift_terms': 'Conditions Générales de Vente Orson Lift '
  //     },
  //     'loader': {
  //       'site_ready_soon': 'Votre site est bientôt prêt. ',
  //       'congratulations': "Félicitations ! ",
  //       'site_ready_customize': 'Votre site est prêt à être finalisé sur ',
  //       'custom': 'Personnalisez votre site à votre image ',
  //       'custom_help': 'Modifiez vos images, vos textes selon vos goûts en quelques clics.',
  //       'domain_name': 'Obtenez une adresse professionnelle',
  //       'domain_name_help': 'Réservez un nom de domaine professionnel gratuitement ou redirigez simplement votre nom de domaine chez Orson.io.',
  //       'seo': 'Boostez votre présence sur Google',
  //       'seo_help': 'Publiez votre site directement en ligne pour être visible auprès de millions de visiteurs.',
  //       'ready_email_notification':"Votre site en cours de finalisation!",
  //       'ready_email_notification_help':"Surveillez votre email! Nous vous informerons dès que votre nouveau site sera créé dans un délai d'1 heure maximum."

  //     }


  //   }
  // });
  
  // var userLang = navigator.language || navigator.userLanguage; 
  // var lang = 'en';
  // if (userLang == 'fr-FR') { lang = 'fr'}

  // $translateProvider.preferredLanguage(lang);



};
