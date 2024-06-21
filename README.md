# Gestion d'etablissement scolaire

## Description
Cette application vise à rationaliser et améliorer la gestion quotidienne des établissements scolaires en automatisant les processus liés aux emplois du temps, aux notes, aux repêchages, et à la gestion administrative des professeurs, afin d'optimiser l'efficacité opérationnelle et de fournir une solution personnalisée aux besoins spécifiques de chaque institution éducative.


## Technologies Utilisées
- **Backend :**
  - Node js 18.20.3
  - express js 4.18.2
  - Mysql
  - Mysql2 3.2.0
  - JWT (JSON web Token)  pour l'authentification
- **Frontend :**
  - EJS 3.1.9
  - Bootstrap 4.3
    
## Installation

### Prérequis

- Node js 18.20.3 installé sur votre machine
- Xampp installé et en cours d'exécution

### Étapes
1. Clonez le dépôt :
    ```bash
    git clone https://github.com/misuke007/Gestion-d-tablissement-scolaire-.git
    cd Gestion-d-tablissement-scolaire
    npm install (pour installer les dépendances)
    npx sequelize-cli db:create (pour créer la base de donnée)
    npm start
    ```

    
1. Accedez à `http//localhost/phpmyadmin`  créez un utilisateur  en lui donnant le badge 'ADMIN'
2. Accédez à l'application web dans votre navigateur à l'adresse `http://localhost::8000/admin/home`


   

## Fonctionnalités
- Authentification des utilisateurs
- Gestion d'emploi du temps
- Gestion de disponibilités des profs
- Gestion des notes 
- Gestion salaire des professeurs
- Gestion de présence des professeurs
- Gestion de repêchage
- Gestion des EC et UE (élément constitutif et unité d'enseignement)
- Inscription des étudiants



## Auteur
- **Randimbisoa Behajaina ** - [misuke007](https://github.com/misuke007)


