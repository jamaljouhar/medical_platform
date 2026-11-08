<?php

namespace App\Patient\Service;

use App\Auth\Register\Client\Entity\UserAccount;
use App\Auth\Register\Client\Repository\UserAccountRepository;
use App\Auth\Register\Client\Dto\UserAccountResponseDto;
use App\Patient\Dto\PatientCreateRequestDto;
use App\Patient\Dto\PatientUpdateRequestDto;
use App\Patient\Dto\PatientResponseDto;
use App\Patient\Entity\Patient;
use App\Patient\Repository\PatientRepository;
use App\Shared\Exception\UserNotFoundException;
use App\Shared\Exception\ValidationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Auth\Register\Client\Enum\UserRole;

class PatientService
{
    public function __construct(
        private PatientRepository $patientRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private UserAccountRepository $userAccountRepository,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function getAll(): array
    {
        $patients = $this->patientRepository->findAll();

        return array_map(
            fn(Patient $patient) => $this->toResponseDto($patient),
            $patients
        );
    }

    public function getById(int $id): PatientResponseDto
    {
        $patient = $this->patientRepository->find($id);

        if (!$patient) {
            throw new UserNotFoundException();
        }

        return $this->toResponseDto($patient);
    }

    
public function getProfileByUser(UserAccount $user): PatientResponseDto
{
    $patient = $this->patientRepository->findOneBy([
        'userAccount' => $user,
    ]);

    if (!$patient) {
        throw new UserNotFoundException();
    }

    return $this->toResponseDto($patient);
}
    
    public function createPatient(
    PatientCreateRequestDto $dto
    ): void
    {
         $this->entityManager->wrapInTransaction(function () use ($dto) {

            if ($this->userAccountRepository->existsByEmail($dto->email)) {
                throw new ValidationException([
                    'email' => ['Email is already used'],
                ]);
            }

            // Create UserAccount
            $userAccount = new UserAccount();

            $userAccount->setEmail($dto->email);

            $hashedPassword = $this->passwordHasher->hashPassword(
                $userAccount,
                $dto->password
            );

            $userAccount->setPassword($hashedPassword);
            $userAccount->setRole(UserRole::PATIENT);
            $userAccount->setEnabled(true);

            $patient = new Patient();

            $patient->setFullname($dto->fullname);
            $patient->setDateOfBirth($dto->dateOfBirth);
            $patient->setPhone($dto->phone);
            $patient->setAddress($dto->address);

            $patient->setUserAccount($userAccount);

            $this->entityManager->persist($userAccount);
            $this->entityManager->persist($patient);

            $this->entityManager->flush();

            $this->entityManager->flush();
        });
    }

    public function update(
        int $id,
        PatientUpdateRequestDto $dto
    ): PatientResponseDto {

        $this->validateDto($dto);

        // 1. Récupérer le patient
        $patient = $this->patientRepository->find($id);

        if (!$patient) {
            throw new UserNotFoundException();
        }

        // 2. Modifier uniquement les informations du patient
        $patient->setFullname($dto->fullname);
        $patient->setDateOfBirth($dto->dateOfBirth);
        $patient->setPhone($dto->phone);
        $patient->setAddress($dto->address);

        // 3. Sauvegarder
        $this->entityManager->flush();

        return $this->toResponseDto($patient);
    }

    public function delete(int $id): void
    {
        $patient = $this->patientRepository->find($id);

        if (!$patient) {
            throw new UserNotFoundException();
        }

        $this->entityManager->remove($patient);
        $this->entityManager->flush();
    }

    private function validateDto(object $dto): void
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

    private function toResponseDto(Patient $patient): PatientResponseDto
    {
        $userAccount = $patient->getUserAccount();

        return new PatientResponseDto(
            $patient->getId(),
            $patient->getFullname(),
            $patient->getDateOfBirth(),
            $patient->getPhone(),
            $patient->getAddress(),
            new UserAccountResponseDto(
                $userAccount->getId(),
                $userAccount->getEmail(),
                $userAccount->getRole(),
                $userAccount->isEnabled()
            )
        );
    }
}
