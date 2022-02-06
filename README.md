# Lampemetre.Vue

Lampemetre.Vue est un programme permettant la visualisation des mesures acquises par [Module Lampemètre Analyseur Traceur de Courbes](https://www.radioelec.com/module-lampemetre-analyseur-traceur-de-courbes-vacuum-tube-analyzer-xml-352_387-828.html) de [RadioElec](https://www.radioelec.com).

Le programme Liberty BASIC fourni par RadioElec lors de l'achat du module souffre malheureusement de nombreuses limitations.

Cette alternative libre et gratuite offre de nombreuses nouvelles fonctionnalités, une meilleure ergonomie et de nombreuses corrections techniques vis-à-vis du programme original.

## Prérequis

### Matériel

Vous aurez besoin du module lampemetre de RadioElec.
Toute la logique d'acquisition de données est effectuée par le boîtier.

### Navigateur internet (Google Chrome)

Lampemetre.Vue s'exécute dans un navigateur internet.

Lampemetre.Vue utilise la nouvelle API [Web Serial](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API), permettant au navigateur de communiquer avec une interface RS232.

Ces fonctionnalités ne sont supportées pour l'instant que par le navigateur [Google Chrome](https://www.google.fr/chrome/).

Dans le futur, ces fonctionalités seront sûrement implémentées par d'autres navigateurs.

## Installation

Vous pouvez utiliser Lampemetre.Vue en mode en ligne, ou en mode hors ligne.

### Mode en ligne (recommandé)

Suivez [ce lien](https://nbusser.github.io/lampemetre_vue/) pour utiliser Lampemetre.Vue.

Aucune autre opération n'est requise.

### Mode hors ligne

1. Téléchargez l'une des [versions](https://github.com/nbusser/lampemetre_vue/releases) du logiciel et extrayez le contenu de l'archive dans un dossier quelquonque.
2. Lancez ensuite le fichier `run.bat`. Ce fichier utilisera une commande python permettant de lancer un serveur http sur votre machine. L'installation préalable de python est requise.
3. Lancez Google Chrome et tapez `localhost` dans la barre de lien.

### Depuis les sources

1. Clonez le projet dans votre arborescence
2. `npm install`
3. `npm run serve`
4. Connectez vous à `localhost:8080` sur Google Chrome

## Utilisation

Avant toute utilisation, pensez à connecter le cable série du lampemètre à votre PC et à mettre sous tension le lampemètre.

### Création de tube

Dans l'interface **Tubes**, cliquez sur **+** pour ajoutezr un nouveau tube.

### Acquisition de données

Vous pouvez ensuite effectuer des captures pour ce tube en appuyant sur le bouton **Nouvelle Capture**.

Dans la pop-up, écrivez la série de valeurs de tension grille pour laquelle vous voulez effectuer l'acquisition.
Notez que toutes les valeurs de tension grille sont implicitement négatives. Le boîtier ne permet pas l'acquisition de données pour des tensions de grille positives.

#### Lissage

Lampemetre.Vue implémente un algorithme de correction de bruit après acquisition des données.

Il est possible de régler la sévérité de cet algorithme en manipulant le curseur dédié.

Pour assurer la cohérence des données, nous vous obligeons a garder le même facteur de lissage pour toutes les captures d'un même tube.

Plus le facteur de lissage est élevé, moins les données seront bruitées. En contrepartie, vous perderez en nombre de données capturées.

Par exemple, avec un paramètre de lissage au minimum, les données seront hautement bruitées mais les captures s'étendront jusqu'à 280V.
En revanche, avec un paramètre de lissage au maximum, le bruit sera extrèmement réduit mais les captures ne s'étendront que jusqu'à 250V.

### Mesure

Pour effectuer une mesure:
1. Cliquez, dans la section Tubes, sur la tension grille pour laquelle vous souhaitez effectuer la mesure
2. Cliquez ensuite sur un des points des courbes

Le programme affichera alors en bas de l'écran le calcul de la résistance interne, de la transductance et du facteur d'amplification pour la tension grille selectionnée.

Vous pouvez également cliquer sur le bouton **+** dans l'onglet mesure pour effectuer une mesure pour la tension anode de votre choix.

### Sauvegarde de l'espace de travail

En utilisant le bouton projet, vous pouvez sauvegarder ou charger votre espace de travail.

#### Sauvegarde JSON (recommandé)

Nous recommandons l'utilisation de la sauvegarde en .json.

Dans ce format, les tubes, leurs captures, les mesures ainsi que les notes personnelles seront sauvegardés.

En utilisant l'option charger depuis un fichier .json, vous pourez alors retrouver votre environnement de travail à l'identique.

#### Importation/exportation Excel (lacunaire)

L'option de sauvegarde en fichier Excel (.xlsx) permet de compiler les données des courbes et des mesures dans un fichier excel.

**NB:** les notes personnelles ne sont pas sauvegardées

En utilisant l'option charger depuis un fichier Excel, vous pourrez retrouver vos tubes et captures.
Les éventuelles mesures ne seront **pas** importées.

**NB:** au vu des contraintes qu'entraine le format de sauvegarde, nous vous recommandons de n'utiliser la fonctionnalité d'importation de fichier Excel uniquement si vous souhaitez entrer votre datasheet à la main.
Dans le cas où vous souhaitez simplement sauvegarder votre espace de travail, référez vous aux boutons Sauvegarder et Charger.

### Minuterie

Vous pouvez trouver en haut à droite de l'écran un espace dédié à la minuterie.

Le rôle de ce minuteur est de vous assurer que vos lampes sont bien chaudes avant de lancer les captures.

Pour lancer le minuteur, cliquez sur le bouton **Minuteur** puis réglez le nombre de secondes.

Toutes les captures lancées pendant que le minuteur est actif seront mises en file d'attente.

## Contribution

En cas de problème, n'hésitez pas à poster une [issue](https://github.com/nbusser/lampemetre_web/issues) sur github.

N'hésitez pas non plus à soumettre des pull-requests.
