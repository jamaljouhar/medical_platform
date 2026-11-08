<?php

namespace App\Appointment\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class AppointmentRequestDto
{

    #[Assert\NotNull(message: 'Appointment date is required.')]
    #[Assert\DateTime(
        format: 'Y-m-d H:i:s',
        message: 'Appointment date must have the format YYYY-MM-DD HH:MM:SS.'
    )]
    public ?string $appointmentDate = null;

    #[Assert\NotBlank(message: 'Reason is required.')]
    #[Assert\Length(max: 2000)]
    public ?string $reason = null;

    #[Assert\NotNull(message: 'Doctor is required.')]
    #[Assert\Positive(message: 'Doctor ID must be positive.')]
    public ?int $doctorId = null;
}
