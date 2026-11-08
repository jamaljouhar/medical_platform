<?php

namespace App\Auth\Login\Controller;

use App\Auth\Register\Client\Entity\UserAccount;
use App\Auth\Register\Admin\Entity\AdminAccount;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class AuthController extends AbstractController
{
    #[Route('/patient/me', name: 'patient_me', methods: ['GET'])]
    public function patientMe(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof UserAccount) {
            return $this->json([
                'message' => 'Patient is not authenticated.',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'enabled' => $user->isEnabled(),
        ]);
    }

    #[Route('/admin/me', name: 'admin_me', methods: ['GET'])]
    public function adminMe(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof AdminAccount) {
            return $this->json([
                'message' => 'Admin is not authenticated.',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'enabled' => $user->isEnabled(),
        ]);
    }
}