<?php

namespace App\Doctor\Service;

use App\Auth\Register\Admin\Dto\AdminAccountRequestDto;
use App\Auth\Register\Admin\Entity\AdminAccount;
use App\Auth\Register\Admin\Enum\AdminRole;
use App\Auth\Register\Admin\Repository\AdminAccountRepository;
use App\Doctor\Dto\DoctorRequestDto;
use App\Doctor\Dto\DoctorResponseDto;
use App\Doctor\Entity\Doctor;
use App\Doctor\Mapper\DoctorMapper;
use App\Doctor\Repository\DoctorRepository;
use App\Shared\Exception\UserNotFoundException;
use App\Shared\Exception\ValidationException;
use App\Specialty\Repository\SpecialtyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class DoctorService
{
    public function __construct(
        private DoctorRepository $doctorRepository,
        private SpecialtyRepository $specialtyRepository,
        private AdminAccountRepository $adminAccountRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private DoctorMapper $doctorMapper,
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function getAll(): array
    {
        $doctors = $this->doctorRepository->findAll();

        return array_map(
            fn(Doctor $doctor) => $this->doctorMapper->toResponseDto($doctor),
            $doctors
        );
    }

    public function getById(int $id): DoctorResponseDto
    {
        $doctor = $this->doctorRepository->find($id);

        if (!$doctor) {
            throw new UserNotFoundException();
        }

        return $this->doctorMapper->toResponseDto($doctor);
    }

    public function createFromJson(string $json): DoctorResponseDto
    {
        $data = $this->decodeJson($json);

        $dto = $this->createDoctorDto($data);
        $this->validate($dto);

        $specialty = $this->specialtyRepository->find($dto->specialtyId);

        if (!$specialty) {
            throw new ValidationException([
                'specialtyId' => ['Specialty not found.'],
            ]);
        }

        if ($this->adminAccountRepository->findOneBy([
            'email' => $data['email'] ?? null,
        ])) {
            throw new ValidationException([
                'email' => ['Email is already used.'],
            ]);
        }

        if ($this->doctorRepository->findOneBy([
        'licenseNumber' => $dto->licenseNumber,
        ])) {
            throw new ValidationException([
                'licenseNumber' => ['License number is already used.'],
            ]);
        }

        $adminAccount = new AdminAccount();
        $adminAccount->setEmail($data['email']);
        $adminAccount->setPassword(
            $this->passwordHasher->hashPassword(
                $adminAccount,
                $data['password']
            )
        );
        $adminAccount->setRole(AdminRole::DOCTOR);
        $adminAccount->setEnabled(true);

        $doctor = new Doctor();
        $this->doctorMapper->updateEntity($doctor, $dto);
        $doctor->setSpecialty($specialty);
        $doctor->setAdminAccount($adminAccount);

        $this->entityManager->persist($doctor);
        $this->entityManager->flush();

        return $this->doctorMapper->toResponseDto($doctor);
    }

    public function updateFromJson(
        int $id,
        string $json
    ): DoctorResponseDto {
        $data = $this->decodeJson($json);
        $dto = $this->createDoctorDto($data);

        return $this->update($id, $dto);
    }

    public function update(
        int $id,
        DoctorRequestDto $dto
    ): DoctorResponseDto {
        $this->validateDto($dto);

        $doctor = $this->doctorRepository->find($id);

        if (!$doctor) {
            throw new UserNotFoundException();
        }

        $specialty = $this->specialtyRepository->find($dto->specialtyId);

        if (!$specialty) {
            throw new ValidationException([
                'specialtyId' => ['Specialty not found.'],
            ]);
        }

        $existingLicense = $this->doctorRepository->findOneBy([
            'licenseNumber' => $dto->licenseNumber,
        ]);

        if (
            $existingLicense !== null
            && $existingLicense->getId() !== $doctor->getId()
        ) {
            throw new ValidationException([
                'licenseNumber' => ['License number is already used.'],
            ]);
        }

        $this->doctorMapper->updateEntity($doctor, $dto);
        $doctor->setSpecialty($specialty);

        $this->entityManager->flush();

        return $this->doctorMapper->toResponseDto($doctor);
    }

    public function delete(int $id): void
    {
        $doctor = $this->doctorRepository->find($id);

        if (!$doctor) {
            throw new UserNotFoundException();
        }

        $this->entityManager->remove($doctor);
        $this->entityManager->flush();
    }

    private function createDoctorDto(array $data): DoctorRequestDto
    {
        $dto = new DoctorRequestDto();

        $dto->fullName = $data['fullName'] ?? null;
        $dto->age = $data['age'] ?? null;
        $dto->dateOfBirth = !empty($data['dateOfBirth'])
            ? new \DateTime($data['dateOfBirth'])
            : null;
        $dto->specialtyId = $data['specialtyId'] ?? null;
        $dto->licenseNumber = $data['licenseNumber'] ?? null;
        $dto->phone = $data['phone'] ?? null;
        $dto->yearsOfExperience = $data['yearsOfExperience'] ?? null;
        $dto->biography = $data['biography'] ?? null;

        return $dto;
    }

    private function decodeJson(string $json): array
    {
        try {
            $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new ValidationException([
                'body' => ['Invalid JSON format.'],
            ]);
        }

        if (!is_array($data)) {
            throw new ValidationException([
                'body' => ['The request body must be a JSON object.'],
            ]);
        }

        return $data;
    }

    private function validateDto(DoctorRequestDto $dto): void
    {
        $this->validate($dto);
    }

    private function validateAdminAccountDto(
        AdminAccountRequestDto $dto
    ): void {
        $this->validate($dto);
    }

    private function validate(object $dto): void
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