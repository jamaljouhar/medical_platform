<?php

namespace App\Doctor\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class DoctorRequestDto
{
    #[Assert\NotNull(message: 'Specialty is required.')]
    #[Assert\Positive(message: 'Specialty ID must be positive.')]
    public ?int $specialtyId = null;

    #[Assert\NotBlank(message: 'Full name is required.')]
    #[Assert\Length(
        min: 3,
        max: 150,
        minMessage: 'Full name must contain at least {{ limit }} characters.',
        maxMessage: 'Full name cannot exceed {{ limit }} characters.'
    )]
    public ?string $fullName = null;

    #[Assert\Positive(message: 'Age must be positive.')]
    #[Assert\Range(
        min: 18,
        max: 100,
        notInRangeMessage: 'Age must be between {{ min }} and {{ max }}.'
    )]
    public ?int $age = null;

    #[Assert\NotNull(message: 'Date of birth is required.')]
    #[Assert\LessThan(
        value: 'today',
        message: 'Date of birth must be in the past.'
    )]
    public ?\DateTimeInterface $dateOfBirth = null;

    #[Assert\NotBlank(message: 'License number is required.')]
    #[Assert\Length(
        min: 3,
        max: 100,
        minMessage: 'License number must contain at least {{ limit }} characters.',
        maxMessage: 'License number cannot exceed {{ limit }} characters.')]
    public ?string $licenseNumber = null;

    #[Assert\Length(
        max: 30,
        maxMessage: 'Phone cannot exceed {{ limit }} characters.'
    )]
    public ?string $phone = null;

    #[Assert\PositiveOrZero(
        message: 'Years of experience cannot be negative.'
    )]
    public ?int $yearsOfExperience = null;

    #[Assert\Length(
        max: 2000,
        maxMessage: 'Biography cannot exceed {{ limit }} characters.'
    )]
    public ?string $biography = null;
}