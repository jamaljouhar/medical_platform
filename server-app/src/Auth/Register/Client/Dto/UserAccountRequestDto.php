<?php

namespace App\Auth\Register\Client\Dto;

use App\Auth\Register\Client\Enum\UserRole;
use Symfony\Component\Validator\Constraints as Assert;

class UserAccountRequestDto
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

    public UserRole $role = UserRole::PATIENT;

    public bool $enabled = true;
}