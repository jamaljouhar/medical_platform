<?php

namespace App\MedicalRecord\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class MedicalRecordRequestDto
{
    #[Assert\NotNull]
    #[Assert\Positive]
    public ?int $patientId = null;

    #[Assert\NotNull]
    #[Assert\Positive]
    public ?int $doctorId = null;

    #[Assert\Positive]
    public ?int $appointmentId = null;

    #[Assert\NotBlank]
    #[Assert\Length(max: 10000)]
    public ?string $diagnosis = null;

    #[Assert\Length(max: 10000)]
    public ?string $medicalHistory = null;

    #[Assert\Length(max: 10000)]
    public ?string $allergies = null;

    #[Assert\Length(max: 10000)]
    public ?string $notes = null;

    #[Assert\NotBlank]
    #[Assert\Date]
    public ?string $recordDate = null;
}
