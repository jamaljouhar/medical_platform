<?php

namespace App\Appointment\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class AppointmentUpdateRequestDto
{
    #[Assert\NotBlank(message: 'La date du rendez-vous est obligatoire.')]
    #[Assert\DateTime(
        format: 'Y-m-d H:i:s',
        message: 'La date doit respecter le format Y-m-d H:i:s.'
    )]
    public ?string $appointmentDate = null;

    #[Assert\NotBlank(message: 'Le motif de consultation est obligatoire.')]
    #[Assert\Length(
        max: 2000,
        maxMessage: 'Le motif ne doit pas dépasser {{ limit }} caractères.'
    )]
    public ?string $reason = null;
}
