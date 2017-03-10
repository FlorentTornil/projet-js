// Evenement déclenché lorsque le DOM a fini de charger, qui va appeller notre fonction setup()
document.addEventListener("DOMContentLoaded", setup);

var body;				// variable correspondant au body, servant à simplifier la lecture du code
var terrain; 			// variable correspondant au terrain de jeu (div), servant à simplifier la lecture du code
var fond; 				// variable correspondant au fond (img), servant à simplifier la lecture du code
var joueur; 			// variable correspondant au joueur (img), servant à simplifier la lecture du code
var ballon; 			// variable correspondant au ballon (img), servant à simplifier la lecture du code
var scores; 			// variable correspondant aux 5 meilleurs scores (div), servant à simplifier la lecture du code
var regles; 			// variable correspondant aux regles (div), servant à simplifier la lecture du code
var boutonCacherRegles;	// variable correspondant au bouton permettant de cacher les règles du jeu (input), servant à simplifier la lecture du code
var information; 		// variable correspondant au score actuel du joueur (div), servant a simplifier la lecture du code
var tricheur;			// variable correspondant à la zone où on affiche un message en cas d'utilisation de la fonction triche (div)
var son;				// variable correspondant à la balise son du html (audio)

var afficherEcranAccueil = true;	// booleen vrai ssi il faut afficher l'écran d'accueil dans le setup au lieu de l'image de fond du terrain
var afficherEcranPerdu = false;		// boolean vrai ssi il faut afficher l'écran gameOver dans le setup au lieu de l'image de fond du terrain

var perdUneVie = true; 		// vrai ssi le joueur perd une vie lorsque le ballon s'arrete, permet d'éviter de perdre une vie en marquant un panier

var enCoursDeTir = false; 	// vrai ssi le joueur est en train de tirer (touche enfoncée)
var peutBouger = true; 		// vrai ssi le joueur est en train de tirer (touche enfoncée)

var chaineTriche = ""; 		// variable contenant les caractères que nous saississons au clavier
var aTricher; 			// au début du jeu, le joueur n'a pas triché

var lancer;					// variable correspondant à l'intervalle de déplacement du ballon 

// les anciennes positions du ballon, qui vont servir au calcul de vecteurs pour les rebonds
var oldX;
var oldY;

// empecher le ballon de s'enfermer dans la planche
var rebondPlanche = true;


