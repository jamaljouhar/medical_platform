<?php

namespace App\Doctor\Mapper;

use App\Auth\Register\Admin\Dto\AdminAccountResponseDto;
use App\Doctor\Dto\DoctorRequestDto;
use App\Doctor\Dto\DoctorResponseDto;
use App\Doctor\Entity\Doctor;
use App\Specialty\Dto\SpecialtyResponseDto;

class DoctorMapper
{
    public function toEntity(
        DoctorRequestDto $dto
    ): Doctor {
        $doctor = new Doctor();

        $doctor->setFullName($dto->fullName);
        $doctor->setAge($dto->age);
        $doctor->setDateOfBirth($dto->dateOfBirth);
        $doctor->setLicenseNumber($dto->licenseNumber);
        $doctor->setPhone($dto->phone);
        $doctor->setYearsOfExperience($dto->yearsOfExperience);
        $doctor->setBiography($dto->biography);

        return $doctor;
    }

    public function updateEntity(
        Doctor $doctor,
        DoctorRequestDto $dto
    ): Doctor {
        $doctor->setFullName($dto->fullName);
        $doctor->setAge($dto->age);
        $doctor->setDateOfBirth($dto->dateOfBirth);
        $doctor->setLicenseNumber($dto->licenseNumber);
        $doctor->setPhone($dto->phone);
        $doctor->setYearsOfExperience($dto->yearsOfExperience);
        $doctor->setBiography($dto->biography);

        return $doctor;
    }

    public function toResponseDto(
        Doctor $doctor
    ): DoctorResponseDto {
        $adminAccount = $doctor->getAdminAccount();
        $specialty = $doctor->getSpecialty();

        return new DoctorResponseDto(
            $doctor->getId(),
            $doctor->getFullName(),
            $doctor->getAge(),
            $doctor->getDateOfBirth(),
            $doctor->getLicenseNumber(),
            $doctor->getPhone(),
            $doctor->getYearsOfExperience(),
            $doctor->getBiography(),
            new AdminAccountResponseDto(
                $adminAccount->getId(),
                $adminAccount->getEmail(),
                $adminAccount->getRole(),
                $adminAccount->isEnabled()
            ),
            new SpecialtyResponseDto(
                $specialty->getId(),
                $specialty->getName(),
                $specialty->getDescription()
            )
        );
    }
}