<?php

namespace App\Doctor\Dto;

use App\Auth\Register\Admin\Dto\AdminAccountResponseDto;
use App\Specialty\Dto\SpecialtyResponseDto;

class DoctorResponseDto
{
    public function __construct(
        public int $id,
        public string $fullName,
        public ?int $age,
        public ?\DateTimeInterface $dateOfBirth,
        public string $licenseNumber,
        public ?string $phone,
        public ?int $yearsOfExperience,
        public ?string $biography,
        public AdminAccountResponseDto $adminAccount,
        public SpecialtyResponseDto $specialty,
    ) {
    }
}