// fonction d'initialisation du jeu
function setup() {
 
    // on initialise les variables globales body et terrain
	body = document.getElementById('body')
    terrain = document.getElementById('terrain');

	// au cas où ce n'est pas la première fois que la fonction est appellée, on "nettoie" le terrain, en supprimant tout ses enfants dans le DOM
	var nbChildren = terrain.children.length //on compte les enfants de la zone
	for(var i=0; i < nbChildren; i++) {
		terrain.removeChild(terrain.lastChild); //on supprime les enfants de la zone
	}

    // on enleve le margin par defaut du body qui décale légèrement le jeu vers la droite et le bas
    body.style.margin = "0px";

    //
    //  Fond
    //
	
	// l'image de fond alterne entre le terrain de jeu, un ecrand 'accueil et un ecran de fin, selon les variables globales
	var imageFond  = document.createElement("img");
	if(afficherEcranAccueil) {
		imageFond.src = "./index.png";
	}
	else if(afficherEcranPerdu) {
		imageFond.src = "./game.png";
	}
	else {
		imageFond.src = "./fond.jpg";
	}

    imageFond.id = "fond";
    terrain.appendChild(imageFond);

    fond = document.getElementById('fond');

    // on redimensionne le fond du terrain de jeu
    fond.width = 2 * window.innerWidth / 3;
    fond.height = 2 * window.innerHeight / 3;

    // on positionne le plateau en absolu afin de pouvoir si besoin est, modifier sa position avec les propriétés CSS "top" et "left"
    fond.style.position = "absolute";

    //
    //  Joueur
    //

    // on ajoute l'image du joueur
    var imageJoueur = document.createElement("img");
    imageJoueur.src = "./joueur.png";
    imageJoueur.id = "joueur";
    terrain.appendChild(imageJoueur);

    joueur = document.getElementById('joueur');

    // on redimensionne le joueur
    joueur.style.width = "100px";

    // on positionne le joueur en absolu afin de pouvoir si besoin est, modifier sa position avec les propriétés CSS "top" et "left"
    joueur.style.position = "absolute";

    //
    //  Ballon
    //

    // on ajoute l'image du ballon
    var imageBallon = document.createElement("img");
    imageBallon.src = "./ballon.png";
    imageBallon.id = "ballon";
    terrain.appendChild(imageBallon);

    ballon = document.getElementById('ballon');

    // on redimensionne le ballon
    ballon.style.width = "32px";

    // on positionne le ballon en absolu afin de pouvoir si besoin est, modifier sa position avec les propriétés CSS "top" et "left"
    ballon.style.position = "absolute";

    //
    // Positionnement initial du joueur et du ballon
    //

    joueur.style.left = (fond.width / 2) - 50 + "px"; // au centre
    joueur.style.top = (2/3) * fond.height -25 + "px"; // a 2/3 du bas de l'image = au centre
	
	ballon.style.left = (fond.width / 2) + 9 + "px"; // au centre
    ballon.style.top = (2/3) * fond.height + 29 + "px"; // a 2/3 du bas de l'image = au centre*/
    
    //
	//	Informations
	//

	// on crée ici un objet de type informations, à partir duquel on pourra afficher le panneau de score pendant la partie
	// cf informations() pour plus de détails sur l'objet
	if(afficherEcranAccueil || afficherEcranPerdu) {
		information = new informations(300, 100);
		information.div.removeAttribute("class");
		information.div.innerHTML = "";
	}
	else {
		information.afficher();
	}
	//
	//	Regles du jeu
	//
    
	regles = document.getElementById('regles');

	regles.style.position = "absolute"; 
    regles.style.width = window.innerWidth /3  + "px"; 
    regles.style.height = fond.height + "px"; 
    regles.style.left = fond.width + "px";

	//
	// Bouton servant a cacher les règles du jeu
	//

    boutonCacherRegles = document.getElementById('cacher');
	
    boutonCacherRegles.style.position = "absolute"; 
    boutonCacherRegles.style.left = fond.width + "px";
    boutonCacherRegles.style.top = fond.height + "px";

	//insertion de l'image aide sur le document
    insererAide(); 

	//
	//	Meilleurs scores
	//
	
	scores = document.getElementById('scores');

	var nbChildren = scores.children.length //on compte les enfants de la zone
	for(var i=0; i < nbChildren; i++) {
		scores.removeChild(scores.lastChild); //on supprime les enfants de la zone
	}

	scores.style.position = "absolute";
	scores.style.width = fond.width + "px";
	scores.style.height = fond.height / 2 + "px";
	scores.style.top = fond.height +"px";
	
	var scoreTitre = document.createElement("h2");
	scoreTitre.innerHTML = " Meilleurs Scores ";
	scoreTitre.style.textAlign = "center";
	scores.appendChild(scoreTitre);
	
	// on lance une requete vers la bdd afin d'obtenir les 5 meilleurs scores, et de les afficher dans la div scores
	scoreRequest();
    
    //
    // Ajout des écouteurs d'événement
    // 

	// au cas ou, pour éviter tout problème, on supprime l'eventListener avant de le rajouter
	document.removeEventListener("keydown", traiterAppuieTouche);
    document.addEventListener("keydown", traiterAppuieTouche);

	document.addEventListener("keydown", triche);
	
	 
	//
	//	div de triche
	//

	aTricher = false;
	
	tricheur = document.getElementById('triche');

	tricheur.style.position = "absolute"; 
    	tricheur.style.width = "500px"; 
    	tricheur.style.height = "50px"; 
   	tricheur.style.fontWeight="bold"; 
    
	tricheur.style.left = fond.width/2 -250 + "px";
	tricheur.style.top = fond.height/2 - 100 + "px";
	
	//
	//	Ajout du son
	//
   
   son = document.getElementById('son');
   if(afficherEcranAccueil) {
	   son.src = "intro.mp3";
	   son.setAttribute("loop","");
	}
	else if(afficherEcranPerdu) {
		son.src = "gameOver.mp3";
		son.removeAttribute("loop");
	}
	else {
		son.src = "./mario.mp3";
		son.setAttribute("loop","");
	}    
}

