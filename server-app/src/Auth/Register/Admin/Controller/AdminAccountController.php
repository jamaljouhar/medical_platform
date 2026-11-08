<?php

namespace App\Auth\Register\Admin\Controller;

use App\Auth\Register\Admin\Dto\AdminAccountRequestDto;
use App\Auth\Register\Admin\Service\AdminAccountService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin-account', name: 'admin_account')]
class AdminAccountController extends AbstractController
{
    public function __construct(
        private AdminAccountService $adminAccountService
    ) {
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        return $this->json(
            $this->adminAccountService->getAll()
        );
    }

    #[Route('/{id}', name: 'get', methods: ['GET'])]
    public function getById(int $id): JsonResponse
    {
        return $this->json(
            $this->adminAccountService->getById($id)
        );
    }

    #[Route('/create', name: 'create', methods: ['POST'])]
    public function createAdmin(Request $request): JsonResponse
    {
        $data = $this->getRequestData($request);

        $dto = new AdminAccountRequestDto();
        $dto->email = $data['email'] ?? null;
        $dto->password = $data['password'] ?? null;
        $dto->enabled = $data['enabled'] ?? true;

        $admin = $this->adminAccountService->createAdmin($dto);

        return $this->json($admin, JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $data = $this->getRequestData($request);

        $dto = new AdminAccountRequestDto();
        $dto->email = $data['email'] ?? null;
        $dto->password = $data['password'] ?? null;
        $dto->enabled = $data['enabled'] ?? true;

        $admin = $this->adminAccountService->update($id, $dto);

        return $this->json($admin);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $this->adminAccountService->delete($id);

        return $this->json([
            'message' => 'Admin account deleted successfully.',
        ]);
    }

    private function getRequestData(Request $request): array
    {
        try {
            $data = json_decode(
                $request->getContent(),
                true,
                512,
                JSON_THROW_ON_ERROR
            );
        } catch (\JsonException $exception) {
            throw new BadRequestHttpException(
                'Invalid JSON request.',
                $exception
            );
        }

        if (!is_array($data)) {
            throw new BadRequestHttpException(
                'The request body must be a JSON object.'
            );
        }

        return $data;
    }
}
