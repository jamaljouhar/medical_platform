<?php

namespace App\Auth\Register\Admin\Service;

use App\Auth\Register\Admin\Dto\AdminAccountRequestDto;
use App\Auth\Register\Admin\Dto\AdminAccountResponseDto;
use App\Auth\Register\Admin\Entity\AdminAccount;
use App\Auth\Register\Admin\Enum\AdminRole;
use App\Auth\Register\Admin\Repository\AdminAccountRepository;
use App\Shared\Exception\UserNotFoundException;
use App\Shared\Exception\ValidationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AdminAccountService
{
    public function __construct(
        private AdminAccountRepository $adminAccountRepository,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator
    ) {
    }

    public function getAll(): array
    {
        $admins = $this->adminAccountRepository->findAll();

        return array_map(
            fn (AdminAccount $admin) => new AdminAccountResponseDto(
                $admin->getId(),
                $admin->getEmail() ?? '',
                $admin->getRole(),
                $admin->isEnabled()
            ),
            $admins
        );
    }

    public function getById(int $id): AdminAccountResponseDto
    {
        $admin = $this->adminAccountRepository->find($id);

        if (!$admin) {
            throw new UserNotFoundException();
        }

        return new AdminAccountResponseDto(
            $admin->getId(),
            $admin->getEmail() ?? '',
            $admin->getRole(),
            $admin->isEnabled()
        );
    }

    public function createAdmin(
        AdminAccountRequestDto $dto
    ): AdminAccountResponseDto {
        $this->validateDto($dto);

        if ($this->adminAccountRepository->existsByEmail($dto->email ?? '')) {
            throw new ValidationException([
                'email' => ['Email is already used'],
            ]);
        }

        $admin = new AdminAccount();

        $admin->setEmail($dto->email);

        $hashedPassword = $this->passwordHasher->hashPassword(
            $admin,
            $dto->password ?? ''
        );

        $admin->setPassword($hashedPassword);

        // Le rôle administrateur est imposé côté serveur.
        $admin->setRole(AdminRole::ADMIN);
        $admin->setEnabled($dto->enabled);

        $this->entityManager->persist($admin);
        $this->entityManager->flush();

        return new AdminAccountResponseDto(
            $admin->getId(),
            $admin->getEmail() ?? '',
            $admin->getRole(),
            $admin->isEnabled()
        );
    }

    public function update(
        int $id,
        AdminAccountRequestDto $dto
    ): AdminAccountResponseDto {
        $this->validateDto($dto);

        $admin = $this->adminAccountRepository->find($id);

        if (!$admin) {
            throw new UserNotFoundException();
        }

        $email = $dto->email ?? '';

        $existingAdmin = $this->adminAccountRepository->findOneBy([
            'email' => $email,
        ]);

        if (
            $existingAdmin !== null
            && $existingAdmin->getId() !== $admin->getId()
        ) {
            throw new ValidationException([
                'email' => ['Email is already used'],
            ]);
        }

        $admin->setEmail($email);

        if (!empty($dto->password)) {
            $hashedPassword = $this->passwordHasher->hashPassword(
                $admin,
                $dto->password
            );

            $admin->setPassword($hashedPassword);
        }

        // Un compte administrateur conserve son rôle administrateur.
        $admin->setRole(AdminRole::ADMIN);
        $admin->setEnabled($dto->enabled);

        $this->entityManager->flush();

        return new AdminAccountResponseDto(
            $admin->getId(),
            $admin->getEmail() ?? '',
            $admin->getRole(),
            $admin->isEnabled()
        );
    }

    public function delete(int $id): void
    {
        $admin = $this->adminAccountRepository->find($id);

        if (!$admin) {
            throw new UserNotFoundException();
        }

        $this->entityManager->remove($admin);
        $this->entityManager->flush();
    }

    private function validateDto(AdminAccountRequestDto $dto): void
    {
        $errors = $this->validator->validate($dto);

        if (count($errors) === 0) {
            return;
        }

        $validationErrors = [];

        foreach ($errors as $error) {
            $validationErrors[$error->getPropertyPath()][] =
                $error->getMessage();
        }

        throw new ValidationException($validationErrors);
    }
}