// fonction evenenement permettant de sélectionner les actions à effectuer selon le moment où la touche est appuyée
function traiterAppuieTouche(event) {
	// si on est sur l'ecran d'accueil ou de fin, on passe sur l'écran "suivant" selon l'ordre :
	// Accueil -> Jeu -> Fin -> Accueil ...
	if(afficherEcranAccueil) { 
		afficherEcranAccueil = false;
		setup();
	 }
	 else if(afficherEcranPerdu) {
		 afficherEcranPerdu = false;
		 afficherEcranAccueil = true;
		 setup();
	 }

	 // sinon, on appelle la fonction appuyer
	 // cf appuyer() 
	 else {
		 appuyer(event);
	 }
}

// fonction qui affiche l'image d'aide
function insererAide() {
	// On commence par supprimer les règles afin d'éviter les duplications
	var nbChildren = regles.children.length; //on compte le nombre d'enfants de règles  
	for(var i=0; i < nbChildren; i++) {
		regles.removeChild(regles.lastChild); //on supprime les enfants de règles
	}

	// Puis on rajoute l'image en la créeant auparavant
	var imgAide = document.createElement('img'); 
    imgAide.setAttribute('id', 'help'); 
    imgAide.setAttribute('src', './aide.jpg');
    imgAide.style.width = (1/3) * fond.width - 100 + "px";

	// On met des ecouteurs d'evenement permettant de montrer les regles quand on survole le bouton ( l'image ) aide
	imgAide.addEventListener("mouseover", afficherAide);
    imgAide.addEventListener("mouseover", Opacity);

	OpacityAllImage();

    regles.appendChild(imgAide);  
    boutonCacherRegles.style.visibility="hidden";
}

// fonction evenenement permettant de sélectionner les actions à effectuer selon la touche qui est appuyée
function appuyer(event) {

	// lorsque l'on appuie sur une touche, on commence par sortir de la "pause"
	OpacityAllImage();

	// fleche gauche ou fleche droite : on déplace le personnage
	if(event.keyCode === 37 || event.keyCode === 39) {
		bougerPersoX(event);
	}

	// touche w : on lance un tir, a condition de ne pas déjà être en train de tirer
	if(!enCoursDeTir && event.keyCode === 87) {
		calculDureeAppuie(event);
	}
}

// fonction qui calcule la durée pendant laquelle le joueur a laissé la touche w appuyée ( ce qui permet de faire un tir plus puissant )
function calculDureeAppuie(event) {

	// on vérifie a nouveau qu'il n'y ai pas déjà un tir en cours
	if(!enCoursDeTir) {

		// on commence un tir
		enCoursDeTir = true;

		// on récupère le temps local correspondant à l'evenement keydown
		tempsDebutTir = event.timeStamp;

		// et enfin, on ajoute un ecouteur d'evenement pour une touche relachée
		document.addEventListener("keyup",function(event) { relacher(event, tempsDebutTir) } );
	}
}

// fonction evenement appellee lorsque le joueur a appuyé sur w et relache une touche
function relacher(event, debut) {
	// on vérifie par sécurité qu'il y ai un tir en cours, et que la touche relachée soit bien le w
	if(enCoursDeTir && event.keyCode === 87) {

		// on récupère le temps local de l'evenement et on supprime l'écouteur d'évènement
		var fin = event.timeStamp;
		document.removeEventListener("keyup",function(event) { relacher(event, debut) } );

		// on arrete de "charger" le tir
		enCoursDeTir = false;

		// cette vérification permet d'éviter au joueur de tirer pendant que le ballon est en vol vers le panier
		if(peutBouger) {

			// on lance réelement le tir, en passsant en argument la durée ( en ms ) durant laquelle la touche w est restée enfoncée
			tir(fin-debut, 1, 1);
		}	
	}
}

