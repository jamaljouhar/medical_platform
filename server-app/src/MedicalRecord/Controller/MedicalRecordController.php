<?php

namespace App\MedicalRecord\Controller;

use App\MedicalRecord\Dto\MedicalRecordRequestDto;
use App\MedicalRecord\Service\MedicalRecordService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/medical-records', name: 'api_medical_records_')]
class MedicalRecordController extends AbstractController
{
    public function __construct(
        private readonly MedicalRecordService $medicalRecordService,
        private readonly ValidatorInterface $validator,
    ) {
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $dto = $this->deserializeRequest($request);

        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            return $this->validationErrorResponse($errors);
        }

        $result = $this->medicalRecordService->create($dto);

        return $this->json(
            $result,
            Response::HTTP_CREATED
        );
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        return $this->json(
            $this->medicalRecordService->getAll()
        );
    }

    #[Route('/{id}', name: 'show', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getById(int $id): JsonResponse
    {
        return $this->json(
            $this->medicalRecordService->getById($id)
        );
    }

    #[Route('/patient/{patientId}', name: 'by_patient', requirements: ['patientId' => '\d+'], methods: ['GET'])]
    public function getByPatientId(int $patientId): JsonResponse
    {
        return $this->json(
            $this->medicalRecordService->getByPatientId($patientId)
        );
    }

    #[Route('/{id}', name: 'update', requirements: ['id' => '\d+'], methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $dto = $this->deserializeRequest($request);

        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            return $this->validationErrorResponse($errors);
        }

        return $this->json(
            $this->medicalRecordService->update($id, $dto)
        );
    }

    #[Route('/{id}', name: 'delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $this->medicalRecordService->delete($id);

        return $this->json(
            ['message' => 'Dossier médical supprimé avec succès.']
        );
    }

    private function deserializeRequest(
        Request $request
    ): MedicalRecordRequestDto {
        try {
            $data = json_decode(
                $request->getContent(),
                true,
                512,
                JSON_THROW_ON_ERROR
            );
        } catch (\JsonException) {
            throw $this->createBadRequestException(
                'Le JSON envoyé est invalide.'
            );
        }

        if (!is_array($data)) {
            throw $this->createBadRequestException(
                'Le corps de la requête doit être un objet JSON.'
            );
        }

        $dto = new MedicalRecordRequestDto();

        $dto->patientId = $data['patientId'] ?? null;
        $dto->doctorId = $data['doctorId'] ?? null;
        $dto->appointmentId = $data['appointmentId'] ?? null;
        $dto->diagnosis = $data['diagnosis'] ?? null;
        $dto->medicalHistory = $data['medicalHistory'] ?? null;
        $dto->allergies = $data['allergies'] ?? null;
        $dto->notes = $data['notes'] ?? null;
        $dto->recordDate = $data['recordDate'] ?? null;

        return $dto;
    }

    private function createBadRequestException(
        string $message
    ): \Symfony\Component\HttpKernel\Exception\BadRequestHttpException {
        return new \Symfony\Component\HttpKernel\Exception\BadRequestHttpException(
            $message
        );
    }

    private function validationErrorResponse(
        iterable $errors
    ): JsonResponse {
        $messages = [];

        foreach ($errors as $error) {
            $messages[] = [
                'field' => $error->getPropertyPath(),
                'message' => $error->getMessage(),
            ];
        }

        return $this->json(
            [
                'message' => 'Les données envoyées sont invalides.',
                'errors' => $messages,
            ],
            Response::HTTP_UNPROCESSABLE_ENTITY
        );
    }
}
