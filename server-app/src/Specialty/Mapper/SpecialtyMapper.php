<?php

namespace App\Specialty\Mapper;

use App\Specialty\Dto\SpecialtyRequestDto;
use App\Specialty\Dto\SpecialtyResponseDto;
use App\Specialty\Entity\Specialty;

class SpecialtyMapper
{
    public function toEntity(SpecialtyRequestDto $dto): Specialty
    {
        $specialty = new Specialty();

        $specialty->setName($dto->name);
        $specialty->setDescription($dto->description);

        return $specialty;
    }

    public function updateEntity(
        Specialty $specialty,
        SpecialtyRequestDto $dto
    ): Specialty {
        $specialty->setName($dto->name);
        $specialty->setDescription($dto->description);

        return $specialty;
    }

    public function toResponseDto(Specialty $specialty): SpecialtyResponseDto
    {
        return new SpecialtyResponseDto(
            $specialty->getId(),
            $specialty->getName(),
            $specialty->getDescription()
        );
    }
}