// fonction de communication avec la bdd
function myajax(url, callBack) {
	// cette fonction est identique à celle vue en cours
	// c'est à dire, que l'on envoie une requete en GET sur une page php
	// et on récupère la réponse du serveur traitée par la fonction callBack en JSON
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.addEventListener("load", function () {
        callBack(httpRequest); });
    httpRequest.send(null);
}

// fonction qui récupère de la bdd les meilleurs scores
function scoreRequest() {

	// url en localhost car il s'agit de la version local et non pas serveur du projet
     var url = 'http://infolimon.iutmontp.univ-montp2.fr/~tornilf/projet-js-master/scoreRequest.php?action=select';

	// une fois que le serveur aura renvoyé la réponse, on appelle la fonction afficherScores()
    myajax(url, afficherScores);
}

// fonction qui insere un nouveau score dans la bdd, avec le nom passé en argument
function insererScoreBdd(nom) {

	// information.score correspond au score actuel du joueur (cf informations())
	var url = 'http://infolimon.iutmontp.univ-montp2.fr/~tornilf/projet-js-master/scoreRequest.php?action=insert&nom=' + nom + '&score=' + information.score;

	// une fois le score inséré, on actualise les meilleurs scores
	myajax(url, scoreRequest);
}

// fonction appellé lorsque le serveur bdd répond à une demande des 5 meilleurs scores
function afficherScores(httpRequest) {
	// on récupère en JSON les meilleurs scores dans un tableau
	var tabRep = JSON.parse(httpRequest.responseText);

	// on supprime les anciens meilleurs scores pour éviter les dédoublements
	for(var i=scores.children.length-1; i>0; i--) {
		scores.removeChild(scores.lastChild);
	}

	// on crée un paragraphe par meilleur score pour afficher les meilleurs scores
    for(var i=0; i<tabRep.length; i++) {
		var p = document.createElement("p");
		p.id = "score" + i;
		p.innerHTML = tabRep[i].nomJoueur + " : " + tabRep[i].score + " points";
		p.style.textAlign = "center";
		scores.appendChild(p);
    }
}

// fonction qui retourne un Number représentant la position en x de l'image
function getImageX(image) {
	// on récupère la variable "left" du l'image
	var xString = image.style.left;
	
	// on récupère uniquement les "nombres" correspondant à la position en x du ballon ( c'est à dire, on enlève le "px" )
	var xNombreChaine =  xString.slice(0, xString.length-2);
	
	// on divise par un afin de retourner un nombre et pas une chaine de caractères
	return xNombreChaine / 1;
}

// cf getImageX(image) pour les explications
function getImageY(image) {
	var yString = image.style.top;
	var yNombreChaine =  yString.slice(0, yString.length-2);
	return yNombreChaine / 1;
}

// fonction permettant de déplacer le personnage à gauche ou à droite
function bougerPersoX(event) {

	// fleche droite : vers la droite
	// on vérifie aussi que le personnage puisse bouger
	// cela permet d'éviter des problèmes, comme déplacer le ballon en vol
	if (event.keyCode === 39 && peutBouger) {

		// on limite le déplacement du joueur pour éviter qu'il n'aille trop loin
		if(getImageX(joueur) < 2*fond.width/3) {

			// on bouge le personnage en déplaçant aussi le ballon qu'il a dans les mains
			joueur.style.left = getImageX(joueur) + 10 + "px";
			ballon.style.left = getImageX(ballon) +10 + "px";

			// on diminue les déplacements disponibles de 1
			// cf informations()
			information.nbDeplacement --;  
			information.afficher();

			// si le joueur se déplace alors qu'il n'a plus de déplacements disponible, il perd une vie
			if(information.nbDeplacement === 0) {
				PerteVie();
			}
		} 
	}

	// fleche gauche : vers la gauche
	if(event.keyCode === 37 && peutBouger) { 
		if(getImageX(joueur) > fond.width/4) {
			joueur.style.left= getImageX(joueur) - 10 + "px"; 
			ballon.style.left= getImageX(ballon) - 10 + "px";

			information.nbDeplacement --;  
			information.afficher();
			if(information.nbDeplacement === 0) {
				PerteVie();
			}
		}
	}	
}

