<?php

namespace App\Auth\Register\Admin\Dto;

use App\Auth\Register\Admin\Enum\AdminRole;
use Symfony\Component\Validator\Constraints as Assert;

class AdminAccountRequestDto
{
    #[Assert\NotBlank(message: 'Email is required')]
    #[Assert\Email(message: 'Email is not valid')]
    public ?string $email = null;

    #[Assert\NotBlank(message: 'Password is required')]
    #[Assert\Length(
        min: 8,
        minMessage: 'Password must contain at least {{ limit }} characters'
    )]
    public ?string $password = null;

    public AdminRole $role = AdminRole::ADMIN;

    public bool $enabled = true;
}
