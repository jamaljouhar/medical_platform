<?php

namespace App\Doctor\Controller;

use App\Doctor\Service\DoctorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/doctors')]
class DoctorController extends AbstractController
{
    public function __construct(
        private DoctorService $doctorService
    ) {
    }

    #[Route('/all', name: 'doctor_list', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        return $this->json(
            $this->doctorService->getAll()
        );
    }

    #[Route('/{id}', name: 'doctor_get', methods: ['GET'])]
    public function getById(int $id): JsonResponse
    {
        return $this->json(
            $this->doctorService->getById($id)
        );
    }

    #[Route('', name: 'doctor_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $doctor = $this->doctorService->createFromJson(
            $request->getContent()
        );

        return $this->json(
            $doctor,
            JsonResponse::HTTP_CREATED
        );
    }

    #[Route('/{id}', name: 'doctor_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request
    ): JsonResponse {
        $doctor = $this->doctorService->updateFromJson(
            $id,
            $request->getContent()
        );

        return $this->json($doctor);
    }

    #[Route('/{id}', name: 'doctor_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $this->doctorService->delete($id);

        return $this->json([
            'message' => 'Doctor deleted successfully.',
        ]);
    }
}