// fonction qui permet d'afficher les règles du jeu
function afficherAide(event) {

	// on supprime le premier fils de règle correspondant à l'image du bouton d'aide
	regles.removeChild(regles.firstChild); 

	// on affiche le bouton permettant de cacher les règles
	boutonCacherRegles.style.visibility = "visible";
	boutonCacherRegles.addEventListener("click", insererAide);

	// on crée puis insère un titre (h2) dans les règles
	var newh2 = document.createElement('h2'); 
	newh2.innerHTML = "Voici les règles de notre jeu"; 
	regles.appendChild(newh2); 
	
	// on crée et on insère des paragraphes dans les regles
	var newp = document.createElement('p'); 
	newp.innerHTML = "Pour déplacer le joueur, appuyez sur les flèches de droite ou de gauche"; 
	regles.appendChild(newp); 
	
	var newp2 = document.createElement('p'); 
	newp2.innerHTML = "Pour tirer, appuyez sur la touche w, plus vous laissez appuyé, plus le tir est puissant"; 
	regles.appendChild(newp2);	 
	
	var newp3 = document.createElement('p'); 
	newp3.innerHTML = "Vous disposez de 5 vies et de 50 pas par tir"; 
	regles.appendChild(newp3);
	
	var newp4 = document.createElement('p'); 
	newp4.innerHTML = "Ceci est un jeu de ... ?"; 
	regles.appendChild(newp4);	 	
}

// fonction qui baisse la luminosité des images
function Opacity() {

	// on sélectionne toutes les images
	var tabImg=document.getElementsByTagName('img');

	// et on passe l'opacité de chacune à 0.5
	for(var i=0; i<tabImg.length; i++) {
		tabImg[i].style.opacity=0.5;
	}
}

// fonction qui repasse la luminosité des images par défaut
function OpacityAllImage() {
	//cf Opacity
	var tabImg=document.getElementsByTagName('img'); 
	for(var i=0; i<tabImg.length; i++) {
		tabImg[i].style.opacity=1;
	}
}

// fonction qui vérifie si le ballon est dans le panier
function faitPanier() {

	// on récupère la position du ballon sur l'axe des x et sur l'axe des y
	var positionXballon = getImageX(ballon); 
	var positionYballon = getImageY(ballon); 
	
	// on récupère également la position du panier en fonction de la taille de l'image
	var panierX = 4*fond.width/5 + 10;
	var panierY = 2*fond.height/5;
	
	// on regarde si le ballon est proche du panier 
	if (panierX < positionXballon + 20 && positionXballon - 20 < panierX + 50 && panierY < positionYballon + 20  && positionYballon - 20 < panierY + 10) {
		
		// on joue un son de victoire
		son.src = "win.mp3";
		son.removeAttribute("loop");

		// cf informations()
		information.score += Math.round(((panierX - getImageX(joueur))*(panierX - getImageX(joueur)))/200);
		information.afficher();
		information.bouger();

		// comme on a marqué, on ne va pas perdre de vie
		perdUneVie = false;

		// on force l'arret du ballon
		arret(true);		
	}
}

// fonction qui enlève une vie
function PerteVie() { 
	
	// son de fail
	son.src = "rate.mp3";
	son.removeAttribute("loop");

	// on affiche un message indiquant que le joueur a perdu une vie
	alert("perte d'une vie");

	// cf informations()
	information.nbVie --; 
	information.afficher();

	// si la perte de vie est due à un manque de déplacement, on réinitialise ce nombre
	if(information.nbDeplacement === 0) {
		information.nbDeplacement = 50;
	}

	// si le joueur n'a plus de vie, on fini la partie
	if(information.nbVie === 0) {
		finGame(); 
	}
}

