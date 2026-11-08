<?php

namespace App\Appointment\Dto;

use App\Appointment\Enum\AppointmentStatus;

class AppointmentResponseDto
{
    public function __construct(
        public int $id,
        public string $appointmentDate,
        public ?string $reason,
        public AppointmentStatus $status,

        public string $patientName,

        public string $doctorName,
        public ?string $doctorEmail = null,
        public ?string $doctorSpecialty = null,
    ) {
    }
}
