<?php

namespace App\Auth\Login\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class LoginController
{
    #[Route('/api/patient/login', name: 'patient_login', methods: ['POST'])]
    public function patientLogin(): Response
    {
        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/api/admin/login', name: 'admin_login', methods: ['POST'])]
    public function adminLogin(): Response
    {
        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}