// fonction qui met fin à la partie
function finGame() {

	// on indique qu'il faudra afficher l'ecran de défaite au prochain setup()
	afficherEcranPerdu = true;

	// on empeche le joueur de continuer à jouer en enlevant les écouteurs d'évenement
	document.removeEventListener("keydown", traiterAppuieTouche);
	document.removeEventListener("keydown", triche);
	
	// son de fin
	son.src = "bdd.mp3";
	son.setAttribute("loop","");

	// on demande au joueur de saisir son nom pour sauvegarder son score dans la base de données
	var input = document.createElement("input");
	input.id = "input";
	input.width = 200 + "px";
	input.style.position = "absolute";
	input.style.left = fond.width/2 - 100 + "px";
	input.style.top = fond.height - 50 + "px";
	

	var label = document.createElement("label");
	label.setAttribute("for",input.id);
	label.setAttribute("id", "user");
	label.style.position = "absolute";
	label.style.left = fond.width/2 - 175 + "px";
	label.style.top = fond.height - 75 + "px";
	label.innerHTML = "Saisir votre nom puis appuyer sur la touche entrée";

	body.appendChild(label);
	body.appendChild(input);

	document.addEventListener("keydown", appuieToucheBdd);
}

// fonction qui insere dans la bdd le score du joueur
function appuieToucheBdd(event) {
	// on vérifie que le joueur ai bien appuyé sur la touche entrée
	if(event.keyCode === 13) {

		// on récupère son nom, et appelle la fonction d'insertion dans la bdd myajax
		var input = document.getElementById("input");
		var nom = input.value;

		// si le joueur ne saisi pas de nom on le nomme "Anonyme" par défaut
		if(nom === "") {
			nom = "Anonyme";
		}

		insererScoreBdd(nom);

		// on supprime la zone e saisie
		body.removeChild(input);
		body.removeChild(document.getElementById("user"));

		setup();
	}
}

// fonction qui permet de tricher
function triche(event) {

	// on ajoute a la chaine de triche le code de la touche
	chaineTriche=chaineTriche+event.keyCode;

	// code du mot "basket"
	var code = "66" + "65" + "83" + "75" + "69" + "84";
	
	// si la chaine de triche contient le code
	if (chaineTriche.indexOf(code,0) != -1) {

		// si le joueur a déjà triché, on remet son score a zéro
		if(aTricher) {
			
			// on met un petit son 
			son.src = "triche2.mp3";
			son.removeAttribute("loop");
			information.score = 0;

			// et on lui affiche un petit message
			tricheur.style.border = "none";
			alert(" Trop de triche score = 0 !");
			
			information.afficher();
			aTricher = false; 
			chaineTriche = "";
			
			document.removeEventListener("keydown", traiterAppuieTouche);
			setTimeout(setup,1000);
		}
		else {

			// on ignore les touches pendant un moment, c'est pas bien de tricher
			document.removeEventListener("keydown", traiterAppuieTouche);

			// on affiche un message indiquant que le joueur vient de tricher
			tricheur.style.border="12px inset beige";
			tricheur.innerHTML = "Si vous trichez encore <br> Votre score va retomber à 0 ! </br"; //écriture du message
			tricheur.style.textAlign = "center"; 

			// et on met le personnage en feu
			var feu = document.createElement("img");
			feu.src = "./flamme.png";
			feu.id = "feu";
			feu.style.position = "absolute"; 
			feu.style.height = "200px"; 
			feu.style.width = "150px"; 
			feu.style.top = getImageY(joueur) - 80 + "px"; 
			feu.style.left = getImageX(joueur) - 30 + "px"; 
			terrain.appendChild(feu);
			
			// on met un petit son 
			son.src = "excellent.mp3";
			son.removeAttribute("loop");

			// on augmete quand même le score de 1000 points parce que c'est pas si mal que ca de tricher
			information.score += 2000;
			

			// on indique que le joueur a déjà triché, car il ne faut pas tricher deux fois
			aTricher = true; 

			// au bout de 5 secondes, on efface le message et permet au joueur de rejouer
			setTimeout(effacerAlerteTriche, 5000);

			information.afficher();

			//on réinitialise aussi la chaine pour ne pas tricher plusieurs fois sans le vouloir
			chaineTriche = ""; 
		}
	} 
}

