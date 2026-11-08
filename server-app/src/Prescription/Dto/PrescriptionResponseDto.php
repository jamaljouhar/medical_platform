<?php

namespace App\Prescription\Dto;

class PrescriptionResponseDto
{
    public function __construct(
        public ?int $id = null,
        public ?int $medicalRecordId = null,
        public ?string $prescriptionDate = null,
        public ?string $notes = null,
        public array $medications = []
    ) {
    }
}
