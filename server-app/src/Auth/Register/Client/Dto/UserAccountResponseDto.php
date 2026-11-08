<?php

namespace App\Auth\Register\Client\Dto;

use App\Auth\Register\Client\Enum\UserRole;

class UserAccountResponseDto
{
    public function __construct(
        public int $id,
        public string $email,
        public UserRole $role,
        public bool $enabled
    ) {
    }
}