// fonction qui permet de reprendre le jeu après avoir triché
function effacerAlerteTriche() {

	// on enleve le feu et le message
	tricheur.style.border = "none"; 
	tricheur.innerHTML = ""; 
	var feu = document.getElementById("feu");
	if(feu) {
		terrain.removeChild(feu);
	}
	
	// on remet le son de base
	son.src = "mario.mp3";
	son.setAttribute("loop","");

	// on remet l'écouteur d'évènement de l'appuie sur les touches
	document.addEventListener("keydown", traiterAppuieTouche);
}

// effectue un tir
function tir(force, coefX, coefY){

	// on empeche le joueur de bouger pendant le tir
	peutBouger = false;

	// on limite également la force maximale du tir
    if(force > 2500){
		force = 2500;
	}

	// on crée un intervalle qui va déplacer le ballon toutes les 75ms
	var attraction = 1;
	lancer = setInterval(function() {
		attraction += 0.5 ;
		intervalle(force, attraction, coefX, coefY);
		limite(force)}, 20);    
}

// fonction appelle pour déplacer le ballon lors d'un tir
function intervalle(force, attraction, coefX, coefY){
	
	oldX = getImageX(ballon);
	oldY = getImageY(ballon);

	// on bouge le ballon en X et en Y selon une formule mathématique secrète
	ballon.style.top = getImageY(ballon) - ((5+(force*0.010))*coefY) + attraction + "px";
    ballon.style.left = getImageX(ballon) + ((2+(force*0.004))*coefX) + "px";
    
	// on vérifie également si le ballon est dans le panier
    faitPanier();
}

// fonction permettant d'arreter le tir
function arret(force){

	// on récupère les coordonnées du panier
	var panierX = 4*fond.width/5 + 10;
	var panierY = 2*fond.height/5;
	
	// si on force l'arret via l'argument, ou que le ballon a dépassé le panier
    if(force || getImageX(ballon) > panierX+100 || getImageY(ballon) > getImageY(joueur)+100 ) {
			
		// on repositionne le joueur et le ballon à leurs positions initiales
		joueur.style.left = (fond.width / 2) - 50 + "px";
		joueur.style.top = (2/3) * fond.height -25 + "px";
	
		ballon.style.left = (fond.width / 2) + 5 + "px";
		ballon.style.top = (2/3) * fond.height + 25 + "px";
		
		// on remet les 50 déplacements possibles
		information.nbDeplacement = 50;

		// si le joueur doit perdre une vie
		// c'est à dire s'il n'a pas marqué de points
		// il perd une vie
		
		if(force) {
			clearInterval(lancer);
		}
		
		if(perdUneVie) {
			PerteVie();
		}

		// on réinitialise les variables
		perdUneVie = true;
		peutBouger = true;

		// s'il reste des vies, on refait le setup
		if(information.nbVie > 0) {
			document.removeEventListener("keydown", traiterAppuieTouche);
			setTimeout(setup ,2000);	
	    }
    }
}

