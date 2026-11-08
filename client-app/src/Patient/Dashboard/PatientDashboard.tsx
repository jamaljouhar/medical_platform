import { useNavigate } from "react-router-dom";
import {
  FaHeartPulse,
  FaCalendarCheck,
  FaUserDoctor,
  FaStethoscope,
  FaClock,
  FaShieldHeart,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaStar,
  FaLaptopMedical,
  FaHandHoldingMedical,
} from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

const PatientDashboard = () => {
  const navigate = useNavigate();

  // Données de présentation à remplacer par celles du backend.
  const specialties = [
    {
      name: "Cardiologie",
      description: "Prenez soin de votre santé cardiovasculaire.",
      icon: <FaHeartPulse />,
    },
    {
      name: "Médecine générale",
      description: "Un accompagnement pour votre santé au quotidien.",
      icon: <FaStethoscope />,
    },
    {
      name: "Consultation spécialisée",
      description: "Accédez aux médecins selon vos besoins.",
      icon: <FaUserDoctor />,
    },
  ];

  const benefits = [
    {
      icon: <FaCalendarCheck />,
      title: "Rendez-vous simplifiés",
      description:
        "Consultez les médecins et gérez vos rendez-vous depuis un seul espace.",
    },
    {
      icon: <FaUserDoctor />,
      title: "Médecins qualifiés",
      description:
        "Découvrez les profils et les spécialités des professionnels de santé.",
    },
    {
      icon: <FaClock />,
      title: "Une meilleure organisation",
      description:
        "Retrouvez facilement les informations relatives à vos consultations.",
    },
    {
      icon: <FaShieldHeart />,
      title: "Un parcours plus serein",
      description:
        "Une interface conçue pour rendre votre expérience médicale plus simple.",
    },
  ];

  const handleDoctorsClick = () => {
    navigate("/patient/doctors");
  };

  const handleAppointmentsClick = () => {
    navigate("/patient/appointments");
  };

  return (
    <main className="container">
      <section className="">
        <div className="">
          <div className="row align-items-center g-5 ">
            <div className="col-12 col-lg-6">
              <span className="badge rounded-pill text-primary bg-primary-subtle px-3 py-2 mb-2">
                <FaHeartPulse className="me-2" />
                Votre santé, notre priorité
              </span>

              <h1 className=" fw-bold ">
                Prenez soin de vous avec <br />
                <span className="text-primary h1 fw-bold ">
                  MedFlow <FaHeartPulse className="me-2" />
                </span>
              </h1>

              <p
                className="fw-semibold small"
                style={{
                  fontSize: 13,
                }}
              >
                Découvrez les professionnels de santé, explorez les spécialités
                médicales et organisez vos rendez-vous simplement, depuis un
                seul espace.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3">
                <button
                  type="button"
                  className="btn btn-primary btn-lg rounded-3 px-4"
                  onClick={handleAppointmentsClick}
                >
                  <FaCalendarCheck className="me-2" />
                  Prendre rendez-vous
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg rounded-3 px-4"
                  onClick={handleDoctorsClick}
                >
                  Nos médecins <FaArrowRight className="ms-2" />
                </button>
              </div>

              <div className="row g-3 mt-2">
                <div className="col-12 col-sm-6">
                  <div className="h-100 border rounded-3 p-3 text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2 fw-semibold mb-1">
                      <FaCheckCircle className="text-success flex-shrink-0" />
                      <span>Simple</span>
                    </div>
                    <small className="fw-semibold">Navigation intuitive</small>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="h-100 border rounded-3 p-3 text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2 fw-semibold mb-1">
                      <FaCheckCircle className="text-success flex-shrink-0" />
                      <span>Pratique</span>
                    </div>
                    <small className="fw-semibold">
                      Rendez-vous centralisés
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="">
                <FaHeartPulse
                  className="img-fluid text-success w-100 rounded-4"
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-fluid mt-3">
        <div className="mb-2">
          <span className="text-primary fw-semibold small text-uppercase">
            À découvrir
          </span>
          <h2 className="h2 fw-bold text-success">
            Actualités et informations
          </h2>
        </div>

        <div className="row g-4">
          {/* Carte 1 */}
          <div className="col-12 col-md-6 col-xl-4">
            <article className="h-100 border rounded-4 overflow-hidden  d-flex flex-column">
              {/* Header */}
              <div className="bg-primary-subtle text-primary d-flex align-items-center justify-content-center py-2">
                <FaCalendarCheck className="fs-1" />
              </div>

              {/* Main */}
              <div className="p-2 d-flex flex-column flex-grow-1">
                <span className="badge bg-primary-subtle text-primary align-self-start mb-3">
                  Services
                </span>

                <h3 className="h5 fw-bold">Organisez vos consultations</h3>

                <p
                  className=" mb-0 overflow-hidden"
                  style={{
                    height: "4.5rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  Retrouvez les médecins et gérez vos rendez-vous depuis votre
                  espace patient.
                </p>

                {/* Footer */}
                <div className="mt-auto border-top p-2">
                  <button
                    type="button"
                    className="btn btn-link px-0 text-decoration-none fw-semibold"
                    onClick={handleAppointmentsClick}
                  >
                    Découvrir <FaArrowRight className="ms-2" />
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Carte 2 */}
          <div className="col-12 col-md-6 col-xl-4">
            <article className="h-100 border rounded-4 overflow-hidden  d-flex flex-column">
              <div className="bg-success-subtle text-success d-flex align-items-center justify-content-center py-2">
                <FaHandHoldingMedical className="fs-1" />
              </div>

              <div className="p-2 d-flex flex-column flex-grow-1">
                <span className="badge bg-success-subtle text-success align-self-start mb-3">
                  Prévention
                </span>

                <h3 className="h5 fw-bold">Prenez soin de votre santé</h3>

                <p
                  className=" mb-0 overflow-hidden"
                  style={{
                    height: "4.5rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  Pensez au suivi régulier et demandez conseil à un
                  professionnel de santé selon vos besoins.
                </p>

                <div className="mt-auto border-top p-2">
                  <button
                    type="button"
                    className="btn btn-link px-0 text-decoration-none fw-semibold"
                    onClick={handleDoctorsClick}
                  >
                    Trouver un médecin <FaArrowRight className="ms-2" />
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Carte 3 */}
          <div className="col-12 col-md-6 col-xl-4">
            <article className="h-100 border rounded-4 overflow-hidden  d-flex flex-column">
              <div className="bg-info-subtle text-info d-flex align-items-center justify-content-center py-2">
                <FaLaptopMedical className="fs-1" />
              </div>

              <div className="p-2 d-flex flex-column flex-grow-1">
                <span className="badge bg-info-subtle text-info align-self-start mb-3">
                  MedFlow
                </span>

                <h3 className="h5 fw-bold">Un espace médical centralisé</h3>

                <p
                  className=" mb-0 overflow-hidden"
                  style={{
                    height: "4.5rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  Accédez aux informations utiles de votre parcours médical
                  grâce à une interface simple et accessible.
                </p>

                <div className="mt-auto border-top p-2">
                  <button
                    type="button"
                    className="btn btn-link px-0 text-decoration-none fw-semibold"
                    onClick={handleDoctorsClick}
                  >
                    Explorer MedFlow <FaArrowRight className="ms-2" />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="container-fluid mt-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
          <div>
            <h2 className="h2 fw-bold mt-2 text-success mb-2">
              Nos spécialités
            </h2>
            <p className=" mb-0">
              Découvrez les domaines de soins proposés sur MedFlow.
            </p>
          </div>
        </div>

        <div className="row g-3">
          {specialties.map((specialty) => (
            <div
              className="col-12 col-md-6 d-flex justify-content-center col-xl-4"
              key={specialty.name}
            >
              <article className="h-100  border rounded-4 p-2">
                <div className="bg-primary-subtle text-primary rounded-3 d-inline-flex p-3 fs-3 mb-3">
                  {specialty.icon}
                </div>
                <h3 className="h5 fw-bold">{specialty.name}</h3>
                <p className="small">{specialty.description}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCED DOCTORS */}
      <section className="container-fluid mt-5">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-6">
            <h2 className="h3 fw-bold mt-2 mb-3">
              Des médecins expérimentés pour vous <br /> accompagner
            </h2>

            <ul className="list-unstyled d-grid gap-3 my-4">
              <li>
                <FaCheckCircle className="text-success me-2" />
                Profils et spécialités des médecins
              </li>
              <li>
                <FaCheckCircle className="text-success me-2" />
                Informations utiles avant une consultation
              </li>
              <li>
                <FaCheckCircle className="text-success me-2" />
                Accès simple à la prise de rendez-vous
              </li>
            </ul>

            <button
              type="button"
              className="btn btn-primary btn-lg rounded-3"
              onClick={handleDoctorsClick}
            >
              Découvrir nos médecins <FaArrowRight className="ms-2" />
            </button>

            <p className="small  mt-2 mb-0">
              Les années d'expérience doivent être affichées à partir des
              informations vérifiées des médecins.
            </p>
          </div>
          <div className="col-12 col-lg-6">
            <div className="border rounded-1 p-2">
              <div className=" rounded-4 p-4">
                <div className="d-flex gap-3 align-items-start">
                  <div className="bg-primary-subtle text-primary rounded-3 p-3 fs-3">
                    <FaUserDoctor />
                  </div>
                  <div>
                    <h3 className="h6 text-primary fw-bold">
                      L'expérience au service de votre santé
                    </h3>
                    <p className=" mb-0">
                      Consultez les profils des médecins pour découvrir leur
                      parcours, leur expérience et leurs spécialités.
                    </p>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="d-flex gap-3 align-items-start">
                  <div className="bg-warning-subtle text-warning-emphasis rounded-3 p-3 fs-4">
                    <FaStar />
                  </div>
                  <div>
                    <h4 className="h6 text-warning fw-bold">
                      Des informations transparentes
                    </h4>
                    <p className="small  mb-0">
                      Consultez les informations disponibles avant de choisir le
                      professionnel qui vous convient.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY MEDFLOW */}
      <section className="container-fluid">
        <div className="text-center mx-auto mb-5">
          <span className="text-primary fw-semibold small text-uppercase">
            Notre engagement
          </span>
          <h2 className="display-6 fw-bold mt-2">Pourquoi choisir MedFlow ?</h2>
          <p className="">
            Une plateforme pensée pour simplifier l'organisation de votre
            parcours médical.
          </p>
        </div>

        <div className="row g-4">
          {benefits.map((benefit) => (
            <div className="col-12 col-sm-6 col-xl-3" key={benefit.title}>
              <article className="h-100 border rounded-4  p-2">
                <div className="text-primary text-center fs-2 mb-3">{benefit.icon}</div>
                <h3 className="h6 text-center fw-bold">{benefit.title}</h3>
                <p className="small mb-0">{benefit.description}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="container-fluid py-5">
        <div className="bg-primary text-white rounded-5 p-4 p-md-5">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <h2 className="h-6 fw-bold">
                Votre prochain rendez-vous commence ici.
              </h2>
              <p className="mb-0 opacity-75">
                Explorez les médecins et choisissez une consultation adaptée à
                vos besoins.
              </p>
            </div>
            <div className="col-12 col-lg-4 text-lg-end">
              <button
                type="button"
                className="btn btn-light btn-lg rounded-3 text-primary fw-semibold"
                onClick={handleAppointmentsClick}
              >
                Commencer <FaArrowRight className="ms-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white pt-5 pb-4">
        <div className="container-fluid px-3 px-md-5">
          <div className="row g-4 pb-4">
            <div className="col-12 col-md-6 col-xl-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaHeartPulse className="fs-3 text-info" />
                <span className="h4 fw-bold mb-0">MedFlow</span>
              </div>
              <p className="text-white-50">
                Une plateforme conçue pour faciliter l'accès aux informations
                des médecins et la gestion des rendez-vous.
              </p>
              <div className="d-flex gap-3 fs-5">
                <a
                  href="https://www.facebook.com/"
                  className="text-white-50"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://www.instagram.com/"
                  className="text-white-50"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  className="text-white-50"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            <div className="col-6 col-md-3 col-xl-2">
              <h3 className="h6 fw-bold mb-3">Navigation</h3>
              <ul className="list-unstyled d-grid gap-2">
                <li>
                  <button
                    type="button"
                    className="btn btn-link text-white-50 text-decoration-none p-0"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Accueil
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="btn btn-link text-white-50 text-decoration-none p-0"
                    onClick={handleDoctorsClick}
                  >
                    Nos médecins
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="btn btn-link text-white-50 text-decoration-none p-0"
                    onClick={handleAppointmentsClick}
                  >
                    Rendez-vous
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-6 col-md-3 col-xl-2">
              <h3 className="h6 fw-bold mb-3">Informations</h3>
              <ul className="list-unstyled d-grid gap-2 text-white-50 small">
                <li>À propos de MedFlow</li>
                <li>Confidentialité</li>
                <li>Conditions d'utilisation</li>
              </ul>
            </div>

            <div className="col-12 col-md-6 col-xl-4">
              <h3 className="h6 fw-bold mb-3">Contact</h3>
              <ul className="list-unstyled d-grid gap-3 text-white-50">
                <li className="d-flex gap-2 align-items-start">
                  <FaEnvelope className="mt-1" />
                  <span>Contactez-nous via votre service officiel.</span>
                </li>
                <li className="d-flex gap-2 align-items-start">
                  <FaPhone className="mt-1" />
                  <span>Coordonnées à configurer pour MedFlow.</span>
                </li>
                <li className="d-flex gap-2 align-items-start">
                  <FaLocationDot className="mt-1" />
                  <span>Adresse à renseigner si applicable.</span>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-secondary" />

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
            <p className="small text-white-50 mb-0">
              © {new Date().getFullYear()} MedFlow. Tous droits réservés.
            </p>
            <p className="small text-white-50 mb-0">
              Une meilleure organisation de votre parcours médical.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default PatientDashboard;
