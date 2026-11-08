<?php

namespace App\Specialty\Service;

use App\Shared\Exception\ValidationException;
use App\Specialty\Dto\SpecialtyRequestDto;
use App\Specialty\Dto\SpecialtyResponseDto;
use App\Specialty\Entity\Specialty;
use App\Specialty\Mapper\SpecialtyMapper;
use App\Specialty\Repository\SpecialtyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SpecialtyService
{
    public function __construct(
        private SpecialtyRepository $specialtyRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private SpecialtyMapper $specialtyMapper
    ) {
    }

    public function getAll(): array
    {
        $specialties = $this->specialtyRepository->findAll();

        return array_map(
            fn (Specialty $specialty) =>
                $this->specialtyMapper->toResponseDto($specialty),
            $specialties
        );
    }

    public function getById(int $id): SpecialtyResponseDto
    {
        $specialty = $this->specialtyRepository->find($id);

        if (!$specialty) {
            throw new \RuntimeException('Specialty not found.');
        }

        return $this->specialtyMapper->toResponseDto($specialty);
    }

    public function create(
        SpecialtyRequestDto $dto
    ): SpecialtyResponseDto {
        $this->validateDto($dto);

        if ($this->specialtyRepository->existsByName($dto->name)) {
            throw new ValidationException([
                'name' => ['Specialty name is already used.'],
            ]);
        }

        $specialty = $this->specialtyMapper->toEntity($dto);

        $this->entityManager->persist($specialty);
        $this->entityManager->flush();

        return $this->specialtyMapper->toResponseDto($specialty);
    }

    public function update(
        int $id,
        SpecialtyRequestDto $dto
    ): SpecialtyResponseDto {
        $this->validateDto($dto);

        $specialty = $this->specialtyRepository->find($id);

        if (!$specialty) {
            throw new \RuntimeException('Specialty not found.');
        }

        $existingSpecialty = $this->specialtyRepository->findOneBy([
            'name' => $dto->name,
        ]);

        if (
            $existingSpecialty !== null
            && $existingSpecialty->getId() !== $specialty->getId()
        ) {
            throw new ValidationException([
                'name' => ['Specialty name is already used.'],
            ]);
        }

        $this->specialtyMapper->updateEntity(
            $specialty,
            $dto
        );

        $this->entityManager->flush();

        return $this->specialtyMapper->toResponseDto($specialty);
    }

    public function delete(int $id): void
    {
        $specialty = $this->specialtyRepository->find($id);

        if (!$specialty) {
            throw new \RuntimeException('Specialty not found.');
        }

        $this->entityManager->remove($specialty);
        $this->entityManager->flush();
    }

    private function validateDto(SpecialtyRequestDto $dto): void
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