// fonction qui trouve si le ballon rebondi
function limite(force){

	// formule secrète de rebond
	var directionX = (getImageX(ballon)-oldX)/Math.abs(getImageX(ballon)-oldX); 	//1 si il veut va vers la gauche, -1 vers la droite.
	var directionY = (-(getImageY(ballon)-oldY))/Math.abs(getImageY(ballon)-oldY);	//1 si il monte, -1 sinon.
  	var panierX = 4*fond.width/5 + 10;
	var panierY = 2*fond.height/5;

	// rebond au sol
 	if(getImageY(ballon) > fond.height*(80/100)){
 		rebond(force,directionX,1);
	}
	//rebond coté droit de l'écran
  	else if(getImageX(ballon) > fond.width*(96.8/100)){
   		rebond(force,-1,directionY);
  	}
	//rebond coté gauche de l'écran
  	else if(getImageX(ballon) < 0){
    	rebond(force,1,directionY);
  	}
	//rebond sur le panneau
  	else if(getImageX(ballon) > fond.width*(82/100) && getImageX(ballon) < fond.width*(89/100) && getImageY(ballon) > fond.height*(14/100) &&  getImageY(ballon) < fond.height*(42/100) && rebondPlanche == true){
		rebondPlanche = false;
		var chrono = setInterval(function(){rebondPlanche = true;clearInterval(chrono)},500);
		var difY = (Math.min(Math.abs(getImageY(ballon)-fond.height*(14/100)),Math.abs(getImageY(ballon)-fond.height*(42/100))));
		var difX = (Math.min(Math.abs(getImageX(ballon)-fond.width*(82/100)),Math.abs(getImageX(ballon)-fond.width*(89/100))));
    	if(difX < difY){
     		rebond(force,directionX*(-1),directionY);
    	}
    	else {
      		rebond(force,directionX,directionY*(-1));
    	}
  	}
	//rebond sous l'arceau
  	else if(getImageY(ballon)  - 20 > panierY + 12 && getImageY(ballon) - 20 < panierY + 25 && panierX < getImageX(ballon) + 20 && getImageX(ballon) - 70 < panierX){
    	rebond(force,directionX,-1);
  	}
	//rebond a gauche de l'arceau
	else if(panierX > getImageX(ballon) +21 && getImageX(ballon) + 30 > panierX &&  panierY < getImageY(ballon) + 40 && getImageY(ballon) -25 < panierY ){
		rebond(force,-1,directionY);
 	}
}

// fonction qui fait rebondir le ballon
function rebond(force,coefX, coefY){

	// on arrete le tir
	clearInterval(lancer);
	
	// on calcule une nouvelle force
	force = force*(3.5/5) - 10;
	
	// si le ballon n'est pas a un arret quasi total il rebondi
	if(force > 8){
		tir(force,coefX,coefY);
	}
	
	// sinon on l'arrete
	else{
		arret(true);
	}
}

// fonction constructeur d'un objet information
function informations(w, h) {
	
	// cet objet rerésente les diverses informations sur le jeu
	// comme le score, le nombre de déplacements et les vies restantes

	// on sélectionne la div où afficher les informations
	this.div = document.getElementById('informations');
	
	// on garde également les tailles et positions de la div
	this.width = w;
	this.height = h;
	
	this.top = 20;
	this.left = fond.width/2 - this.width/2;
	
	// initialisation des variables
	this.score = 0;
	this.nbDeplacement = 50;
	this.nbVie = 5;
	
	// variables permettant de déplacer la div
	this.iteration = 0;
	this.intervalle;
	
	// fonction qui affiche la div d'information'
	this.afficher = function() {
		this.div.style.position = "absolute";
		this.div.style.width = this.width + "px";
		this.div.style.height = this.height + "px";
		this.div.style.top = this.top + "px";
		this.div.style.left = this.left + "px";
		this.div.setAttribute("class","infos");
		this.div.innerHTML = "<p class=score>" + this.score + "</p><p> <span class=gauche>Vies</span><span class=droite>Pas</span> </p><p class=chiffres> <span class=gauche>" + this.nbVie + "</span><span class=droite> " + this.nbDeplacement + "</span></p>";	
	}
	
	// fonction qui déplace la div 
	// cette fonction est appellée en cas de panier réussi
	this.bouger = function() {
		this.iteration = 0;
		this.intervalle = setInterval(function() { information.actionDeIntervalle() }, 30);		
	}
	
	// fonction qui déplace la div en fonction de l'itération en cours 
	this.actionDeIntervalle = function() {
		if(this.iteration < 5) {
			this.deplacer(-10,0);
		}
		else if(this.iteration < 10) {
			this.deplacer(0,10);
		}
		else if (this.iteration < 15) {
			this.deplacer(10,0);
		}
		else if (this.iteration < 20) {
			this.deplacer(0,-10);
		}
		else {
			clearInterval(this.intervalle);
		}
		this.iteration++;
	}

	// fonction qui déplace la div de x et y vers la droite et le bas ( peut etre négatif )
	this.deplacer = function(x, y) {
		this.left += x;
		this.top += y;
		this.afficher();
	}	
}
	




