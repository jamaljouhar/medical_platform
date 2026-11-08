<?php

namespace App\Patient\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class PatientUpdateRequestDto
{
    #[Assert\NotBlank(message: 'Fullname is required.')]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'Fullname must contain at least {{ limit }} characters.',
        maxMessage: 'Fullname cannot exceed {{ limit }} characters.'
    )]
    public ?string $fullname = null;

    #[Assert\NotNull(message: 'Date of birth is required.')]
    #[Assert\Type(
        type: \DateTimeImmutable::class,
        message: 'Date of birth must be a valid date.'
    )]
    public ?\DateTimeImmutable $dateOfBirth = null;

    #[Assert\Length(
        max: 30,
        maxMessage: 'Phone cannot exceed {{ limit }} characters.'
    )]
    public ?string $phone = null;

    #[Assert\Length(
        max: 255,
        maxMessage: 'Address cannot exceed {{ limit }} characters.'
    )]
    public ?string $address = null;
}