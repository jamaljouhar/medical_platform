<?php

namespace App\Specialty\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class SpecialtyRequestDto
{
    #[Assert\NotBlank(message: 'Specialty name is required.')]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'Specialty name must contain at least {{ limit }} characters.',
        maxMessage: 'Specialty name cannot exceed {{ limit }} characters.'
    )]
    public ?string $name = null;

    #[Assert\Length(
        max: 1000,
        maxMessage: 'Description cannot exceed {{ limit }} characters.'
    )]
    public ?string $description = null;
}