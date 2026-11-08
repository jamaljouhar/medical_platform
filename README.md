# Medical Platform

**Medical Platform** est une application web de gestion médicale permettant de centraliser et de simplifier la gestion des patients, des médecins, des rendez-vous et des dossiers médicaux.

Le projet repose sur une architecture **Frontend / Backend** avec une API REST sécurisée, permettant une communication entre l'interface utilisateur et le serveur.

## 🚀 Technologies utilisées

### Backend
- PHP 8.2+
- Symfony 7
- Doctrine ORM
- MySQL / PostgreSQL (selon la configuration)
- API REST
- JWT Authentication
- Symfony Validator
- Doctrine Migrations

### Frontend
- React.js
- TypeScript
- PrimeReact
- Axios
- Bootstrap

## ✨ Fonctionnalités principales

### 🔐 Authentification et sécurité
- Inscription et connexion des patients.
- Authentification JWT.
- Gestion des rôles et des autorisations.
- Séparation des comptes patients et administrateurs.
- Protection des endpoints API.

### 👤 Gestion des patients
- Création des comptes patients.
- Consultation des profils.
- Modification des informations personnelles.
- Gestion des données des patients.

### 👨‍⚕️ Gestion des médecins
- Gestion des médecins.
- Association des médecins aux spécialités.
- Consultation des profils médicaux.
- Gestion des informations professionnelles.

### 📅 Gestion des rendez-vous
- Création des rendez-vous.
- Consultation et gestion des rendez-vous.
- Gestion des statuts des rendez-vous.

### 🩺 Dossiers médicaux
- Création et consultation des dossiers médicaux.
- Association des dossiers aux patients et aux médecins.
- Enregistrement des diagnostics.

### 💊 Gestion des prescriptions
- Création des prescriptions médicales.
- Gestion des médicaments prescrits.
- Enregistrement des dosages, fréquences et durées des traitements.

## 🏗️ Architecture du projet

```text
medical_platform/
│
├── client-app/
│   └── React.js Application
│
├── server-app/
│   ├── config/
│   ├── migrations/
│   ├── public/
│   ├── src/
│   │   ├── Appointment/
│   │   ├── Auth/
│   │   ├── Doctor/
│   │   ├── MedicalRecord/
│   │   ├── Patient/
│   │   ├── Prescription/
│   │   ├── Shared/
│   │   └── Specialty/
│   │
│   ├── composer.json
│   └── symfony.lock
│
└── README.md
```

## ⚙️ Installation et configuration

### 1. Cloner le projet

```bash
git clone YOUR_REPOSITORY_URL
cd medical_platform
```

### 2. Configuration du Backend

```bash
cd server-app
composer install
```

Créer un fichier `.env.local` et configurer la connexion à la base de données :

```env
DATABASE_URL="your_database_connection"
```

Générer les clés JWT :

```bash
php bin/console lexik:jwt:generate-keypair
```

Créer la base de données et exécuter les migrations :

```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

Démarrer le serveur Symfony :

```bash
symfony serve
```

Backend accessible par défaut sur :

`http://127.0.0.1:8000`

### 3. Configuration du Frontend

Dans un autre terminal :

```bash
cd client-app
npm install
npm run dev
```

Configurer l'URL de l'API Backend selon la configuration de l'application.

## 🔒 Sécurité

Les informations sensibles ne doivent jamais être publiées sur GitHub.

- Ne pas partager les fichiers `.env` et `.env.local`.
- Utiliser des variables d'environnement.
- Protéger les routes avec JWT.
- Vérifier les autorisations selon les rôles des utilisateurs.

## 👨‍💻 Auteur

**Jamal JOUHARI**

Développeur Web & Mobile

⭐ *Medical Platform – A modern solution for medical management.*
