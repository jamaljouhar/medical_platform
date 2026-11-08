<?php

namespace App\Auth\Register\Client\Service;

use App\Auth\Register\Client\Dto\UserAccountRequestDto;
use App\Auth\Register\Client\Dto\UserAccountResponseDto;
use App\Auth\Register\Client\Entity\UserAccount;
use App\Auth\Register\Client\Enum\UserRole;
use App\Auth\Register\Client\Repository\UserAccountRepository;
use App\Shared\Exception\UserNotFoundException;
use App\Shared\Exception\ValidationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserAccountService
{
    public function __construct(
        private UserAccountRepository $userAccountRepository,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator
    ) {}

    public function getAll(): array
    {
        $users = $this->userAccountRepository->findAll();

        return array_map(
            fn(UserAccount $user) => new UserAccountResponseDto(
                $user->getId(),
                $user->getEmail() ?? '',
                $user->getRole(),
                $user->isEnabled()
            ),
            $users
        );
    }

    public function getById(int $id): UserAccountResponseDto
    {
        $user = $this->userAccountRepository->find($id);

        if (!$user) {
            throw new UserNotFoundException();
        }

        return new UserAccountResponseDto(
            $user->getId(),
            $user->getEmail() ?? '',
            $user->getRole(),
            $user->isEnabled()
        );
    }

    public function createUser(string $content): UserAccountResponseDto
    {
        $data = $this->decodeJson($content);

        $dto = new UserAccountRequestDto();
        $dto->email = $data['email'] ?? null;
        $dto->password = $data['password'] ?? null;
        $dto->role = UserRole::PATIENT;
        $dto->enabled = true;

        $this->validateDto($dto);

        $email = $dto->email;

        if ($this->userAccountRepository->existsByEmail($email)) {
            throw new ValidationException([
                'email' => ['Email is already used'],
            ]);
        }

        $user = new UserAccount();

        $user->setEmail($email);

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $dto->password
        );

        $user->setPassword($hashedPassword);
        $user->setRole(UserRole::PATIENT);
        $user->setEnabled(true);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new UserAccountResponseDto(
            $user->getId(),
            $user->getEmail() ?? '',
            $user->getRole(),
            $user->isEnabled()
        );
    }

    public function update(int $id, string $content): UserAccountResponseDto
    {
        $user = $this->userAccountRepository->find($id);

        if (!$user) {
            throw new UserNotFoundException();
        }

        $data = json_decode($content, true);

        $dto = new UserAccountRequestDto();
        $dto->email = $data['email'] ?? null;
        $dto->password = $data['password'] ?? null;
        $dto->role = UserRole::PATIENT;
        $dto->enabled = $data['enabled'] ?? true;

        $this->validateDto($dto);

        $email = $dto->email;

        $existingUser = $this->userAccountRepository->findOneBy([
            'email' => $email,
        ]);

        if (
            $existingUser !== null
            && $existingUser->getId() !== $user->getId()
        ) {
            throw new ValidationException([
                'email' => ['Email is already used'],
            ]);
        }

        $user->setEmail($email);

        if (!empty($dto->password)) {
            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                $dto->password
            );

            $user->setPassword($hashedPassword);
        }

        $user->setRole(UserRole::PATIENT);
        $user->setEnabled($dto->enabled);

        $this->entityManager->flush();

        return new UserAccountResponseDto(
            $user->getId(),
            $user->getEmail() ?? '',
            $user->getRole(),
            $user->isEnabled()
        );
    }

    public function delete(int $id): void
    {
        $user = $this->userAccountRepository->find($id);

        if (!$user) {
            throw new UserNotFoundException();
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }

    private function decodeJson(string $content): array
    {
        try {
            $data = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $exception) {
            throw new BadRequestHttpException('Invalid JSON request body.', $exception);
        }

        if (!is_array($data)) {
            throw new BadRequestHttpException('The request body must be a JSON object.');
        }

        return $data;
    }

    private function validateDto(UserAccountRequestDto $dto): void
    {
        $errors = $this->validator->validate($dto);

        if (count($errors) === 0) {
            return;
        }

        $validationErrors = [];

        foreach ($errors as $error) {
            $validationErrors[$error->getPropertyPath()][] = $error->getMessage();
        }

        throw new ValidationException($validationErrors);
    }
}
