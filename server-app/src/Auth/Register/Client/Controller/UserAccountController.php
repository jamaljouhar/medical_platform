<?php

namespace App\Auth\Register\Client\Controller;

use App\Auth\Register\Client\Service\UserAccountService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class UserAccountController extends AbstractController
{
    public function __construct(
        private UserAccountService $userAccountService
    ) {
    }

    #[Route('/api/user-accounts', name: 'user_account_list', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        $users = $this->userAccountService->getAll();

        return $this->json($users);
    }

    #[Route('/api/user-accounts/{id}', name: 'user_account_get', methods: ['GET'])]
    public function getById(int $id): JsonResponse
    {
        $user = $this->userAccountService->getById($id);

        return $this->json($user);
    }

    #[Route('/api/user-accounts/create', name: 'user_account_create', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        $user = $this->userAccountService->createUser($request->getContent());

        return $this->json($user, 201);
    }

    #[Route('/api/user-accounts/{id}', name: 'user_account_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $user = $this->userAccountService->update($id, $request->getContent());

        return $this->json($user);
    }

    #[Route('/api/user-accounts/{id}', name: 'user_account_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $this->userAccountService->delete($id);

        return $this->json([
            'message' => 'User account deleted successfully.',
        ]);
    }
}
