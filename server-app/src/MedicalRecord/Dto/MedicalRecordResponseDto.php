<?php

namespace App\MedicalRecord\Dto;

class MedicalRecordResponseDto
{
    public function __construct(
        public readonly ?int $id,
        public readonly ?int $patientId,
        public readonly ?string $patientName,
        public readonly ?int $doctorId,
        public readonly ?string $doctorName,
        public readonly ?int $appointmentId,
        public readonly ?string $diagnosis,
        public readonly ?string $medicalHistory,
        public readonly ?string $allergies,
        public readonly ?string $notes,
        public readonly ?string $recordDate,
        public readonly ?string $createdAt,
        public readonly ?string $updatedAt,
    ) {
    }
}
