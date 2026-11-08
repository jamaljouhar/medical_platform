<?php

namespace App\Patient\Controller;

use App\Auth\Register\Client\Entity\UserAccount;
use App\Patient\Dto\PatientUpdateRequestDto;
use App\Patient\Dto\PatientCreateRequestDto;
use App\Patient\Service\PatientService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/patient')]
class PatientController extends AbstractController
{
    public function __construct(
        private PatientService $patientService
    ) {}

    #[Route('', name: 'patient_list', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        return $this->json(
            $this->patientService->getAll()
        );
    }

    #[Route('/profile', name: 'patient_profile', methods: ['GET'])]
    public function getProfile(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof UserAccount) {
            return $this->json([
                'message' => 'Authentication required.',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $patient = $this->patientService->getProfileByUser($user);

        return $this->json($patient);
    }


    #[Route(
        '/{id}',
        name: 'patient_get',
        methods: ['GET']
    )]
    public function getById(int $id): JsonResponse
    {
        return $this->json(
            $this->patientService->getById($id)
        );
    }

    #[Route('/create', name: 'patient_create', methods: ['POST'])]
    public function createPatient(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new PatientCreateRequestDto();

        $dto->email = $data['email'] ?? null;
        $dto->password = $data['password'] ?? null;
        $dto->fullname = $data['fullname'] ?? null;

        $dto->dateOfBirth = isset($data['dateOfBirth'])
            ? new \DateTimeImmutable($data['dateOfBirth'])
            : null;

        $dto->phone = $data['phone'] ?? null;
        $dto->address = $data['address'] ?? null;

        $this->patientService->createPatient($dto);

        return $this->json([
            'success' => true,
            'message' => 'Patient account created successfully.',
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'patient_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new PatientUpdateRequestDto();

        $dto->fullname = $data['fullname'] ?? null;
        $dto->dateOfBirth = isset($data['dateOfBirth'])
            ? new \DateTimeImmutable($data['dateOfBirth'])
            : null;
        $dto->phone = $data['phone'] ?? null;
        $dto->address = $data['address'] ?? null;

        $patient = $this->patientService->update($id, $dto);

        return $this->json($patient);
    }

    #[Route('/{id}', name: 'patient_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $this->patientService->delete($id);

        return $this->json([
            'message' => 'Patient deleted successfully.',
        ]);
    }
}
