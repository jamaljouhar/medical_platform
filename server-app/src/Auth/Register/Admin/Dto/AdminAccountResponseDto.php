<?php

namespace App\Auth\Register\Admin\Dto;

use App\Auth\Register\Admin\Enum\AdminRole;

class AdminAccountResponseDto
{
    public function __construct(
        public int $id,
        public string $email,
        public AdminRole $role,
        public bool $enabled
    ) {
    }
}
