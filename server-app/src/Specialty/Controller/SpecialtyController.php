<?php

namespace App\Specialty\Controller;

use App\Specialty\Dto\SpecialtyRequestDto;
use App\Specialty\Service\SpecialtyService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/specialties')]
class SpecialtyController extends AbstractController
{
    public function __construct(
        private SpecialtyService $specialtyService
    ) {
    }

    #[Route('', name: 'specialty_list', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        return $this->json(
            $this->specialtyService->getAll()
        );
    }

    #[Route('/{id}', name: 'specialty_get', methods: ['GET'])]
    public function getById(int $id): JsonResponse
    {
        return $this->json(
            $this->specialtyService->getById($id)
        );
    }

    #[Route('', name: 'specialty_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode(
            $request->getContent(),
            true
        );

        $dto = new SpecialtyRequestDto();

        $dto->name = $data['name'] ?? null;
        $dto->description = $data['description'] ?? null;

        $specialty = $this->specialtyService->create($dto);

        return $this->json(
            $specialty,
            JsonResponse::HTTP_CREATED
        );
    }

    #[Route('/{id}', name: 'specialty_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request
    ): JsonResponse {
        $data = json_decode(
            $request->getContent(),
            true
        );

        $dto = new SpecialtyRequestDto();

        $dto->name = $data['name'] ?? null;
        $dto->description = $data['description'] ?? null;

        $specialty = $this->specialtyService->update(
            $id,
            $dto
        );

        return $this->json($specialty);
    }

    #[Route('/{id}', name: 'specialty_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $this->specialtyService->delete($id);

        return $this->json([
            'message' => 'Specialty deleted successfully.',
        ]);
    }
}