<?php

namespace App\Patient\Dto;

use App\Auth\Register\Client\Dto\UserAccountResponseDto;

class PatientResponseDto
{
    public function __construct(
        public int $id,
        public string $fullname,
        public \DateTimeImmutable $dateOfBirth,
        public ?string $phone,
        public ?string $address,
        public UserAccountResponseDto $userAccount,
    ) {
    }
}