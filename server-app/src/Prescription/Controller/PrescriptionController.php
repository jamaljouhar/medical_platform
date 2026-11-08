<?php

namespace App\Prescription\Controller;

use App\Prescription\Dto\PrescriptionRequestDto;
use App\Prescription\Service\PrescriptionService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/prescriptions', name: 'api_prescriptions_')]
class PrescriptionController extends AbstractController
{
    public function __construct(
    private readonly PrescriptionService $prescriptionService,
    private readonly ValidatorInterface $validator,
) {
}

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json([
                'message' => 'Le corps de la requête doit contenir un JSON valide.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $dto = new PrescriptionRequestDto();
        $dto->medicalRecordId = $data['medicalRecordId'] ?? null;
        $dto->prescriptionDate = $data['prescriptionDate'] ?? null;
        $dto->notes = $data['notes'] ?? null;
        $dto->medications = $data['medications'] ?? null;

        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            $messages = [];

            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }

            return $this->json([
                'message' => 'Les données fournies sont invalides.',
                'errors' => $messages,
            ], Response::HTTP_BAD_REQUEST);
        }

        $prescription = $this->prescriptionService->create($dto);

        return $this->json($prescription, Response::HTTP_CREATED);
    }

    #[Route('', name: 'find_all', methods: ['GET'])]
    public function findAll(): JsonResponse
    {
        return $this->json(
            $this->prescriptionService->findAll(),
            Response::HTTP_OK
        );
    }

    #[Route('/{id}', name: 'find_by_id', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function findById(int $id): JsonResponse
    {
        return $this->json(
            $this->prescriptionService->findById($id),
            Response::HTTP_OK
        );
    }

    #[Route('/{id}', name: 'update', requirements: ['id' => '\d+'], methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return $this->json([
                'message' => 'Le corps de la requête doit contenir un JSON valide.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $dto = new PrescriptionRequestDto();
        $dto->medicalRecordId = $data['medicalRecordId'] ?? null;
        $dto->prescriptionDate = $data['prescriptionDate'] ?? null;
        $dto->notes = $data['notes'] ?? null;
        $dto->medications = $data['medications'] ?? null;

        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            $messages = [];

            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }

            return $this->json([
                'message' => 'Les données fournies sont invalides.',
                'errors' => $messages,
            ], Response::HTTP_BAD_REQUEST);
        }

        $prescription = $this->prescriptionService->update($id, $dto);

        return $this->json($prescription, Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $this->prescriptionService->delete($id);

        return $this->json([
            'message' => 'La prescription a été supprimée avec succès.',
        ], Response::HTTP_OK);
    }
}
